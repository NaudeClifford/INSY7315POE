using CB_Photography_Webapp.Models;
using Google.Cloud.Firestore;

namespace CB_Photography_Webapp.Services
{
    public class FirestoreDataStore : IDataStoreService
    {
        private readonly FirestoreDb? _db;

        private const string BookingsCollection = "bookings";
        private const string ServicesCollection = "services";
        private const string PhotographersCollection = "photographers";
        private const string ExpensesCollection = "expenses";

        public FirestoreDataStore(IWebHostEnvironment env)
        {
            try
            {
                string keyPath = Path.Combine(env.ContentRootPath, "Keys", "camrynburgerphotography-firebase-adminsdk-fbsvc-c8b07db472.json");
                if (File.Exists(keyPath))
                {
                    Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", keyPath);
                    _db = FirestoreDb.Create("camrynburgerphotography");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[FirestoreDataStore] Warning: FirestoreDb init failed: {ex.Message}.");
                _db = null;
            }
        }

        public List<Booking> GetBookings(string? email = null, string? photographerId = null)
        {
            if (_db == null) return new List<Booking>();

            try
            {
                var query = _db.Collection(BookingsCollection).GetSnapshotAsync().GetAwaiter().GetResult();
                var all = query.Documents.Select(d => d.ConvertTo<Booking>()).ToList();

                if (!string.IsNullOrEmpty(email))
                {
                    all = all.Where(b => b.Customer?.Email?.Equals(email, StringComparison.OrdinalIgnoreCase) == true).ToList();
                }

                if (!string.IsNullOrEmpty(photographerId))
                {
                    all = all.Where(b => b.PhotographerId == photographerId).ToList();
                }

                return all.OrderByDescending(b => b.CreatedAt).ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[FirestoreDataStore] Error getting bookings: {ex.Message}");
                return new List<Booking>();
            }
        }

        public Booking? GetBookingById(string id)
        {
            if (_db == null) return null;

            try
            {
                var docRef = _db.Collection(BookingsCollection).Document(id);
                var snapshot = docRef.GetSnapshotAsync().GetAwaiter().GetResult();
                if (snapshot.Exists)
                {
                    return snapshot.ConvertTo<Booking>();
                }

                var query = _db.Collection(BookingsCollection)
                    .WhereEqualTo("BookingReference", id)
                    .Limit(1)
                    .GetSnapshotAsync().GetAwaiter().GetResult();

                return query.Documents.FirstOrDefault()?.ConvertTo<Booking>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[FirestoreDataStore] Error getting booking {id}: {ex.Message}");
                return null;
            }
        }

        public Booking CreateBooking(Booking booking)
        {
            if (_db == null) return booking;

            try
            {
                var docRef = _db.Collection(BookingsCollection).Document(booking.Id);
                docRef.SetAsync(booking).GetAwaiter().GetResult();
                return booking;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[FirestoreDataStore] Error creating booking: {ex.Message}");
                return booking;
            }
        }

        public Booking? UpdateBooking(string id, Booking updates)
        {
            if (_db == null) return null;

            try
            {
                var existing = GetBookingById(id);
                if (existing == null) return null;

                var updateData = new Dictionary<string, object>();
                if (!string.IsNullOrEmpty(updates.Status)) updateData["Status"] = updates.Status;
                if (!string.IsNullOrEmpty(updates.PaymentStatus)) updateData["PaymentStatus"] = updates.PaymentStatus;
                if (!string.IsNullOrEmpty(updates.GalleryStatus)) updateData["GalleryStatus"] = updates.GalleryStatus;
                if (!string.IsNullOrEmpty(updates.GalleryUrl)) updateData["GalleryUrl"] = updates.GalleryUrl;

                if (updateData.Count > 0)
                {
                    _db.Collection(BookingsCollection).Document(existing.Id)
                        .UpdateAsync(updateData).GetAwaiter().GetResult();
                }

                return GetBookingById(existing.Id);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[FirestoreDataStore] Error updating booking {id}: {ex.Message}");
                return null;
            }
        }

        public bool DeleteBooking(string id)
        {
            if (_db == null) return false;

            try
            {
                var existing = GetBookingById(id);
                if (existing == null) return false;

                _db.Collection(BookingsCollection).Document(existing.Id)
                    .DeleteAsync().GetAwaiter().GetResult();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[FirestoreDataStore] Error deleting booking {id}: {ex.Message}");
                return false;
            }
        }

        public List<Service> GetServices()
        {
            if (_db == null) return new List<Service>();

            try
            {
                var query = _db.Collection(ServicesCollection).GetSnapshotAsync().GetAwaiter().GetResult();
                return query.Documents.Select(MapService).ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[FirestoreDataStore] Error getting services: {ex.Message}");
                return new List<Service>();
            }
        }

        public List<Photographer> GetPhotographers()
        {
            if (_db == null) return new List<Photographer>();

            try
            {
                var query = _db.Collection(PhotographersCollection).GetSnapshotAsync().GetAwaiter().GetResult();
                return query.Documents.Select(MapPhotographer).ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[FirestoreDataStore] Error getting photographers: {ex.Message}");
                return new List<Photographer>();
            }
        }

        private static Service MapService(DocumentSnapshot doc)
        {
            var s = doc.ConvertTo<Service>();
            if (!string.IsNullOrEmpty(s.Title)) return s;

            var dict = doc.ToDictionary();
            s.Id = doc.Id;
            s.Title = dict.GetValueOrDefault("title")?.ToString() ?? "";
            s.Slug = dict.GetValueOrDefault("slug")?.ToString() ?? "";
            s.Subtitle = dict.GetValueOrDefault("subtitle")?.ToString() ?? dict.GetValueOrDefault("tagline")?.ToString() ?? "";
            s.Description = dict.GetValueOrDefault("description")?.ToString() ?? "";
            s.HeroImageUrl = dict.GetValueOrDefault("imageUrl")?.ToString() ?? dict.GetValueOrDefault("heroImageUrl")?.ToString() ?? "";

            if (dict.TryGetValue("startingPriceZAR", out var priceVal) && decimal.TryParse(priceVal?.ToString(), out var p))
            {
                s.StartingPriceZAR = p;
            }

            if (dict.TryGetValue("packages", out var pkgsObj) && pkgsObj is IEnumerable<object> pkgsList)
            {
                s.Packages = new List<PackageOption>();
                foreach (var item in pkgsList)
                {
                    if (item is Dictionary<string, object> pDict)
                    {
                        var pkg = new PackageOption
                        {
                            Id = pDict.GetValueOrDefault("id")?.ToString() ?? "",
                            ServiceId = s.Id,
                            Name = pDict.GetValueOrDefault("name")?.ToString() ?? "",
                            DurationHours = Convert.ToInt32(pDict.GetValueOrDefault("durationHours") ?? 0),
                            IsPopular = Convert.ToBoolean(pDict.GetValueOrDefault("popular") ?? false)
                        };
                        if (pDict.TryGetValue("startingPriceZAR", out var pkgPrice) && decimal.TryParse(pkgPrice?.ToString(), out var pp))
                        {
                            pkg.StartingPriceZAR = pp;
                        }
                        if (pDict.TryGetValue("features", out var feats) && feats is IEnumerable<object> featList)
                        {
                            pkg.Features = featList.Select(f => f.ToString() ?? "").ToList();
                        }
                        s.Packages.Add(pkg);
                    }
                }
            }

            return s;
        }

        private static Photographer MapPhotographer(DocumentSnapshot doc)
        {
            var p = doc.ConvertTo<Photographer>();
            p.Id = doc.Id;

            if (string.Equals(p.Id, "photo-camryn", StringComparison.OrdinalIgnoreCase) || p.Name.Contains("Camryn", StringComparison.OrdinalIgnoreCase))
            {
                p.IsLead = true;
                if (string.IsNullOrEmpty(p.Role) || string.Equals(p.Role, "photographer", StringComparison.OrdinalIgnoreCase))
                {
                    p.Role = "Owner / Photographer";
                }
            }
            else if (string.Equals(p.Id, "photo-brendon", StringComparison.OrdinalIgnoreCase) || p.Name.Contains("Brendon", StringComparison.OrdinalIgnoreCase))
            {
                p.IsLead = false;
                if (string.IsNullOrEmpty(p.Role) || string.Equals(p.Role, "photographer", StringComparison.OrdinalIgnoreCase))
                {
                    p.Role = "Associate Photographer";
                }
            }
            else if (string.Equals(p.Id, "photo-miah", StringComparison.OrdinalIgnoreCase) || p.Name.Contains("Miah", StringComparison.OrdinalIgnoreCase))
            {
                p.IsLead = false;
                if (string.IsNullOrEmpty(p.Role) || string.Equals(p.Role, "photographer", StringComparison.OrdinalIgnoreCase))
                {
                    p.Role = "Associate Photographer";
                }
            }

            if (!string.IsNullOrEmpty(p.Name)) return p;

            var dict = doc.ToDictionary();
            p.Name = dict.GetValueOrDefault("name")?.ToString() ?? "";
            p.Role = dict.GetValueOrDefault("role")?.ToString() ?? "";
            p.Email = dict.GetValueOrDefault("email")?.ToString() ?? "";
            p.Phone = dict.GetValueOrDefault("phone")?.ToString() ?? "";
            p.AvatarUrl = dict.GetValueOrDefault("avatarUrl")?.ToString() ?? "";
            p.Bio = dict.GetValueOrDefault("bio")?.ToString() ?? "";
            p.CompletedShoots = Convert.ToInt32(dict.GetValueOrDefault("completedShoots") ?? 0);
            return p;
        }

        public Photographer CreatePhotographer(Photographer photographer)
        {
            if (string.IsNullOrEmpty(photographer.Id))
            {
                photographer.Id = $"photo_{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
            }

            if (_db != null)
            {
                try
                {
                    var docRef = _db.Collection(PhotographersCollection).Document(photographer.Id);
                    docRef.SetAsync(photographer, SetOptions.MergeAll).GetAwaiter().GetResult();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[FirestoreDataStore] Warning: CreatePhotographer failed: {ex.Message}");
                }
            }

            return photographer;
        }

        public bool DeletePhotographer(string id)
        {
            if (_db != null)
            {
                try
                {
                    _db.Collection(PhotographersCollection).Document(id).DeleteAsync().GetAwaiter().GetResult();
                    return true;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[FirestoreDataStore] Warning: DeletePhotographer failed: {ex.Message}");
                    return false;
                }
            }

            return false;
        }

        public List<Expense> GetExpenses()
        {
            if (_db == null) return new List<Expense>();

            try
            {
                var query = _db.Collection(ExpensesCollection).GetSnapshotAsync().GetAwaiter().GetResult();
                var list = query.Documents.Select(MapExpense).ToList();
                return list.OrderByDescending(e => e.Date).ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[FirestoreDataStore] Error getting expenses: {ex.Message}");
                return new List<Expense>();
            }
        }

        public Expense CreateExpense(Expense expense)
        {
            if (string.IsNullOrEmpty(expense.Id))
            {
                expense.Id = $"exp_{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
            }

            if (_db != null)
            {
                try
                {
                    var docRef = _db.Collection(ExpensesCollection).Document(expense.Id);
                    docRef.SetAsync(expense).GetAwaiter().GetResult();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[FirestoreDataStore] Warning: CreateExpense failed: {ex.Message}");
                }
            }

            return expense;
        }

        public bool DeleteExpense(string id)
        {
            if (_db != null)
            {
                try
                {
                    _db.Collection(ExpensesCollection).Document(id).DeleteAsync().GetAwaiter().GetResult();
                    return true;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[FirestoreDataStore] Warning: DeleteExpense failed: {ex.Message}");
                    return false;
                }
            }

            return false;
        }

        private static Expense MapExpense(DocumentSnapshot doc)
        {
            var e = doc.ConvertTo<Expense>();
            if (!string.IsNullOrEmpty(e.Title)) return e;

            var dict = doc.ToDictionary();
            e.Id = doc.Id;
            e.Title = dict.GetValueOrDefault("title")?.ToString() ?? "";
            e.Category = dict.GetValueOrDefault("category")?.ToString() ?? "Gear & Maintenance";
            e.Date = dict.GetValueOrDefault("date")?.ToString() ?? "";
            e.Description = dict.GetValueOrDefault("description")?.ToString();
            e.LoggedBy = dict.GetValueOrDefault("loggedBy")?.ToString();
            if (dict.TryGetValue("amountZAR", out var amt) && decimal.TryParse(amt?.ToString(), out var a))
            {
                e.AmountZAR = a;
            }
            return e;
        }

        public DashboardStats GetStats()
        {
            var bookings = GetBookings();
            var services = GetServices();
            var photographers = GetPhotographers();
            var expenses = GetExpenses();

            var gross = bookings.Where(b => b.Status != "Cancelled").Sum(b => b.SubtotalZAR);
            var totalExp = expenses.Sum(e => e.AmountZAR);
            var net = gross - totalExp;
            var margin = gross > 0 ? Math.Round((net / gross) * 100, 1) : 0;

            return new DashboardStats
            {
                TotalBookings = bookings.Count,
                GrossRevenueZAR = gross,
                TotalExpensesZAR = totalExp,
                NetProfitZAR = net,
                OperatingMarginPercent = margin,
                OutstandingBalancesZAR = bookings.Where(b => b.PaymentStatus != "Fully Paid" && b.Status != "Cancelled").Sum(b => b.RemainingBalanceZAR),
                PendingEditingCount = bookings.Count(b => b.GalleryStatus == "editing"),
                TotalServicesCount = services.Count,
                TotalPhotographersCount = photographers.Count
            };
        }
    }
}
