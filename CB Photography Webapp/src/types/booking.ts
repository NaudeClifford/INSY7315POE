export type BookingStatus = "Confirmed" | "Pending" | "Cancelled" | "Completed";
export type PaymentStatus = "Deposit Paid" | "Paid in Full" | "Pending" | "Unpaid" | "Refunded";

export interface BookingLocation {
  venueName: string;              // e.g. "Walter Sisulu National Botanical Garden"
  address: string;
  suburb: string;
  latitude: number;
  longitude: number;
  distanceFromBaseKm: number;     // Distance from Krugersdorp base
  travelFeeZAR: number;           // Calculated surcharge (R5/km beyond 20km)
  additionalDirections?: string;  // Gate codes, parking instructions
  city?: string;
  province?: string;
}

export interface BookingCustomer {
  fullName: string;
  email: string;
  phone: string;
  eventType?: string;
  notes?: string;                 // Special vision / styling notes
}

export interface Booking {
  id: string;
  clientId: string;                 // User UID
  bookingReference: string;         // e.g. "CB-54231"
  serviceId?: string;
  serviceName: string;              // e.g. "Weddings & Elopements"
  packageId?: string;
  packageName: string;              // e.g. "Full Day Heirloom (8 Hours)"
  photographerId?: string;
  photographerName: string;         // e.g. "Camryn Burger (Lead)"
  date: string;                     // e.g. "Saturday, 24 Oct 2026" or "2026-10-24"
  timeSlot: string;                 // e.g. "15:30 - 17:30 (Golden Hour)"
  customer: BookingCustomer;
  location: BookingLocation;
  basePriceZAR: number;             // Package base price (ZAR)
  travelFeeZAR: number;             // Travel fee (ZAR)
  lateNightSurchargeZAR: number;    // R450 for midnight slots (23:00 - 01:00)
  subtotalZAR: number;              // basePrice + travelFee + lateNightSurcharge
  depositRequiredZAR: number;       // 50% of subtotal
  remainingBalanceZAR: number;      // 50% remaining due on shoot day
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;                // Date booking was logged
  invoiceNumber?: string;
  galleryUrl?: string;
  galleryStatus?: "editing" | "ready" | "sent" | "expired";
  yocoCheckoutId?: string;
  yocoPaymentId?: string;
  depositPaidAt?: string;
  balancePaidAt?: string;
}

export interface TravelQuoteInput {
  suburb?: string;
  city?: string;
  distanceKm?: number;
  latitude?: number;
  longitude?: number;
}

export interface QuoteBreakdown {
  basePrice: number;
  travelDistanceKm: number;
  travelFee: number;
  lateNightSurcharge: number;
  subtotal: number;
  depositRequired: number;
  remainingBalance: number;
}
