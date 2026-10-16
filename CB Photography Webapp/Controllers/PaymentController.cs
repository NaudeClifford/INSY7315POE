using CB_Photography_Webapp.Models;
using CB_Photography_Webapp.Services;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace CB_Photography_Webapp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IDataStoreService _dataStore;
        private readonly IConfiguration _config;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<PaymentController> _logger;

        private const string DefaultSecretKey = "sk_test_e7afccear6ZAnLx5aab4309a19d2";
        private const string DefaultPublicKey = "pk_test_30c973e3kwJzYKA0c174";

        public PaymentController(
            IDataStoreService dataStore,
            IConfiguration config,
            IHttpClientFactory httpClientFactory,
            ILogger<PaymentController> logger)
        {
            _dataStore = dataStore;
            _config = config;
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        [HttpGet("config")]
        public IActionResult GetConfig()
        {
            var publicKey = _config["Yoco:PublicKey"] ?? DefaultPublicKey;
            return Ok(new
            {
                publicKey,
                currency = "ZAR",
                mode = "live",
                gateway = "Yoco"
            });
        }

        [HttpPost("create-checkout")]
        public async Task<IActionResult> CreateCheckout([FromBody] CreateCheckoutRequest req)
        {
            if (req.AmountZAR <= 0)
            {
                return BadRequest(new { success = false, error = "Invalid payment amount specified." });
            }

            var secretKey = _config["Yoco:SecretKey"] ?? DefaultSecretKey;
            var frontendUrl = _config["Frontend:BaseUrl"] ?? _config["Frontend:Url"];
            var origin = !string.IsNullOrEmpty(frontendUrl)
                ? frontendUrl.TrimEnd('/')
                : (Request.Headers["Origin"].FirstOrDefault() ?? "http://localhost:3000");

            var amountInCents = (int)Math.Round(req.AmountZAR * 100);
            var successUrl = $"{origin}/booking/success?bookingId={Uri.EscapeDataString(req.BookingId ?? "")}&type={Uri.EscapeDataString(req.PaymentType ?? "deposit")}";
            var cancelUrl = $"{origin}/booking?cancelled=true&bookingId={Uri.EscapeDataString(req.BookingId ?? "")}";
            var failureUrl = $"{origin}/booking?failed=true&bookingId={Uri.EscapeDataString(req.BookingId ?? "")}";

            var payload = new
            {
                amount = amountInCents,
                currency = "ZAR",
                successUrl,
                cancelUrl,
                failureUrl,
                metadata = new
                {
                    bookingId = req.BookingId ?? string.Empty,
                    bookingReference = req.BookingReference ?? string.Empty,
                    customerEmail = req.CustomerEmail ?? string.Empty,
                    customerName = req.CustomerName ?? string.Empty,
                    packageName = req.PackageName ?? "Photoshoot Session",
                    paymentType = req.PaymentType ?? "deposit",
                    platform = "CB Photography Webapp (.NET Backend)"
                }
            };

            try
            {
                var client = _httpClientFactory.CreateClient();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", secretKey);

                var jsonContent = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
                var response = await client.PostAsync("https://payments.yoco.com/api/checkouts", jsonContent);

                var responseString = await response.Content.ReadAsStringAsync();
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("Yoco API error: {Status} - {Response}", response.StatusCode, responseString);
                    return StatusCode((int)response.StatusCode, new { success = false, error = responseString });
                }

                using var doc = JsonDocument.Parse(responseString);
                var root = doc.RootElement;

                var checkoutId = root.TryGetProperty("id", out var idProp) ? idProp.GetString() : string.Empty;
                var redirectUrl = root.TryGetProperty("redirectUrl", out var rProp) ? rProp.GetString() : string.Empty;
                var status = root.TryGetProperty("status", out var sProp) ? sProp.GetString() : string.Empty;

                // Update booking if exists
                if (!string.IsNullOrEmpty(req.BookingId))
                {
                    var existing = _dataStore.GetBookingById(req.BookingId);
                    if (existing != null)
                    {
                        existing.YocoCheckoutId = checkoutId;
                        _dataStore.UpdateBooking(existing.Id, existing);
                    }
                }

                return Ok(new
                {
                    success = true,
                    checkoutId,
                    redirectUrl,
                    status
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create Yoco checkout session.");
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        [HttpGet("verify")]
        public async Task<IActionResult> VerifyCheckout([FromQuery] string checkoutId, [FromQuery] string? bookingId, [FromQuery] string? type)
        {
            if (string.IsNullOrEmpty(checkoutId))
            {
                return BadRequest(new { success = false, error = "Missing checkoutId" });
            }

            var secretKey = _config["Yoco:SecretKey"] ?? DefaultSecretKey;

            try
            {
                var client = _httpClientFactory.CreateClient();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", secretKey);

                var response = await client.GetAsync($"https://payments.yoco.com/api/checkouts/{Uri.EscapeDataString(checkoutId)}");
                var responseString = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode((int)response.StatusCode, new { success = false, error = responseString });
                }

                using var doc = JsonDocument.Parse(responseString);
                var root = doc.RootElement;
                var status = root.TryGetProperty("status", out var sProp) ? sProp.GetString() : string.Empty;

                var isPaid = status == "completed" || status == "paid" || status == "successful" || status == "created";
                var isBalance = (type ?? "").ToLower() == "balance";

                if (!string.IsNullOrEmpty(bookingId))
                {
                    var existing = _dataStore.GetBookingById(bookingId);
                    if (existing != null)
                    {
                        existing.YocoCheckoutId = checkoutId;
                        existing.PaymentStatus = isBalance ? "Paid in Full" : "Deposit Paid";
                        existing.Status = "Confirmed";
                        if (isBalance)
                            existing.BalancePaidAt = DateTime.UtcNow.ToString("yyyy-MM-dd");
                        else
                            existing.DepositPaidAt = DateTime.UtcNow.ToString("yyyy-MM-dd");

                        _dataStore.UpdateBooking(existing.Id, existing);
                    }
                }

                return Ok(new
                {
                    success = true,
                    verified = isPaid,
                    status,
                    checkoutId,
                    paymentStatus = isBalance ? "Paid in Full" : "Deposit Paid"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error verifying Yoco checkout {CheckoutId}", checkoutId);
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        [HttpPost("webhook")]
        public async Task<IActionResult> HandleWebhook()
        {
            try
            {
                using var reader = new StreamReader(Request.Body);
                var rawBody = await reader.ReadToEndAsync();
                _logger.LogInformation("Yoco Webhook received: {Body}", rawBody);

                using var doc = JsonDocument.Parse(rawBody);
                var root = doc.RootElement;

                var eventType = root.TryGetProperty("type", out var typeProp) ? typeProp.GetString() ?? "" : "";

                JsonElement payload = root;
                if (root.TryGetProperty("payload", out var pProp)) payload = pProp;
                else if (root.TryGetProperty("data", out var dProp)) payload = dProp;

                var paymentStatus = payload.TryGetProperty("status", out var sProp) ? sProp.GetString() ?? "" : "";
                var paymentId = payload.TryGetProperty("id", out var idProp) ? idProp.GetString() ?? "" : "";

                bool isSuccess = eventType.Contains("succeeded") ||
                                 eventType.Contains("completed") ||
                                 paymentStatus == "successful" ||
                                 paymentStatus == "completed";

                if (isSuccess && payload.TryGetProperty("metadata", out var metaProp))
                {
                    var bookingId = metaProp.TryGetProperty("bookingId", out var bProp) ? bProp.GetString() : null;
                    var paymentType = metaProp.TryGetProperty("paymentType", out var ptProp) ? ptProp.GetString() : "deposit";

                    if (!string.IsNullOrEmpty(bookingId))
                    {
                        var existing = _dataStore.GetBookingById(bookingId);
                        if (existing != null)
                        {
                            bool isBalance = (paymentType ?? "").ToLower() == "balance";
                            existing.PaymentStatus = isBalance ? "Paid in Full" : "Deposit Paid";
                            existing.Status = "Confirmed";
                            existing.YocoPaymentId = paymentId;
                            if (isBalance)
                                existing.BalancePaidAt = DateTime.UtcNow.ToString("yyyy-MM-dd");
                            else
                                existing.DepositPaidAt = DateTime.UtcNow.ToString("yyyy-MM-dd");

                            _dataStore.UpdateBooking(existing.Id, existing);
                            _logger.LogInformation("Booking {BookingId} updated via Yoco webhook.", bookingId);
                        }
                    }
                }

                return Ok(new { received = true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing Yoco webhook");
                return BadRequest(new { received = false, error = ex.Message });
            }
        }
    }

    public class CreateCheckoutRequest
    {
        public string? BookingId { get; set; }
        public string? BookingReference { get; set; }
        public decimal AmountZAR { get; set; }
        public string? CustomerEmail { get; set; }
        public string? CustomerName { get; set; }
        public string? PackageName { get; set; }
        public string? PaymentType { get; set; }
    }
}
