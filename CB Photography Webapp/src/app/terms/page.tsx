"use client";

// Terms & Conditions legal policy page covering deposits, travel rates, image copyright, and cancellation rules
import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7f3ed] text-[#402615]">
      <Navbar />


      {/* Header Banner */}
      <section className="bg-[#402615] text-[#f7f3ed] pt-32 pb-20 border-b border-[#bea683]/30 text-center relative">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-[#bea683] font-semibold">
            Legal & Policy Guidelines
          </span>
          <h1 className="font-serif-heading text-4xl sm:text-6xl font-normal">
            Terms & Conditions
          </h1>
          <p className="text-xs sm:text-sm text-[#d6c8b1] max-w-xl mx-auto font-light leading-relaxed">
            Please read our standard studio terms regarding deposits, cancellations, travel rates, and image delivery policies.
          </p>
        </div>
      </section>

      {/* Informational Production Warning */}
      <section className="bg-amber-900/10 border-b border-amber-600/30 py-4">
        <div className="max-w-4xl mx-auto px-4 flex items-start gap-3 text-xs text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-semibold uppercase tracking-wider text-amber-800">
              Informational Notice:
            </strong>{" "}
            The policies below represent standard operating rules for Camryn Burger Photography / The Union Lab. This document is provided for informational purposes on the frontend and should be formally reviewed by legal counsel prior to production use.
          </div>
        </div>
      </section>

      {/* Terms Content Body */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 flex-1 text-xs sm:text-sm text-[#402615] leading-relaxed">
        {/* Section 1: Payment & Deposit */}
        <div className="bg-white p-8 rounded-sm border border-[#bea683]/40 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-[#bea683]/20 pb-3">
            <FileText className="w-5 h-5 text-[#7d5e3c]" />
            <h2 className="font-serif-heading text-2xl text-[#402615] font-semibold">
              1. Payment and Deposit Terms
            </h2>
          </div>
          <ul className="space-y-2 list-disc pl-5 text-[#878679]">
            <li>
              A non-refundable <strong className="text-[#402615]">50% deposit</strong> is required to secure your shoot date and time on the photographer’s calendar.
            </li>
            <li>
              The remaining <strong className="text-[#402615]">50% balance</strong> must be paid in full prior to the start of the photography session or event.
            </li>
            <li>
              Payment can be made via our online Yoco payment portal, direct electronic funds transfer (EFT), or pre-arranged cash.
            </li>
          </ul>
        </div>

        {/* Section 2: Postponement & Cancellation */}
        <div className="bg-white p-8 rounded-sm border border-[#bea683]/40 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-[#bea683]/20 pb-3">
            <FileText className="w-5 h-5 text-[#7d5e3c]" />
            <h2 className="font-serif-heading text-2xl text-[#402615] font-semibold">
              2. Postponement and Cancellation Policy
            </h2>
          </div>
          <ul className="space-y-2 list-disc pl-5 text-[#878679]">
            <li>
              <strong className="text-[#402615]">First Postponement:</strong> One free shoot postponement is permitted with at least 7 days' advance written notice (excluding extreme weather or medical emergencies).
            </li>
            <li>
              <strong className="text-[#402615]">Second Postponement:</strong> A second postponement request incurs a <strong className="text-[#402615]">25% surcharge</strong> on the total package price.
            </li>
            <li>
              <strong className="text-[#402615]">Late Cancellation:</strong> Cancellations made within <strong className="text-[#402615]">5 working days</strong> of the scheduled shoot date may incur a 100% cancellation fee or total loss of the deposit.
            </li>
          </ul>
        </div>

        {/* Section 3: Travel Fees */}
        <div className="bg-white p-8 rounded-sm border border-[#bea683]/40 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-[#bea683]/20 pb-3">
            <FileText className="w-5 h-5 text-[#7d5e3c]" />
            <h2 className="font-serif-heading text-2xl text-[#402615] font-semibold">
              3. Travel Rates and Calculation
            </h2>
          </div>
          <ul className="space-y-2 list-disc pl-5 text-[#878679]">
            <li>
              Shoots located within a <strong className="text-[#402615]">20 km radius of Krugersdorp</strong> carry no travel fee.
            </li>
            <li>
              Travel beyond the 20 km radius is charged at <strong className="text-[#402615]">R5.00 per kilometre</strong> for total round-trip distance traveled.
            </li>
            <li>
              Destination shoots requiring overnight accommodation or toll fees will be quoted separately.
            </li>
          </ul>
        </div>

        {/* Section 4: Deliverables & Turnaround */}
        <div className="bg-white p-8 rounded-sm border border-[#bea683]/40 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-[#bea683]/20 pb-3">
            <FileText className="w-5 h-5 text-[#7d5e3c]" />
            <h2 className="font-serif-heading text-2xl text-[#402615] font-semibold">
              4. Deliverables and Turnaround Time
            </h2>
          </div>
          <ul className="space-y-2 list-disc pl-5 text-[#878679]">
            <li>
              Final high-resolution edited images are delivered digitally via a private online gallery within <strong className="text-[#402615]">14 working days</strong> from the shoot date.
            </li>
            <li>
              Additional edited photographs beyond package limits can be requested at <strong className="text-[#402615]">R5.00 per edited image</strong>.
            </li>
          </ul>
        </div>

        {/* Section 5: Image Retention & Raw Files */}
        <div className="bg-white p-8 rounded-sm border border-[#bea683]/40 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-[#bea683]/20 pb-3">
            <FileText className="w-5 h-5 text-[#7d5e3c]" />
            <h2 className="font-serif-heading text-2xl text-[#402615] font-semibold">
              5. Image Retention and Raw Files Policy
            </h2>
          </div>
          <ul className="space-y-2 list-disc pl-5 text-[#878679]">
            <li>
              <strong className="text-[#402615]">Retention Period:</strong> Raw camera files and final edited images are stored in digital archives for <strong className="text-[#402615]">3 months</strong> from the delivery date.
            </li>
            <li>
              Images may be permanently removed from backup servers after this 3-month period if not requested by the client.
            </li>
            <li>
              <strong className="text-[#402615]">Raw Files Withholding:</strong> Unedited raw files represent incomplete creative work and remain the intellectual property of the photographer. Only final retouched images will be delivered.
            </li>
          </ul>
        </div>

        {/* Back link */}
        <div className="pt-4 text-center">
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 bg-[#7d5e3c] text-white hover:bg-[#402615] text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded-sm transition-all shadow-md"
          >
            <span>Return to Booking Page</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
