namespace CB_Photography_Webapp.Models
{
    // Model for passing error diagnostic information to the Error view
    public class ErrorViewModel
    {
        // Trace identifier or activity ID for tracking request failures
        public string? RequestId { get; set; }

        // Helper property indicating whether request ID exists and should be shown
        public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);
    }
}

