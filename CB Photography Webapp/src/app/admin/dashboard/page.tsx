"use client";

// Administrative dashboard portal for monitoring revenue stats, managing client shoot bookings, and reassigning photographers
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Toast, ToastMessage } from "@/components/ui/Toast";
import { getAllBookings, getServices, getPhotographers } from "@/lib/api";
import { Booking } from "@/types/booking";
import { Service } from "@/types/service";
import { Photographer } from "@/types/user";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  TrendingUp,
  Calendar,
  Users,
  DollarSign,
  Package,
  ExternalLink,
  Edit,
  Sliders,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  FileText,
  Filter,
  Plus,
  LogOut
} from "lucide-react";

import { getAuthUser, logoutUser } from "@/lib/auth";

export default function AdminDashboardPage() {
  const router = useRouter();
  // Admin dashboard state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [activeTab, setActiveTab] = useState<"bookings" | "services" | "photographers" | "reports">("bookings");
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Require admin login authentication
  useEffect(() => {
    const user = getAuthUser();
    if (!user || user.role !== "admin") {
      window.location.assign("/login/admin");
    }
  }, []);

  const handleSignOut = () => {
    logoutUser();
    window.location.assign("/login/admin");
  };

  // Fetch all system bookings, services, and photographers on mount
  useEffect(() => {
    async function loadData() {
      try {
        const bData = await getAllBookings();
        const sData = await getServices();
        const pData = await getPhotographers();
        setBookings(bData || []);
        setServices(sData || []);
        setPhotographers(pData || []);
      } catch (err) {
        console.error("Failed to load admin data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalRevenue = bookings.reduce((sum, b) => sum + b.subtotalZAR, 0);
  const outstandingPayments = bookings
    .filter((b) => b.paymentStatus !== "Fully Paid")
    .reduce((sum, b) => sum + b.remainingBalanceZAR, 0);
  const pendingEditing = bookings.filter((b) => b.galleryStatus === "editing").length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f3ed] text-[#402615]">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-[#402615] text-[#f7f3ed] pt-32 pb-16 border-b border-[#bea683]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#bea683] font-semibold">
              Management & Operations Console
            </span>
            <h1 className="font-serif-heading text-3xl sm:text-5xl font-normal mt-1">
              Studio Admin Overview
            </h1>
            <p className="text-xs text-[#d6c8b1] mt-1">
              Camryn Burger Photography • The Union Lab Master Management
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-[#bea683] text-[#402615] px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider">
              Role: System Admin
            </span>
            <button
              onClick={handleSignOut}
              className="bg-rose-900/40 hover:bg-rose-800 text-rose-200 border border-rose-500/30 text-xs font-semibold uppercase px-3.5 py-1.5 rounded-sm transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Admin Console Area */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 space-y-10 w-full">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-sm border border-[#bea683]/40 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-[#878679]">
              <span className="text-xs uppercase tracking-wider font-semibold">Total Bookings</span>
              <Calendar className="w-5 h-5 text-[#7d5e3c]" />
            </div>
            <div className="font-serif-heading text-3xl font-bold text-[#402615]">{bookings.length}</div>
            <p className="text-[11px] text-[#878679]">Active & Completed Shoots</p>
          </div>

          <div className="bg-white p-6 rounded-sm border border-[#bea683]/40 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-[#878679]">
              <span className="text-xs uppercase tracking-wider font-semibold">Gross Revenue</span>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="font-serif-heading text-3xl font-bold text-emerald-800">
              R{formatCurrency(totalRevenue)}
            </div>
            <p className="text-[11px] text-[#878679]">Combined Subtotals</p>
          </div>

          <div className="bg-white p-6 rounded-sm border border-[#bea683]/40 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-[#878679]">
              <span className="text-xs uppercase tracking-wider font-semibold">Outstanding Balances</span>
              <DollarSign className="w-5 h-5 text-rose-600" />
            </div>
            <div className="font-serif-heading text-3xl font-bold text-rose-800">
              R{formatCurrency(outstandingPayments)}
            </div>
            <p className="text-[11px] text-[#878679]">Due Before Shoot Date</p>
          </div>

          <div className="bg-white p-6 rounded-sm border border-[#bea683]/40 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-[#878679]">
              <span className="text-xs uppercase tracking-wider font-semibold">Editing Pipeline</span>
              <Package className="w-5 h-5 text-[#7d5e3c]" />
            </div>
            <div className="font-serif-heading text-3xl font-bold text-[#7d5e3c]">{pendingEditing}</div>
            <p className="text-[11px] text-[#878679]">In Progress (14-Day Delivery)</p>
          </div>
        </div>

        {/* Console Navigation Tabs */}
        <div className="flex border-b border-[#bea683]/30 gap-4 text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`pb-3 transition-colors relative ${
              activeTab === "bookings"
                ? "text-[#7d5e3c] font-bold"
                : "text-[#878679] hover:text-[#402615]"
            }`}
          >
            Manage Bookings & Links
            {activeTab === "bookings" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7d5e3c]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("services")}
            className={`pb-3 transition-colors relative ${
              activeTab === "services"
                ? "text-[#7d5e3c] font-bold"
                : "text-[#878679] hover:text-[#402615]"
            }`}
          >
            Services & Packages ({services.length})
            {activeTab === "services" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7d5e3c]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("photographers")}
            className={`pb-3 transition-colors relative ${
              activeTab === "photographers"
                ? "text-[#7d5e3c] font-bold"
                : "text-[#878679] hover:text-[#402615]"
            }`}
          >
            Team & Availability ({photographers.length})
            {activeTab === "photographers" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7d5e3c]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`pb-3 transition-colors relative ${
              activeTab === "reports"
                ? "text-[#7d5e3c] font-bold"
                : "text-[#878679] hover:text-[#402615]"
            }`}
          >
            Reports & Analytics
            {activeTab === "reports" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7d5e3c]" />
            )}
          </button>
        </div>

        {/* TAB 1: MANAGE BOOKINGS */}
        {activeTab === "bookings" && (
          <div className="bg-white border border-[#bea683]/40 rounded-sm shadow-sm overflow-hidden">
            <div className="p-6 bg-[#d6c8b1]/20 border-b border-[#bea683]/30 flex justify-between items-center">
              <h3 className="font-serif-heading text-xl font-semibold text-[#402615]">
                Master Bookings Register
              </h3>
              <Link
                href="/booking"
                className="bg-[#7d5e3c] text-white text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-sm"
              >
                + Create Admin Reservation
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f7f3ed] uppercase text-[#7d5e3c] border-b border-[#bea683]/30 font-semibold">
                  <tr>
                    <th className="p-4">Ref #</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Service & Package</th>
                    <th className="p-4">Photographer</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Gallery Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#bea683]/20">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-[#f7f3ed]/50">
                      <td className="p-4 font-bold text-[#402615]">{b.bookingReference}</td>
                      <td className="p-4">
                        <span className="block font-semibold">{b.customer.fullName}</span>
                        <span className="text-[11px] text-[#878679]">{b.customer.email}</span>
                      </td>
                      <td className="p-4">
                        <span>{b.serviceName}</span>
                        <span className="block text-[11px] text-[#7d5e3c]">{b.packageName}</span>
                      </td>
                      <td className="p-4 font-medium">{b.photographerName}</td>
                      <td className="p-4 whitespace-nowrap">{b.date}</td>
                      <td className="p-4 font-bold">R{formatCurrency(b.subtotalZAR)}</td>
                      <td className="p-4 space-y-1">
                        <StatusBadge status={b.status} type="booking" />
                      </td>
                      <td className="p-4">
                        {b.galleryUrl ? (
                          <a
                            href={b.galleryUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-700 underline font-semibold flex items-center gap-1"
                          >
                            View Link <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-[11px] text-[#878679] italic">Pending Delivery</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE SERVICES & PACKAGES */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((serv) => (
                <div key={serv.id} className="bg-white p-6 rounded-sm border border-[#bea683]/40 space-y-4 shadow-sm">
                  <div className="flex justify-between items-start border-b pb-3">
                    <div>
                      <h4 className="font-serif-heading text-2xl font-semibold text-[#402615]">
                        {serv.title}
                      </h4>
                      <p className="text-xs text-[#7d5e3c]">Starting from R{formatCurrency(serv.startingPriceZAR)}</p>
                    </div>
                    <button
                      onClick={() =>
                        setToast({
                          id: Date.now().toString(),
                          type: "info",
                          title: "Service Editor",
                          message: `Editing options for ${serv.title} opened.`
                        })
                      }
                      className="text-xs border border-[#bea683] px-3 py-1 rounded-sm text-[#402615] hover:bg-[#bea683]/20"
                    >
                      Edit Service
                    </button>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] uppercase font-bold text-[#7d5e3c]">Package Tiers:</span>
                    <ul className="space-y-1 text-xs text-[#878679]">
                      {serv.packages.map((pkg) => (
                        <li key={pkg.id} className="flex justify-between p-2 bg-[#f7f3ed] rounded-sm">
                          <span>{pkg.name} ({pkg.durationHours} hrs)</span>
                          <strong className="text-[#402615]">R{formatCurrency(pkg.startingPriceZAR)}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PHOTOGRAPHERS & AVAILABILITY */}
        {activeTab === "photographers" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {photographers.map((photo) => (
              <div key={photo.id} className="bg-white p-6 rounded-sm border border-[#bea683]/40 space-y-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden relative border border-[#bea683]">
                    <img src={photo.avatarUrl} alt={photo.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-serif-heading text-xl font-bold">{photo.name}</h4>
                    <p className="text-xs text-[#7d5e3c]">{photo.email}</p>
                    <span className="text-[11px] text-[#878679]">{photo.completedShoots} Shoots Completed</span>
                  </div>
                </div>

                <div className="text-xs text-[#878679]">
                  <strong className="text-[#402615] block mb-1">Available Days:</strong>
                  <div className="flex flex-wrap gap-1">
                    {photo.availableDays.map((d) => (
                      <span key={d} className="bg-[#d6c8b1]/30 border border-[#bea683]/30 px-2 py-0.5 rounded-sm text-[10px]">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: REPORTS & ANALYTICS */}
        {activeTab === "reports" && (
          <div className="bg-white p-8 rounded-sm border border-[#bea683]/40 shadow-sm space-y-6 text-center">
            <BarChart3 className="w-12 h-12 text-[#7d5e3c] mx-auto" />
            <h3 className="font-serif-heading text-2xl font-semibold text-[#402615]">
              Revenue & Performance Reports
            </h3>
            <p className="text-xs text-[#878679] max-w-md mx-auto">
              Monthly breakdown for South African tax compliance, shoot volume metrics, and photographer commission tracking.
            </p>
            <div className="p-6 bg-[#f7f3ed] rounded-sm max-w-lg mx-auto border border-[#bea683]/30 text-left space-y-2 text-xs">
              <div className="flex justify-between"><span>August 2026 Revenue:</span><strong>R16,350</strong></div>
              <div className="flex justify-between"><span>Completed Shoots:</span><strong>12</strong></div>
              <div className="flex justify-between"><span>Average Booking Value:</span><strong>R5,450</strong></div>
            </div>
          </div>
        )}
      </section>

      <Toast toast={toast} onClose={() => setToast(null)} />
      <Footer />
    </div>
  );
}
