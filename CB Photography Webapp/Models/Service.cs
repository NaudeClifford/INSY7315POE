namespace CB_Photography_Webapp.Models
{
    public class PackageOption
    {
        public string Id { get; set; } = string.Empty;
        public string ServiceId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public decimal StartingPriceZAR { get; set; }
        public int DurationHours { get; set; }
        public List<string> Features { get; set; } = new();
        public bool IsPopular { get; set; }
    }

    public class Service
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Subtitle { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal StartingPriceZAR { get; set; }
        public string HeroImageUrl { get; set; } = string.Empty;
        public List<PackageOption> Packages { get; set; } = new();
    }
}
