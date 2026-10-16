using CB_Photography_Webapp.BusinessLogic;
using CB_Photography_Webapp.Models;
using CB_Photography_Webapp.Services;
using Microsoft.AspNetCore.Mvc;

namespace CB_Photography_Webapp.Controllers
{
    // API endpoints for managing photo session bookings
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase
    {
        private readonly IDataStoreService _dataStore;
        private readonly BookingService _bookingService;

        // Inject the shared data store and business logic booking service
        public BookingsController(IDataStoreService dataStore, BookingService bookingService)
        {
            _dataStore = dataStore;
            _bookingService = bookingService;
        }

        // Fetch bookings, optionally filtered by client email or assigned photographer
        [HttpGet]
        public ActionResult<IEnumerable<Booking>> GetBookings([FromQuery] string? email, [FromQuery] string? photographerId)
        {
            var bookings = _dataStore.GetBookings(email, photographerId);
            return Ok(bookings);
        }

        // Retrieve a single booking by its ID
        [HttpGet("{id}")]
        public ActionResult<Booking> GetBooking(string id)
        {
            var booking = _dataStore.GetBookingById(id);
            if (booking == null)
            {
                return NotFound(new { message = $"Booking {id} not found." });
            }
            return Ok(booking);
        }

        // Create and save a new booking with business logic validation and secure pricing calculations
        [HttpPost]
        public ActionResult<Booking> CreateBooking([FromBody] Booking booking)
        {
            try
            {
                var created = _bookingService.ProcessNewBooking(booking);
                return CreatedAtAction(nameof(GetBooking), new { id = created.Id }, created);
            }
            catch (ArgumentException ex)
            {
                // Return a clear validation error to the frontend
                return BadRequest(new { message = ex.Message });
            }
        }

        // Update fields on an existing booking
        [HttpPut("{id}")]
        public ActionResult<Booking> UpdateBooking(string id, [FromBody] Booking updates)
        {
            var updated = _bookingService.ProcessUpdate(id, updates);
            if (updated == null)
            {
                return NotFound(new { message = $"Booking {id} not found." });
            }
            return Ok(updated);
        }

        // Remove a booking by ID
        [HttpDelete("{id}")]
        public IActionResult DeleteBooking(string id)
        {
            var success = _dataStore.DeleteBooking(id);
            if (!success)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}
