using Google.Cloud.Firestore;

namespace CB_Photography_Webapp.Models
{
    // Studio operating expense model for revenue and net profit calculation
    [FirestoreData]
    public class Expense
    {
        [FirestoreProperty] public string Id { get; set; } = string.Empty;
        [FirestoreProperty] public string Title { get; set; } = string.Empty;
        [FirestoreProperty] public string Category { get; set; } = "Gear & Maintenance"; // Gear & Maintenance, Studio Rent, Travel & Fuel, Cloud & Software, Marketing & Ads, Miscellaneous
        [FirestoreProperty] public decimal AmountZAR { get; set; }
        [FirestoreProperty] public string Date { get; set; } = string.Empty;
        [FirestoreProperty] public string? Description { get; set; }
        [FirestoreProperty] public string? LoggedBy { get; set; }
        [FirestoreProperty] public string CreatedAt { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd");
    }
}
