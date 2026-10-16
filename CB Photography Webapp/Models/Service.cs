using Google.Cloud.Firestore;

namespace CB_Photography_Webapp.Models
{
    // Specific tier or package within a photography service (e.g., Standard vs Luxury)
    [FirestoreData]
    public class PackageOption
    {
        [FirestoreProperty] public string Id { get; set; } = string.Empty;
        [FirestoreProperty] public string ServiceId { get; set; } = string.Empty;
        [FirestoreProperty] public string Name { get; set; } = string.Empty;
        [FirestoreProperty] public decimal StartingPriceZAR { get; set; }
        [FirestoreProperty] public int DurationHours { get; set; }
        [FirestoreProperty] public List<string> Features { get; set; } = new();
        [FirestoreProperty] public bool IsPopular { get; set; }
    }

    // High-level service category (Weddings, Matric Dances, Studio Shoots, etc.)
    [FirestoreData]
    public class Service
    {
        [FirestoreProperty] public string Id { get; set; } = string.Empty;
        [FirestoreProperty] public string Title { get; set; } = string.Empty;
        [FirestoreProperty] public string Slug { get; set; } = string.Empty;
        [FirestoreProperty] public string Subtitle { get; set; } = string.Empty;
        [FirestoreProperty] public string Description { get; set; } = string.Empty;
        [FirestoreProperty] public decimal StartingPriceZAR { get; set; }
        [FirestoreProperty] public string HeroImageUrl { get; set; } = string.Empty;
        [FirestoreProperty] public List<PackageOption> Packages { get; set; } = new();
    }
}
