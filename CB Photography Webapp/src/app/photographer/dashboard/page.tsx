"use client";

// Photographer portal dashboard for managing assigned shoots, gear checklists, and publishing client gallery links
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Toast, ToastMessage } from "@/components/ui/Toast";
import { getPhotographerBookings, updateBooking, saveGalleryLink } from "@/lib/api";
import { Booking, BookingStatus } from "@/types/booking";
import { useRouter } from "next/navigation";
import {
  Camera,
  Calendar,
  Clock,
  MapPin,
  CheckSquare,
  Square,
  Link as LinkIcon,
  Phone,
  User,
  Plus,
  Save,
  CheckCircle2,
  ExternalLink,
  LogOut
} from "lucide-react";

import { getAuthUser, loginUser, logoutUser } from "@/lib/auth";

export default function PhotographerDashboardPage() {
  const router = useRouter();
  // Photographer portal state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [photoEmailInput, setPhotoEmailInput] = useState("camryn@cbphotography.co.za");
  const [photoPassInput, setPhotoPassInput] = useState("photo123");
  const [assignedBookings, setAssignedBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"shoots" | "gallery-links">("shoots");
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Check auth state on mount
  useEffect(() => {
    const user = getAuthUser();
    if (user && user.role === "photographer") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handlePhotoLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser("photographer", photoEmailInput, "Camryn Burger");
    setIsAuthenticated(true);
  };

  const handleSignOut = () => {
    logoutUser();
    setIsAuthenticated(false);
  };

  // Load photographer's assigned shoot schedule on mount
  useEffect(() => {
    async function loadShoots() {
      try {
        const data = await getPhotographerBookings();
        setAssignedBookings(data || []);
      } catch (err) {
        console.error("Failed to load photographer bookings", err);
      } finally {
        setLoading(false);
      }
    }
    loadShoots();
  }, []);

  // Modal for linking external gallery URL
  const [linkModalBooking, setLinkModalBooking] = useState<Booking | null>(null);
  const [externalUrlInput, setExternalUrlInput] = useState("");

  // Task Checklists state keyed by booking id
  const [checklists, setChecklists] = useState<Record<string, { gearPacked: boolean; shootDone: boolean; editingDone: boolean }>>({
    "bk-1001": { gearPacked: true, shootDone: false, editingDone: false },
    "bk-1002": { gearPacked: true, shootDone: true, editingDone: true },
    "bk-1003": { gearPacked: false, shootDone: false, editingDone: false }
  });

  const toggleChecklist = (bookingId: string, key: "gearPacked" | "shootDone" | "editingDone") => {
    setChecklists((prev) => {
      const current = prev[bookingId] || { gearPacked: false, shootDone: false, editingDone: false };
      const updated = { ...current, [key]: !current[key] };
      return { ...prev, [bookingId]: updated };
    });
  };

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    await updateBooking(bookingId, { status: newStatus });
    setAssignedBookings(await getPhotographerBookings());
    setToast({
      id: Date.now().toString(),
      type: "success",
      title: "Booking Status Updated",
      message: `Booking status changed to ${newStatus}.`
    });
  };

  const handleSaveGalleryLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkModalBooking || !externalUrlInput) return;

    await saveGalleryLink(linkModalBooking.id, externalUrlInput);
    await updateBooking(linkModalBooking.id, {
      galleryStatus: "ready",
      galleryUrl: externalUrlInput,
      status: "Completed"
    });

    setAssignedBookings(await getPhotographerBookings());
    setToast({
      id: Date.now().toString(),
      type: "success",
      title: "External Gallery Link Saved!",
      message: `Published external gallery URL associated with booking ${linkModalBooking.bookingReference}. Client can now view gallery.`
    });

    setLinkModalBooking(null);
    setExternalUrlInput("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f3ed] text-[#402615]">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-[#402615] text-[#f7f3ed] pt-32 pb-16 border-b border-[#bea683]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#bea683] font-semibold">
              Photographer Operations Console
            </span>
            <h1 className="font-serif-heading text-3xl sm:text-5xl font-normal mt-1">
              Camryn Burger Dashboard
            </h1>
            <p className="text-xs text-[#d6c8b1] mt-1">
              Track upcoming shoots, update task checklists, and attach client Pixieset/SmugMug gallery links.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-[#bea683]/20 border border-[#bea683]/40 px-3 py-1.5 rounded-sm text-xs text-[#bea683] font-medium">
              Role: Lead Photographer
            </span>
            {isAuthenticated && (
              <button
                onClick={handleSignOut}
                className="bg-rose-900/40 hover:bg-rose-800 text-rose-200 border border-rose-500/30 text-xs font-semibold uppercase px-3.5 py-1.5 rounded-sm transition-colors flex items-center gap-1.5"
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
              <Camera className="w-8 h-8" />
            </div>
            <h2 className="font-serif-heading text-2xl font-bold text-[#402615]">
              Photographer Portal Security Access
            </h2>
            <p className="text-xs text-[#878679]">
              Please authenticate below to access assigned shoot schedules, gear checklists, and publish client Pixieset/SmugMug galleries.
            </p>
            <form onSubmit={handlePhotoLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs uppercase font-semibold text-[#7d5e3c] mb-1">
                  Photographer Email
                </label>
                <input
                  type="email"
                  required
                  value={photoEmailInput}
                  onChange={(e) => setPhotoEmailInput(e.target.value)}
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
                  value={photoPassInput}
                  onChange={(e) => setPhotoPassInput(e.target.value)}
                  className="w-full bg-[#f7f3ed] border border-[#bea683]/50 rounded-sm p-3 text-xs text-[#402615]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#7d5e3c] text-white text-xs font-semibold uppercase tracking-widest py-3.5 rounded-sm hover:bg-[#402615] transition-all shadow-md"
              >
                Access Photographer Dashboard
              </button>
            </form>
          </div>
        </section>
      ) : (
        /* Main Content Area */
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 space-y-10 w-full">
        {/* Bookings & Shoots Management List */}
        <div className="bg-white border border-[#bea683]/40 rounded-sm shadow-sm overflow-hidden">
          <div className="p-6 bg-[#d6c8b1]/20 border-b border-[#bea683]/30 flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-serif-heading text-2xl text-[#402615] font-semibold">
              Assigned Shoots & Workflow Tasks
            </h2>
            <span className="text-xs text-[#878679]">
              Total Assigned: <strong>{assignedBookings.length} Shoots</strong>
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-[#878679]">Loading schedule...</div>
          ) : (
            <div className="divide-y divide-[#bea683]/20">
              {assignedBookings.map((b: Booking) => {

                const chk = checklists[b.id] || { gearPacked: false, shootDone: false, editingDone: false };
                return (
                  <div key={b.id} className="p-6 space-y-6 hover:bg-[#f7f3ed]/40 transition-colors">
                    {/* Top Row: Shoot Info & Status Selector */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-serif-heading text-2xl font-bold text-[#402615]">
                            {b.serviceName}
                          </span>
                          <span className="text-xs font-semibold text-[#7d5e3c]">[{b.packageName}]</span>
                          <StatusBadge status={b.status} type="booking" />
                          <StatusBadge status={b.paymentStatus} type="payment" />
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-[#878679] pt-1">
                          <span className="flex items-center gap-1 font-semibold text-[#402615]">
                            <Calendar className="w-3.5 h-3.5 text-[#bea683]" />
                            {b.date} ({b.timeSlot})
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-[#bea683]" />
                            Client: {b.customer.fullName} ({b.customer.phone})
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#bea683]" />
                            {b.location.venueName}, {b.location.suburb}
                          </span>
                        </div>
                      </div>

                      {/* Status Selector & Gallery Link Trigger */}
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                          <label className="text-[11px] uppercase font-semibold text-[#7d5e3c]">
                            Status:
                          </label>
                          <select
                            value={b.status}
                            onChange={(e) => handleStatusChange(b.id, e.target.value as BookingStatus)}
                            className="bg-[#f7f3ed] border border-[#bea683]/50 text-xs rounded-sm p-1.5 font-semibold"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>

                        <button
                          onClick={() => {
                            setLinkModalBooking(b);
                            setExternalUrlInput(b.galleryUrl || "");
                          }}
                          className="inline-flex items-center gap-1.5 bg-[#7d5e3c] text-white hover:bg-[#402615] text-xs font-semibold uppercase tracking-wider px-3.5 py-2 rounded-sm transition-all shadow-sm"
                        >
                          <LinkIcon className="w-3.5 h-3.5" />
                          <span>{b.galleryUrl ? "Update Gallery Link" : "+ Add External Gallery Link"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Middle Row: Shoot Location & Special Notes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-[#d6c8b1]/20 p-4 rounded-sm border border-[#bea683]/30">
                      <div>
                        <strong className="block text-[#7d5e3c] uppercase text-[10px] tracking-wider mb-1">
                          Location & Directions:
                        </strong>
                        <p className="text-[#402615]">
                          {b.location.venueName} • {b.location.address}, {b.location.suburb}, {b.location.city}
                        </p>
                        {b.location.additionalDirections && (
                          <p className="text-[#878679] italic mt-0.5">{b.location.additionalDirections}</p>
                        )}
                      </div>

                      <div>
                        <strong className="block text-[#7d5e3c] uppercase text-[10px] tracking-wider mb-1">
                          Client Notes & Preferences:
                        </strong>
                        <p className="text-[#402615]">{b.customer.notes || "No special requests listed."}</p>
                      </div>
                    </div>

                    {/* Bottom Row: Workflow Task Checklist */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-[#bea683]/20">
                      <div className="flex flex-wrap items-center gap-6 text-xs">
                        <span className="font-semibold text-[#402615] uppercase tracking-wider text-[11px]">
                          Task Checklist:
                        </span>

                        <button
                          type="button"
                          onClick={() => toggleChecklist(b.id, "gearPacked")}
                          className="flex items-center gap-1.5 hover:text-[#7d5e3c]"
                        >
                          {chk.gearPacked ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4 text-[#878679]" />
                          )}
                          <span className={chk.gearPacked ? "line-through text-[#878679]" : ""}>
                            Equipment & Backups Packed
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleChecklist(b.id, "shootDone")}
                          className="flex items-center gap-1.5 hover:text-[#7d5e3c]"
                        >
                          {chk.shootDone ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4 text-[#878679]" />
                          )}
                          <span className={chk.shootDone ? "line-through text-[#878679]" : ""}>
                            Shoot Completed & RAW Backup Done
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleChecklist(b.id, "editingDone")}
                          className="flex items-center gap-1.5 hover:text-[#7d5e3c]"
                        >
                          {chk.editingDone ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4 text-[#878679]" />
                          )}
                          <span className={chk.editingDone ? "line-through text-[#878679]" : ""}>
                            Retouching & Editing Completed
                          </span>
                        </button>
                      </div>

                      {b.galleryUrl && (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold bg-emerald-50 px-3 py-1 rounded-sm border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <a href={b.galleryUrl} target="_blank" rel="noreferrer" className="underline flex items-center gap-1">
                            Published Gallery <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      )}

      {/* External Gallery URL Modal */}
      {linkModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#f7f3ed] text-[#402615] max-w-md w-full p-6 rounded-sm border border-[#bea683] shadow-2xl space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-serif-heading text-xl font-bold">
                Associate External Gallery Link
              </h3>
            </div>

            <p className="text-xs text-[#878679]">
              Booking Ref: <strong>{linkModalBooking.bookingReference}</strong> ({linkModalBooking.customer.fullName})
            </p>

            <form onSubmit={handleSaveGalleryLink} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#7d5e3c] mb-1">
                  External Gallery URL (Pixieset / SmugMug / Google Drive) *
                </label>
                <input
                  type="url"
                  required
                  value={externalUrlInput}
                  onChange={(e) => setExternalUrlInput(e.target.value)}
                  placeholder="https://cbphotography.pixieset.com/liamsarahmatric2026/"
                  className="w-full bg-white border border-[#bea683]/50 rounded-sm p-3 text-xs focus:outline-none"
                />
              </div>

              <div className="p-3 bg-[#d6c8b1]/30 rounded-sm text-[11px] text-[#402615] leading-relaxed">
                Saving this URL updates the client portal status to <strong>"Gallery Ready"</strong> and displays the <em>"View Private Gallery"</em> button on the client dashboard.
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLinkModalBooking(null)}
                  className="w-1/2 border border-[#878679] text-[#402615] text-xs font-semibold uppercase py-3 rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-[#7d5e3c] text-white text-xs font-semibold uppercase py-3 rounded-sm hover:bg-[#402615]"
                >
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
      <Footer />
    </div>
  );
}
