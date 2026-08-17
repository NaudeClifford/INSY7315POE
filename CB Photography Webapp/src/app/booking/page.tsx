"use client";

// Multi-step shoot booking wizard page handling service selection, package tiers, date picker, travel quote, and checkout
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MOCK_SERVICES } from "@/data/services";
import { MOCK_PHOTOGRAPHERS } from "@/data/photographers";
import { createBooking, calculateQuote, getAvailability } from "@/lib/api";
import { Service, PackageOption } from "@/types/service";
import { Photographer } from "@/types/user";
import { Booking, QuoteBreakdown } from "@/types/booking";
import { formatCurrency } from "@/lib/utils";
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  User,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Info
} from "lucide-react";

function BookingWizardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselectedServiceSlug = searchParams.get("service");

  // Step state management (1: Service, 2: Package, 3: Photographer, 4: Date & Time, 5: Location & Customer Details, 6: Quote & Payment, 7: Confirmation)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // User form selection state
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackageOption | null>(null);
  const [selectedPhotographer, setSelectedPhotographer] = useState<Photographer | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

  // Shoot venue location form
  const [locationForm, setLocationForm] = useState({
    venueName: "",
    address: "",
    suburb: "",
    city: "",
    province: "Gauteng",
    postalCode: "",
    additionalDirections: "",
    distanceFromBaseKm: ""
  });


  // Customer Form
  const [customerForm, setCustomerForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    eventType: "",
    notes: ""
  });

  // Quote breakdown state
  const [quote, setQuote] = useState<QuoteBreakdown>({
    basePrice: 0,
    travelDistanceKm: 0,
    travelFee: 0,
    subtotal: 0,
    depositRequired: 0,
    remainingBalance: 0
  });

  // Terms acceptance
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  // Initialize preselected service & package if query params are passed
  useEffect(() => {
    const preselectedPackageId = searchParams.get("package");
    if (preselectedServiceSlug) {
      const match = MOCK_SERVICES.find((s) => s.slug === preselectedServiceSlug);
      if (match) {
        setSelectedService(match);
        if (preselectedPackageId) {
          const pkgMatch = match.packages.find((p) => p.id === preselectedPackageId);
          if (pkgMatch) {
            setSelectedPackage(pkgMatch);
            setCurrentStep(3); // Jump to Date & Photographer selection
          } else if (match.packages.length > 0) {
            setSelectedPackage(match.packages[0]);
          }
        } else if (match.packages.length > 0) {
          setSelectedPackage(match.packages[0]);
        }
      }
    } else if (!selectedService && MOCK_SERVICES.length > 0) {
      setSelectedService(MOCK_SERVICES[0]);
      setSelectedPackage(MOCK_SERVICES[0].packages[0]);
    }
  }, [preselectedServiceSlug, searchParams]);

  // Set default photographer
  useEffect(() => {
    if (!selectedPhotographer && MOCK_PHOTOGRAPHERS.length > 0) {
      setSelectedPhotographer(MOCK_PHOTOGRAPHERS[0]);
    }
  }, []);

  // Update availability when date or photographer changes
  useEffect(() => {
    if (selectedPhotographer && selectedDate) {
      setLoadingSlots(true);
      getAvailability(selectedPhotographer.id, selectedDate).then((slots) => {
        setAvailableSlots(slots);
        if (slots.length > 0) {
          setSelectedTimeSlot(slots[0]);
        } else {
          setSelectedTimeSlot("");
        }
        setLoadingSlots(false);
      });
    }
  }, [selectedPhotographer, selectedDate]);

  // Calculate price breakdown whenever package or distance changes
  useEffect(() => {
    if (selectedPackage) {
      const distNum = locationForm.distanceFromBaseKm !== "" ? Number(locationForm.distanceFromBaseKm) : 0;
      calculateQuote(selectedPackage.startingPriceZAR, {
        suburb: locationForm.suburb,
        city: locationForm.city,
        distanceKm: distNum
      }).then((res) => setQuote(res));
    }
  }, [selectedPackage, locationForm.distanceFromBaseKm]);

  // Validation before proceeding
  const handleNextStep = () => {
    setValidationError(null);

    if (currentStep === 1) {
      if (!selectedService) {
        setValidationError("Please select a photography service to continue.");
        return;
      }
    } else if (currentStep === 2) {
      if (!selectedPackage) {
        setValidationError("Please select a package tier.");
        return;
      }
    } else if (currentStep === 3) {
      if (!selectedPhotographer) {
        setValidationError("Please select a photographer.");
        return;
      }
      if (!selectedDate) {
        setValidationError("Please select a date for your shoot.");
        return;
      }
      if (!selectedTimeSlot) {
        setValidationError("Please select an available time slot.");
        return;
      }
    } else if (currentStep === 4) {
      if (!locationForm.venueName || !locationForm.city) {
        setValidationError("Please enter venue name and city.");
        return;
      }
    } else if (currentStep === 5) {
      if (!customerForm.fullName || !customerForm.email || !customerForm.phone) {
        setValidationError("Please fill out your name, email address, and phone number.");
        return;
      }
    } else if (currentStep === 6) {
      if (!termsAccepted) {
        setValidationError("You must confirm acceptance of the Terms and Conditions to proceed.");
        return;
      }
      // Submit booking
      handleConfirmBooking();
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, 7));
  };

  const handlePrevStep = () => {
    setValidationError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedPackage || !selectedPhotographer) return;
    setIsSubmitting(true);
    try {
      const newBooking = await createBooking({
        serviceId: selectedService.id,
        serviceName: selectedService.title,
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        photographerId: selectedPhotographer.id,
        photographerName: selectedPhotographer.name,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        location: {
          ...locationForm,
          distanceFromBaseKm: locationForm.distanceFromBaseKm !== "" ? Number(locationForm.distanceFromBaseKm) : 0,
          travelFeeZAR: quote.travelFee
        },
        customer: {
          ...customerForm,
          eventType: customerForm.eventType || selectedService.title
        },
        basePriceZAR: quote.basePrice,
        travelFeeZAR: quote.travelFee,
        addonsTotalZAR: 0,
        subtotalZAR: quote.subtotal,
        depositRequiredZAR: quote.depositRequired,
        remainingBalanceZAR: quote.remainingBalance
      });
      setCreatedBooking(newBooking);
      setCurrentStep(7);
    } catch (err) {
      setValidationError("Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepTitles = [
    "Select Service",
    "Select Package",
    "Date & Photographer",
    "Location Details",
    "Customer Details",
    "Summary & Breakdown",
    "Confirmation"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f3ed] text-[#402615]">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-[#402615] text-[#f7f3ed] pt-32 pb-16 border-b border-[#bea683]/30 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-[#bea683] font-semibold">
            Online Reservation Wizard
          </span>
          <h1 className="font-serif-heading text-4xl sm:text-5xl font-normal">
            Book Your Photography Shoot
          </h1>
          <p className="text-xs sm:text-sm text-[#d6c8b1] max-w-lg mx-auto font-light">
            Follow our 7-step wizard to calculate your quote, select date & location, and secure your session.
          </p>
        </div>
      </section>

      {/* Main Wizard Area */}
      <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        {/* Stepper Progress Bar */}
        <div className="mb-8 sm:mb-10 overflow-x-auto no-scrollbar pb-3">
          <div className="flex items-center justify-between min-w-[620px] relative px-2">
            {stepTitles.map((title, idx) => {
              const stepNum = idx + 1;
              const isCompleted = stepNum < currentStep;
              const isCurrent = stepNum === currentStep;
              return (
                <div key={idx} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                      isCompleted
                        ? "bg-[#7d5e3c] text-white"
                        : isCurrent
                        ? "bg-[#bea683] text-[#402615] ring-4 ring-[#bea683]/30 font-bold"
                        : "bg-[#d6c8b1] text-[#878679]"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : stepNum}
                  </div>
                  <span
                    className={`text-[10px] uppercase tracking-wider mt-2 font-medium ${
                      isCurrent ? "text-[#7d5e3c] font-bold" : "text-[#878679]"
                    }`}
                  >
                    {title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Validation Error Alert */}
        {validationError && (
          <div className="mb-6 p-4 bg-rose-900/10 border border-rose-500/40 rounded-sm text-rose-800 text-xs flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* STEP 1: SELECT SERVICE */}
        {currentStep === 1 && (
          <div className="bg-[#f7f3ed] border border-[#bea683]/40 rounded-sm p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#7d5e3c] font-semibold">
                Tap to Select & Continue
              </span>
              <h2 className="font-serif-heading text-2xl text-[#402615]">
                Step 1: Select a Photography Service
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {MOCK_SERVICES.map((serv) => {
                const isSelected = selectedService?.id === serv.id;
                return (
                  <div
                    key={serv.id}
                    onClick={() => {
                      setSelectedService(serv);
                      if (serv.packages.length > 0) setSelectedPackage(serv.packages[0]);
                      setCurrentStep(2);
                      window.scrollTo({ top: 160, behavior: "smooth" });
                    }}
                    className={`p-5 rounded-sm border cursor-pointer transition-all active:scale-98 ${
                      isSelected
                        ? "border-[#7d5e3c] bg-[#d6c8b1]/30 ring-2 ring-[#7d5e3c]/20 shadow-md"
                        : "border-[#bea683]/30 bg-white/50 hover:bg-[#d6c8b1]/10"
                    } space-y-3`}
                  >
                    <div className="relative h-36 w-full rounded-sm overflow-hidden">
                      <Image src={serv.imageUrl} alt={serv.title} fill className="object-cover" />
                    </div>
                    <h3 className="font-serif-heading text-xl text-[#402615] font-semibold">
                      {serv.title}
                    </h3>
                    <p className="text-xs text-[#878679] line-clamp-2">{serv.description}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-semibold text-[#7d5e3c]">
                        From R{formatCurrency(serv.startingPriceZAR)}
                      </span>
                      <span className="text-[11px] font-bold text-[#7d5e3c] uppercase tracking-wider flex items-center gap-1">
                        Select →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: SELECT PACKAGE */}
        {currentStep === 2 && selectedService && (
          <div className="bg-[#f7f3ed] border border-[#bea683]/40 rounded-sm p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#7d5e3c]">
                {selectedService.title} • Tap to Choose
              </span>
              <h2 className="font-serif-heading text-2xl text-[#402615]">
                Step 2: Choose Your Package Tier
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {selectedService.packages.map((pkg) => {
                const isSelected = selectedPackage?.id === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => {
                      setSelectedPackage(pkg);
                      setCurrentStep(3);
                      window.scrollTo({ top: 160, behavior: "smooth" });
                    }}
                    className={`p-6 rounded-sm border cursor-pointer transition-all flex flex-col justify-between active:scale-98 ${
                      isSelected
                        ? "border-[#7d5e3c] bg-[#d6c8b1]/40 ring-2 ring-[#7d5e3c]/20 shadow-md"
                        : "border-[#bea683]/30 bg-white/50 hover:bg-[#d6c8b1]/10"
                    } space-y-4`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif-heading text-2xl text-[#402615] font-bold">
                          {pkg.name}
                        </h3>
                        {pkg.popular && (
                          <span className="text-[9px] uppercase font-bold bg-[#7d5e3c] text-white px-2 py-0.5 rounded-sm">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#878679]">{pkg.tagline}</p>
                      <div className="text-2xl font-serif-heading font-semibold text-[#7d5e3c] pt-2">
                        R{formatCurrency(pkg.startingPriceZAR)}
                      </div>
                      <div className="text-xs text-[#402615] font-medium">
                        {pkg.durationHours} Hours Coverage • {pkg.editedImagesCount} Edited Images
                      </div>
                    </div>

                    <ul className="space-y-2 pt-4 border-t border-[#bea683]/30 text-xs text-[#402615]">
                      {pkg.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#7d5e3c] shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      className="w-full mt-4 bg-[#7d5e3c] text-white text-xs font-semibold uppercase tracking-wider py-2.5 rounded-sm shadow-sm flex items-center justify-center gap-1"
                    >
                      <span>Choose {pkg.name} →</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: PHOTOGRAPHER, DATE & TIME */}
        {currentStep === 3 && (
          <div className="bg-[#f7f3ed] border border-[#bea683]/40 rounded-sm p-6 sm:p-8 space-y-8 shadow-sm animate-fade-in">
            <h2 className="font-serif-heading text-2xl text-[#402615]">
              Step 3: Select Photographer, Date & Time Slot
            </h2>

            {/* Select Photographer Cards */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#7d5e3c] mb-3">
                Choose Photographer
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MOCK_PHOTOGRAPHERS.map((photo) => {
                  const isSelected = selectedPhotographer?.id === photo.id;
                  return (
                    <div
                      key={photo.id}
                      onClick={() => setSelectedPhotographer(photo)}
                      className={`p-4 rounded-sm border cursor-pointer transition-all flex items-center gap-4 ${
                        isSelected
                          ? "border-[#7d5e3c] bg-[#d6c8b1]/40 ring-2 ring-[#7d5e3c]/20"
                          : "border-[#bea683]/30 bg-white/50"
                      }`}
                    >
                      <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-[#bea683] bg-[#bea683]/20 flex items-center justify-center text-center p-1">
                        <span className="text-[9px] uppercase font-bold text-[#7d5e3c] leading-tight">
                          {photo.avatarUrl}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-serif-heading text-lg font-semibold text-[#402615]">
                          {photo.name}
                        </h4>
                        <p className="text-[11px] text-[#878679] line-clamp-1">{photo.bio}</p>
                        <span className="text-[10px] text-[#7d5e3c] font-semibold">
                          ★ {photo.rating} ({photo.completedShoots}+ Shoots)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Select Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#7d5e3c] mb-2">
                  Select Shoot Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-white border border-[#bea683]/50 rounded-sm p-3 text-base sm:text-sm focus:outline-none focus:border-[#7d5e3c]"
                />
              </div>

              {/* Select Time Slot */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#7d5e3c] mb-2">
                  Select Time Slot (Tapping advances to location)
                </label>
                {loadingSlots ? (
                  <p className="text-xs text-[#878679]">Checking photographer calendar...</p>
                ) : !selectedDate ? (
                  <p className="text-xs text-[#878679] italic">Please select a date first to view slots.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => {
                          setSelectedTimeSlot(slot);
                          setTimeout(() => {
                            setCurrentStep(4);
                            window.scrollTo({ top: 160, behavior: "smooth" });
                          }, 250);
                        }}
                        className={`p-3 min-h-[44px] rounded-sm text-xs font-medium border text-center transition-all cursor-pointer active:scale-95 ${
                          selectedTimeSlot === slot
                            ? "bg-[#7d5e3c] text-white border-[#7d5e3c] font-bold"
                            : "bg-white text-[#402615] border-[#bea683]/40 hover:bg-[#d6c8b1]/20"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: LOCATION & TRAVEL CALCULATION */}
        {currentStep === 4 && (
          <div className="bg-[#f7f3ed] border border-[#bea683]/40 rounded-sm p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
            <h2 className="font-serif-heading text-2xl text-[#402615]">
              Step 4: Shoot Location & Travel Distance
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#7d5e3c] mb-1">
                  Venue Name / Location
                </label>
                <input
                  type="text"
                  value={locationForm.venueName}
                  onChange={(e) => setLocationForm({ ...locationForm, venueName: e.target.value })}
                  placeholder="e.g. Cradle Valley Estate"
                  className="w-full bg-white border border-[#bea683]/50 rounded-sm p-3 text-sm text-[#402615] placeholder:text-[#878679] focus:outline-none focus:border-[#7d5e3c]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#7d5e3c] mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={locationForm.address}
                  onChange={(e) => setLocationForm({ ...locationForm, address: e.target.value })}
                  placeholder="e.g. Plot 42 Kromdraai Rd"
                  className="w-full bg-white border border-[#bea683]/50 rounded-sm p-3 text-sm text-[#402615] placeholder:text-[#878679] focus:outline-none focus:border-[#7d5e3c]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#7d5e3c] mb-1">
                  Suburb / Area
                </label>
                <input
                  type="text"
                  value={locationForm.suburb}
                  onChange={(e) => setLocationForm({ ...locationForm, suburb: e.target.value })}
                  placeholder="e.g. Muldersdrift"
                  className="w-full bg-white border border-[#bea683]/50 rounded-sm p-3 text-sm text-[#402615] placeholder:text-[#878679] focus:outline-none focus:border-[#7d5e3c]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#7d5e3c] mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={locationForm.city}
                  onChange={(e) => setLocationForm({ ...locationForm, city: e.target.value })}
                  placeholder="e.g. Krugersdorp"
                  className="w-full bg-white border border-[#bea683]/50 rounded-sm p-3 text-sm text-[#402615] placeholder:text-[#878679] focus:outline-none focus:border-[#7d5e3c]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#7d5e3c] mb-1">
                  Province
                </label>
                <select
                  value={locationForm.province}
                  onChange={(e) => setLocationForm({ ...locationForm, province: e.target.value })}
                  className="w-full bg-white border border-[#bea683]/50 rounded-sm p-3 text-sm text-[#402615] focus:outline-none focus:border-[#7d5e3c]"
                >
                  <option value="Gauteng">Gauteng</option>
                  <option value="North West">North West</option>
                  <option value="Mpumalanga">Mpumalanga</option>
                  <option value="Free State">Free State</option>
                  <option value="Western Cape">Western Cape</option>
                  <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#7d5e3c] mb-1">
                  Distance from Base (Km from Krugersdorp)
                </label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={locationForm.distanceFromBaseKm}
                  onChange={(e) =>
                    setLocationForm({ ...locationForm, distanceFromBaseKm: e.target.value })
                  }
                  placeholder="e.g. 25"
                  className="w-full bg-white border border-[#bea683]/50 rounded-sm p-3 text-sm text-[#402615] placeholder:text-[#878679] focus:outline-none focus:border-[#7d5e3c]"
                />
              </div>
            </div>

            {/* Travel Rule Calculation Display */}
            <div className="p-4 bg-[#d6c8b1]/30 border border-[#bea683]/50 rounded-sm flex items-start gap-3 text-xs">
              <Info className="w-5 h-5 text-[#7d5e3c] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-[#402615] uppercase tracking-wider">
                  Travel Fee Business Rule:
                </p>
                <p className="text-[#878679]">
                  Travel within 20 km of Krugersdorp has no additional fee. Beyond 20 km is charged at R5/km.
                </p>
                <p className="text-[#7d5e3c] font-bold">
                  Calculated Distance: {locationForm.distanceFromBaseKm !== "" ? locationForm.distanceFromBaseKm : 0} km → Billable Travel Fee: R{quote.travelFee}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: CUSTOMER DETAILS */}
        {currentStep === 5 && (
          <div className="bg-[#f7f3ed] border border-[#bea683]/40 rounded-sm p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
            <h2 className="font-serif-heading text-2xl text-[#402615]">
              Step 5: Customer Contact & Event Info
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#7d5e3c] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={customerForm.fullName}
                  onChange={(e) => setCustomerForm({ ...customerForm, fullName: e.target.value })}
                  placeholder="e.g. Nadine Du Plessis"
                  className="w-full bg-white border border-[#bea683]/50 rounded-sm p-3 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#7d5e3c] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={customerForm.email}
                  onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                  placeholder="e.g. nadine@example.com"
                  className="w-full bg-white border border-[#bea683]/50 rounded-sm p-3 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#7d5e3c] mb-1">
                  Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  value={customerForm.phone}
                  onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                  placeholder="e.g. +27 83 123 4567"
                  className="w-full bg-white border border-[#bea683]/50 rounded-sm p-3 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#7d5e3c] mb-1">
                  Event / Occasion Description
                </label>
                <input
                  type="text"
                  value={customerForm.eventType}
                  onChange={(e) => setCustomerForm({ ...customerForm, eventType: e.target.value })}
                  placeholder="e.g. 8-Hour Wedding Celebration"
                  className="w-full bg-white border border-[#bea683]/50 rounded-sm p-3 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#7d5e3c] mb-1">
                Special Requests or Notes
              </label>
              <textarea
                rows={3}
                value={customerForm.notes}
                onChange={(e) => setCustomerForm({ ...customerForm, notes: e.target.value })}
                placeholder="Mention key family shots, styling preferences, or timeline notes..."
                className="w-full bg-white border border-[#bea683]/50 rounded-sm p-3 text-sm focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 6: SUMMARY & BREAKDOWN */}
        {currentStep === 6 && (
          <div className="bg-[#f7f3ed] border border-[#bea683]/40 rounded-sm p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
            <h2 className="font-serif-heading text-2xl text-[#402615]">
              Step 6: Booking Summary & Final Quote
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-sm border border-[#bea683]/30">
              <div className="space-y-3 text-xs">
                <h3 className="font-serif-heading text-xl text-[#402615] font-semibold border-b pb-2">
                  Shoot Overview
                </h3>
                <p>
                  <strong className="text-[#7d5e3c]">Service:</strong> {selectedService?.title}
                </p>
                <p>
                  <strong className="text-[#7d5e3c]">Package:</strong> {selectedPackage?.name} ({selectedPackage?.durationHours} Hours)
                </p>
                <p>
                  <strong className="text-[#7d5e3c]">Photographer:</strong> {selectedPhotographer?.name}
                </p>
                <p>
                  <strong className="text-[#7d5e3c]">Date & Time:</strong> {selectedDate} @ {selectedTimeSlot}
                </p>
                <p>
                  <strong className="text-[#7d5e3c]">Location:</strong> {locationForm.venueName}, {locationForm.suburb}, {locationForm.city}
                </p>
                <p>
                  <strong className="text-[#7d5e3c]">Client:</strong> {customerForm.fullName} ({customerForm.email})
                </p>
              </div>

              <div className="space-y-3 text-xs bg-[#f7f3ed] p-5 rounded-sm border border-[#bea683]/30">
                <h3 className="font-serif-heading text-xl text-[#402615] font-semibold border-b pb-2">
                  Financial Breakdown
                </h3>
                <div className="flex justify-between">
                  <span>Base Package Price:</span>
                  <span className="font-semibold">R{formatCurrency(quote.basePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Travel Fee ({locationForm.distanceFromBaseKm} km):</span>
                  <span className="font-semibold">R{quote.travelFee}</span>
                </div>
                <hr className="border-[#bea683]/30" />
                <div className="flex justify-between text-sm font-bold text-[#402615]">
                  <span>Total Quote:</span>
                  <span>R{formatCurrency(quote.subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-[#7d5e3c] font-bold pt-2 border-t border-[#bea683]/30">
                  <span>Required 50% Deposit:</span>
                  <span>R{formatCurrency(quote.depositRequired)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#878679]">
                  <span>Balance Due Before Shoot:</span>
                  <span>R{formatCurrency(quote.remainingBalance)}</span>
                </div>
              </div>
            </div>

            {/* Terms Acceptance Checkbox */}
            <div className="flex items-start gap-3 p-4 bg-[#d6c8b1]/30 border border-[#bea683]/40 rounded-sm text-xs">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-[#7d5e3c] rounded border-[#bea683]"
              />
              <label htmlFor="terms" className="text-[#402615] leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" target="_blank" className="underline font-semibold text-[#7d5e3c]">
                  Terms and Conditions
                </Link>
                , confirming that a 50% deposit secures the date and time, shoots beyond 20km Krugersdorp incur travel charges, and raw files remain property of the studio.
              </label>
            </div>
          </div>
        )}

        {/* STEP 7: CONFIRMATION & MOCK PAYMENT */}
        {currentStep === 7 && createdBooking && (
          <div className="bg-[#f7f3ed] border border-[#bea683]/40 rounded-sm p-8 text-center space-y-6 shadow-md animate-fade-in">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#7d5e3c] font-semibold">
                Reservation Pending Deposit
              </span>
              <h2 className="font-serif-heading text-3xl sm:text-4xl text-[#402615]">
                Booking Request Submitted!
              </h2>
              <p className="text-xs text-[#878679] max-w-md mx-auto">
                Your booking reference number is{" "}
                <strong className="text-[#402615] text-sm">{createdBooking.bookingReference}</strong>
              </p>
            </div>

            <div className="max-w-md mx-auto bg-white p-6 rounded-sm border border-[#bea683]/30 text-left space-y-3 text-xs">
              <div className="flex justify-between border-b pb-2 font-semibold text-[#402615]">
                <span>Summary:</span>
                <span>{createdBooking.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Time:</span>
                <span>{createdBooking.date} ({createdBooking.timeSlot})</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span>R{formatCurrency(createdBooking.subtotalZAR)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#7d5e3c] pt-2 border-t">
                <span>50% Deposit Due:</span>
                <span>R{formatCurrency(createdBooking.depositRequiredZAR)}</span>
              </div>
            </div>

            {/* Yoco Payment Simulation */}
            <div className="max-w-md mx-auto p-6 bg-[#402615] text-[#f7f3ed] rounded-sm space-y-4 shadow-xl border border-[#bea683]/40">
              <div className="flex items-center justify-between text-xs text-[#bea683]">
                <span className="font-semibold uppercase tracking-wider">Yoco Payment Gateway</span>
                <CreditCard className="w-5 h-5" />
              </div>
              <p className="text-xs text-[#d6c8b1]">
                Payment integration is simulated for frontend preview. In production, this connects to Yoco API.
              </p>

              <button
                onClick={() =>
                  alert(
                    `Simulated Yoco Payment Triggered!\nReference: ${createdBooking.bookingReference}\nDeposit: R${formatCurrency(createdBooking.depositRequiredZAR)}`
                  )
                }
                className="w-full bg-[#7d5e3c] hover:bg-[#bea683] hover:text-[#402615] text-white text-xs font-semibold uppercase tracking-widest py-3.5 rounded-sm transition-all shadow-md"
              >
                Pay R{formatCurrency(createdBooking.depositRequiredZAR)} with Yoco
              </button>

              <div className="text-[10px] text-[#878679]">
                Simulated test payment. No real credit card charge will occur.
              </div>
            </div>

            <div className="pt-4 flex items-center justify-center gap-4">
              <Link
                href="/client/dashboard"
                className="inline-flex items-center gap-2 border border-[#402615] text-[#402615] hover:bg-[#402615] hover:text-white text-xs font-semibold uppercase tracking-widest px-6 py-3 rounded-sm transition-all"
              >
                <span>Go to Client Portal</span>
              </Link>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls (Back / Next) */}
        {currentStep < 7 && (
          <div className="mt-8 flex items-center justify-between pt-6 border-t border-[#bea683]/30">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center gap-1.5 text-xs uppercase font-semibold text-[#7d5e3c] hover:text-[#402615] px-5 py-3 rounded-sm transition-all min-h-[44px] active:scale-95 border border-[#bea683]/30 bg-white/40"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNextStep}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 bg-[#7d5e3c] hover:bg-[#402615] text-white text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded-sm transition-all shadow-md min-h-[44px] active:scale-95"
            >
              <span>{currentStep === 6 ? "Confirm & Book" : "Next Step"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-xs">Loading booking wizard...</div>}>
      <BookingWizardContent />
    </Suspense>
  );
}
