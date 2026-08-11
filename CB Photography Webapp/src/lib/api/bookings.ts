// API layer for client shoot bookings, quote calculations, travel fee rules, and status updates
import { MOCK_BOOKINGS } from "@/data/bookings";
import { Booking, BookingStatus, QuoteBreakdown, TravelQuoteInput } from "@/types/booking";

const STORAGE_KEY = "cb_bookings";

// In-memory array for active client shoot booking state
let bookingsStore: Booking[] = [...MOCK_BOOKINGS];

// Helper to safely get store data from browser storage or initial seed data
function getStore(): Booking[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          bookingsStore = parsed;
          return parsed;
        }
      }
      // If missing or empty array in localStorage, seed with MOCK_BOOKINGS
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_BOOKINGS));
      bookingsStore = [...MOCK_BOOKINGS];
      return bookingsStore;
    } catch {
      // Fallback
    }
  }
  return bookingsStore.length > 0 ? bookingsStore : [...MOCK_BOOKINGS];
}

// Helper to update store in memory and persistent browser storage
function saveStore(updated: Booking[]) {
  bookingsStore = updated;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Fallback
    }
  }
}

// Calculate pricing quote breakdown based on base package price and travel distance (R5/km past 20km from Krugersdorp)
export async function calculateQuote(
  basePrice: number,
  travel: TravelQuoteInput
): Promise<QuoteBreakdown> {
  const distanceKm = travel.distanceKm ?? 15;
  const billableDistance = Math.max(0, distanceKm - 20);
  const travelFee = billableDistance * 5;
  const subtotal = basePrice + travelFee;
  const depositRequired = Math.round(subtotal * 0.5);
  const remainingBalance = subtotal - depositRequired;

  return {
    basePrice,
    travelDistanceKm: distanceKm,
    travelFee,
    subtotal,
    depositRequired,
    remainingBalance
  };
}

// Create a new client shoot booking record
export async function createBooking(bookingData: Omit<Booking, "id" | "bookingReference" | "createdAt" | "status" | "paymentStatus">): Promise<Booking> {
  const currentList = getStore();
  const randomRef = `CB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const newBooking: Booking = {
    ...bookingData,
    id: `bk-${Date.now()}`,
    bookingReference: randomRef,
    status: "Confirmed",
    paymentStatus: "Deposit Paid",
    createdAt: new Date().toISOString().split("T")[0]
  };
  const updated = [newBooking, ...currentList];
  saveStore(updated);
  return newBooking;
}

// Update existing shoot booking status or details
export async function updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | null> {
  const currentList = getStore();
  const idx = currentList.findIndex((b) => b.id === id || b.bookingReference === id);
  if (idx === -1) return null;
  const updatedItem = { ...currentList[idx], ...updates };
  currentList[idx] = updatedItem;
  saveStore([...currentList]);
  return updatedItem;
}

// Cancel a shoot booking by ID
export async function cancelBooking(id: string): Promise<boolean> {
  const currentList = getStore();
  const idx = currentList.findIndex((b) => b.id === id || b.bookingReference === id);
  if (idx === -1) return false;
  currentList[idx].status = "Cancelled";
  saveStore([...currentList]);
  return true;
}

// Retrieve client shoot bookings by customer email
export async function getCustomerBookings(email?: string): Promise<Booking[]> {
  const list = getStore();
  if (email) {
    const filtered = list.filter((b) => b.customer.email.toLowerCase() === email.toLowerCase());
    return filtered.length > 0 ? filtered : list;
  }
  return list;
}

// Retrieve assigned shoot bookings for a photographer portal
export async function getPhotographerBookings(photographerId?: string): Promise<Booking[]> {
  const list = getStore();
  if (photographerId) {
    const filtered = list.filter((b) => b.photographerId === photographerId);
    return filtered.length > 0 ? filtered : list;
  }
  return list;
}

// Retrieve all bookings for the administrative dashboard
export async function getAllBookings(): Promise<Booking[]> {
  return getStore();
}

// Process deposit payment via Yoco or Instant EFT payment gateway mock
export async function createPayment(bookingId: string, amountZAR: number, provider: "Yoco" | "EFT" = "Yoco"): Promise<{ success: boolean; reference: string; message: string }> {
  const ref = `PAY-YOCO-${Math.floor(100000 + Math.random() * 900000)}`;
  const currentList = getStore();
  const idx = currentList.findIndex((b) => b.id === bookingId || b.bookingReference === bookingId);
  if (idx !== -1) {
    currentList[idx].paymentStatus = "Deposit Paid";
    saveStore([...currentList]);
  }
  return {
    success: true,
    reference: ref,
    message: `Payment of R${amountZAR.toLocaleString()} initiated via ${provider}.`
  };
}
