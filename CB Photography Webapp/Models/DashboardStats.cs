using Google.Cloud.Firestore;

namespace CB_Photography_Webapp.Models
{
    // Summary metrics displayed on the studio admin dashboard
    [FirestoreData]
    public class DashboardStats
    {
        [FirestoreProperty] public int TotalBookings { get; set; }
        [FirestoreProperty] public decimal GrossRevenueZAR { get; set; }
        [FirestoreProperty] public decimal TotalExpensesZAR { get; set; }
        [FirestoreProperty] public decimal NetProfitZAR { get; set; }
        [FirestoreProperty] public decimal OperatingMarginPercent { get; set; }
        [FirestoreProperty] public decimal OutstandingBalancesZAR { get; set; }
        [FirestoreProperty] public int PendingEditingCount { get; set; }
        [FirestoreProperty] public int TotalServicesCount { get; set; }
        [FirestoreProperty] public int TotalPhotographersCount { get; set; }
    }
}
