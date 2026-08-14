using CB_Photography_Webapp.Models;

namespace CB_Photography_Webapp.Services
{
    /// <summary>
    /// Contract defining data access and business operations for photography services, bookings, and dashboard metrics.
    /// </summary>
    public interface IDataStoreService
    {
        /// <summary>
        /// Retrieves a filtered list of shoot bookings by client email or assigned photographer ID.
        /// </summary>
        List<Booking> GetBookings(string? email = null, string? photographerId = null);

        /// <summary>
        /// Retrieves a single shoot booking by unique identifier or reference number.
        /// </summary>
        Booking? GetBookingById(string id);

        /// <summary>
        /// Creates and persists a new shoot booking record.
        /// </summary>
        Booking CreateBooking(Booking booking);

        /// <summary>
        /// Updates status, payment details, or gallery links for an existing booking.
        /// </summary>
        Booking? UpdateBooking(string id, Booking updates);

        /// <summary>
        /// Removes a shoot booking from storage.
        /// </summary>
        bool DeleteBooking(string id);

        /// <summary>
        /// Retrieves all photography services offered by the studio.
        /// </summary>
        List<Service> GetServices();

        /// <summary>
        /// Retrieves all studio photographers.
        /// </summary>
        List<Photographer> GetPhotographers();

        /// <summary>
        /// Calculates revenue, booking counts, and operational statistics for admin overview.
        /// </summary>
        DashboardStats GetStats();
    }
}
