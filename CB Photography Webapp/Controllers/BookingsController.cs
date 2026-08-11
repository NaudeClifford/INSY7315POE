using CB_Photography_Webapp.Models;
using CB_Photography_Webapp.Services;
using Microsoft.AspNetCore.Mvc;

namespace CB_Photography_Webapp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase
    {
        private readonly DemoDataStore _dataStore;

        public BookingsController(DemoDataStore dataStore)
        {
            _dataStore = dataStore;
        }

        // GET: api/bookings
        [HttpGet]
        public ActionResult<IEnumerable<Booking>> GetBookings([FromQuery] string? email, [FromQuery] string? photographerId)
        {
            var bookings = _dataStore.GetBookings(email, photographerId);
            return Ok(bookings);
        }

        // GET: api/bookings/{id}
        [HttpGet("{id}")]
        public ActionResult<Booking> GetBooking(string id)
        {
            var booking = _dataStore.GetBookingById(id);
            if (booking == null) return NotFound(new { message = $"Booking {id} not found." });
            return Ok(booking);
        }

        // POST: api/bookings
        [HttpPost]
        public ActionResult<Booking> CreateBooking([FromBody] Booking booking)
        {
            var created = _dataStore.CreateBooking(booking);
            return CreatedAtAction(nameof(GetBooking), new { id = created.Id }, created);
        }

        // PUT: api/bookings/{id}
        [HttpPut("{id}")]
        public ActionResult<Booking> UpdateBooking(string id, [FromBody] Booking updates)
        {
            var updated = _dataStore.UpdateBooking(id, updates);
            if (updated == null) return NotFound(new { message = $"Booking {id} not found." });
            return Ok(updated);
        }

        // DELETE: api/bookings/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteBooking(string id)
        {
            var success = _dataStore.DeleteBooking(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
