using CB_Photography_Webapp.Models;

namespace CB_Photography_Webapp.Services
{
    // Contract for managing bookings, services, and photographer data
    public interface IDataStoreService
    {
        // Query bookings with optional filtering
        List<Booking> GetBookings(string? email = null, string? photographerId = null);
        
        // Find a specific booking
        Booking? GetBookingById(string id);
        
        // Add, modify, or remove bookings
        Booking CreateBooking(Booking booking);
        Booking? UpdateBooking(string id, Booking updates);
        bool DeleteBooking(string id);
        
        // Static catalogs and studio metrics
        List<Service> GetServices();
        List<Photographer> GetPhotographers();
        Photographer CreatePhotographer(Photographer photographer);
        bool DeletePhotographer(string id);

        // Expense tracking & Financial operations
        List<Expense> GetExpenses();
        Expense CreateExpense(Expense expense);
        bool DeleteExpense(string id);

        DashboardStats GetStats();
    }
}
