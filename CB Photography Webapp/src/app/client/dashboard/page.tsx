"use client";

// Client portal dashboard page for reviewing shoot bookings, downloading photo galleries, and handling payments
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Toast, ToastMessage } from "@/components/ui/Toast";
import { getCustomerBookings, cancelBooking } from "@/lib/api";
import { Booking } from "@/types/booking";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  FileText,
  MessageCircle,
  AlertCircle,
  X,
  CheckCircle2,
  Download,
  LogOut
} from "lucide-react";

import { getAuthUser, loginUser, logoutUser } from "@/lib/auth";

export default function ClientDashboardPage() {
  const router = useRouter();
  // Client portal bookings & notification state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [clientEmailInput, setClientEmailInput] = useState("nadine.dp@gmail.com");
  const [clientPassInput, setClientPassInput] = useState("password123");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Booking | null>(null);
  const [rescheduleModalBooking, setRescheduleModalBooking] = useState<Booking | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Check auth state on mount
  useEffect(() => {
    const user = getAuthUser();
    if (user && user.role === "client") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleClientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser("client", clientEmailInput, clientEmailInput.split("@")[0]);
    setIsAuthenticated(true);
  };

  const handleSignOut = () => {
    logoutUser();
    setIsAuthenticated(false);
  };

  // Load active client bookings on mount
  useEffect(() => {
    try {
      const data = getCustomerBookings();
      if (data && Promise.resolve(data) === data) {
        (data as Promise<Booking[]>).then((res) => {
          setBookings(res);
          setLoading(false);
        });
      } else {
        setBookings(data as unknown as Booking[]);
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to fetch customer bookings", err);
      setLoading(false);
    }
  }, []);


  const handleCancel = async (bookingId: string) => {
    if (confirm("Are you sure you want to request cancellation for this booking? (See T&Cs for refund policy)")) {
      await cancelBooking(bookingId);
      setBookings(await getCustomerBookings());
      setToast({
        id: Date.now().toString(),
        type: "info",
        title: "Cancellation Requested",
        message: "Your cancellation request has been logged. Our team will contact you regarding deposit terms."
      });
    }
  };

  const handleReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleDate) return;
    setToast({
      id: Date.now().toString(),
      type: "success",
      title: "Reschedule Request Sent",
      message: `Your request to move shoot ${rescheduleModalBooking?.bookingReference} to ${rescheduleDate} has been submitted.`
    });
    setRescheduleModalBooking(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f3ed] text-[#402615]">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-[#402615] text-[#f7f3ed] pt-32 pb-16 border-b border-[#bea683]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#bea683] font-semibold">
              Client Portal
            </span>
            <h1 className="font-serif-heading text-3xl sm:text-5xl font-normal mt-1">
              Welcome back, Nadine Du Plessis
            </h1>
            <p className="text-xs text-[#d6c8b1] mt-1">
              Manage your shoots, download tax invoices, and access your private gallery links.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/booking"
              className="bg-[#7d5e3c] hover:bg-[#bea683] hover:text-[#402615] text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded-sm transition-all shadow-md shrink-0"
            >
              + Book New Shoot
            </Link>

            {isAuthenticated && (
              <button
                onClick={handleSignOut}
                className="bg-rose-900/40 hover:bg-rose-800 text-rose-200 border border-rose-500/30 text-xs font-semibold uppercase px-3.5 py-3 rounded-sm transition-colors flex items-center gap-1.5 shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {!isAuthenticated ? (
        <section className="py-20 max-w-md mx-auto px-4 flex-1 w-full">
          <div className="bg-white p-8 rounded-sm border border-[#bea683]/50 shadow-xl space-y-6 text-center">
            <div className="p-3 bg-[#7d5e3c]/20 text-[#7d5e3c] rounded-full w-fit mx-auto">
              <Calendar className="w-8 h-8" />
            </div>
            <h2 className="font-serif-heading text-2xl font-bold text-[#402615]">
              Customer Portal Security Login
            </h2>
            <p className="text-xs text-[#878679]">
              Please authenticate below to access your active bookings, download tax invoices, and view private photo galleries.
            </p>
            <form onSubmit={handleClientLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs uppercase font-semibold text-[#7d5e3c] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={clientEmailInput}
                  onChange={(e) => setClientEmailInput(e.target.value)}
                  className="w-full bg-[#f7f3ed] border border-[#bea683]/50 rounded-sm p-3 text-xs text-[#402615]"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-semibold text-[#7d5e3c] mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={clientPassInput}
                  onChange={(e) => setClientPassInput(e.target.value)}
                  className="w-full bg-[#f7f3ed] border border-[#bea683]/50 rounded-sm p-3 text-xs text-[#402615]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#7d5e3c] text-white text-xs font-semibold uppercase tracking-widest py-3.5 rounded-sm hover:bg-[#402615] transition-all shadow-md"
              >
                Sign In to Client Portal
              </button>
            </form>
          </div>
        </section>
      ) : (
        /* Main Dashboard Area */
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 space-y-10 w-full">
        {/* Bookings Section */}
        <div className="bg-white border border-[#bea683]/40 rounded-sm shadow-sm overflow-hidden">
          <div className="p-6 bg-[#d6c8b1]/20 border-b border-[#bea683]/30 flex items-center justify-between">
            <h2 className="font-serif-heading text-2xl text-[#402615] font-semibold">
              Your Bookings & Shoot Deliveries
            </h2>
            <span className="text-xs text-[#878679]">
              Total Bookings: <strong>{bookings.length}</strong>
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-[#878679]">Loading your portal data...</div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#878679]">No bookings found.</div>
          ) : (
            <div className="divide-y divide-[#bea683]/20">
              {bookings.map((b) => (
                <div key={b.id} className="p-6 space-y-4 hover:bg-[#f7f3ed]/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-serif-heading text-xl font-bold text-[#402615]">
                          {b.serviceName}
                        </span>
                        <span className="text-xs text-[#7d5e3c] font-medium">({b.packageName})</span>
                        <StatusBadge status={b.status} type="booking" />
                        <StatusBadge status={b.paymentStatus} type="payment" />
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#878679] pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#bea683]" />
                          {b.date} ({b.timeSlot})
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#bea683]" />
                          {b.location.venueName}, {b.location.city}
                        </span>
                        <span>Ref: <strong>{b.bookingReference}</strong></span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setSelectedInvoice(b)}
                        className="inline-flex items-center gap-1 text-xs border border-[#bea683] text-[#402615] px-3 py-1.5 rounded-sm hover:bg-[#bea683]/20 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#7d5e3c]" />
                        <span>Tax Invoice</span>
                      </button>

                      <a
                        href={`https://wa.me/27824567890?text=Hi%20Camryn,%20enquiry%20regarding%20booking%20${b.bookingReference}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs border border-emerald-600 text-emerald-800 px-3 py-1.5 rounded-sm hover:bg-emerald-50 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Contact Photographer</span>
                      </a>

                      {b.status !== "Cancelled" && (
                        <>
                          <button
                            onClick={() => setRescheduleModalBooking(b)}
                            className="text-xs text-[#7d5e3c] hover:underline px-2 py-1"
                          >
                            Reschedule
                          </button>

                          <button
                            onClick={() => handleCancel(b.id)}
                            className="text-xs text-rose-700 hover:underline px-2 py-1"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Private Gallery Banner */}
                  {b.galleryStatus === "ready" && b.galleryUrl ? (
                    <div className="p-4 bg-[#402615] text-[#f7f3ed] rounded-sm border border-[#bea683]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                        <div>
                          <h4 className="font-serif-heading text-lg font-medium text-white">
                            Your photographs are ready!
                          </h4>
                          <p className="text-xs text-[#d6c8b1]">
                            Your private password-protected online gallery has been published.
                          </p>
                        </div>
                      </div>

                      <a
                        href={b.galleryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-[#bea683] hover:bg-white text-[#402615] text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-sm transition-all shadow-md shrink-0"
                      >
                        <span>View Private Gallery</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  ) : (
                    <div className="p-3 bg-[#d6c8b1]/20 rounded-sm text-xs text-[#878679] flex items-center justify-between">
                      <span>
                        Gallery Status: <strong>{b.galleryStatus === "editing" ? "Editing in Progress (Standard 14-Day Delivery)" : "Pending Shoot Date"}</strong>
                      </span>
                      <span className="text-[11px] italic">External link will appear here upon completion</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      )}

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#f7f3ed] text-[#402615] max-w-lg w-full p-8 rounded-sm border border-[#bea683] shadow-2xl space-y-6 animate-fade-in">
            <div className="flex justify-between items-start border-b border-[#bea683]/30 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#7d5e3c] font-semibold">
                  Tax Invoice
                </span>
                <h3 className="font-serif-heading text-2xl font-bold">
                  INV-{selectedInvoice.bookingReference}
                </h3>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="p-1 text-[#878679] hover:text-[#402615]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p><strong>Billed To:</strong> {selectedInvoice.customer.fullName} ({selectedInvoice.customer.email})</p>
              <p><strong>Service:</strong> {selectedInvoice.serviceName} - {selectedInvoice.packageName}</p>
              <p><strong>Shoot Date:</strong> {selectedInvoice.date}</p>
              <p><strong>Location:</strong> {selectedInvoice.location.venueName}, {selectedInvoice.location.city}</p>
              <hr className="border-[#bea683]/30 my-2" />
              <div className="flex justify-between">
                <span>Base Package Rate:</span>
                <span>R{formatCurrency(selectedInvoice.basePriceZAR)}</span>
              </div>
              <div className="flex justify-between">
                <span>Travel Charge ({selectedInvoice.location.distanceFromBaseKm} km):</span>
                <span>R{selectedInvoice.travelFeeZAR}</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t pt-2">
                <span>Subtotal (ZAR):</span>
                <span>R{formatCurrency(selectedInvoice.subtotalZAR)}</span>
              </div>
              <div className="flex justify-between text-xs text-[#7d5e3c] font-semibold">
                <span>Deposit Paid:</span>
                <span>R{formatCurrency(selectedInvoice.depositRequiredZAR)}</span>
              </div>
              <div className="flex justify-between text-xs text-rose-800 font-semibold">
                <span>Remaining Balance Due:</span>
                <span>R{formatCurrency(selectedInvoice.remainingBalanceZAR)}</span>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                onClick={() => {
                  alert("Downloading PDF Tax Invoice...");
                  setSelectedInvoice(null);
                }}
                className="w-full inline-flex justify-center items-center gap-2 bg-[#7d5e3c] text-white text-xs uppercase font-semibold py-3 rounded-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#f7f3ed] text-[#402615] max-w-md w-full p-6 rounded-sm border border-[#bea683] shadow-2xl space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-serif-heading text-xl font-bold">Request Reschedule</h3>
              <button onClick={() => setRescheduleModalBooking(null)} className="p-1 text-[#878679]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#878679]">
              Booking Ref: <strong>{rescheduleModalBooking.bookingReference}</strong> ({rescheduleModalBooking.serviceName})
            </p>

            <form onSubmit={handleReschedule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#7d5e3c] mb-1">
                  New Preferred Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full bg-white border border-[#bea683]/50 rounded-sm p-3 text-sm"
                />
              </div>

              <div className="p-3 bg-amber-900/10 rounded-sm text-[11px] text-amber-950">
                Notice: One free postponement is permitted. A second postponement incurs a 25% surcharge per T&Cs.
              </div>

              <button
                type="submit"
                className="w-full bg-[#7d5e3c] text-white text-xs font-semibold uppercase py-3 rounded-sm"
              >
                Submit Reschedule Request
              </button>
            </form>
          </div>
        </div>
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
      <Footer />
    </div>
  );
}
