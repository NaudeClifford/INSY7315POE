using CB_Photography_Webapp.Models;
using CB_Photography_Webapp.Services;
using Microsoft.AspNetCore.Mvc;

namespace CB_Photography_Webapp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly DemoDataStore _dataStore;

        public DashboardController(DemoDataStore dataStore)
        {
            _dataStore = dataStore;
        }

        // GET: api/dashboard/stats
        [HttpGet("stats")]
        public ActionResult<DashboardStats> GetStats()
        {
            return Ok(_dataStore.GetStats());
        }

        // GET: api/dashboard/overview
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
