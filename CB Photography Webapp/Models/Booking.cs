namespace CB_Photography_Webapp.Models
{
    public class LocationInfo
    {
        public string VenueName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Suburb { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;
        public string PostalCode { get; set; } = string.Empty;
        public double DistanceFromBaseKm { get; set; }
        public decimal TravelFeeZAR { get; set; }
        public string? AdditionalDirections { get; set; }
    }

    public class CustomerInfo
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string EventType { get; set; } = string.Empty;
        public string? Notes { get; set; }
    }

    public class Booking
    {
        public string Id { get; set; } = string.Empty;
        public string BookingReference { get; set; } = string.Empty;
        public string ServiceId { get; set; } = string.Empty;
        public string ServiceName { get; set; } = string.Empty;
        public string PackageId { get; set; } = string.Empty;
        public string PackageName { get; set; } = string.Empty;
        public string PhotographerId { get; set; } = string.Empty;
        public string PhotographerName { get; set; } = string.Empty;
        public string Date { get; set; } = string.Empty;
        public string TimeSlot { get; set; } = string.Empty;
        public LocationInfo Location { get; set; } = new();
        public CustomerInfo Customer { get; set; } = new();
        public decimal BasePriceZAR { get; set; }
        public decimal TravelFeeZAR { get; set; }
        public decimal AddonsTotalZAR { get; set; }
        public decimal SubtotalZAR { get; set; }
        public decimal DepositRequiredZAR { get; set; }
        public decimal RemainingBalanceZAR { get; set; }
        public string Status { get; set; } = "Confirmed"; // Pending, Confirmed, Completed, Cancelled
        public string PaymentStatus { get; set; } = "Deposit Paid"; // Unpaid, Deposit Paid, Fully Paid
        public string CreatedAt { get; set; } = string.Empty;
        public string? GalleryStatus { get; set; } // pending, editing, ready
        public string? GalleryUrl { get; set; }
    }
}
