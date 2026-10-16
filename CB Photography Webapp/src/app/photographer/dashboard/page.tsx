"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getPhotographerBookings, updateBooking, saveGalleryLink } from "@/lib/api";
import { Booking, BookingStatus } from "@/types/booking";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Toast, ToastMessage } from "@/components/ui/Toast";
import {
  Camera,
  Calendar,
  Clock,
  MapPin,
  CheckSquare,
  Square,
  ExternalLink,
  Phone,
  User,
  HardDrive,
  LogOut,
  Link as LinkIcon,
  CheckCircle2,
  ShieldCheck,
  Filter
} from "lucide-react";
import { fetchCurrentUser, logoutUser, AuthUser } from "@/lib/auth";

export default function PhotographerDashboardPage() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [shoots, setShoots] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [photographerFilter, setPhotographerFilter] = useState<string>("all");

  // Gallery URL modal state
  const [linkModalBooking, setLinkModalBooking] = useState<Booking | null>(null);
  const [externalUrlInput, setExternalUrlInput] = useState("");

  // Pre-shoot gear checklist state
  const [gearChecklist, setGearChecklist] = useState({
    primaryCameraBody: true,
    backupCameraBody: true,
    portraitLens85mm: true,
    wideLens35mm: true,
    fourChargedBatteries: false,
    threeHighSpeedSDs: false,
    speedlightFlash: false,
    lensCleaningKit: true
  });

  // Post-shoot execution and raw file backup checklist state
  const [postShootChecklist, setPostShootChecklist] = useState({
    dualCardBackupVerified: true,
    syncedToCloudDrive: false,
    initialCullCompleted: false,
    sneakPeekColorGraded: false,
    clientSneakPeekDelivered: false
  });

  const loadShoots = async (photographerId?: string) => {
    setLoading(true);
    try {
      const data = await getPhotographerBookings(photographerId);
      setShoots(data || []);
    } catch (err) {
      console.error("Failed to load shoots", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const user = await fetchCurrentUser();
      if (cancelled) return;

      if (user && (user.role === "photographer" || user.role === "admin")) {
        setAuthUser(user);
        if (user.role === "photographer") {
          loadShoots(user.photographerId);
        } else {
          // Admin viewing photographer portal: view all shoots or filtered
          loadShoots();
        }
      } else {
        router.replace("/login/photographer");
      }
    })();
    return () => { cancelled = true; };
  }, [router]);

  const handleFilterChange = (filterId: string) => {
    setPhotographerFilter(filterId);
    if (filterId === "all") {
      loadShoots();
    } else {
      loadShoots(filterId);
    }
  };

  const handleSignOut = async () => {
    await logoutUser();
    router.push("/login/photographer");
  };

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    await updateBooking(bookingId, { status: newStatus });
    const targetFilter = authUser?.role === "photographer"
      ? (authUser.photographerId || (authUser.email.includes("haim") ? "photo-miah" : "photo-brendon"))
      : (photographerFilter === "all" ? undefined : photographerFilter);
    await loadShoots(targetFilter);
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

    const targetFilter = authUser?.role === "photographer"
      ? (authUser.photographerId || (authUser.email.includes("haim") ? "photo-miah" : "photo-brendon"))
      : (photographerFilter === "all" ? undefined : photographerFilter);
    await loadShoots(targetFilter);
    setToast({
      id: Date.now().toString(),
      type: "success",
      title: "External Gallery Link Saved!",
      message: `Published gallery URL associated with booking ${linkModalBooking.bookingReference}. Client can now view gallery.`
    });

    setLinkModalBooking(null);
    setExternalUrlInput("");
  };

  const toggleGear = (key: keyof typeof gearChecklist) => {
    setGearChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePost = (key: keyof typeof postShootChecklist) => {
    setPostShootChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#141210] text-[#2C2420] dark:text-[#FAF8F5] transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-32 w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE3D9] dark:border-[#3A332C] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                Photographer Roster & Shoot Execution
              </span>
              {authUser?.role === "admin" && (
                <span className="bg-[#2E5E43]/15 text-[#2E5E43] dark:text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Full Studio Access (Admin)
                </span>
              )}
            </div>
            <h1 className="font-serif-heading text-3xl sm:text-4xl font-normal mt-0.5">
              Welcome, {authUser?.name || "Camryn Burger (Lead)"}
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Review your scheduled shoot assignments, venue GPS coordinates, gear checklists & raw backup workflow.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {authUser?.role === "admin" && (
              <>
                <Link
                  href="/admin/dashboard"
                  className="px-3 py-1.5 bg-[#FAF8F5] dark:bg-[#25221F] border border-[#EAE3D9] dark:border-[#3A332C] hover:border-[#C5A880] text-[#2C2420] dark:text-[#FAF8F5] text-xs font-medium rounded-sm flex items-center gap-1.5 transition-colors"
                  title="Switch to Admin Console"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Admin Console</span>
                </Link>
                <Link
                  href="/client/dashboard"
                  className="px-3 py-1.5 bg-[#FAF8F5] dark:bg-[#25221F] border border-[#EAE3D9] dark:border-[#3A332C] hover:border-[#C5A880] text-[#2C2420] dark:text-[#FAF8F5] text-xs font-medium rounded-sm flex items-center gap-1.5 transition-colors"
                  title="Preview Client Dashboard"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Client Portal</span>
                </Link>
              </>
            )}

            <span className="px-3 py-1.5 bg-[#C5A880]/15 text-[#C5A880] rounded text-xs font-semibold border border-[#C5A880]/30">
              {authUser?.role === "admin" || authUser?.photographerId === "photo-camryn" || authUser?.email?.includes("camryn")
                ? "Role: Studio Owner & Lead"
                : "Role: Associate Photographer"}
            </span>

            <button
              onClick={handleSignOut}
              className="bg-rose-900/20 hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-semibold uppercase px-3.5 py-1.5 rounded-sm transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Top Checklists Grid: Pre-Shoot Gear & Post-Shoot Raw Backup */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Pre-Shoot Gear Checklist */}
          <div className="bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#EAE3D9] dark:border-[#3A332C] pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#C5A880]" />
                <h3 className="font-serif-heading text-lg font-semibold">
                  Pre-Shoot Gear Checklist
                </h3>
              </div>
              <span className="text-[10px] uppercase font-bold text-neutral-400">
                Equipment Verification
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-neutral-700 dark:text-neutral-300">
              {[
                { key: "primaryCameraBody", label: "Primary Body: Sony A7 IV (Sensor clean, firmware 3.0)" },
                { key: "backupCameraBody", label: "Backup Body: Canon EOS R5 in bag" },
                { key: "portraitLens85mm", label: "Prime Lens: Sony FE 85mm f/1.4 GM" },
                { key: "wideLens35mm", label: "Wide Lens: Sony FE 35mm f/1.4 GM" },
                { key: "fourChargedBatteries", label: "4x NP-FZ100 Batteries (100% charged)" },
                { key: "threeHighSpeedSDs", label: "3x 128GB V90 UHS-II SD Cards (Formatted)" },
                { key: "speedlightFlash", label: "Godox V1 Flash + MagMod Diffuser Sphere" },
                { key: "lensCleaningKit", label: "Rocket Blower & Microfiber Cloths" }
              ].map((item) => {
                const checked = gearChecklist[item.key as keyof typeof gearChecklist];
                return (
                  <div
                    key={item.key}
                    onClick={() => toggleGear(item.key as keyof typeof gearChecklist)}
                    className="flex items-center gap-2.5 p-2 rounded hover:bg-[#FAF8F5] dark:hover:bg-[#141210] cursor-pointer transition-colors"
                  >
                    {checked ? (
                      <CheckSquare className="w-4 h-4 text-[#2E5E43] dark:text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-neutral-400 shrink-0" />
                    )}
                    <span className={checked ? "line-through text-neutral-400" : ""}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Post-Shoot Execution & Raw File Backup Checklist */}
          <div className="bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#EAE3D9] dark:border-[#3A332C] pb-3">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-[#C5A880]" />
                <h3 className="font-serif-heading text-lg font-semibold">
                  Post-Shoot & Raw Backup Checklist
                </h3>
              </div>
              <span className="text-[10px] uppercase font-bold text-neutral-400">
                Asset Safety
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-neutral-700 dark:text-neutral-300">
              {[
                { key: "dualCardBackupVerified", label: "Dual SD Card Slot 1 & 2 Checksums Verified" },
                { key: "syncedToCloudDrive", label: "Ingested to Studio SSD + Synced to Offsite Cloud" },
                { key: "initialCullCompleted", label: "Initial Star-Rating Culling Finished" },
                { key: "sneakPeekColorGraded", label: "5-10 Sneak Peeks Color Graded in Lightroom" },
                { key: "clientSneakPeekDelivered", label: "Sneak Peek Delivered via WhatsApp/Email within 48h" }
              ].map((item) => {
                const checked = postShootChecklist[item.key as keyof typeof postShootChecklist];
                return (
                  <div
                    key={item.key}
                    onClick={() => togglePost(item.key as keyof typeof postShootChecklist)}
                    className="flex items-center gap-2.5 p-2 rounded hover:bg-[#FAF8F5] dark:hover:bg-[#141210] cursor-pointer transition-colors"
                  >
                    {checked ? (
                      <CheckSquare className="w-4 h-4 text-[#2E5E43] dark:text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-neutral-400 shrink-0" />
                    )}
                    <span className={checked ? "line-through text-neutral-400" : ""}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Assigned Shoot Schedule List */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-serif-heading text-2xl font-normal">
                {authUser?.role === "admin"
                  ? `Studio Shoot Assignments (${shoots.length})`
                  : `Assigned Shoot Schedule for ${authUser?.name || "Photographer"} (${shoots.length})`}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {authUser?.role === "admin"
                  ? "View, filter and update shoot schedules across all studio photographers."
                  : "All photo shoots assigned to your portfolio."}
              </p>
            </div>

            {authUser?.role === "admin" && (
              <div className="flex items-center gap-1.5 bg-white dark:bg-[#1C1917] p-1 border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm text-xs">
                <span className="text-[10px] uppercase font-bold text-neutral-400 px-2 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-[#C5A880]" />
                  Filter:
                </span>
                {[
                  { id: "all", label: "All Shoots" },
                  { id: "photo-camryn", label: "Camryn (Lead)" },
                  { id: "photo-miah", label: "Miah" },
                  { id: "photo-brendon", label: "Brendon" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleFilterChange(tab.id)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                      photographerFilter === tab.id
                        ? "bg-[#C5A880] text-[#2C2420]"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-[#2C2420] dark:hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            {loading && <span className="text-xs text-neutral-400">Refreshing schedule...</span>}
          </div>

          {shoots.length === 0 && !loading ? (
            <div className="bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-8 text-center text-xs text-neutral-400">
              No assigned shoots found.
            </div>
          ) : (
            <div className="space-y-5">
              {shoots.map((s) => (
                <div
                  key={s.id}
                  className="bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-6 space-y-5 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE3D9] dark:border-[#3A332C] pb-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] uppercase font-mono text-[#C5A880] font-bold">
                          Booking #{s.bookingReference} • {s.serviceName}
                        </span>
                        <StatusBadge status={s.status} type="booking" />
                        <StatusBadge status={s.paymentStatus} type="payment" />
                        <span className="text-[11px] bg-neutral-100 dark:bg-[#25221F] text-neutral-600 dark:text-neutral-300 px-2 py-0.5 rounded border border-neutral-200 dark:border-[#3A332C]">
                          Assigned: <strong>{s.photographerName}</strong>
                        </span>
                      </div>
                      <h3 className="font-serif-heading text-2xl font-semibold mt-1">
                        {s.packageName}
                      </h3>
                    </div>

                    {/* Status updater and gallery actions */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <label className="text-[11px] uppercase font-semibold text-[#C5A880]">
                          Status:
                        </label>
                        <select
                          value={s.status}
                          onChange={(e) => handleStatusChange(s.id, e.target.value as BookingStatus)}
                          className="bg-[#FAF8F5] dark:bg-[#141210] border border-[#C5A880]/40 text-xs rounded-sm p-1.5 font-semibold"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      <button
                        onClick={() => {
                          setLinkModalBooking(s);
                          setExternalUrlInput(s.galleryUrl || "");
                        }}
                        className="inline-flex items-center gap-1.5 bg-[#C5A880] text-[#2C2420] hover:bg-[#b0936b] text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-sm transition-all shadow-sm"
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>{s.galleryUrl ? "Update Gallery Link" : "+ Add Gallery Link"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Shoot Info */}
                    <div className="md:col-span-7 space-y-3 text-xs text-neutral-600 dark:text-neutral-300">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <strong className="block text-[#2C2420] dark:text-[#FAF8F5] mb-1">Date & Time</strong>
                          <p className="flex items-center gap-1.5 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                            {s.date}
                          </p>
                          <p className="flex items-center gap-1.5 text-neutral-400 mt-0.5">
                            <Clock className="w-3.5 h-3.5" />
                            {s.timeSlot}
                          </p>
                        </div>

                        <div>
                          <strong className="block text-[#2C2420] dark:text-[#FAF8F5] mb-1">Client Contact</strong>
                          <p className="flex items-center gap-1.5 font-medium">
                            <User className="w-3.5 h-3.5 text-[#C5A880]" />
                            {s.customer.fullName}
                          </p>
                          <a
                            href={`tel:${s.customer.phone}`}
                            className="flex items-center gap-1.5 text-[#C5A880] hover:underline mt-0.5"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            {s.customer.phone}
                          </a>
                        </div>
                      </div>

                      {s.customer.notes && (
                        <div className="p-3 bg-[#FAF8F5] dark:bg-[#141210] rounded border border-[#EAE3D9] dark:border-[#3A332C]">
                          <strong className="text-[10px] uppercase text-[#C5A880] block mb-1">
                            Client Vision & Styling Notes:
                          </strong>
                          <p className="italic">{s.customer.notes}</p>
                        </div>
                      )}

                      {s.galleryUrl && (
                        <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-sm border border-emerald-300/40">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Delivered Gallery:</span>
                          <a
                            href={s.galleryUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="underline flex items-center gap-1 font-semibold"
                          >
                            Open Link <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Venue Mini-Map & GPS Coordinates */}
                    <div className="md:col-span-5 bg-[#FAF8F5] dark:bg-[#141210] p-4 rounded-sm border border-[#EAE3D9] dark:border-[#3A332C] space-y-2">
                      <div className="flex items-center justify-between">
                        <strong className="text-xs text-[#2C2420] dark:text-[#FAF8F5] flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          {s.location.venueName}
                        </strong>
                        <span className="text-[10px] text-neutral-400">
                          {s.location.distanceFromBaseKm} km from base
                        </span>
                      </div>

                      <div className="text-[11px] font-mono text-neutral-500 bg-white dark:bg-[#1F1B18] p-2 rounded border border-[#EAE3D9] dark:border-[#3A332C]">
                        GPS: {s.location.distanceFromBaseKm ? `-26.0883, 27.8447` : "-26.0883, 27.8447"}
                      </div>

                      {s.location.additionalDirections && (
                        <p className="text-[11px] text-neutral-500">
                          <strong>Gate/Access:</strong> {s.location.additionalDirections}
                        </p>
                      )}

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${s.location.venueName}, ${s.location.suburb || "Krugersdorp"}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C5A880] hover:underline pt-1"
                      >
                        <span>Open in Google Maps Navigation</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* External Gallery URL Modal */}
      {linkModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1C1917] text-[#2C2420] dark:text-[#FAF8F5] max-w-md w-full p-6 rounded-sm border border-[#C5A880]/50 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-[#EAE3D9] dark:border-[#3A332C] pb-2">
              <h3 className="font-serif-heading text-xl font-bold">
                Associate External Gallery Link
              </h3>
            </div>

            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Booking Ref: <strong>{linkModalBooking.bookingReference}</strong> ({linkModalBooking.customer.fullName})
            </p>

            <form onSubmit={handleSaveGalleryLink} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#C5A880] mb-1">
                  External Gallery URL (Pixieset / SmugMug / Google Drive) *
                </label>
                <input
                  type="url"
                  required
                  value={externalUrlInput}
                  onChange={(e) => setExternalUrlInput(e.target.value)}
                  placeholder="https://cbphotography.pixieset.com/liamsarahmatric2026/"
                  className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#C5A880]/50 rounded-sm p-3 text-xs focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div className="p-3 bg-[#C5A880]/10 rounded-sm text-[11px] leading-relaxed">
                Saving this URL updates the client portal status to <strong>"Gallery Ready"</strong> and displays the <em>"View Private Gallery"</em> button on the client dashboard.
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLinkModalBooking(null)}
                  className="w-1/2 border border-neutral-300 dark:border-neutral-700 text-xs font-semibold uppercase py-3 rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-[#C5A880] hover:bg-[#b0936b] text-[#2C2420] text-xs font-semibold uppercase py-3 rounded-sm transition-colors"
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
