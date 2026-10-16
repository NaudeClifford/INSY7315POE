"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LiveWeatherCard } from "@/components/ui/LiveWeatherCard";
import { getCustomerBookings, cancelBooking, updateBooking } from "@/lib/api";
import { Booking } from "@/types/booking";
import { formatCurrency } from "@/lib/utils";
import {
  Calendar,
  MapPin,
  Phone,
  Navigation,
  XCircle,
  ExternalLink,
  Download,
  CheckCircle2,
  Camera,
  CreditCard,
  ShieldCheck
} from "lucide-react";
import { YocoPaymentModal } from "@/components/ui/YocoPaymentModal";
import { fetchCurrentUser, AuthUser } from "@/lib/auth";

export default function ClientDashboardPage() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "galleries" | "invoices">("upcoming");
  const [selectedInvoice, setSelectedInvoice] = useState<Booking | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [yocoModal, setYocoModal] = useState<{
    isOpen: boolean;
    booking: Booking | null;
    paymentType: "deposit" | "balance" | "full";
    amount: number;
  }>({
    isOpen: false,
    booking: null,
    paymentType: "deposit",
    amount: 0
  });

  const loadData = async (userEmail?: string) => {
    if (!userEmail) {
      setBookings([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getCustomerBookings(userEmail);
      setBookings(data || []);
    } catch (err) {
      console.error("Failed to load customer bookings", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const user = await fetchCurrentUser();
      if (cancelled) return;
      if (user && (user.role === "client" || user.role === "admin")) {
        setAuthUser(user);
        loadData(user.email);
      } else {
        router.replace("/login");
      }
    })();
    return () => { cancelled = true; };
  }, [router]);

  const handlePayDeposit = (b: Booking) => {
    const depositAmt = b.depositRequiredZAR || Math.round((b.subtotalZAR || 3500) * 0.5);
    setYocoModal({
      isOpen: true,
      booking: b,
      paymentType: "deposit",
      amount: depositAmt
    });
  };

  const handlePayBalance = (b: Booking) => {
    const balanceAmt = b.remainingBalanceZAR || Math.round((b.subtotalZAR || 3500) * 0.5);
    setYocoModal({
      isOpen: true,
      booking: b,
      paymentType: "balance",
      amount: balanceAmt
    });
  };

  const handlePayInFull = (b: Booking) => {
    const fullAmt = b.subtotalZAR || (b.depositRequiredZAR ? b.depositRequiredZAR * 2 : 3500);
    setYocoModal({
      isOpen: true,
      booking: b,
      paymentType: "full",
      amount: fullAmt
    });
  };

  const handleCancelBooking = async (id: string, ref: string) => {
    if (
      confirm(
        `Are you sure you wish to cancel reservation ${ref}? Your calendar time slot will be released for other clients.`
      )
    ) {
      await cancelBooking(id);
      if (authUser) loadData(authUser.email);
      setNotification(`Booking ${ref} has been cancelled and the calendar slot released.`);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const upcomingBookings = bookings.filter((b) => b.status !== "Cancelled");

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#141210] text-[#2C2420] dark:text-[#FAF8F5] transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-32 w-full space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE3D9] dark:border-[#3A332C] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                Client Portal & Reservations
              </span>
              {authUser?.role === "admin" && (
                <span className="bg-[#2E5E43]/15 text-[#2E5E43] dark:text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Admin Preview Active
                </span>
              )}
            </div>
            <h1 className="font-serif-heading text-3xl sm:text-4xl font-normal">
              Welcome, {authUser?.name || "Valued Client"}
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Manage your upcoming photoshoot reservations, weather forecasts, invoices & photo galleries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {authUser?.role === "admin" && (
              <>
                <Link
                  href="/admin/dashboard"
                  className="px-3 py-2 bg-[#FAF8F5] dark:bg-[#25221F] border border-[#EAE3D9] dark:border-[#3A332C] hover:border-[#C5A880] text-[#2C2420] dark:text-[#FAF8F5] text-xs font-medium rounded-sm flex items-center gap-1.5 transition-colors"
                  title="Switch to Admin Console"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Admin Console</span>
                </Link>
                <Link
                  href="/photographer/dashboard"
                  className="px-3 py-2 bg-[#FAF8F5] dark:bg-[#25221F] border border-[#EAE3D9] dark:border-[#3A332C] hover:border-[#C5A880] text-[#2C2420] dark:text-[#FAF8F5] text-xs font-medium rounded-sm flex items-center gap-1.5 transition-colors"
                  title="Switch to Photographer Portal"
                >
                  <Camera className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Photographer Portal</span>
                </Link>
              </>
            )}

            <Link
              href="/booking"
              className="bg-[#C5A880] hover:bg-[#2C2420] text-[#2C2420] hover:text-white dark:text-[#2C2420] text-xs font-semibold uppercase tracking-wider py-2.5 px-5 rounded-sm transition-all shadow-sm"
            >
              + Book New Shoot
            </Link>
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="p-4 bg-[#2E5E43]/15 border border-[#2E5E43]/30 text-[#2E5E43] dark:text-emerald-300 text-xs rounded-sm flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* 3 Main Tabs: Upcoming Shoots, Past Galleries, Tax Invoices */}
        <div className="flex border-b border-[#EAE3D9] dark:border-[#3A332C]">
          <button
            type="button"
            onClick={() => setActiveTab("upcoming")}
            className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === "upcoming"
                ? "border-[#C5A880] text-[#C5A880]"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            }`}
          >
            Bookings & Reservations ({upcomingBookings.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("galleries")}
            className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === "galleries"
                ? "border-[#C5A880] text-[#C5A880]"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            }`}
          >
            Delivered Galleries
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("invoices")}
            className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === "invoices"
                ? "border-[#C5A880] text-[#C5A880]"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            }`}
          >
            Tax Invoices & Statements
          </button>
        </div>

        {/* TAB 1: UPCOMING SHOOTS */}
        {activeTab === "upcoming" && (
          <div className="space-y-6">
            {loading ? (
              <div className="p-12 text-center text-xs text-neutral-400">Loading reservations...</div>
            ) : upcomingBookings.length === 0 ? (
              <div className="bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-12 text-center space-y-4">
                <Calendar className="w-8 h-8 text-[#C5A880] mx-auto" />
                <h3 className="font-serif-heading text-xl">No upcoming photoshoots yet</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Ready to document your wedding, matric dance, graduation or portraits?
                </p>
                <Link
                  href="/booking"
                  className="inline-block bg-[#C5A880] text-[#2C2420] text-xs font-semibold uppercase tracking-wider px-6 py-2.5 rounded-sm shadow"
                >
                  Book a Shoot Now
                </Link>
              </div>
            ) : (
              upcomingBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-6 space-y-6 shadow-sm"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAE3D9] dark:border-[#3A332C] pb-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold">
                        Ref: {b.bookingReference} • {b.serviceName}
                      </span>
                      <h3 className="font-serif-heading text-2xl font-normal mt-0.5">
                        {b.packageName}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#2E5E43]/15 text-[#2E5E43] dark:text-emerald-300">
                        {b.status}
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded ${
                        b.paymentStatus === "Deposit Paid" || b.paymentStatus === "Paid in Full"
                          ? "bg-[#2E5E43]/20 text-[#2E5E43] dark:text-emerald-300 border border-[#2E5E43]/30"
                          : "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                      }`}>
                        {b.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Shoot Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-neutral-600 dark:text-neutral-300">
                    <div className="flex items-start gap-2.5">
                      <Calendar className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-[#2C2420] dark:text-[#FAF8F5]">Date & Time Slot</strong>
                        <span>{b.date}</span>
                        <span className="block text-neutral-400">{b.timeSlot}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-[#2C2420] dark:text-[#FAF8F5]">Shoot Venue</strong>
                        <span>{b.location.venueName}</span>
                        <span className="block text-neutral-400">
                          {b.location.distanceFromBaseKm} km from Krugersdorp
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Camera className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-[#2C2420] dark:text-[#FAF8F5]">Assigned Photographer</strong>
                        <span>{b.photographerName}</span>
                        <span className="block text-neutral-400">Direct studio coordination</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Alert Banner if Unpaid or Pending */}
                  {(b.paymentStatus === "Unpaid" || b.paymentStatus === "Pending") && (
                    <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                        <CreditCard className="w-4 h-4 shrink-0" />
                        <span>Deposit Required: <strong>R {formatCurrency(b.depositRequiredZAR || Math.round((b.subtotalZAR || 3500) * 0.5))}</strong> (50% to secure calendar slot)</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handlePayDeposit(b)}
                          className="px-3.5 py-2 bg-[#2E5E43] text-white font-semibold text-[11px] uppercase tracking-wider rounded-sm hover:bg-[#254d37] transition-all flex items-center gap-1.5 cursor-pointer shadow"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Pay Deposit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePayInFull(b)}
                          className="px-3.5 py-2 bg-[#2C2420] dark:bg-[#C5A880] text-white dark:text-[#2C2420] hover:bg-[#C5A880] hover:text-[#2C2420] font-semibold text-[11px] uppercase tracking-wider rounded-sm transition-all flex items-center gap-1.5 cursor-pointer shadow"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Pay in Full</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Settle Balance Banner if Deposit is Paid */}
                  {b.paymentStatus === "Deposit Paid" && (
                    <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>
                          Deposit Paid ✓ — Balance Due on Shoot Day: <strong>R {formatCurrency(b.remainingBalanceZAR ?? (b.subtotalZAR ? b.subtotalZAR - (b.depositRequiredZAR || 0) : Math.round((b.subtotalZAR || 3500) * 0.5)))}</strong>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePayBalance(b)}
                        className="px-4 py-2 bg-[#2C2420] dark:bg-[#C5A880] text-white dark:text-[#2C2420] hover:bg-[#C5A880] hover:text-[#2C2420] font-semibold text-[11px] uppercase tracking-wider rounded-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay Balance</span>
                      </button>
                    </div>
                  )}

                  {/* Gallery Ready Shortcut Banner */}
                  {b.galleryUrl && (
                    <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>High-Resolution Photo Gallery has been edited and uploaded!</span>
                      </div>
                      <a
                        href={b.galleryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-emerald-600 text-white font-semibold text-[11px] uppercase tracking-wider rounded-sm hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shrink-0"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open High-Res Gallery</span>
                      </a>
                    </div>
                  )}

                  {/* Live Weather Forecast Preview for Shoot Venue */}
                  <LiveWeatherCard
                    latitude={b.location.latitude || -26.0883}
                    longitude={b.location.longitude || 27.8447}
                    venueName={b.location.venueName}
                  />

                  {/* 2-Tier Mobile Action Buttons */}
                  <div className="pt-2 border-t border-[#EAE3D9] dark:border-[#3A332C]">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-semibold">
                      {/* 1. Directions (Google Maps) */}
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${b.location.latitude || -26.0883},${b.location.longitude || 27.8447}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] hover:border-[#C5A880] rounded flex items-center justify-center gap-1.5 transition-colors text-center"
                      >
                        <Navigation className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>Directions</span>
                      </a>

                      {/* 2. Download Tax Invoice */}
                      <button
                        type="button"
                        onClick={() => setSelectedInvoice(b)}
                        className="p-2.5 bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] hover:border-[#C5A880] rounded flex items-center justify-center gap-1.5 transition-colors text-center"
                      >
                        <Download className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>Invoice PDF</span>
                      </button>

                      {/* 3. Call Studio Line */}
                      <a
                        href="tel:+27821234567"
                        className="p-2.5 bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] hover:border-[#C5A880] rounded flex items-center justify-center gap-1.5 transition-colors text-center"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>Call Studio</span>
                      </a>

                      {/* 4. Cancel Booking (Releases slot) */}
                      <button
                        type="button"
                        onClick={() => handleCancelBooking(b.id, b.bookingReference)}
                        className="p-2.5 bg-rose-900/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 hover:bg-rose-900/20 rounded flex items-center justify-center gap-1.5 transition-colors text-center"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel Shoot</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: DELIVERED GALLERIES */}
        {activeTab === "galleries" && (
          <div className="space-y-4">
            {bookings.filter((b) => b.galleryUrl).map((b) => (
              <div
                key={b.id}
                className="bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#2E5E43] dark:text-emerald-400 font-bold">
                    Gallery Ready for Download
                  </span>
                  <h4 className="font-serif-heading text-xl">{b.packageName}</h4>
                  <p className="text-xs text-neutral-500">
                    Shot on {b.date} at {b.location.venueName}
                  </p>
                </div>

                <a
                  href={b.galleryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#C5A880] text-[#2C2420] text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded-sm shadow hover:bg-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Private Gallery</span>
                </a>
              </div>
            ))}
            {bookings.filter((b) => b.galleryUrl).length === 0 && (
              <div className="p-12 text-center text-xs text-neutral-400 bg-white dark:bg-[#1C1917] rounded-sm border border-[#EAE3D9] dark:border-[#3A332C]">
                Your photo galleries will appear here once post-production retouching is complete within 14 days.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TAX INVOICES */}
        {activeTab === "invoices" && (
          <div className="bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] dark:bg-[#141210] border-b border-[#EAE3D9] dark:border-[#3A332C] uppercase text-[10px] tracking-wider text-neutral-400">
                  <tr>
                    <th className="p-3.5">Invoice #</th>
                    <th className="p-3.5">Shoot Ref</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Total (ZAR)</th>
                    <th className="p-3.5">Deposit Paid</th>
                    <th className="p-3.5">Balance Due</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE3D9] dark:divide-[#3A332C]">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                      <td className="p-3.5 font-mono font-semibold text-[#C5A880]">
                        {b.invoiceNumber || "INV-CB-2026-001"}
                      </td>
                      <td className="p-3.5">{b.bookingReference}</td>
                      <td className="p-3.5">{b.date}</td>
                      <td className="p-3.5 font-semibold">R {formatCurrency(b.subtotalZAR)}</td>
                      <td className="p-3.5 text-[#2E5E43] dark:text-emerald-400 font-semibold">
                        R {formatCurrency(b.depositRequiredZAR)}
                      </td>
                      <td className="p-3.5">R {formatCurrency(b.remainingBalanceZAR)}</td>
                      <td className="p-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedInvoice(b)}
                          className="text-[#C5A880] hover:underline font-semibold"
                        >
                          View & Print
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Invoice Modal Preview */}
        {selectedInvoice && (
          <div
            className="fixed inset-0 z-[160] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setSelectedInvoice(null)}
          >
            <div
              className="bg-white text-[#2C2420] w-full max-w-2xl rounded-md p-8 shadow-2xl space-y-6 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h2 className="font-serif-heading text-2xl font-bold">Camryn Burger Photography</h2>
                  <p className="text-neutral-500">Studio Base: Krugersdorp, Gauteng</p>
                  <p className="text-neutral-500">Email: info@cbphotography.co.za | Tel: +27 82 123 4567</p>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase font-bold text-[#C5A880] block">Official Tax Invoice</span>
                  <span className="font-mono font-bold text-sm">
                    {selectedInvoice.invoiceNumber || "INV-CB-2026-001"}
                  </span>
                  <p className="text-neutral-500 mt-1">Date: {selectedInvoice.createdAt}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-4 rounded border">
                <div>
                  <strong className="block text-neutral-400 text-[10px] uppercase">Billed To:</strong>
                  <p className="font-semibold">{selectedInvoice.customer.fullName}</p>
                  <p>{selectedInvoice.customer.email}</p>
                  <p>{selectedInvoice.customer.phone}</p>
                </div>
                <div>
                  <strong className="block text-neutral-400 text-[10px] uppercase">Shoot Specifications:</strong>
                  <p><strong>Package:</strong> {selectedInvoice.packageName}</p>
                  <p><strong>Date & Time:</strong> {selectedInvoice.date} @ {selectedInvoice.timeSlot}</p>
                  <p><strong>Venue:</strong> {selectedInvoice.location.venueName}</p>
                </div>
              </div>

              <table className="w-full text-left border-t border-b py-2">
                <thead>
                  <tr className="border-b text-neutral-400 text-[10px] uppercase">
                    <th className="py-2">Description</th>
                    <th className="py-2 text-right">Amount (ZAR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  <tr>
                    <td className="py-2">{selectedInvoice.packageName} (Base Package)</td>
                    <td className="py-2 text-right font-semibold">R {formatCurrency(selectedInvoice.basePriceZAR)}</td>
                  </tr>
                  <tr>
                    <td className="py-2">
                      Studio Travel Surcharge ({selectedInvoice.location.distanceFromBaseKm} km from base)
                    </td>
                    <td className="py-2 text-right font-semibold">R {formatCurrency(selectedInvoice.travelFeeZAR)}</td>
                  </tr>
                  {selectedInvoice.lateNightSurchargeZAR > 0 && (
                    <tr>
                      <td className="py-2">Midnight Session Surcharge (23:00 - 01:00)</td>
                      <td className="py-2 text-right font-semibold">R {formatCurrency(selectedInvoice.lateNightSurchargeZAR)}</td>
                    </tr>
                  )}
                  <tr className="font-bold text-sm border-t">
                    <td className="py-2.5">Subtotal Quote:</td>
                    <td className="py-2.5 text-right">R {formatCurrency(selectedInvoice.subtotalZAR)}</td>
                  </tr>
                  <tr className="text-emerald-700 font-semibold">
                    <td className="py-1">Deposit Paid (50%):</td>
                    <td className="py-1 text-right">- R {formatCurrency(selectedInvoice.depositRequiredZAR)}</td>
                  </tr>
                  <tr className="text-[#C5A880] font-bold">
                    <td className="py-1">Balance Due on Shoot Day:</td>
                    <td className="py-1 text-right">R {formatCurrency(selectedInvoice.remainingBalanceZAR)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-[#2C2420] text-white px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider hover:bg-[#C5A880] transition-colors"
                >
                  Print / Save PDF
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="border px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Yoco Payment Gateway Modal */}
      {yocoModal.booking && (
        <YocoPaymentModal
          isOpen={yocoModal.isOpen}
          onClose={() => setYocoModal((prev) => ({ ...prev, isOpen: false }))}
          bookingId={yocoModal.booking.id}
          bookingReference={yocoModal.booking.bookingReference}
          customerName={yocoModal.booking.customer.fullName}
          customerEmail={yocoModal.booking.customer.email}
          packageName={yocoModal.booking.packageName}
          amountZAR={yocoModal.amount}
          paymentType={yocoModal.paymentType}
          onSuccess={async () => {
            const isFullOrBalance =
              yocoModal.paymentType === "balance" || yocoModal.paymentType === "full";
            const updatedStatus = isFullOrBalance ? "Paid in Full" : "Deposit Paid";
            const updatePayload: Partial<Booking> = {
              paymentStatus: updatedStatus,
              status: "Confirmed"
            };
            if (isFullOrBalance) {
              updatePayload.remainingBalanceZAR = 0;
            }
            await updateBooking(yocoModal.booking!.id, updatePayload);
            if (authUser) await loadData(authUser.email);
            else await loadData();
            setNotification(
              `Payment of R ${formatCurrency(yocoModal.amount)} successfully confirmed via Yoco!`
            );
            setTimeout(() => setNotification(null), 5000);
          }}
        />
      )}

      <Footer />
    </div>
  );
}
