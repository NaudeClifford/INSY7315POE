using CB_Photography_Webapp.Models;
using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace CB_Photography_Webapp.Controllers
{
    // Request model received from the login form
    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = "client";
    }

    // Profile data returned to the user upon login
    public class UserProfile
    {
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? PhotographerId { get; set; }
    }

    // Profile update request
    public class ProfileUpdateRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Role { get; set; }
    }

    // Password reset request
    public class ForgotPasswordRequest
    {
        public string Email { get; set; } = string.Empty;
    }

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ILogger<AuthController> _logger;
        private readonly IConfiguration _configuration;

        private static readonly HashSet<string> AllowedRoles = new(StringComparer.OrdinalIgnoreCase) { "admin", "photographer", "client" };

        private readonly FirestoreDb? _db;

        public AuthController(IWebHostEnvironment env, ILogger<AuthController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;

            string keyPath = Path.Combine(env.ContentRootPath, "Keys", "camrynburgerphotography-firebase-adminsdk-fbsvc-c8b07db472.json");
            if (System.IO.File.Exists(keyPath))
            {
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", keyPath);
                try
                {
                    _db = FirestoreDb.Create("camrynburgerphotography");
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to initialize FirestoreDb in AuthController");
                    _db = null;
                }
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserProfile>> Login([FromBody] LoginRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Email) || !IsValidEmail(req.Email))
                return BadRequest(new { message = "A valid email address is required." });

            if (string.IsNullOrWhiteSpace(req.Password) || req.Password.Length < 6)
                return BadRequest(new { message = "Password must be at least 6 characters." });

            var cleanEmail = req.Email.Trim().ToLower();

            // Verify credentials against Firebase Identity Toolkit
            var userRecord = await VerifyFirebaseUser(cleanEmail, req.Password);
            if (userRecord == null)
            {
                _logger.LogWarning("Failed login attempt for {Email}", cleanEmail);
                return Unauthorized(new { message = "Invalid email or password." });
            }

            // Resolve User Profile & Role from Firestore users collection
            string resolvedRole = "client";
            string displayName = userRecord.DisplayName ?? cleanEmail.Split('@')[0];
            string? phone = null;
            string? photoId = null;

            if (_db != null)
            {
                try
                {
                    var docRef = _db.Collection("users").Document(userRecord.LocalId);
                    var snapshot = await docRef.GetSnapshotAsync();
                    DocumentSnapshot? profileDoc = snapshot.Exists ? snapshot : null;

                    if (profileDoc == null)
                    {
                        var query = await _db.Collection("users")
                            .WhereEqualTo("email", cleanEmail)
                            .Limit(1)
                            .GetSnapshotAsync();
                        profileDoc = query.Documents.FirstOrDefault();
                    }

                    if (profileDoc != null)
                    {
                        var data = profileDoc.ToDictionary();
                        var rawRole = data.GetValueOrDefault("role")?.ToString()?.ToLower() ?? "client";
                        if (rawRole.Contains("admin")) resolvedRole = "admin";
                        else if (rawRole.Contains("photo")) resolvedRole = "photographer";
                        else resolvedRole = "client";

                        displayName = data.GetValueOrDefault("name")?.ToString() ?? displayName;
                        phone = data.GetValueOrDefault("phone")?.ToString();
                        photoId = data.GetValueOrDefault("photographerId")?.ToString();
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Error reading user profile from Firestore for {Email}", cleanEmail);
                }
            }

            // Enforce role permission security if a specific role was requested
            if (req.Role == "admin" && resolvedRole != "admin")
            {
                return StatusCode(403, new { message = "Access denied: Account does not have administrator privileges." });
            }
            if (req.Role == "photographer" && resolvedRole != "photographer" && resolvedRole != "admin")
            {
                return StatusCode(403, new { message = "Access denied: Account does not have photographer privileges." });
            }

            var profile = new UserProfile
            {
                Email = cleanEmail,
                Name = displayName,
                Role = resolvedRole,
                Phone = phone,
                PhotographerId = photoId,
                Token = $"tok-{Guid.NewGuid():N}"
            };

            SetAuthCookies(profile.Role, profile.Email, profile.PhotographerId);
            return Ok(profile);
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            var isHttps = Request.IsHttps;
            var isDev = string.Equals(Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"), "Development", StringComparison.OrdinalIgnoreCase);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = isHttps || !isDev,
                SameSite = (isHttps || !isDev) ? SameSiteMode.None : SameSiteMode.Lax,
                Path = "/"
            };

            Response.Cookies.Delete("cb_auth_role", cookieOptions);
            Response.Cookies.Delete("cb_auth_email", cookieOptions);
            Response.Cookies.Delete("cb_photographer_id", cookieOptions);

            Response.Cookies.Delete("cb_auth_role");
            Response.Cookies.Delete("cb_auth_email");
            Response.Cookies.Delete("cb_photographer_id");

            return Ok(new { message = "Logged out successfully." });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Email) || !IsValidEmail(req.Email))
            {
                return BadRequest(new { message = "A valid email address is required." });
            }

            var cleanEmail = req.Email.Trim().ToLower();
            var apiKey = _configuration["Firebase:ApiKey"] ?? "AIzaSyBdpHhPWj8VXT3TN7sTAJ02FdES-kTrFmQ";
            var url = $"https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key={apiKey}";

            try
            {
                using var client = new HttpClient();
                client.Timeout = TimeSpan.FromSeconds(10);
                var payload = new
                {
                    requestType = "PASSWORD_RESET",
                    email = cleanEmail
                };

                await client.PostAsJsonAsync(url, payload);
                return Ok(new { success = true, message = "If an account exists for this email, password recovery instructions have been dispatched." });
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to send password reset email for {Email}", cleanEmail);
                return StatusCode(500, new { message = "An error occurred while processing the password reset request." });
            }
        }

        // Updates user profile information (Name, Email, Phone)
        [HttpPut("profile")]
        public async Task<ActionResult<UserProfile>> UpdateProfile([FromBody] ProfileUpdateRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Email))
            {
                return BadRequest(new { message = "Email is required." });
            }

            var cleanEmail = req.Email.Trim().ToLower();
            string? role = req.Role;
            string? phone = req.Phone;
            string? photoId = null;
            string name = !string.IsNullOrWhiteSpace(req.Name) ? req.Name.Trim() : cleanEmail.Split('@')[0];

            if (_db != null)
            {
                try
                {
                    var query = await _db.Collection("users")
                        .WhereEqualTo("email", cleanEmail)
                        .Limit(1)
                        .GetSnapshotAsync();
                    var doc = query.Documents.FirstOrDefault();
                    if (doc != null)
                    {
                        var updates = new Dictionary<string, object>();
                        if (!string.IsNullOrWhiteSpace(req.Name)) updates["name"] = req.Name.Trim();
                        if (req.Phone != null) updates["phone"] = req.Phone.Trim();

                        if (updates.Count > 0)
                        {
                            await doc.Reference.UpdateAsync(updates);
                        }

                        var dict = doc.ToDictionary();
                        role = dict.GetValueOrDefault("role")?.ToString() ?? role ?? "client";
                        phone = req.Phone ?? dict.GetValueOrDefault("phone")?.ToString();
                        photoId = dict.GetValueOrDefault("photographerId")?.ToString();
                        name = dict.GetValueOrDefault("name")?.ToString() ?? name;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to update profile in Firestore for {Email}", cleanEmail);
                }
            }

            var updated = new UserProfile
            {
                Email = cleanEmail,
                Name = name,
                Role = !string.IsNullOrEmpty(role) ? role : "client",
                Phone = phone,
                PhotographerId = photoId,
                Token = $"tok-{Guid.NewGuid():N}"
            };

            SetAuthCookies(updated.Role, updated.Email, updated.PhotographerId);
            return Ok(updated);
        }

        [HttpGet("me")]
        public async Task<ActionResult<UserProfile>> GetCurrentUser()
        {
            if (Request.Cookies.TryGetValue("cb_auth_email", out var email) && !string.IsNullOrWhiteSpace(email))
            {
                var cleanEmail = email.Trim().ToLower();
                Request.Cookies.TryGetValue("cb_auth_role", out var role);
                Request.Cookies.TryGetValue("cb_photographer_id", out var photoId);

                string name = cleanEmail.Split('@')[0];
                string? phone = null;

                if (_db != null)
                {
                    try
                    {
                        var query = await _db.Collection("users")
                            .WhereEqualTo("email", cleanEmail)
                            .Limit(1)
                            .GetSnapshotAsync();
                        var doc = query.Documents.FirstOrDefault();
                        if (doc != null)
                        {
                            var dict = doc.ToDictionary();
                            name = dict.GetValueOrDefault("name")?.ToString() ?? name;
                            role = dict.GetValueOrDefault("role")?.ToString() ?? role;
                            phone = dict.GetValueOrDefault("phone")?.ToString();
                            photoId = dict.GetValueOrDefault("photographerId")?.ToString() ?? photoId;
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "Error fetching user profile from Firestore for {Email}", cleanEmail);
                    }
                }

                return Ok(new UserProfile
                {
                    Email = cleanEmail,
                    Name = name,
                    Role = !string.IsNullOrEmpty(role) ? role : "client",
                    Phone = phone,
                    PhotographerId = photoId,
                    Token = "tok-session"
                });
            }

            return Unauthorized(new { message = "No active session found." });
        }

        private void SetAuthCookies(string role, string email, string? photographerId = null)
        {
            var isHttps = Request.IsHttps;
            var isDev = string.Equals(Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"), "Development", StringComparison.OrdinalIgnoreCase);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = isHttps || !isDev,
                SameSite = (isHttps || !isDev) ? SameSiteMode.None : SameSiteMode.Lax,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            };

            Response.Cookies.Append("cb_auth_role", role, cookieOptions);
            Response.Cookies.Append("cb_auth_email", email, cookieOptions);
            if (!string.IsNullOrEmpty(photographerId))
            {
                Response.Cookies.Append("cb_photographer_id", photographerId, cookieOptions);
            }
        }

        private static bool IsValidEmail(string email)
        {
            return Regex.IsMatch(email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$");
        }

        private async Task<FirebaseUserRecord?> VerifyFirebaseUser(string email, string password)
        {
            var apiKey = _configuration["Firebase:ApiKey"] ?? "AIzaSyBdpHhPWj8VXT3TN7sTAJ02FdES-kTrFmQ";
            var url = $"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={apiKey}";

            try
            {
                using var client = new HttpClient();
                client.Timeout = TimeSpan.FromSeconds(10);
                var payload = new
                {
                    email = email,
                    password = password,
                    returnSecureToken = true
                };

                var response = await client.PostAsJsonAsync(url, payload);
                if (!response.IsSuccessStatusCode)
                    return null;

                var json = await response.Content.ReadFromJsonAsync<FirebaseAuthResponse>();
                if (json == null || string.IsNullOrEmpty(json.localId))
                    return null;

                return new FirebaseUserRecord
                {
                    LocalId = json.localId,
                    Email = json.email,
                    DisplayName = json.displayName
                };
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Firebase Auth REST API call failed");
                return null;
            }
        }

        // Internal DTOs for Firebase REST response
        private class FirebaseAuthResponse
        {
            public string localId { get; set; } = string.Empty;
            public string email { get; set; } = string.Empty;
            public string? displayName { get; set; }
        }
        private class FirebaseUserRecord
        {
            public string LocalId { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string? DisplayName { get; set; }
        }
    }
}
