namespace CB_Photography_Webapp.Models
{
    public class Photographer
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
        public List<string> Specialties { get; set; } = new();
        public List<string> AvailableDays { get; set; } = new();
        public int CompletedShoots { get; set; }
    }
}
