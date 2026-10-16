# Camryn Burger Photography Web Application

A web application and studio management platform built for Camryn Burger Photography in Krugersdorp, Gauteng. The platform provides an online booking wizard for clients, a portal for photographers to view schedules and manage shoot workflows, and an administrative console for business analytics and database management.

---

## Features

### Client Portal & Booking
- Online Booking Wizard: Step-by-step package selection, Krugersdorp travel distance calculation (R5/km past a 20km radius), and automatic 50% deposit breakdown.
- Client Dashboard: Real-time shoot status tracking, downloadable tax invoices, and access to external gallery links.
- Filterable Portfolio: Category-based image gallery across weddings, matric dances, graduations, couples, solo, corporate, and events.

### Photographer Operations Portal
- Shoot Schedule: Calendar view of assigned shoots with client information and venue details.
- Task Checklists: Checklist toggles for equipment preparation, shoot completion, and retouching status.
- Gallery Delivery: Ability to attach Pixieset or SmugMug delivery links to completed bookings.

### Studio Administration Console
- Studio Metrics: Overview of total bookings, revenue, outstanding balances, and editing queue status.
- Booking Management: Full bookings table with status updates and photographer re-assignment.
- Database Seeder: Utility to initialize and populate Firestore collections with default services, packages, and photographer profiles.

---

## Project Structure

```
CB Photography Webapp/
|-- Controllers/          # ASP.NET Core API Controllers (/api/...)
|   |-- AuthController.cs
|   |-- BookingsController.cs
|   |-- DashboardController.cs
|   |-- PhotographersController.cs
|   `-- ServicesController.cs
|-- Models/               # C# domain models (Booking, Service, Photographer)
|-- Services/             # In-memory data store and service interfaces
|-- Program.cs            # Backend API server & Next.js proxy routing
`-- src/                  # Next.js frontend application
    |-- app/              # App Router pages and portals
    |-- components/       # Reusable UI components
    |-- lib/              # Firebase configuration, authentication, and client API helpers
    `-- types/            # TypeScript type definitions
```

---

## Getting Started

### Prerequisites
- Node.js (version 20 or higher recommended)
- .NET SDK (version 10.0 or compatible)

### Running the Application

#### Option 1: Full Stack via Terminal (.NET + Next.js) (Recommended)
```powershell
dotnet run
```
This builds and starts the ASP.NET Core backend API on `http://localhost:7200` and automatically launches the Next.js development server on `http://localhost:3000`.

#### Option 2: Frontend & Backend via Separate Terminals
**Terminal 1 (Backend API):**
```powershell
npm run api
# or: dotnet run --launch-profile http
```
**Terminal 2 (Next.js Frontend):**
```powershell
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

> [!NOTE]
> The authentication endpoints (`POST /api/auth/login`), bookings, and Yoco payment services run on the ASP.NET Core API (port 7200). If the backend API is not running, the frontend will automatically operate in **offline/standalone fallback mode** with full support for demo accounts.

#### Option 3: Visual Studio
1. Open `CB Photography Webapp.sln`.
2. Run using the `http` (or `https`) launch profile.

---

## Authentication & Cloud Architecture

The application runs entirely off Firebase:
- **Authentication**: Firebase Authentication manages user credentials securely.
- **Data Persistence**: Cloud Firestore is the single source of truth for all collections (`bookings`, `services`, `photographers`, `expenses`, `portfolio`, `gallery_links`, `users`).
- **No Local Fallbacks / Clones**: All operations read and write directly to Firebase, eliminating local clones and data collision.

Client accounts can register directly at `/register` or via the interactive Auth Modal. Studio Administrator and Photographer roles are determined by Firestore user profiles in the `users` collection.

---

## Continuous Integration

An automated CI workflow is configured in `.github/workflows/ci.yml` to run on pushes and pull requests to `main` and `Web App Code`. It executes:
1. Dependency installation (`npm ci`).
2. ESLint code validation (`npm run lint`).
3. TypeScript compilation and Next.js production build (`npm run build`).
