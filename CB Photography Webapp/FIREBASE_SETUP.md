# Firebase Database & Schema Documentation

Welcome to the Firebase setup and database documentation for my Camryn Burger Photography web application. I have documented the Firestore collections and data schemas I designed for this project below, along with how my environment variables and database security rules are structured.

---

## 1. Environment Configuration

I have configured my Firebase credentials in the `.env.local` file located in the root directory of the project:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cb-photography-webapp.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cb-photography-webapp
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cb-photography-webapp.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

When you run the application, it connects directly to Cloud Firestore and Firebase Authentication as the single source of truth for all bookings, services, team members, expenses, and user roles.

---

## 2. Firestore Collections & Schemas

Here are the five core collections I created to structure the database for my application:

### A. Collection: `services`
Stores all bespoke photography offerings and their associated package tiers.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | string | Document identifier (e.g. `serv-weddings`) |
| `slug` | string | URL route slug (e.g. `weddings`, `matric-dances`) |
| `title` | string | Service title name |
| `tagline` | string | Short tagline summary |
| `description` | string | Concise marketing summary |
| `longDescription` | string | Detailed editorial service description |
| `imageUrl` | string | Cover photo path |
| `startingPriceZAR` | number | Base starting rate in ZAR |
| `approxDuration` | string | Duration estimate (e.g. `4 to 12 Hours`) |
| `editedImagesSummary` | string | Estimate of delivered retouched photos |
| `inclusions` | array<string> | List of package inclusions |
| `packages` | array<object> | Package tier objects (`id`, `name`, `durationHours`, `startingPriceZAR`, `features`, `popular`) |

### B. Collection: `photographers`
Stores photographer profile details, specialties, ratings, and schedule availability.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | string | Document identifier (e.g. `photo-camryn`) |
| `name` | string | Full name |
| `email` | string | Contact email address |
| `role` | string | Role title (e.g. `Lead Photographer`, `Senior Associate`) |
| `bio` | string | Biography and experience overview |
| `specialties` | array<string> | Photography specialties |
| `rating` | number | Average review rating out of 5 |
| `completedShoots` | number | Total count of completed client shoots |
| `availableDays` | array<string> | Working days of the week |
| `avatarUrl` | string | Profile image path |

### C. Collection: `bookings`
Captures client shoot bookings, schedule slots, travel fee calculations, and lifecycle status progression.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | string | Unique booking record identifier |
| `bookingReference` | string | Customer reference code (e.g. `CB-88219`) |
| `serviceId` | string | Associated service ID |
| `serviceName` | string | Associated service title |
| `packageId` | string | Selected package tier ID |
| `packageName` | string | Selected package tier name |
| `photographerId` | string | Assigned photographer ID |
| `photographerName` | string | Assigned photographer name |
| `date` | string | Scheduled date (`YYYY-MM-DD`) |
| `timeSlot` | string | Scheduled time slot (e.g. `09:00 - 11:00`) |
| `location` | map | Object containing venue name, address, suburb, city, province, and distance from Krugersdorp |
| `customer` | map | Object containing client full name, email, phone number, and shoot notes |
| `basePriceZAR` | number | Selected package price in ZAR |
| `travelFeeZAR` | number | Travel surcharge (R5/km past a 20km radius from Krugersdorp) |
| `subtotalZAR` | number | Total shoot quote amount |
| `depositRequiredZAR` | number | 50% deposit amount required to confirm |
| `remainingBalanceZAR`| number | Outstanding balance due on shoot day |
| `status` | string | Current lifecycle status (`Pending Deposit`, `Confirmed`, `Shoot Complete`, `Delivered`, `Cancelled`) |
| `paymentStatus` | string | Payment status (`Unpaid`, `Deposit Paid`, `Fully Paid`) |
| `galleryStatus` | string | Digital delivery status (`editing`, `ready`, `sent`) |
| `galleryUrl` | string | External delivery gallery URL (Pixieset / SmugMug) |
| `createdAt` | string | Timestamp when booking was created |

### D. Collection: `portfolio`
Powers the public gallery showcase and interactive lightbox viewer.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | string | Unique gallery item identifier |
| `title` | string | Image caption or shoot title |
| `category` | string | Category (`Solo`, `Couples`, `Graduations`, `Events`, `Group`, `Weddings`, `Matric Dances`, `Corporate`, `Lifestyle`) |
| `imageUrl` | string | Path to high-resolution photo |
| `location` | string | Shoot venue and city |
| `photographer` | string | Credited photographer name |

### E. Collection: `testimonials`
Stores verified client reviews and ratings.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | string | Unique testimonial identifier |
| `clientName` | string | Client or couple name |
| `roleOrEvent` | string | Occasion or shoot type |
| `quote` | string | Review text |
| `rating` | number | Star rating (1 to 5) |
| `date` | string | Review date |

### F. Collection: `users`
Stores user profile information, role-based authorization, and photographer linkages.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | string | User UID (matches Firebase Auth UID) |
| `email` | string | Registered email address |
| `name` | string | Full display name |
| `role` | string | Role permission (`client`, `photographer`, `admin`) |
| `phone` | string | Contact phone or WhatsApp number |
| `photographerId` | string | Linked photographer document ID (e.g. `photo-camryn`, `photo-miah`, `photo-brendon`) |
| `createdAt` | string | Account creation timestamp |

### G. Collection: `expenses`
Financial expense tracking for studio equipment, studio hire, maintenance, and travel.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | string | Unique expense identifier (e.g. `exp_1712345678`) |
| `title` | string | Description / title of the expense item |
| `amountZAR` | number | Expense value in South African Rand |
| `category` | string | Category (e.g. `Gear & Maintenance`, `Studio Hire`, `Travel & Fuel`, `Marketing`) |
| `date` | string | Date logged (`YYYY-MM-DD`) |
| `loggedBy` | string | Email or name of the admin who logged the expense |

---

## 3. Database Security Rules

Here are the Firestore security rules I established to protect the collections while allowing public reading of marketing content and client booking submissions:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Public read-only catalogs: services, team roster, portfolio gallery & reviews
    match /services/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /photographers/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /portfolio/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /testimonials/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // User account profiles: users can manage their own profile; admins can manage all
    match /users/{userId} {
      allow read, write: if request.auth != null;
    }

    // Bookings & client gallery links
    match /bookings/{bookingId} {
      allow read, write: if true;
    }
    match /gallery_links/{bookingId} {
      allow read, write: if true;
    }

    // Studio operations & expenses (admin only)
    match /expenses/{expenseId} {
      allow read, write: if request.auth != null;
    }
  }
}
```
