// Client bookings mock dataset representing active, pending, and completed shoots
import { Booking } from "@/types/booking";

// Initial list of client bookings used for admin, photographer, and client portal views
export const MOCK_BOOKINGS: Booking[] = [

  {
    id: "bk-1001",
    bookingReference: "CB-2026-8901",
    serviceId: "serv-weddings",
    serviceName: "Wedding Photography",
    packageId: "pkg-wed-editorial",
    packageName: "Editorial Elegance",
    photographerId: "photo-camryn",
    photographerName: "Camryn Burger",
    date: "2026-08-22",
    timeSlot: "12:00 - 20:00",
    location: {
      venueName: "Avianto Estate",
      address: "Villa Via Road",
      suburb: "Muldersdrift",
      city: "Krugersdorp",
      province: "Gauteng",
      postalCode: "1739",
      distanceFromBaseKm: 12,
      travelFeeZAR: 0
    },
    customer: {
      fullName: "Nadine Du Plessis",
      email: "nadine.dp@gmail.com",
      phone: "+27 83 123 4567",
      eventType: "Wedding Ceremony & Reception",
      notes: "Golden hour sunset portrait request."
    },
    basePriceZAR: 10500,
    travelFeeZAR: 0,
    addonsTotalZAR: 1200,
    subtotalZAR: 11700,
    depositRequiredZAR: 5850,
    remainingBalanceZAR: 5850,
    status: "Confirmed",
    paymentStatus: "Deposit Paid",
    createdAt: "2026-08-01",
    galleryStatus: "editing"
  },
  {
    id: "bk-1002",
    bookingReference: "CB-2026-8902",
    serviceId: "serv-matric",
    serviceName: "Matric Dances",
    packageId: "pkg-mat-couple",
    packageName: "Couple & Arrival",
    photographerId: "photo-camryn",
    photographerName: "Camryn Burger",
    date: "2026-08-28",
    timeSlot: "15:30 - 18:00",
    location: {
      venueName: "Kloofzicht Lodge",
      address: "R564 Chrome Street",
      suburb: "Kromdraai",
      city: "Krugersdorp",
      province: "Gauteng",
      postalCode: "1739",
      distanceFromBaseKm: 18,
      travelFeeZAR: 0
    },
    customer: {
      fullName: "Liam & Sarah Botha",
      email: "sarah.b@gmail.com",
      phone: "+27 72 987 1122",
      eventType: "Matric Dance Pre-Session",
      notes: "Arriving in a vintage Mustang."
    },
    basePriceZAR: 3400,
    travelFeeZAR: 0,
    addonsTotalZAR: 0,
    subtotalZAR: 3400,
    depositRequiredZAR: 1700,
    remainingBalanceZAR: 0,
    status: "Completed",
    paymentStatus: "Fully Paid",
    createdAt: "2026-07-20",
    galleryStatus: "ready",
    galleryUrl: "https://cbphotography.pixieset.com/liamsarahmatric2026/"
  },
  {
    id: "bk-1003",
    bookingReference: "CB-2026-8903",
    serviceId: "serv-corporate",
    serviceName: "Corporate Events & Headshots",
    packageId: "pkg-corp-event",
    packageName: "Half-Day Corporate Event",
    photographerId: "photo-associate",
    photographerName: "Lethabo Ndlovu",
    date: "2026-09-05",
    timeSlot: "09:00 - 13:00",
    location: {
      venueName: "Sandton Convention Centre",
      address: "161 Maude St",
      suburb: "Sandton",
      city: "Johannesburg",
      province: "Gauteng",
      postalCode: "2196",
      distanceFromBaseKm: 38,
      travelFeeZAR: 90 // (38km - 20km) * R5 = 18 * 5 = R90
    },
    customer: {
      fullName: "Kagiso Khumalo",
      email: "k.khumalo@techsa.co.za",
      phone: "+27 82 555 9090",
      eventType: "TechSA Summit 2026",
      notes: "Keynote presentation & executive networking."
    },
    basePriceZAR: 4500,
    travelFeeZAR: 90,
    addonsTotalZAR: 0,
    subtotalZAR: 4590,
    depositRequiredZAR: 2295,
    remainingBalanceZAR: 2295,
    status: "Pending",
    paymentStatus: "Unpaid",
    createdAt: "2026-08-05"
  }
];
