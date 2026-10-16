using Google.Cloud.Firestore;

namespace CB_Photography_Webapp.Models
{
    // Venue address and calculated travel distance/fee
    [FirestoreData]
    public class LocationInfo
    {
        [FirestoreProperty] public string VenueName { get; set; } = string.Empty;
        [FirestoreProperty] public string Address { get; set; } = string.Empty;
        [FirestoreProperty] public string Suburb { get; set; } = string.Empty;
        [FirestoreProperty] public string City { get; set; } = string.Empty;
        [FirestoreProperty] public string Province { get; set; } = string.Empty;
        [FirestoreProperty] public string PostalCode { get; set; } = string.Empty;
        [FirestoreProperty] public double DistanceFromBaseKm { get; set; }
        [FirestoreProperty] public decimal TravelFeeZAR { get; set; }
        [FirestoreProperty] public string? AdditionalDirections { get; set; }
    }

    // Contact details of the client booking the shoot
    [FirestoreData]
    public class CustomerInfo
    {
        [FirestoreProperty] public string FullName { get; set; } = string.Empty;
        [FirestoreProperty] public string Email { get; set; } = string.Empty;
        [FirestoreProperty] public string Phone { get; set; } = string.Empty;
        [FirestoreProperty] public string EventType { get; set; } = string.Empty;
        [FirestoreProperty] public string? Notes { get; set; }
    }

    // Primary booking record containing session, pricing, and status info
    [FirestoreData]
    public class Booking
    {
        [FirestoreProperty] public string Id { get; set; } = string.Empty;
        [FirestoreProperty] public string BookingReference { get; set; } = string.Empty;
        [FirestoreProperty] public string ServiceId { get; set; } = string.Empty;
        [FirestoreProperty] public string ServiceName { get; set; } = string.Empty;
        [FirestoreProperty] public string PackageId { get; set; } = string.Empty;
        [FirestoreProperty] public string PackageName { get; set; } = string.Empty;
        [FirestoreProperty] public string PhotographerId { get; set; } = string.Empty;
        [FirestoreProperty] public string PhotographerName { get; set; } = string.Empty;
        [FirestoreProperty] public string Date { get; set; } = string.Empty;
        [FirestoreProperty] public string TimeSlot { get; set; } = string.Empty;
        [FirestoreProperty] public LocationInfo Location { get; set; } = new();
        [FirestoreProperty] public CustomerInfo Customer { get; set; } = new();

        // Financials in South African Rand (ZAR)
        [FirestoreProperty] public decimal BasePriceZAR { get; set; }
        [FirestoreProperty] public decimal TravelFeeZAR { get; set; }
        [FirestoreProperty] public decimal AddonsTotalZAR { get; set; }
        [FirestoreProperty] public decimal SubtotalZAR { get; set; }
        [FirestoreProperty] public decimal DepositRequiredZAR { get; set; }
        [FirestoreProperty] public decimal RemainingBalanceZAR { get; set; }

        // Shoot progression and gallery delivery
        [FirestoreProperty] public string Status { get; set; } = "Confirmed"; // Pending, Confirmed, Completed, Cancelled
        [FirestoreProperty] public string PaymentStatus { get; set; } = "Deposit Paid"; // Unpaid, Deposit Paid, Fully Paid
        [FirestoreProperty] public string CreatedAt { get; set; } = string.Empty;
        [FirestoreProperty] public string? GalleryStatus { get; set; } // pending, editing, ready
        [FirestoreProperty] public string? GalleryUrl { get; set; }
        [FirestoreProperty] public string? YocoCheckoutId { get; set; }
        [FirestoreProperty] public string? YocoPaymentId { get; set; }
        [FirestoreProperty] public string? DepositPaidAt { get; set; }
        [FirestoreProperty] public string? BalancePaidAt { get; set; }
    }
}
