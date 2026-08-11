// Type definitions for client shoot bookings, payment statuses, location details, and quotes
export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";
export type PaymentStatus = "Unpaid" | "Deposit Paid" | "Fully Paid" | "Refunded";

// Physical venue location & travel distance calculation interface
export interface TravelDetails {
  venueName: string;
  address: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
  additionalDirections?: string;
  distanceFromBaseKm: number;
  travelFeeZAR: number;
}

// Client contact details interface
export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  eventType: string;
  notes?: string;
}

// Master shoot booking interface
export interface Booking {
  id: string;
  bookingReference: string;
  serviceId: string;
  serviceName: string;
  packageId: string;
  packageName: string;
  photographerId: string;
  photographerName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "14:00 - 16:00"
  location: TravelDetails;
  customer: CustomerDetails;
  basePriceZAR: number;
  travelFeeZAR: number;
  addonsTotalZAR: number;
  subtotalZAR: number;
  depositRequiredZAR: number;
  remainingBalanceZAR: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  galleryStatus?: "editing" | "ready" | "sent" | "expired";
  galleryUrl?: string;
}

// Travel quote calculation input
export interface TravelQuoteInput {
  suburb: string;
  city: string;
  distanceKm?: number;
}

// Itemized pricing quote calculation result
export interface QuoteBreakdown {
  basePrice: number;
  travelDistanceKm: number;
  travelFee: number;
  subtotal: number;
  depositRequired: number;
  remainingBalance: number;
}

