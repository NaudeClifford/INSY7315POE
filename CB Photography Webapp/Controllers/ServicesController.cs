using CB_Photography_Webapp.Models;
using CB_Photography_Webapp.Services;
using Microsoft.AspNetCore.Mvc;

namespace CB_Photography_Webapp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly DemoDataStore _dataStore;

        public ServicesController(DemoDataStore dataStore)
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
