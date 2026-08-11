using CB_Photography_Webapp.Models;

namespace CB_Photography_Webapp.Services
{
    public class DemoDataStore
    {
        private readonly List<Booking> _bookings;
        private readonly List<Service> _services;
        private readonly List<Photographer> _photographers;

        public DemoDataStore()
        {
            // Seed photographers
            _photographers = new List<Photographer>
            {
                new Photographer
                {
                    Id = "photo-camryn",
                    Name = "Camryn Burger",
                    Role = "Lead Photographer & Founder",
                    Email = "camryn@cbphotography.co.za",
                    Phone = "+27 82 456 7890",
                    AvatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
                    Bio = "Professional lifestyle, wedding, and event photographer based in Krugersdorp, Gauteng.",
                    Specialties = new List<string> { "Weddings", "Matric Dances", "Editorial Portraits" },
                    AvailableDays = new List<string> { "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" },
                    CompletedShoots = 142
                },
                new Photographer
                {
                    Id = "photo-associate",
                    Name = "Lethabo Ndlovu",
                    Role = "Associate Photographer",
                    Email = "lethabo@cbphotography.co.za",
                    Phone = "+27 71 888 2345",
                    AvatarUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
                    Bio = "Specialist corporate event and portrait photographer with 5 years experience.",
                    Specialties = new List<string> { "Corporate Events", "Graduations", "Commercial Headshots" },
                    AvailableDays = new List<string> { "Thursday", "Friday", "Saturday", "Sunday" },
                    CompletedShoots = 68
                }
            };

            // Seed services
            _services = new List<Service>
            {
                new Service
                {
                    Id = "serv-weddings",
                    Slug = "weddings",
                    Title = "Wedding Photography",
                    Subtitle = "Timeless, romantic & editorial coverage for your most sacred day.",
                    Description = "Documenting genuine love stories, intricate details, and heartfelt emotions with fine-art precision.",
                    StartingPriceZAR = 6500,
                    HeroImageUrl = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
                    Packages = new List<PackageOption>
                    {
                        new PackageOption
                        {
                            Id = "pkg-wed-essential",
                            ServiceId = "serv-weddings",
                            Name = "Essential Story",
                            StartingPriceZAR = 6500,
                            DurationHours = 5,
                            Features = new List<string> { "5 Hours continuous coverage", "1 Professional Photographer", "250+ High-resolution edited photos" }
                        },
                        new PackageOption
                        {
                            Id = "pkg-wed-editorial",
                            ServiceId = "serv-weddings",
                            Name = "Editorial Elegance",
                            StartingPriceZAR = 10500,
                            DurationHours = 8,
                            IsPopular = true,
                            Features = new List<string> { "8 Hours continuous coverage", "Lead Photographer + Assistant", "450+ High-resolution edited photos" }
                        }
                    }
                },
                new Service
                {
                    Id = "serv-matric",
                    Slug = "matric-dances",
                    Title = "Matric Dances",
                    Subtitle = "Glamorous, editorial portraits celebrating your high school milestone.",
                    Description = "Capturing the elegance, excitement, and style of your matric dance arrival and portraits.",
                    StartingPriceZAR = 2200,
                    HeroImageUrl = "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200",
                    Packages = new List<PackageOption>
                    {
                        new PackageOption
                        {
                            Id = "pkg-mat-couple",
                            ServiceId = "serv-matric",
                            Name = "Couple & Arrival",
                            StartingPriceZAR = 3400,
                            DurationHours = 2,
                            IsPopular = true,
                            Features = new List<string> { "2.5 Hours shoot time", "75 Hand-edited high-resolution photos", "Luxury car arrival shots" }
                        }
                    }
                },
                new Service
                {
                    Id = "serv-corporate",
                    Slug = "corporate",
                    Title = "Corporate Events & Headshots",
                    Subtitle = "Professional branding, executive headshots & dynamic event coverage.",
                    Description = "Elevate your corporate identity with crisp, modern headshots and seamless event documentation.",
                    StartingPriceZAR = 3200,
                    HeroImageUrl = "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200",
                    Packages = new List<PackageOption>
                    {
                        new PackageOption
                        {
                            Id = "pkg-corp-event",
                            ServiceId = "serv-corporate",
                            Name = "Half-Day Corporate Event",
                            StartingPriceZAR = 4500,
                            DurationHours = 4,
                            Features = new List<string> { "4 Hours event coverage", "180 High-resolution corporate photos", "Commercial licensing included" }
                        }
                    }
                }
            };

            // Seed bookings matching Next.js MOCK_BOOKINGS
            _bookings = new List<Booking>
            {
                new Booking
                {
                    Id = "bk-1001",
                    BookingReference = "CB-2026-8901",
                    ServiceId = "serv-weddings",
                    ServiceName = "Wedding Photography",
                    PackageId = "pkg-wed-editorial",
                    PackageName = "Editorial Elegance",
                    PhotographerId = "photo-camryn",
                    PhotographerName = "Camryn Burger",
                    Date = "2026-08-22",
                    TimeSlot = "12:00 - 20:00",
                    Location = new LocationInfo
                    {
                        VenueName = "Avianto Estate",
                        Address = "Villa Via Road",
                        Suburb = "Muldersdrift",
                        City = "Krugersdorp",
                        Province = "Gauteng",
                        PostalCode = "1739",
                        DistanceFromBaseKm = 12,
                        TravelFeeZAR = 0
                    },
                    Customer = new CustomerInfo
                    {
                        FullName = "Nadine Du Plessis",
                        Email = "nadine.dp@gmail.com",
                        Phone = "+27 83 123 4567",
                        EventType = "Wedding Ceremony & Reception",
                        Notes = "Golden hour sunset portrait request."
                    },
                    BasePriceZAR = 10500,
                    TravelFeeZAR = 0,
                    AddonsTotalZAR = 1200,
                    SubtotalZAR = 11700,
                    DepositRequiredZAR = 5850,
                    RemainingBalanceZAR = 5850,
                    Status = "Confirmed",
                    PaymentStatus = "Deposit Paid",
                    CreatedAt = "2026-08-01",
                    GalleryStatus = "editing"
                },
                new Booking
                {
                    Id = "bk-1002",
                    BookingReference = "CB-2026-8902",
                    ServiceId = "serv-matric",
                    ServiceName = "Matric Dances",
                    PackageId = "pkg-mat-couple",
                    PackageName = "Couple & Arrival",
                    PhotographerId = "photo-camryn",
                    PhotographerName = "Camryn Burger",
                    Date = "2026-08-28",
                    TimeSlot = "15:30 - 18:00",
                    Location = new LocationInfo
                    {
                        VenueName = "Kloofzicht Lodge",
                        Address = "R564 Chrome Street",
                        Suburb = "Kromdraai",
                        City = "Krugersdorp",
                        Province = "Gauteng",
                        PostalCode = "1739",
                        DistanceFromBaseKm = 18,
                        TravelFeeZAR = 0
                    },
                    Customer = new CustomerInfo
                    {
                        FullName = "Liam & Sarah Botha",
                        Email = "sarah.b@gmail.com",
                        Phone = "+27 72 987 1122",
                        EventType = "Matric Dance Pre-Session",
                        Notes = "Arriving in a vintage Mustang."
                    },
                    BasePriceZAR = 3400,
                    TravelFeeZAR = 0,
                    AddonsTotalZAR = 0,
                    SubtotalZAR = 3400,
                    DepositRequiredZAR = 1700,
                    RemainingBalanceZAR = 0,
                    Status = "Completed",
                    PaymentStatus = "Fully Paid",
                    CreatedAt = "2026-07-20",
                    GalleryStatus = "ready",
                    GalleryUrl = "https://cbphotography.pixieset.com/liamsarahmatric2026/"
                },
                new Booking
                {
                    Id = "bk-1003",
                    BookingReference = "CB-2026-8903",
                    ServiceId = "serv-corporate",
                    ServiceName = "Corporate Events & Headshots",
                    PackageId = "pkg-corp-event",
                    PackageName = "Half-Day Corporate Event",
                    PhotographerId = "photo-associate",
                    PhotographerName = "Lethabo Ndlovu",
                    Date = "2026-09-05",
                    TimeSlot = "09:00 - 13:00",
                    Location = new LocationInfo
                    {
                        VenueName = "Sandton Convention Centre",
                        Address = "161 Maude St",
                        Suburb = "Sandton",
                        City = "Johannesburg",
                        Province = "Gauteng",
                        PostalCode = "2196",
                        DistanceFromBaseKm = 38,
                        TravelFeeZAR = 90
                    },
                    Customer = new CustomerInfo
                    {
                        FullName = "Kagiso Khumalo",
                        Email = "k.khumalo@techsa.co.za",
                        Phone = "+27 82 555 9090",
                        EventType = "TechSA Summit 2026",
                        Notes = "Keynote presentation & executive networking."
                    },
                    BasePriceZAR = 4500,
                    TravelFeeZAR = 90,
                    AddonsTotalZAR = 0,
                    SubtotalZAR = 4590,
                    DepositRequiredZAR = 2295,
                    RemainingBalanceZAR = 2295,
                    Status = "Pending",
                    PaymentStatus = "Unpaid",
                    CreatedAt = "2026-08-05"
                }
            };
        }

