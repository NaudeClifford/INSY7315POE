using CB_Photography_Webapp.Models;
using CB_Photography_Webapp.Services;

namespace CB_Photography_Webapp.BusinessLogic
{
    public class BookingService
    {
        private readonly IDataStoreService _dataStore;

        public BookingService(IDataStoreService dataStore)
        {
            _dataStore = dataStore;
        }

        public Booking ProcessNewBooking(Booking booking)
        {
            var services = _dataStore.GetServices();
            var matchedService = services.FirstOrDefault(s => s.Id == booking.ServiceId);

            if (matchedService == null)
            {
                throw new ArgumentException($"Service with ID '{booking.ServiceId}' does not exist.");
            }

            var matchedPackage = matchedService.Packages.FirstOrDefault(p => p.Id == booking.PackageId);
            if (matchedPackage == null)
            {
                throw new ArgumentException($"Package '{booking.PackageId}' is not offered for this service.");
            }

            booking.ServiceName = matchedService.Title;
            booking.PackageName = matchedPackage.Name;
            booking.BasePriceZAR = matchedPackage.StartingPriceZAR;

            booking.SubtotalZAR = booking.BasePriceZAR + booking.TravelFeeZAR + booking.AddonsTotalZAR;
            booking.DepositRequiredZAR = Math.Round(booking.SubtotalZAR * 0.5m, 2);
            booking.RemainingBalanceZAR = booking.SubtotalZAR - booking.DepositRequiredZAR;

            if (string.IsNullOrEmpty(booking.Status)) booking.Status = "Confirmed";
            if (string.IsNullOrEmpty(booking.PaymentStatus)) booking.PaymentStatus = "Unpaid";

            booking.Id = $"bk-{Guid.NewGuid():N}"[..12];
            booking.BookingReference = GenerateUniqueReference();
            booking.CreatedAt = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ");

            return _dataStore.CreateBooking(booking);
        }

        private string GenerateUniqueReference()
        {
            for (int i = 0; i < 10; i++)
            {
                var candidate = $"CB-{DateTime.UtcNow.Year}-{Random.Shared.Next(1000, 9999)}";
                if (_dataStore.GetBookingById(candidate) == null)
                {
                    return candidate;
                }
            }
            return $"CB-{DateTime.UtcNow.Year}-{Guid.NewGuid():N}"[..15].ToUpper();
        }

        public Booking? ProcessUpdate(string id, Booking updates)
        {
            updates.BasePriceZAR = 0;
            updates.SubtotalZAR = 0;
            updates.DepositRequiredZAR = 0;
            updates.RemainingBalanceZAR = 0;

            return _dataStore.UpdateBooking(id, updates);
        }
    }
}
