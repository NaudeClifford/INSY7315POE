"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GoogleMapPicker } from "@/components/ui/GoogleMapPicker";
import { LiveWeatherCard } from "@/components/ui/LiveWeatherCard";
import { AuthModal } from "@/components/ui/AuthModal";
import { YocoPaymentModal } from "@/components/ui/YocoPaymentModal";
import { getServices, getPhotographers, createBooking, calculateQuote, getAllBookings } from "@/lib/api";
import { getAuthUser, AuthUser } from "@/lib/auth";
import { Service, PackageOption } from "@/types/service";
import { Photographer } from "@/types/user";
import { Booking, QuoteBreakdown } from "@/types/booking";
import { PREDEFINED_VENUES } from "@/lib/maps";
import { formatCurrency } from "@/lib/utils";
import {
  CheckCircle2,
  Calendar as CalendarIcon,
  Clock,
  User,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Moon,
  Ban,
  ShieldCheck,
  CreditCard
} from "lucide-react";

// Standard 5 Time Slots from Mobile App
const TIME_SLOTS = [
  { id: "slot-early", label: "Early Light (08:30 - 10:00)", isMidnight: false },
  { id: "slot-morning", label: "Morning (10:00 - 11:30)", isMidnight: false },
  { id: "slot-afternoon", label: "Afternoon (14:00 - 15:30)", isMidnight: false },
  { id: "slot-golden", label: "Golden Hour (15:30 - 17:30)", isMidnight: false },
  { id: "slot-midnight", label: "Midnight Session (23:00 - 01:00)", isMidnight: true }
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function BookingWizardContent() {
  const searchParams = useSearchParams();
  const urlService = searchParams.get("service");
  const urlPackage = searchParams.get("package");
  const urlVenue = searchParams.get("venue");

  // Dynamic Date Setup
  const now = new Date();
  const defaultFutureDate = new Date();
  defaultFutureDate.setDate(now.getDate() + 2);
  const defaultDateFormatted = `${defaultFutureDate.getFullYear()}-${String(defaultFutureDate.getMonth() + 1).padStart(2, "0")}-${String(defaultFutureDate.getDate()).padStart(2, "0")}`;

  // 5-Step Photography Booking Wizard
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Loaded Catalog Data
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [photographersList, setPhotographersList] = useState<Photographer[]>([]);
  const [existingBookings, setExistingBookings] = useState<Booking[]>([]);

  // Step 1 Selections
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackageOption | null>(null);

  // Step 2 Selections (Calendar, Slot, Photographer)
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date(now.getFullYear(), now.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<string>(defaultDateFormatted);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("Golden Hour (15:30 - 17:30)");
  const [selectedPhotographer, setSelectedPhotographer] = useState<Photographer | null>(null);

  // Step 3 Selections (Client Details & Vision Notes)
  const [customerForm, setCustomerForm] = useState({
    fullName: "",
    email: "",
    phone: "+27 ",
    eventType: "",
    notes: ""
  });

  // Step 4 Selections (Location, Map, Weather)
  const defaultVenue = PREDEFINED_VENUES[0]; // Walter Sisulu
  const [locationForm, setLocationForm] = useState({
    venueName: defaultVenue.name,
    address: `${defaultVenue.name}, ${defaultVenue.suburb}`,
    suburb: defaultVenue.suburb,
    latitude: defaultVenue.latitude,
    longitude: defaultVenue.longitude,
    distanceFromBaseKm: defaultVenue.distanceKm,
    travelFeeZAR: 0,
    additionalDirections: ""
  });

  // Step 5 Breakdown & Auth Gate
  const [quote, setQuote] = useState<QuoteBreakdown>({
    basePrice: 0,
    travelDistanceKm: defaultVenue.distanceKm,
    travelFee: 0,
    lateNightSurcharge: 0,
    subtotal: 0,
    depositRequired: 0,
    remainingBalance: 0
  });

  const [termsAccepted, setTermsAccepted] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingSubmitMode, setPendingSubmitMode] = useState<"pay_now" | "hold_only">("pay_now");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [yocoModalOpen, setYocoModalOpen] = useState(false);
  const [paymentTypeForModal, setPaymentTypeForModal] = useState<"deposit" | "full">("deposit");
  const [holdNoticeModalOpen, setHoldNoticeModalOpen] = useState(false);
  const [bookingForPayment, setBookingForPayment] = useState<Booking | null>(null);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Load catalog on mount & fuzzy match
  useEffect(() => {
    const user = getAuthUser();
    if (user) {
      setCurrentUser(user);
      setCustomerForm((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name,
        email: prev.email || user.email,
        phone: user.phone || prev.phone
      }));
    }

    getAllBookings().then((b) => setExistingBookings(b || []));

    getServices().then((services) => {
      setServicesList(services || []);
      if (services && services.length > 0) {
        // Fuzzy match clicked service
        let matchedService = services[0];
        if (urlService) {
          const found = services.find(
            (s) =>
              s.slug.toLowerCase().includes(urlService.toLowerCase()) ||
              urlService.toLowerCase().includes(s.slug.toLowerCase()) ||
              s.title.toLowerCase().includes(urlService.toLowerCase())
          );
          if (found) matchedService = found;
        }
        setSelectedService(matchedService);

        // Fuzzy match clicked package
        let matchedPackage = matchedService.packages[0];
        if (urlPackage) {
          const foundPkg = matchedService.packages.find(
            (p) =>
              p.id.toLowerCase().includes(urlPackage.toLowerCase()) ||
              p.name.toLowerCase().includes(urlPackage.toLowerCase())
          );
          if (foundPkg) matchedPackage = foundPkg;
        }
        setSelectedPackage(matchedPackage);
      }
    });

    getPhotographers().then((photos) => {
      const sanitized = (photos || [])
        .filter((p) => p.id !== "photo-associate" && !p.name.toLowerCase().includes("lethabo"))
        .map((p) => {
          const photo = { ...p, availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] };
          if (p.id === "photo-camryn" || p.name.toLowerCase().includes("camryn")) {
            return {
              ...photo,
              isLead: true,
              role: p.role && !p.role.toLowerCase().startsWith("photo") ? p.role : "Owner / Photographer"
            };
          }
          if (p.id === "photo-brendon" || p.name.toLowerCase().includes("brendon")) {
            return {
              ...photo,
              isLead: false,
              role: p.role && p.role.toLowerCase().includes("associate") ? p.role : "Associate Photographer"
            };
          }
          if (p.id === "photo-miah" || p.name.toLowerCase().includes("miah")) {
            return {
              ...photo,
              isLead: false,
              role: p.role && p.role.toLowerCase().includes("associate") ? p.role : "Associate Photographer"
            };
          }
          return photo;
        });
      setPhotographersList(sanitized);
      if (sanitized.length > 0) {
        // Default to lead photographer (Camryn)
        const lead = sanitized.find((p) => p.isLead) || sanitized[0];
        setSelectedPhotographer(lead);
      }
    });

    if (urlVenue) {
      const foundVenue = PREDEFINED_VENUES.find((v) =>
        v.name.toLowerCase().includes(urlVenue.toLowerCase())
      );
      if (foundVenue) {
        setLocationForm((prev) => ({
          ...prev,
          venueName: foundVenue.name,
          address: `${foundVenue.name}, ${foundVenue.suburb}`,
          suburb: foundVenue.suburb,
          latitude: foundVenue.latitude,
          longitude: foundVenue.longitude,
          distanceFromBaseKm: foundVenue.distanceKm,
          travelFeeZAR: foundVenue.isFreeZone ? 0 : Math.round((foundVenue.distanceKm - 20) * 5)
        }));
      }
    }
  }, [urlService, urlPackage, urlVenue]);

  // Recalculate quote whenever package, distance, or timeSlot changes
  useEffect(() => {
    if (selectedPackage) {
      calculateQuote(
        selectedPackage.startingPriceZAR,
        {
          distanceKm: locationForm.distanceFromBaseKm,
          latitude: locationForm.latitude,
          longitude: locationForm.longitude
        },
        selectedTimeSlot
      ).then((res) => setQuote(res));
    }
  }, [selectedPackage, locationForm.distanceFromBaseKm, locationForm.latitude, locationForm.longitude, selectedTimeSlot]);

  // Calendar Month Navigation handlers
  const handlePrevMonth = () => {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = parseInt(e.target.value, 10);
    setCalendarMonth((prev) => new Date(prev.getFullYear(), month, 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(e.target.value, 10);
    setCalendarMonth((prev) => new Date(year, prev.getMonth(), 1));
  };

  const handleJumpToToday = () => {
    const now = new Date();
    setCalendarMonth(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  // Helper to match booking date
  const doesBookingMatchDate = (bDate: string, targetDateStr: string, targetDateObj: Date): boolean => {
    if (!bDate) return false;
    const cleanB = bDate.trim();
    if (cleanB === targetDateStr || cleanB.startsWith(targetDateStr)) return true;

    try {
      const parsed = new Date(cleanB);
      if (!isNaN(parsed.getTime())) {
        return (
          parsed.getFullYear() === targetDateObj.getFullYear() &&
          parsed.getMonth() === targetDateObj.getMonth() &&
          parsed.getDate() === targetDateObj.getDate()
        );
      }
    } catch { }

    return false;
  };

  // Helper to match booking slot
  const doesBookingMatchSlot = (bSlot: string, slotLabel: string): boolean => {
    if (!bSlot || !slotLabel) return false;
    const b = bSlot.toLowerCase().trim();
    const s = slotLabel.toLowerCase().trim();
    if (b === s) return true;
    if (b.includes(s) || s.includes(b)) return true;

    const match = slotLabel.match(/\d{2}:\d{2}/);
    if (match && b.includes(match[0])) return true;

    return false;
  };

  // Determines whether a booking actively holds its slot:
  // - Deposit Paid or Paid in Full: permanently held until shoot/cancellation
  // - Unpaid or Pending: held for up to 12 hours from creation
  // - Filtered strictly by chosen photographer
  const isBookingHoldingSlot = (b: Booking, targetPhotographerId?: string): boolean => {
    if (b.status === "Cancelled") return false;

    if (targetPhotographerId && b.photographerId) {
      if (b.photographerId !== targetPhotographerId) {
        return false;
      }
    }

    const isDepositPaid =
      b.paymentStatus === "Deposit Paid" ||
      b.paymentStatus === "Paid in Full";
    if (isDepositPaid) return true;

    if (!b.createdAt) return false;
    try {
      const createdTime = new Date(b.createdAt).getTime();
      if (!isNaN(createdTime)) {
        const nowTime = Date.now();
        const twelveHoursMs = 12 * 60 * 60 * 1000;
        return (nowTime - createdTime) < twelveHoursMs;
      }
      const todayStr = new Date().toISOString().split("T")[0];
      return b.createdAt === todayStr;
    } catch {
      return false;
    }
  };

  // Checks if a specific time slot is already taken for the chosen photographer on a date
  const isSlotTaken = (dateStr: string, slotLabel: string, photoId?: string): boolean => {
    if (!dateStr || !slotLabel) return false;
    const parts = dateStr.split("-").map(Number);
    const dateObj = parts.length === 3 ? new Date(parts[0], parts[1] - 1, parts[2]) : new Date(dateStr);

    return existingBookings.some((b) => {
      if (!isBookingHoldingSlot(b, photoId)) return false;
      return doesBookingMatchDate(b.date, dateStr, dateObj) && doesBookingMatchSlot(b.timeSlot, slotLabel);
    });
  };

  // Auto-switch selected time slot to first available slot if currently selected is taken
  useEffect(() => {
    if (selectedDate) {
      const isCurrentTaken = isSlotTaken(selectedDate, selectedTimeSlot, selectedPhotographer?.id);
      if (isCurrentTaken) {
        const firstFree = TIME_SLOTS.find(
          (s) => !isSlotTaken(selectedDate, s.label, selectedPhotographer?.id)
        );
        if (firstFree) {
          setSelectedTimeSlot(firstFree.label);
        } else {
          setSelectedTimeSlot("");
        }
      }
    }
  }, [selectedDate, selectedPhotographer, existingBookings]);

  // Live Calendar Availability calculation (Green: 100%, Amber: partial, Red: fully booked, Past: disabled)
  // No off days: photographers are available every day unless time slots are booked
  const getDayAvailability = (year: number, month: number, day: number): "past" | "green" | "amber" | "red" => {
    const checkDate = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // If date is before today, it's past
    if (checkDate < today) {
      return "past";
    }

    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const photoId = selectedPhotographer?.id;

    // Active bookings holding slots on this date for this photographer
    const activeDateBookings = existingBookings.filter((b) => {
      if (!isBookingHoldingSlot(b, photoId)) return false;
      return doesBookingMatchDate(b.date, dateStr, checkDate);
    });

    const takenCount = TIME_SLOTS.filter((slot) =>
      activeDateBookings.some((b) => doesBookingMatchSlot(b.timeSlot, slot.label))
    ).length;

    if (takenCount === 0) {
      return "green"; // All slots free
    }

    if (takenCount >= TIME_SLOTS.length) {
      return "red"; // Fully booked (all slots taken)
    }

    return "amber"; // Partial: some slots taken, other slots still available
  };

  const formatSelectedDateHuman = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-").map(Number);
    if (parts.length !== 3 || isNaN(parts[0])) return dateStr;
    const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
    return dateObj.toLocaleDateString("en-ZA", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const handleNextStep = () => {
    setValidationError(null);

    if (currentStep === 1) {
      if (!selectedService || !selectedPackage) {
        setValidationError("Please select a photography service and package tier to continue.");
        return;
      }
    } else if (currentStep === 2) {
      if (!selectedDate || !selectedTimeSlot || !selectedPhotographer) {
        setValidationError("Please select your date, time slot, and preferred photographer.");
        return;
      }
    } else if (currentStep === 3) {
      if (!customerForm.fullName || !customerForm.email || !customerForm.phone) {
        setValidationError("Please enter your name, email, and contact phone number.");
        return;
      }
    } else if (currentStep === 4) {
      if (!locationForm.venueName) {
        setValidationError("Please specify the shoot venue name or address.");
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 5));
    window.scrollTo({ top: 160, behavior: "smooth" });
  };

  const handlePrevStep = () => {
    setValidationError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 160, behavior: "smooth" });
  };

  // Step 5: Confirm & Authentication Gate
  const handleFinalBookingSubmit = async (
    userOverride?: AuthUser,
    mode: "pay_now" | "hold_only" = "pay_now"
  ) => {
    const userToUse = userOverride || currentUser || getAuthUser();
    if (!userToUse) {
      setPendingSubmitMode(mode);
      setAuthModalOpen(true);
      return;
    }

    if (!selectedService || !selectedPackage || !selectedPhotographer) return;
    setIsSubmitting(true);

    try {
      const isMidnight = selectedTimeSlot.includes("23:00") || selectedTimeSlot.toLowerCase().includes("midnight");
      const lateNightSurcharge = isMidnight ? 450 : 0;

      const newBooking = await createBooking({
        clientId: userToUse.email,
        serviceId: selectedService.id,
        serviceName: selectedService.title,
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        photographerId: selectedPhotographer.id,
        photographerName: `${selectedPhotographer.name} (${selectedPhotographer.isLead ? "Owner & Lead" : "Associate"})`,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        customer: {
          fullName: customerForm.fullName || userToUse.name,
          email: customerForm.email || userToUse.email,
          phone: customerForm.phone,
          eventType: customerForm.eventType || selectedService.title,
          notes: customerForm.notes
        },
        location: {
          venueName: locationForm.venueName.trim() ? locationForm.venueName.trim() : "Client Chosen Location",
          address: locationForm.address.trim() ? locationForm.address.trim() : (locationForm.venueName.trim() || "Gauteng, South Africa"),
          suburb: locationForm.suburb || "Gauteng",
          latitude: locationForm.latitude,
          longitude: locationForm.longitude,
          distanceFromBaseKm: locationForm.distanceFromBaseKm,
          travelFeeZAR: quote.travelFee,
          additionalDirections: locationForm.additionalDirections
        },
        basePriceZAR: quote.basePrice,
        travelFeeZAR: quote.travelFee,
        lateNightSurchargeZAR: lateNightSurcharge,
        subtotalZAR: quote.subtotal,
        depositRequiredZAR: quote.depositRequired,
        remainingBalanceZAR: quote.remainingBalance,
        status: "Confirmed",
        paymentStatus: "Pending"
      });

      setExistingBookings((prev) => [...prev, newBooking]);
      setBookingForPayment(newBooking);

      if (mode === "pay_now") {
        setYocoModalOpen(true);
      } else {
        setCreatedBooking(newBooking);
        setHoldNoticeModalOpen(true);
      }
    } catch {
      setValidationError("Failed to confirm booking reservation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepTitles = [
    "1. Service & Tier",
    "2. Date & Time",
    "3. Client Details",
    "4. Venue & Weather",
    "5. Review & Confirm"
  ];

  // If booking was just created, render Confirmation Screen
  if (createdBooking) {
    const isDepositPaid = createdBooking.paymentStatus === "Deposit Paid" || createdBooking.paymentStatus === "Paid in Full";

    return (
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#141210] text-[#2C2420] dark:text-[#FAF8F5]">
        <Navbar />
        <main className="flex-1 max-w-3xl mx-auto px-4 py-28 sm:py-36 w-full">
          <div className="bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-md p-8 sm:p-12 text-center space-y-6 shadow-2xl animate-fade-in">
            <div className={`w-16 h-16 ${isDepositPaid ? "bg-[#2E5E43]/15 text-[#2E5E43] dark:text-emerald-400 ring-[#2E5E43]/10" : "bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-amber-500/10"} rounded-full flex items-center justify-center mx-auto ring-8`}>
              {isDepositPaid ? <CheckCircle2 className="w-10 h-10" /> : <Clock className="w-10 h-10" />}
            </div>

            <span className="text-xs uppercase tracking-[0.3em] text-[#C5A880] font-semibold block">
              {isDepositPaid ? "Reservation Confirmed • Deposit Paid ✓" : "Reservation Held • 12-Hour Window Active"}
            </span>

            <h1 className="font-serif-heading text-3xl sm:text-5xl font-normal text-[#2C2420] dark:text-[#FAF8F5]">
              {isDepositPaid ? "Your Photoshoot is Booked!" : "Photoshoot Slot Reserved!"}
            </h1>

            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 max-w-md mx-auto leading-relaxed">
              Booking reference <strong className="text-[#C5A880]">{createdBooking.bookingReference}</strong> has been logged to our studio calendar. A confirmation email and tax invoice have been dispatched to <strong>{createdBooking.customer.email}</strong>.
            </p>

            {/* 12-Hour Hold Alert for Unpaid Bookings */}
            {!isDepositPaid && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-sm text-left text-xs text-amber-800 dark:text-amber-200 space-y-1.5 max-w-lg mx-auto">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>12-Hour Reservation Hold Active</span>
                </div>
                <p>
                  Please note: Bookings without a deposit are held for a maximum of <strong>12 hours</strong>. If your deposit is not settled within this period, your time slot will automatically be released for other clients.
                </p>
              </div>
            )}

            <div className="bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-6 text-left text-xs space-y-3 max-w-lg mx-auto">
              <div className="flex justify-between border-b border-[#EAE3D9] dark:border-[#3A332C] pb-2">
                <span className="text-neutral-500">Service & Package:</span>
                <strong className="text-[#2C2420] dark:text-[#FAF8F5]">{createdBooking.packageName}</strong>
              </div>
              <div className="flex justify-between border-b border-[#EAE3D9] dark:border-[#3A332C] pb-2">
                <span className="text-neutral-500">Date & Slot:</span>
                <strong className="text-[#2C2420] dark:text-[#FAF8F5]">{createdBooking.date} • {createdBooking.timeSlot}</strong>
              </div>
              <div className="flex justify-between border-b border-[#EAE3D9] dark:border-[#3A332C] pb-2">
                <span className="text-neutral-500">Photographer:</span>
                <strong className="text-[#2C2420] dark:text-[#FAF8F5]">{createdBooking.photographerName}</strong>
              </div>
              <div className="flex justify-between border-b border-[#EAE3D9] dark:border-[#3A332C] pb-2">
                <span className="text-neutral-500">Venue:</span>
                <strong className="text-[#2C2420] dark:text-[#FAF8F5]">{createdBooking.location.venueName}</strong>
              </div>
              <div className="flex justify-between border-b border-[#EAE3D9] dark:border-[#3A332C] pb-2">
                <span className="text-neutral-500">
                  {isDepositPaid ? "Deposit Paid (50%):" : "Deposit Required (50%):"}
                </span>
                <strong className={isDepositPaid ? "text-[#2E5E43] dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}>
                  R {formatCurrency(createdBooking.depositRequiredZAR)} {!isDepositPaid && "(Unpaid - Held 12h)"}
                </strong>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-neutral-500">Balance Due on Shoot Day:</span>
                <strong className="text-[#C5A880]">R {formatCurrency(createdBooking.remainingBalanceZAR)}</strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {!isDepositPaid && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentTypeForModal("deposit");
                      setBookingForPayment(createdBooking);
                      setYocoModalOpen(true);
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2E5E43] hover:bg-[#254d37] text-white text-xs font-semibold uppercase tracking-wider py-3.5 px-6 rounded-sm shadow-md transition-all cursor-pointer active:scale-95"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    <span>Pay Deposit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentTypeForModal("full");
                      setBookingForPayment(createdBooking);
                      setYocoModalOpen(true);
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2C2420] dark:bg-[#C5A880] text-white dark:text-[#2C2420] hover:bg-[#C5A880] hover:text-[#2C2420] text-xs font-semibold uppercase tracking-wider py-3.5 px-6 rounded-sm shadow-md transition-all cursor-pointer active:scale-95"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay in Full</span>
                  </button>
                </>
              )}

              <Link
                href="/client/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2C2420] dark:bg-[#C5A880] text-white dark:text-[#2C2420] hover:bg-[#C5A880] text-xs font-semibold uppercase tracking-wider py-3.5 px-8 rounded-sm shadow-md transition-all"
              >
                <User className="w-4 h-4" />
                <span>Go to Client Portal</span>
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

        {/* 12-Hour Hold Pop-Up Notice Modal when held without deposit */}
        {holdNoticeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#FAF8F5] dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-lg max-w-lg w-full overflow-hidden shadow-2xl relative text-[#2C2420] dark:text-[#FAF8F5]">
              <div className="bg-[#2C2420] text-[#FAF8F5] p-6 border-b border-[#C5A880]/30">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
                    Camryn Burger Photography • Studio Notice
                  </span>
                  <div className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[10px] font-semibold uppercase">
                    <Clock className="w-3 h-3 text-amber-300" />
                    <span>12-Hour Hold</span>
                  </div>
                </div>
                <h2 className="font-serif-heading text-2xl font-normal mt-1.5">
                  Booking Reserved!
                </h2>
                <p className="text-xs text-[#EAE3D9]/75 mt-0.5">
                  Booking Ref: <strong className="text-[#C5A880]">{createdBooking.bookingReference}</strong>
                </p>
              </div>

              <div className="p-6 space-y-5 text-xs">
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-sm text-amber-800 dark:text-amber-200 leading-relaxed space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Please Note: 12-Hour Reservation Window</span>
                  </div>
                  <p>
                    Bookings without deposit are held for a maximum of <strong>12 hours</strong>.
                  </p>
                  <p className="text-[11px] text-amber-700 dark:text-amber-300/90 font-light">
                    Once your deposit is received, your date and time slot will be permanently locked in and marked as taken on our calendar.
                  </p>
                </div>

                <div className="bg-white dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-4 space-y-2">
                  <div className="flex justify-between items-center border-b border-[#EAE3D9] dark:border-[#3A332C] pb-2">
                    <span className="text-neutral-500">Service & Package:</span>
                    <strong className="font-medium text-[#2C2420] dark:text-[#FAF8F5]">{createdBooking.packageName}</strong>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#EAE3D9] dark:border-[#3A332C] pb-2">
                    <span className="text-neutral-500">Date & Slot:</span>
                    <strong className="font-medium text-[#2C2420] dark:text-[#FAF8F5]">{createdBooking.date} • {createdBooking.timeSlot}</strong>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-neutral-500">Deposit Required (50%):</span>
                    <strong className="text-sm font-serif-heading text-[#C5A880]">R {formatCurrency(createdBooking.depositRequiredZAR)}</strong>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setHoldNoticeModalOpen(false)}
                    className="w-full sm:w-auto px-6 py-3 border border-[#EAE3D9] dark:border-[#3A332C] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[#2C2420] dark:text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors cursor-pointer text-center"
                  >
                    OK
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setHoldNoticeModalOpen(false);
                      setBookingForPayment(createdBooking);
                      setYocoModalOpen(true);
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-[#2E5E43] hover:bg-[#254d37] text-white text-xs font-semibold uppercase tracking-widest rounded-sm transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    <span>Pay Deposit</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Yoco Modal when initiated from confirmation screen */}
        {bookingForPayment && (
          <YocoPaymentModal
            isOpen={yocoModalOpen}
            onClose={() => setYocoModalOpen(false)}
            bookingId={bookingForPayment.id}
            bookingReference={bookingForPayment.bookingReference}
            customerName={bookingForPayment.customer?.fullName || customerForm.fullName}
            customerEmail={bookingForPayment.customer?.email || customerForm.email}
            packageName={bookingForPayment.packageName}
            amountZAR={
              paymentTypeForModal === "full"
                ? (bookingForPayment.subtotalZAR || (bookingForPayment.depositRequiredZAR * 2))
                : bookingForPayment.depositRequiredZAR
            }
            paymentType={paymentTypeForModal}
            onSuccess={() => {
              const isFull = paymentTypeForModal === "full";
              setCreatedBooking({
                ...bookingForPayment,
                status: "Confirmed",
                paymentStatus: isFull ? "Paid in Full" : "Deposit Paid",
                remainingBalanceZAR: isFull ? 0 : bookingForPayment.remainingBalanceZAR
              });
              setYocoModalOpen(false);
            }}
          />
        )}

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#141210] text-[#2C2420] dark:text-[#FAF8F5] transition-colors duration-300">
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* Banner */}
        <section className="bg-[#2C2420] dark:bg-[#141210] text-[#FAF8F5] pt-32 pb-14 border-b border-[#C5A880]/30 text-center">
          <div className="max-w-4xl mx-auto px-4 space-y-2">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
              Camryn Burger Photography • Online Reservation
            </span>
            <h1 className="font-serif-heading text-3xl sm:text-5xl font-normal">
              5-Step Photography Booking Wizard
            </h1>
            <p className="text-xs text-[#EAE3D9]/80 font-light max-w-md mx-auto">
              Select your package, choose available calendar slots, inspect live venue weather, and secure your session.
            </p>
          </div>
        </section>

        {/* Wizard Container */}
        <section className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Stepper Progress Bar */}
          <div className="mb-8 overflow-x-auto no-scrollbar pb-2">
            <div className="flex items-center justify-between min-w-[550px] relative px-2">
              {stepTitles.map((title, idx) => {
                const stepNum = idx + 1;
                const isCompleted = stepNum < currentStep;
                const isCurrent = stepNum === currentStep;
                return (
                  <div key={idx} className="flex flex-col items-center relative z-10">
                    <button
                      type="button"
                      onClick={() => {
                        if (stepNum < currentStep) setCurrentStep(stepNum);
                      }}
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                        isCompleted
                          ? "bg-[#2E5E43] text-white cursor-pointer"
                          : isCurrent
                          ? "bg-[#C5A880] text-[#2C2420] ring-4 ring-[#C5A880]/30 font-bold"
                          : "bg-[#EAE3D9] dark:bg-[#27221E] text-neutral-400"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : stepNum}
                    </button>
                    <span
                      className={`text-[10px] uppercase tracking-wider mt-2 font-medium ${
                        isCurrent ? "text-[#C5A880] font-bold" : "text-neutral-400"
                      }`}
                    >
                      {title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Validation Alert */}
          {validationError && (
            <div className="mb-6 p-4 bg-rose-900/10 border border-rose-500/30 rounded-sm text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* ================= STEP 1: SERVICE & PACKAGE SELECTION ================= */}
          {currentStep === 1 && (
            <div className="bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
                  Step 1 of 5
                </span>
                <h2 className="font-serif-heading text-2xl sm:text-3xl font-normal mt-0.5">
                  Select Photography Service & Package Tier
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Choose a service category, then pick your desired package with transparent pricing & image quantities.
                </p>
              </div>

              {/* Service Categories Selector Pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {servicesList.map((serv) => {
                  const isSelected = selectedService?.id === serv.id;
                  return (
                    <button
                      key={serv.id}
                      type="button"
                      onClick={() => {
                        setSelectedService(serv);
                        if (serv.packages.length > 0) setSelectedPackage(serv.packages[0]);
                      }}
                      className={`px-4 py-2.5 rounded-sm border text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#C5A880] text-[#2C2420] border-[#C5A880] shadow-md"
                          : "bg-[#FAF8F5] dark:bg-[#141210] border-[#EAE3D9] dark:border-[#3A332C] text-neutral-600 dark:text-neutral-300 hover:border-[#C5A880]"
                      }`}
                    >
                      {serv.title}
                    </button>
                  );
                })}
              </div>

              {/* Package Options Cards for Selected Service */}
              {selectedService && (
                <div className="space-y-4 pt-4 border-t border-[#EAE3D9] dark:border-[#3A332C]">
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-[#C5A880]">
                    Available {selectedService.title} Tiers:
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {selectedService.packages.map((pkg) => {
                      const isSelected = selectedPackage?.id === pkg.id;
                      return (
                        <div
                          key={pkg.id}
                          onClick={() => setSelectedPackage(pkg)}
                          className={`p-6 rounded-sm border cursor-pointer transition-all flex flex-col justify-between active:scale-98 ${
                            isSelected
                              ? "border-[#C5A880] bg-[#C5A880]/10 dark:bg-[#C5A880]/15 ring-2 ring-[#C5A880] shadow-md"
                              : "border-[#EAE3D9] dark:border-[#3A332C] bg-[#FAF8F5] dark:bg-[#141210] hover:border-[#C5A880]/60"
                          }`}
                        >
                          {pkg.imageUrl && (
                            <div className="relative h-32 w-full rounded-sm overflow-hidden mb-3 border border-[#EAE3D9] dark:border-[#3A332C]">
                              <Image
                                src={pkg.imageUrl}
                                alt={pkg.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-serif-heading text-xl font-bold">
                                {pkg.name}
                              </h4>
                              {pkg.popular && (
                                <span className="text-[9px] uppercase font-bold bg-[#C5A880] text-[#2C2420] px-2 py-0.5 rounded">
                                  Popular
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-light">
                              {pkg.tagline}
                            </p>

                            <div className="text-2xl font-serif-heading font-semibold text-[#C5A880] pt-1">
                              R {formatCurrency(pkg.startingPriceZAR)}
                            </div>

                            <div className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                              {pkg.durationHours} Hours Coverage • {pkg.editedImagesCount} Edited Images
                            </div>
                          </div>

                          <ul className="space-y-2 pt-4 mt-4 border-t border-[#EAE3D9] dark:border-[#3A332C] text-xs text-neutral-600 dark:text-neutral-300">
                            {pkg.features.map((feat, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>

                          <button
                            type="button"
                            className={`w-full mt-5 text-xs font-semibold uppercase tracking-wider py-2.5 rounded-sm transition-colors ${
                              isSelected
                                ? "bg-[#2C2420] dark:bg-[#C5A880] text-white dark:text-[#2C2420]"
                                : "border border-[#C5A880] text-[#C5A880] hover:bg-[#C5A880] hover:text-[#2C2420]"
                            }`}
                          >
                            {isSelected ? "Selected ✓" : "Select Package"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 2: DATE, TIME SLOT & PHOTOGRAPHER ================= */}
          {currentStep === 2 && (
            <div className="bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-6 sm:p-8 space-y-8 shadow-sm animate-fade-in">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
                  Step 2 of 5
                </span>
                <h2 className="font-serif-heading text-2xl sm:text-3xl font-normal mt-0.5">
                  Choose Date, Time Slot & Photographer
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Inspect real-time calendar availability dots and select lead or associate photographer.
                </p>
              </div>

              {/* Photographer Lead vs Associate Selection */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#C5A880] mb-3">
                  Select Photographer
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {photographersList.map((photo) => {
                    const isSelected = selectedPhotographer?.id === photo.id;
                    return (
                      <div
                        key={photo.id}
                        onClick={() => setSelectedPhotographer(photo)}
                        className={`p-4 rounded-sm border cursor-pointer transition-all flex items-center gap-3.5 ${
                          isSelected
                            ? "border-[#C5A880] bg-[#C5A880]/15 ring-2 ring-[#C5A880]"
                            : "border-[#EAE3D9] dark:border-[#3A332C] bg-[#FAF8F5] dark:bg-[#141210] hover:border-[#C5A880]/60"
                        }`}
                      >
                        <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border border-[#C5A880] bg-[#C5A880]/10">
                          <Image
                            src={photo.avatarUrl || "/backgrounds/camryn-portrait.jpg"}
                            alt={photo.name}
                            fill
                            sizes="56px"
                            unoptimized={photo.avatarUrl?.startsWith("data:") || photo.avatarUrl?.startsWith("http")}
                            className="object-cover"
                          />
                        </div>
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-serif-heading text-base font-semibold truncate">{photo.name}</h4>
                            <span
                              className={`text-[8px] uppercase px-1.5 py-0.5 rounded font-bold ${
                                photo.isLead
                                  ? "bg-[#C5A880] text-[#2C2420]"
                                  : "bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                              }`}
                            >
                              {photo.role || (photo.isLead ? "Owner / Photographer" : "Photographer")}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                            {photo.bio}
                          </p>
                          <div className="text-[10px] text-[#C5A880] font-semibold flex items-center gap-1.5">
                            <span>★ {photo.rating || 4.9}</span>
                            <span>•</span>
                            <span>{photo.completedShoots || 50}+ Shoots</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Studio Calendar with Month Navigation and Availability Status Dots */}
              <div className="border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-4 sm:p-6 bg-[#FAF8F5] dark:bg-[#141210]">
                {/* Header with Month/Year Navigation and Pickers */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#EAE3D9] dark:border-[#3A332C]">
                  {/* Left: Previous / Next buttons & Month-Year Title */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      title="Previous Month"
                      className="p-2 rounded-sm border border-[#EAE3D9] dark:border-[#3A332C] bg-white dark:bg-[#1C1917] hover:bg-[#EAE3D9] dark:hover:bg-[#2C2420] text-[#2C2420] dark:text-[#FAF8F5] transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2 px-2">
                      <CalendarIcon className="w-4 h-4 text-[#C5A880]" />
                      <span className="font-serif-heading text-lg sm:text-xl font-semibold text-[#2C2420] dark:text-[#FAF8F5]">
                        {MONTH_NAMES[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleNextMonth}
                      title="Next Month"
                      className="p-2 rounded-sm border border-[#EAE3D9] dark:border-[#3A332C] bg-white dark:bg-[#1C1917] hover:bg-[#EAE3D9] dark:hover:bg-[#2C2420] text-[#2C2420] dark:text-[#FAF8F5] transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Right: Quick Month & Year Pickers, Reset, and Legend */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <select
                        value={calendarMonth.getMonth()}
                        onChange={handleMonthChange}
                        aria-label="Select Month"
                        className="text-xs py-1.5 px-2 rounded-sm border border-[#EAE3D9] dark:border-[#3A332C] bg-white dark:bg-[#1C1917] text-[#2C2420] dark:text-[#FAF8F5] font-medium focus:outline-none focus:border-[#C5A880]"
                      >
                        {MONTH_NAMES.map((name, idx) => (
                          <option key={name} value={idx}>
                            {name}
                          </option>
                        ))}
                      </select>

                      <select
                        value={calendarMonth.getFullYear()}
                        onChange={handleYearChange}
                        aria-label="Select Year"
                        className="text-xs py-1.5 px-2 rounded-sm border border-[#EAE3D9] dark:border-[#3A332C] bg-white dark:bg-[#1C1917] text-[#2C2420] dark:text-[#FAF8F5] font-medium focus:outline-none focus:border-[#C5A880]"
                      >
                        {[now.getFullYear(), now.getFullYear() + 1, now.getFullYear() + 2].map((yr) => (
                          <option key={yr} value={yr}>
                            {yr}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={handleJumpToToday}
                        className="text-[11px] py-1.5 px-2.5 rounded-sm border border-[#C5A880]/40 text-[#C5A880] hover:bg-[#C5A880]/10 font-semibold transition-colors"
                      >
                        This Month
                      </button>
                    </div>

                    {/* Dot Legend */}
                    <div className="flex items-center gap-2.5 text-[10px] pl-2 border-l border-[#EAE3D9] dark:border-[#3A332C]">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-neutral-600 dark:text-neutral-300">Available</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span className="text-neutral-600 dark:text-neutral-300">Partially Booked</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span className="text-neutral-600 dark:text-neutral-300">Fully Booked</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Day Grid */}
                {(() => {
                  const calendarYear = calendarMonth.getFullYear();
                  const calendarMonthIndex = calendarMonth.getMonth();
                  const daysInMonth = new Date(calendarYear, calendarMonthIndex + 1, 0).getDate();
                  const firstDayIndex = new Date(calendarYear, calendarMonthIndex, 1).getDay();

                  return (
                    <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                        <div key={d} className="text-[10px] uppercase font-bold text-neutral-400 py-1">
                          {d}
                        </div>
                      ))}

                      {/* Empty Offset for first day */}
                      {[...Array(firstDayIndex)].map((_, i) => (
                        <div key={`empty-${i}`} className="min-h-[46px] opacity-0" />
                      ))}

                      {/* Month Days */}
                      {[...Array(daysInMonth)].map((_, i) => {
                        const day = i + 1;
                        const dateStr = `${calendarYear}-${String(calendarMonthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                        const isSelected = selectedDate === dateStr;
                        const status = getDayAvailability(calendarYear, calendarMonthIndex, day);
                        const isPast = status === "past";
                        const isFullyBooked = status === "red";
                        const isDisabled = isPast || isFullyBooked;

                        return (
                          <button
                            key={`day-${calendarYear}-${calendarMonthIndex}-${day}`}
                            type="button"
                            onClick={() => {
                              if (!isDisabled) setSelectedDate(dateStr);
                            }}
                            disabled={isDisabled}
                            title={
                              isPast
                                ? "Past date cannot be booked"
                                : isFullyBooked
                                ? "Fully Booked (All slots taken for chosen photographer)"
                                : status === "amber"
                                ? "Partially Booked: Select date to pick an open time slot"
                                : "100% Available"
                            }
                            className={`p-2 rounded-sm border text-xs transition-all relative flex flex-col items-center justify-center min-h-[46px] ${
                              isDisabled
                                ? "bg-neutral-200/50 dark:bg-neutral-900/60 border-transparent text-neutral-400/40 opacity-35 cursor-not-allowed"
                                : isSelected
                                ? "bg-[#C5A880] text-[#2C2420] border-[#C5A880] font-bold shadow-md ring-2 ring-[#C5A880]/60"
                                : "bg-white dark:bg-[#1C1917] border-[#EAE3D9] dark:border-[#3A332C] hover:border-[#C5A880] cursor-pointer"
                            }`}
                          >
                            <span className={isSelected ? "font-bold" : ""}>{day}</span>
                            {!isPast && (
                              <span
                                className={`w-1.5 h-1.5 rounded-full mt-1 ${
                                  status === "green"
                                    ? "bg-emerald-500 shadow-sm"
                                    : status === "amber"
                                    ? "bg-amber-400 ring-2 ring-amber-400/25 shadow-sm"
                                    : "bg-rose-500"
                                }`}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* Selected Date Confirmation Banner */}
                {selectedDate && (
                  <div className="mt-4 pt-3 border-t border-[#EAE3D9] dark:border-[#3A332C] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-500 dark:text-neutral-400">Selected Shoot Date:</span>
                      <span className="font-semibold text-[#2C2420] dark:text-[#FAF8F5] bg-[#C5A880]/15 px-2.5 py-1 rounded-sm border border-[#C5A880]/30">
                        {formatSelectedDateHuman(selectedDate)}
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                      Date Selected for Studio Booking
                    </span>
                  </div>
                )}
              </div>

              {/* Time Slots Selection */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#C5A880] mb-3">
                  Select Time Slot (Midnight slot includes R450 surcharge)
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = selectedTimeSlot === slot.label;
                    const isSlotBooked = isSlotTaken(selectedDate, slot.label, selectedPhotographer?.id);

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={isSlotBooked}
                        onClick={() => !isSlotBooked && setSelectedTimeSlot(slot.label)}
                        title={isSlotBooked ? "This time slot is already booked / held" : undefined}
                        className={`p-3.5 rounded-sm border text-left text-xs transition-all flex items-center justify-between ${
                          isSlotBooked
                            ? "bg-neutral-100/70 dark:bg-neutral-900/70 border-dashed border-rose-300/40 dark:border-rose-900/40 text-neutral-400 opacity-60 cursor-not-allowed"
                            : isSelected
                            ? "bg-[#C5A880] text-[#2C2420] border-[#C5A880] font-semibold shadow-md cursor-pointer"
                            : "bg-[#FAF8F5] dark:bg-[#141210] border-[#EAE3D9] dark:border-[#3A332C] text-[#2C2420] dark:text-[#FAF8F5] hover:border-[#C5A880] cursor-pointer active:scale-95"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="font-medium flex items-center gap-1.5">
                            {slot.isMidnight ? (
                              <Moon className={`w-3.5 h-3.5 ${isSlotBooked ? "text-neutral-400" : ""}`} />
                            ) : (
                              <Clock className={`w-3.5 h-3.5 ${isSlotBooked ? "text-neutral-400" : "text-[#C5A880]"}`} />
                            )}
                            <span className={isSlotBooked ? "line-through decoration-rose-500 decoration-2 text-neutral-400" : ""}>
                              {slot.label}
                            </span>
                          </div>
                          {slot.isMidnight && !isSlotBooked && (
                            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 block">
                              +R450 Late Night Surcharge
                            </span>
                          )}
                          {isSlotBooked && (
                            <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                              <Ban className="w-3 h-3" /> Slot Taken / Booked
                            </span>
                          )}
                        </div>
                        {isSelected && !isSlotBooked && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: CLIENT CONTACT & VISION NOTES ================= */}
          {currentStep === 3 && (
            <div className="bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
                  Step 3 of 5
                </span>
                <h2 className="font-serif-heading text-2xl sm:text-3xl font-normal mt-0.5">
                  Client Contact & Vision Notes
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Auto-fills from authenticated profile or allows custom contact details and styling notes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerForm.fullName}
                    onChange={(e) => setCustomerForm({ ...customerForm, fullName: e.target.value })}
                    placeholder="e.g. Jane Doe"
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-3 text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerForm.email}
                    onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-3 text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerForm.phone}
                    onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                    placeholder="+27 82 123 4567"
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-3 text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                    Event / Occasion
                  </label>
                  <input
                    type="text"
                    value={customerForm.eventType}
                    onChange={(e) => setCustomerForm({ ...customerForm, eventType: e.target.value })}
                    placeholder={selectedService?.title || "e.g. Wedding, Matric Dance, Milestone"}
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-3 text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              {/* Vision Notes */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                  Vision Notes & Styling Direction (Moodboard, Outfits, Props)
                </label>
                <textarea
                  rows={4}
                  value={customerForm.notes}
                  onChange={(e) => setCustomerForm({ ...customerForm, notes: e.target.value })}
                  placeholder="Tell us about your visual concept, outfit changes, props (e.g. champagne, smoke bombs, vintage cars), or key family shots..."
                  className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-3 text-xs focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>
          )}

          {/* ================= STEP 4: LOCATION, MAP & LIVE WEATHER ================= */}
          {currentStep === 4 && (
            <div className="bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
                  Step 4 of 5
                </span>
                <h2 className="font-serif-heading text-2xl sm:text-3xl font-normal mt-0.5">
                  Shoot Location, Studio Base & Live Weather
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Select a popular Gauteng venue or drag the pin. View complimentary 20km zone & live lighting condition tips.
                </p>
              </div>

              {/* Interactive Google Map with 20km Circle & Predefined Pills */}
              <GoogleMapPicker
                venueName={locationForm.venueName}
                address={locationForm.address}
                suburb={locationForm.suburb}
                latitude={locationForm.latitude}
                longitude={locationForm.longitude}
                distanceKm={locationForm.distanceFromBaseKm}
                travelFeeZAR={locationForm.travelFeeZAR}
                onLocationChange={(loc) => {
                  setLocationForm((prev) => ({
                    ...prev,
                    venueName: loc.venueName,
                    address: loc.address,
                    suburb: loc.suburb,
                    latitude: loc.latitude,
                    longitude: loc.longitude,
                    distanceFromBaseKm: loc.distanceKm,
                    travelFeeZAR: loc.travelFeeZAR
                  }));
                }}
              />

              {/* Live Weather Forecast Preview Card from OpenWeatherMap */}
              <LiveWeatherCard
                latitude={locationForm.latitude}
                longitude={locationForm.longitude}
                venueName={locationForm.venueName}
              />

              {/* Additional Directions / Gate Code */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                  Additional Directions / Gate Codes / Parking Notes (Optional)
                </label>
                <input
                  type="text"
                  value={locationForm.additionalDirections}
                  onChange={(e) => setLocationForm({ ...locationForm, additionalDirections: e.target.value })}
                  placeholder="e.g. Gate code #2910, parking at reception pavilion"
                  className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-3 text-xs focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>
          )}

          {/* ================= STEP 5: REVIEW & COST BREAKDOWN ================= */}
          {currentStep === 5 && (
            <div className="bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
                  Step 5 of 5
                </span>
                <h2 className="font-serif-heading text-2xl sm:text-3xl font-normal mt-0.5">
                  Review & Cost Breakdown
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Review all booking line items and terms before confirming your session.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shoot Specs Summary */}
                <div className="bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-5 space-y-3 text-xs">
                  <h3 className="font-serif-heading text-lg font-semibold border-b border-[#EAE3D9] dark:border-[#3A332C] pb-2">
                    Photoshoot Summary
                  </h3>

                  <div className="space-y-2 text-neutral-700 dark:text-neutral-300">
                    <p>
                      <strong className="text-[#C5A880]">Service:</strong> {selectedService?.title}
                    </p>
                    <p>
                      <strong className="text-[#C5A880]">Package Tier:</strong> {selectedPackage?.name} ({selectedPackage?.durationHours} Hours • {selectedPackage?.editedImagesCount} Images)
                    </p>
                    <p>
                      <strong className="text-[#C5A880]">Photographer:</strong> {selectedPhotographer?.name} ({selectedPhotographer?.isLead ? "Owner & Lead" : "Associate"})
                    </p>
                    <p>
                      <strong className="text-[#C5A880]">Date & Time:</strong> {selectedDate} @ {selectedTimeSlot}
                    </p>
                    <p>
                      <strong className="text-[#C5A880]">Location:</strong> {locationForm.venueName} (~{locationForm.distanceFromBaseKm} km from base)
                    </p>
                    <p>
                      <strong className="text-[#C5A880]">Client:</strong> {customerForm.fullName} ({customerForm.email})
                    </p>
                    {customerForm.notes && (
                      <p className="italic text-neutral-500">
                        "{customerForm.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Financial Breakdown Card */}
                <div className="bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-5 space-y-3 text-xs flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif-heading text-lg font-semibold border-b border-[#EAE3D9] dark:border-[#3A332C] pb-2 mb-3">
                      Financial Breakdown (ZAR)
                    </h3>

                    <div className="space-y-2.5">
                      <div className="flex justify-between">
                        <span>Base Package Price:</span>
                        <span className="font-semibold">R {formatCurrency(quote.basePrice)}</span>
                      </div>

                      <div className="flex justify-between">
                        <span>
                          Travel Fee ({locationForm.distanceFromBaseKm} km from Krugersdorp):
                        </span>
                        <span className={`font-semibold ${quote.travelFee === 0 ? "text-[#2E5E43] dark:text-emerald-400" : ""}`}>
                          {quote.travelFee === 0 ? "R 0.00 (Complimentary)" : `R ${formatCurrency(quote.travelFee)}`}
                        </span>
                      </div>

                      {quote.lateNightSurcharge > 0 && (
                        <div className="flex justify-between text-amber-700 dark:text-amber-300 font-semibold">
                          <span>Midnight Session Surcharge (23:00 - 01:00):</span>
                          <span>+R {quote.lateNightSurcharge}.00</span>
                        </div>
                      )}

                      <hr className="border-[#EAE3D9] dark:border-[#3A332C] my-2" />

                      <div className="flex justify-between text-sm font-bold text-[#2C2420] dark:text-[#FAF8F5]">
                        <span>Subtotal Quote:</span>
                        <span>R {formatCurrency(quote.subtotal)}</span>
                      </div>

                      <div className="flex justify-between text-xs text-[#2E5E43] dark:text-emerald-400 font-bold pt-2 border-t border-[#EAE3D9] dark:border-[#3A332C]">
                        <span>50% Deposit Due Today:</span>
                        <span>R {formatCurrency(quote.depositRequired)}</span>
                      </div>

                      <div className="flex justify-between text-[11px] text-neutral-500">
                        <span>Remaining 50% Balance (Due on Shoot Day):</span>
                        <span>R {formatCurrency(quote.remainingBalance)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded text-[11px] text-neutral-600 dark:text-neutral-400 mt-4 space-y-1">
                    <p className="font-semibold text-[#2C2420] dark:text-[#FAF8F5]">Payment Terms:</p>
                    <p>• 50% deposit locks date & photographer on studio schedule.</p>
                    <p>• 50% balance payable on the shoot day prior to delivery.</p>
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3 p-4 bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm text-xs">
                <input
                  type="checkbox"
                  id="terms-check"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-[#C5A880] rounded border-[#EAE3D9]"
                />
                <label htmlFor="terms-check" className="text-neutral-600 dark:text-neutral-300">
                  I agree to the Camryn Burger Photography{" "}
                  <Link href="/terms" target="_blank" className="text-[#C5A880] underline">
                    Terms and Conditions
                  </Link>
                  , cancellation notice policy, and understand that remaining balance is due on shoot day.
                </label>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="mt-8 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center gap-1.5 border border-[#EAE3D9] dark:border-[#3A332C] hover:border-[#C5A880] text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded-sm transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center gap-1.5 bg-[#2C2420] dark:bg-[#C5A880] text-white dark:text-[#2C2420] hover:bg-[#C5A880] text-xs font-semibold uppercase tracking-wider px-8 py-3.5 rounded-sm transition-colors shadow-md cursor-pointer active:scale-95"
              >
                <span>Continue to Step {currentStep + 1}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Secondary Button: Confirm Booking (12-Hour Hold) */}
                <button
                  type="button"
                  onClick={() => handleFinalBookingSubmit(undefined, "hold_only")}
                  disabled={isSubmitting || !termsAccepted}
                  title="Reserve date and time slot for up to 12 hours without upfront deposit"
                  className="inline-flex items-center justify-center gap-2 border-2 border-[#2C2420] dark:border-[#C5A880] text-[#2C2420] dark:text-[#FAF8F5] hover:bg-[#2C2420]/10 dark:hover:bg-[#C5A880]/15 text-xs font-semibold uppercase tracking-wider px-6 py-3.5 rounded-sm transition-all shadow-sm cursor-pointer disabled:opacity-50 active:scale-95"
                >
                  <Clock className="w-4 h-4 text-[#C5A880]" />
                  <span>
                    {isSubmitting && pendingSubmitMode === "hold_only"
                      ? "Reserving Slot..."
                      : "Confirm Booking"}
                  </span>
                </button>

                {/* Primary Button: Confirm & Pay Deposit */}
                <button
                  type="button"
                  onClick={() => handleFinalBookingSubmit(undefined, "pay_now")}
                  disabled={isSubmitting || !termsAccepted}
                  className="inline-flex items-center justify-center gap-2 bg-[#2E5E43] hover:bg-[#254d37] text-white text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded-sm transition-all shadow-xl cursor-pointer disabled:opacity-50 active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>
                    {isSubmitting && pendingSubmitMode === "pay_now"
                      ? "Preparing Checkout..."
                      : `Confirm & Pay 50% Deposit (R ${formatCurrency(quote.depositRequired)})`}
                  </span>
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Authentication Gate Modal (Triggered in Step 5 if not logged in) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        redirectNotice="Please sign in or create an account to finalize your booking reservation."
        onSuccess={(loggedUser) => {
          setCurrentUser(loggedUser);
          setCustomerForm((prev) => ({
            ...prev,
            fullName: prev.fullName || loggedUser.name,
            email: prev.email || loggedUser.email
          }));
          // Immediately confirm booking after login/registration using selected mode
          handleFinalBookingSubmit(loggedUser, pendingSubmitMode);
        }}
      />

      {/* Yoco Payment Gateway Checkout Modal */}
      {bookingForPayment && (
        <YocoPaymentModal
          isOpen={yocoModalOpen}
          onClose={() => setYocoModalOpen(false)}
          bookingId={bookingForPayment.id}
          bookingReference={bookingForPayment.bookingReference}
          customerName={bookingForPayment.customer?.fullName || customerForm.fullName}
          customerEmail={bookingForPayment.customer?.email || customerForm.email}
          packageName={bookingForPayment.packageName}
          amountZAR={
            paymentTypeForModal === "full"
              ? (bookingForPayment.subtotalZAR || (bookingForPayment.depositRequiredZAR * 2))
              : bookingForPayment.depositRequiredZAR
          }
          paymentType={paymentTypeForModal}
          onSuccess={() => {
            const isFull = paymentTypeForModal === "full";
            setCreatedBooking({
              ...bookingForPayment,
              status: "Confirmed",
              paymentStatus: isFull ? "Paid in Full" : "Deposit Paid",
              remainingBalanceZAR: isFull ? 0 : bookingForPayment.remainingBalanceZAR
            });
            setYocoModalOpen(false);
          }}
        />
      )}

      <Footer />
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#2C2420] text-white flex items-center justify-center">
        <p className="text-xs uppercase tracking-widest text-[#C5A880]">Loading Booking Wizard...</p>
      </div>
    }>
      <BookingWizardContent />
    </Suspense>
  );
}
