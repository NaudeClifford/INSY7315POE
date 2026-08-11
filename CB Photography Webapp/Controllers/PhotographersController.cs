using CB_Photography_Webapp.Models;
using CB_Photography_Webapp.Services;
using Microsoft.AspNetCore.Mvc;

namespace CB_Photography_Webapp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PhotographersController : ControllerBase
    {
        private readonly DemoDataStore _dataStore;

        public PhotographersController(DemoDataStore dataStore)
        {
            _dataStore = dataStore;
        }

        // GET: api/photographers
        [HttpGet]
        public ActionResult<IEnumerable<Photographer>> GetPhotographers()
        {
            return Ok(_dataStore.GetPhotographers());
        }
    }
}
