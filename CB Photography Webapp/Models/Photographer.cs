using Google.Cloud.Firestore;

namespace CB_Photography_Webapp.Models
{
    // Represents a studio photographer profile, schedule, and specialties
    [FirestoreData]
    public class Photographer
    {
        [FirestoreProperty("id")] public string Id { get; set; } = string.Empty;
        [FirestoreProperty("name")] public string Name { get; set; } = string.Empty;
        [FirestoreProperty("role")] public string Role { get; set; } = string.Empty;
        [FirestoreProperty("isLead")] public bool IsLead { get; set; }
        [FirestoreProperty("email")] public string Email { get; set; } = string.Empty;
        [FirestoreProperty("phone")] public string Phone { get; set; } = string.Empty;
        [FirestoreProperty("avatarUrl")] public string AvatarUrl { get; set; } = string.Empty;
        [FirestoreProperty("bio")] public string Bio { get; set; } = string.Empty;
        [FirestoreProperty("instagram")] public string? Instagram { get; set; }
        [FirestoreProperty("rating")] public double Rating { get; set; } = 5.0;
        [FirestoreProperty("specialties")] public List<string> Specialties { get; set; } = new();
        [FirestoreProperty("availableDays")] public List<string> AvailableDays { get; set; } = new();
        [FirestoreProperty("completedShoots")] public int CompletedShoots { get; set; }
    }
}
