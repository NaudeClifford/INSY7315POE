"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getBookingById } from "@/lib/api/bookings";
import { Booking } from "@/types/booking";
import { formatCurrency } from "@/lib/utils";
import { verifyYocoCheckout } from "@/lib/yoco";
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const checkoutId = searchParams.get("checkoutId");
  const paymentType = (searchParams.get("type") as "deposit" | "balance" | "full") || "deposit";

  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function verifyAndLoad() {
      if (!bookingId) return;

      if (checkoutId) {
        try {
          await verifyYocoCheckout(checkoutId, bookingId, paymentType);
        } catch (err) {
          console.error("Verification error:", err);
        }
      }

      try {
        const found = await getBookingById(bookingId);
        if (found && isMounted) {
          setBooking(found);
        }
      } catch (err) {
        console.error("Failed to load booking details:", err);
      }
    }

    verifyAndLoad();

    return () => {
      isMounted = false;
    };
  }, [bookingId, checkoutId, paymentType]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#141210] text-[#2C2420] dark:text-[#FAF8F5]">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-28 sm:py-36 w-full">
        <div className="bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-md p-8 sm:p-12 text-center space-y-6 shadow-2xl animate-fade-in">
          {/* Badge & Icon */}
          <div className="w-16 h-16 bg-[#2E5E43]/15 text-[#2E5E43] dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto ring-8 ring-[#2E5E43]/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C5A880] font-semibold block">
              Payment Confirmed via Yoco Gateway
            </span>
            <h1 className="font-serif-heading text-3xl sm:text-5xl font-normal text-[#2C2420] dark:text-[#FAF8F5]">
              {paymentType === "balance" || paymentType === "full"
                ? "Photoshoot Fully Settled!"
                : "Photoshoot Reservation Confirmed!"}
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 max-w-md mx-auto leading-relaxed">
            Thank you! Your payment has been securely processed by Yoco.
            {booking?.bookingReference && (
              <>
                {" "}Booking reference{" "}
                <strong className="text-[#C5A880]">{booking.bookingReference}</strong>{" "}
                is now active on our studio calendar.
              </>
            )}
          </p>

          {/* Verification indicator */}
          {checkoutId && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] text-[11px] text-neutral-500">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2E5E43] dark:text-emerald-400" />
              <span>Yoco Transaction ID:</span>
              <code className="text-[#2C2420] dark:text-[#FAF8F5] font-mono font-medium">
                {checkoutId}
              </code>
            </div>
          )}

          {/* Details Card */}
          {booking && (
            <div className="bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-6 text-left text-xs space-y-3 max-w-lg mx-auto">
              <div className="flex justify-between border-b border-[#EAE3D9] dark:border-[#3A332C] pb-2">
                <span className="text-neutral-500">Service & Package:</span>
                <strong className="text-[#2C2420] dark:text-[#FAF8F5]">
                  {booking.packageName}
                </strong>
              </div>
              <div className="flex justify-between border-b border-[#EAE3D9] dark:border-[#3A332C] pb-2">
                <span className="text-neutral-500">Date & Slot:</span>
                <strong className="text-[#2C2420] dark:text-[#FAF8F5]">
                  {booking.date} • {booking.timeSlot}
                </strong>
              </div>
              <div className="flex justify-between border-b border-[#EAE3D9] dark:border-[#3A332C] pb-2">
                <span className="text-neutral-500">Assigned Photographer:</span>
                <strong className="text-[#2C2420] dark:text-[#FAF8F5]">
                  {booking.photographerName}
                </strong>
              </div>
              <div className="flex justify-between border-b border-[#EAE3D9] dark:border-[#3A332C] pb-2">
                <span className="text-neutral-500">Venue:</span>
                <strong className="text-[#2C2420] dark:text-[#FAF8F5]">
                  {booking.location?.venueName}
                </strong>
              </div>
              <div className="flex justify-between border-b border-[#EAE3D9] dark:border-[#3A332C] pb-2">
                <span className="text-neutral-500">Payment Status:</span>
                <strong className="text-[#2E5E43] dark:text-emerald-400 bg-[#2E5E43]/10 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border border-[#2E5E43]/30">
                  {booking.paymentStatus || "Deposit Paid"}
                </strong>
              </div>
              <div className="flex justify-between border-b border-[#EAE3D9] dark:border-[#3A332C] pb-2">
                <span className="text-neutral-500">Deposit Amount Paid (via Yoco):</span>
                <strong className="text-[#2E5E43] dark:text-emerald-400">
                  R {formatCurrency(booking.depositRequiredZAR)}
                </strong>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-neutral-500">Remaining Balance:</span>
                <strong className="text-[#C5A880]">
                  {booking.paymentStatus === "Paid in Full"
                    ? "R 0.00 (Fully Settled)"
                    : `R ${formatCurrency(booking.remainingBalanceZAR)} (Due on Shoot Day)`}
                </strong>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/client/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2C2420] dark:bg-[#C5A880] text-white dark:text-[#2C2420] hover:bg-[#C5A880] text-xs font-semibold uppercase tracking-wider py-3.5 px-8 rounded-sm shadow-md transition-all"
            >
              <span>Go to Client Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#EAE3D9] dark:border-[#3A332C] text-xs font-semibold uppercase tracking-wider py-3.5 px-8 rounded-sm hover:border-[#C5A880] transition-colors"
            >
              <span>Return to Home</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#2C2420] text-white flex items-center justify-center">
          <p className="text-xs uppercase tracking-widest text-[#C5A880]">
            Verifying Yoco Transaction...
          </p>
        </div>
      }
    >
      <BookingSuccessContent />
    </Suspense>
  );
}
