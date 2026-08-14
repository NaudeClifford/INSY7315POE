using CB_Photography_Webapp.Models;
using CB_Photography_Webapp.Services;
using Microsoft.AspNetCore.Mvc;

namespace CB_Photography_Webapp.Controllers
{
    /// <summary>
    /// API Controller providing photography service catalog and package tier listings.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly IDataStoreService _dataStore;

        public ServicesController(IDataStoreService dataStore)
        {
            _dataStore = dataStore;
        }

        // GET: api/services
        [HttpGet]
        public ActionResult<IEnumerable<Service>> GetServices()
        {
            return Ok(_dataStore.GetServices());
        }
    }
}
