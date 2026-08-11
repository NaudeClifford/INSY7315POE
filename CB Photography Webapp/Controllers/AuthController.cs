using Microsoft.AspNetCore.Mvc;

namespace CB_Photography_Webapp.Controllers
{
    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = "client"; // admin, photographer, client
    }

    public class UserProfile
    {
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
    }

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        // Demo User Accounts DB Mock
        private static readonly List<UserProfile> DemoUsers = new()
        {
            new UserProfile { Email = "admin@cbphotography.co.za", Name = "Studio Admin", Role = "admin", Token = "tok-admin-999" },
            new UserProfile { Email = "camryn@cbphotography.co.za", Name = "Camryn Burger", Role = "photographer", Token = "tok-photo-888" },
            new UserProfile { Email = "nadine.dp@gmail.com", Name = "Nadine Du Plessis", Role = "client", Token = "tok-client-777" }
        };

        // POST: api/auth/login
        [HttpPost("login")]
        public ActionResult<UserProfile> Login([FromBody] LoginRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Email))
            {
                return BadRequest(new { message = "Email is required." });
            }

            var existing = DemoUsers.FirstOrDefault(u => u.Email.Equals(req.Email, StringComparison.OrdinalIgnoreCase));
            if (existing != null)
            {
                // Set cookie for session persistence across proxy requests
                Response.Cookies.Append("cb_auth_role", existing.Role, new CookieOptions
                {
                    HttpOnly = false,
                    SameSite = SameSiteMode.Lax,
                    Expires = DateTimeOffset.UtcNow.AddDays(7)
                });
                Response.Cookies.Append("cb_auth_email", existing.Email, new CookieOptions
                {
                    HttpOnly = false,
                    SameSite = SameSiteMode.Lax,
                    Expires = DateTimeOffset.UtcNow.AddDays(7)
                });

                return Ok(existing);
            }

            // Fallback for new client registrations / custom emails
            var newUser = new UserProfile
            {
                Email = req.Email,
                Name = req.Email.Split('@')[0],
                Role = string.IsNullOrEmpty(req.Role) ? "client" : req.Role,
                Token = $"tok-{Guid.NewGuid():N}"
            };

            Response.Cookies.Append("cb_auth_role", newUser.Role, new CookieOptions
            {
                HttpOnly = false,
                SameSite = SameSiteMode.Lax,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });
            Response.Cookies.Append("cb_auth_email", newUser.Email, new CookieOptions
            {
                HttpOnly = false,
                SameSite = SameSiteMode.Lax,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });

            return Ok(newUser);
        }

        // POST: api/auth/logout
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("cb_auth_role");
            Response.Cookies.Delete("cb_auth_email");
            return Ok(new { message = "Logged out successfully." });
        }

        // GET: api/auth/me
        [HttpGet("me")]
        public ActionResult<UserProfile> GetCurrentUser()
        {
            if (Request.Cookies.TryGetValue("cb_auth_role", out var role) &&
                Request.Cookies.TryGetValue("cb_auth_email", out var email))
            {
                var user = DemoUsers.FirstOrDefault(u => u.Email.Equals(email, StringComparison.OrdinalIgnoreCase))
                           ?? new UserProfile { Email = email, Name = email.Split('@')[0], Role = role, Token = "tok-session" };
                return Ok(user);
            }

            return Unauthorized(new { message = "No active session found." });
        }
    }
}
