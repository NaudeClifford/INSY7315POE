using CB_Photography_Webapp.Models;
using CB_Photography_Webapp.Services;
using Microsoft.AspNetCore.Mvc;

namespace CB_Photography_Webapp.Controllers
{
    // API endpoint for photography services and package catalog
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly IDataStoreService _dataStore;

        // Inject the shared data store
        public ServicesController(IDataStoreService dataStore)
        {
            _dataStore = dataStore;
        }

        // Returns all offered photography packages and pricing
        [HttpGet]
        public ActionResult<IEnumerable<Service>> GetServices()
        {
            return Ok(_dataStore.GetServices());
        }
    }
}
