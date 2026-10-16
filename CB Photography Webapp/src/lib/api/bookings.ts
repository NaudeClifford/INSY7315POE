import { Booking, QuoteBreakdown, TravelQuoteInput } from "@/types/booking";
import { db, isFirebaseConfigured, cleanForFirestore } from "@/lib/firebase";
import { calculateTravelFee } from "@/lib/maps";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  where
} from "firebase/firestore";

// Computes travel fees (first 20km free from Krugersdorp, then R5/km), midnight surcharge (R450), and 50% deposit breakdown
export async function calculateQuote(
  basePrice: number,
  travel: TravelQuoteInput,
  timeSlot = ""
): Promise<QuoteBreakdown> {
  const distanceKm = travel.distanceKm ?? 15;
  const { travelFeeZAR } = calculateTravelFee(distanceKm);

  // Check for Midnight Session (23:00 - 01:00) which carries R450 surcharge
  const isMidnight = timeSlot.includes("23:00") || timeSlot.toLowerCase().includes("midnight");
  const lateNightSurcharge = isMidnight ? 450 : 0;

  const subtotal = basePrice + travelFeeZAR + lateNightSurcharge;
  const depositRequired = Math.round(subtotal * 0.5);
  const remainingBalance = subtotal - depositRequired;

  return {
    basePrice,
    travelDistanceKm: distanceKm,
    travelFee: travelFeeZAR,
    lateNightSurcharge,
    subtotal,
    depositRequired,
    remainingBalance
  };
}

// Creates a new booking directly in Firebase Firestore
export async function createBooking(
  bookingData: Omit<Booking, "id" | "bookingReference" | "createdAt" | "status" | "paymentStatus"> & {
    status?: Booking["status"];
    paymentStatus?: Booking["paymentStatus"];
  }
): Promise<Booking> {
  const randomRef = `CB-${Math.floor(10000 + Math.random() * 90000)}`;
  const bookingId = `bk_${Date.now()}`;
  const invoiceNum = `INV-CB-2026-${Math.floor(100 + Math.random() * 900)}`;

  const newBooking: Booking = {
    ...bookingData,
    id: bookingId,
    bookingReference: randomRef,
    invoiceNumber: invoiceNum,
    status: bookingData.status || "Confirmed",
    paymentStatus: bookingData.paymentStatus || "Pending",
    createdAt: new Date().toISOString()
  };

  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firestore is not configured. Unable to create booking.");
  }

  const cleaned = cleanForFirestore(newBooking);
  await setDoc(doc(db, "bookings", bookingId), cleaned);

  return newBooking;
}

// Retrieves a booking by its document ID or bookingReference
export async function getBookingById(id: string): Promise<Booking | null> {
  if (!isFirebaseConfigured() || !db || !id) return null;

  try {
    const docRef = doc(db, "bookings", id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as Booking;
    }

    const q = query(collection(db, "bookings"), where("bookingReference", "==", id));
    const qSnap = await getDocs(q);
    if (!qSnap.empty) {
      const d = qSnap.docs[0];
      return { id: d.id, ...d.data() } as Booking;
    }
  } catch (err) {
    console.error(`Firestore getBookingById(${id}) error:`, err);
  }

  return null;
}

// Updates booking details in Cloud Firestore
export async function updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | null> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firestore is not configured. Unable to update booking.");
  }

  const cleanedUpdates = cleanForFirestore(updates);

  try {
    let docRef = doc(db, "bookings", id);
    let snap = await getDoc(docRef);
    if (!snap.exists()) {
      const q = query(collection(db, "bookings"), where("bookingReference", "==", id));
      const qSnap = await getDocs(q);
      if (!qSnap.empty) {
        docRef = doc(db, "bookings", qSnap.docs[0].id);
        snap = qSnap.docs[0];
      }
    }

    if (!snap.exists()) {
      return null;
    }

    await setDoc(docRef, cleanedUpdates, { merge: true });
    const updatedSnap = await getDoc(docRef);
    if (updatedSnap.exists()) {
      return { id: updatedSnap.id, ...updatedSnap.data() } as Booking;
    }
  } catch (err) {
    console.error(`Firestore updateBooking(${id}) error:`, err);
    throw err;
  }

  return null;
}

// Flags a booking as cancelled directly in Firestore
export async function cancelBooking(id: string): Promise<boolean> {
  return (await updateBooking(id, { status: "Cancelled" })) !== null;
}

// Completely removes a booking from Cloud Firestore
export async function deleteBooking(id: string): Promise<boolean> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firestore is not configured. Unable to delete booking.");
  }

  try {
    const docRef = doc(db, "bookings", id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      await deleteDoc(docRef);
      return true;
    } else {
      const q = query(collection(db, "bookings"), where("bookingReference", "==", id));
      const qSnap = await getDocs(q);
      for (const d of qSnap.docs) {
        await deleteDoc(doc(db, "bookings", d.id));
      }
      return !qSnap.empty;
    }
  } catch (err) {
    console.error(`Firestore deleteBooking(${id}) error:`, err);
    return false;
  }
}

// Retrieves all shoots booked by a specific client email or UID directly from Firestore
export async function getCustomerBookings(emailOrUid?: string): Promise<Booking[]> {
  if (!emailOrUid) return [];
  if (!isFirebaseConfigured() || !db) return [];

  try {
    const bookingsCol = collection(db, "bookings");
    const q = emailOrUid.includes("@")
      ? query(bookingsCol, where("customer.email", "==", emailOrUid.toLowerCase()))
      : query(bookingsCol, where("clientId", "==", emailOrUid));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
  } catch (err) {
    console.error("Firestore getCustomerBookings error:", err);
    return [];
  }
}

// Retrieves all shoots assigned to a specific photographer directly from Firestore
export async function getPhotographerBookings(photographerId?: string): Promise<Booking[]> {
  if (!isFirebaseConfigured() || !db) return [];

  try {
    const bookingsCol = collection(db, "bookings");
    const q = photographerId
      ? query(bookingsCol, where("photographerId", "==", photographerId))
      : bookingsCol;
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
  } catch (err) {
    console.error("Firestore getPhotographerBookings error:", err);
    return [];
  }
}

// Returns the full bookings list directly from Cloud Firestore
export async function getAllBookings(): Promise<Booking[]> {
  if (!isFirebaseConfigured() || !db) return [];

  try {
    const snap = await getDocs(collection(db, "bookings"));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
  } catch (err) {
    console.error("Firestore getAllBookings error:", err);
    return [];
  }
}

// Simulates payment verification and updates booking in Firestore
export async function createPayment(
  bookingId: string,
  amountZAR: number,
  provider: "Yoco" | "EFT" = "Yoco"
): Promise<{ success: boolean; reference: string; message: string }> {
  const ref = `PAY-YOCO-${Math.floor(100000 + Math.random() * 900000)}`;
  await updateBooking(bookingId, {
    paymentStatus: "Deposit Paid",
    status: "Confirmed",
    depositPaidAt: new Date().toISOString().split("T")[0]
  });
  return {
    success: true,
    reference: ref,
    message: `Payment of R${amountZAR.toLocaleString()} confirmed via ${provider}.`
  };
}
