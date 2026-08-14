using CB_Photography_Webapp.Models;
using CB_Photography_Webapp.Services;
using Microsoft.AspNetCore.Mvc;

namespace CB_Photography_Webapp.Controllers
{
    /// <summary>
    /// API Controller serving photographer profiles and assignment details.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class PhotographersController : ControllerBase
    {
        private readonly IDataStoreService _dataStore;

        public PhotographersController(IDataStoreService dataStore)
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
