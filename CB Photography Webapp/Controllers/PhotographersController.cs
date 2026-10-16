using CB_Photography_Webapp.Models;
using CB_Photography_Webapp.Services;
using Microsoft.AspNetCore.Mvc;

namespace CB_Photography_Webapp.Controllers
{
    // API endpoint to get the studio's photographer team
    [ApiController]
    [Route("api/[controller]")]
    public class PhotographersController : ControllerBase
    {
        private readonly IDataStoreService _dataStore;

        // Inject the shared data store
        public PhotographersController(IDataStoreService dataStore)
        {
            _dataStore = dataStore;
        }

        // Returns all active photographers and their specialties
        [HttpGet]
        public ActionResult<IEnumerable<Photographer>> GetPhotographers()
        {
            return Ok(_dataStore.GetPhotographers());
        }

        // Add a new photographer to the team roster
        [HttpPost]
        public ActionResult<Photographer> CreatePhotographer([FromBody] Photographer photographer)
        {
            if (string.IsNullOrWhiteSpace(photographer.Name) || string.IsNullOrWhiteSpace(photographer.Email))
            {
                return BadRequest(new { message = "Photographer name and email are required." });
            }

            var created = _dataStore.CreatePhotographer(photographer);
            return Ok(created);
        }

        // Update an existing photographer profile
        [HttpPut("{id}")]
        public ActionResult<Photographer> UpdatePhotographer(string id, [FromBody] Photographer photographer)
        {
            photographer.Id = id;
            var updated = _dataStore.CreatePhotographer(photographer);
            return Ok(updated);
        }

        // Remove a photographer from the team
        [HttpDelete("{id}")]
        public IActionResult DeletePhotographer(string id)
        {
            var success = _dataStore.DeletePhotographer(id);
            if (!success)
            {
                return NotFound(new { message = $"Photographer {id} not found." });
            }
            return NoContent();
        }
    }
}
