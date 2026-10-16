using CB_Photography_Webapp.Models;
using CB_Photography_Webapp.Services;
using Microsoft.AspNetCore.Mvc;

namespace CB_Photography_Webapp.Controllers
{
    // Endpoints for admin dashboard analytics and overview metrics
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly IDataStoreService _dataStore;

        // Inject the shared data store
        public DashboardController(IDataStoreService dataStore)
        {
            _dataStore = dataStore;
        }

        // Returns aggregated metrics (totals, revenue, pending shoots)
        [HttpGet("stats")]
        public ActionResult<DashboardStats> GetStats()
        {
            return Ok(_dataStore.GetStats());
        }

        // Returns a full dashboard snapshot (stats, bookings, services, team)
        [HttpGet("overview")]
        public ActionResult GetOverview()
        {
            var bookings = _dataStore.GetBookings();
            var stats = _dataStore.GetStats();
            var services = _dataStore.GetServices();
            var photographers = _dataStore.GetPhotographers();

            return Ok(new
            {
                stats,
                recentBookings = bookings,
                services,
                photographers
            });
        }
    }
}