        public List<Booking> GetBookings(string? email = null, string? photographerId = null)
        {
            var query = _bookings.AsEnumerable();
            if (!string.IsNullOrEmpty(email))
            {
                query = query.Where(b => b.Customer.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
            }
            if (!string.IsNullOrEmpty(photographerId))
            {
                query = query.Where(b => b.PhotographerId == photographerId);
            }
            return query.ToList();
        }

        public Booking? GetBookingById(string id)
        {
            return _bookings.FirstOrDefault(b => b.Id == id || b.BookingReference == id);
        }

        public Booking CreateBooking(Booking booking)
        {
            if (string.IsNullOrEmpty(booking.Id))
            {
                booking.Id = $"bk-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
            }
            if (string.IsNullOrEmpty(booking.BookingReference))
            {
                booking.BookingReference = $"CB-2026-{new Random().Next(1000, 9999)}";
            }
            if (string.IsNullOrEmpty(booking.CreatedAt))
            {
                booking.CreatedAt = DateTime.UtcNow.ToString("yyyy-MM-dd");
            }

            _bookings.Insert(0, booking);
            return booking;
        }

        public Booking? UpdateBooking(string id, Booking updates)
        {
            var existing = GetBookingById(id);
            if (existing == null) return null;

            if (!string.IsNullOrEmpty(updates.Status)) existing.Status = updates.Status;
            if (!string.IsNullOrEmpty(updates.PaymentStatus)) existing.PaymentStatus = updates.PaymentStatus;
            if (!string.IsNullOrEmpty(updates.GalleryStatus)) existing.GalleryStatus = updates.GalleryStatus;
            if (!string.IsNullOrEmpty(updates.GalleryUrl)) existing.GalleryUrl = updates.GalleryUrl;

            return existing;
        }

        public bool DeleteBooking(string id)
        {
            var existing = GetBookingById(id);
            if (existing == null) return false;
            _bookings.Remove(existing);
            return true;
        }

        public List<Service> GetServices() => _services;
        public List<Photographer> GetPhotographers() => _photographers;

        public DashboardStats GetStats()
        {
            return new DashboardStats
            {
                TotalBookings = _bookings.Count,
                GrossRevenueZAR = _bookings.Sum(b => b.SubtotalZAR),
                OutstandingBalancesZAR = _bookings.Where(b => b.PaymentStatus != "Fully Paid").Sum(b => b.RemainingBalanceZAR),
                PendingEditingCount = _bookings.Count(b => b.GalleryStatus == "editing"),
                TotalServicesCount = _services.Count,
                TotalPhotographersCount = _photographers.Count
            };
        }
    }
}
