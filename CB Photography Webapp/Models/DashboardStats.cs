namespace CB_Photography_Webapp.Models
{
    public class DashboardStats
    {
        public int TotalBookings { get; set; }
        public decimal GrossRevenueZAR { get; set; }
        public decimal OutstandingBalancesZAR { get; set; }
        public int PendingEditingCount { get; set; }
        public int TotalServicesCount { get; set; }
        public int TotalPhotographersCount { get; set; }
    }
}
