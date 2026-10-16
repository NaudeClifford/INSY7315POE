"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { initiateYocoCheckout } from "@/lib/yoco";
import {
  CreditCard,
  Lock,
  ShieldCheck,
  ExternalLink,
  X,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

interface YocoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  bookingReference: string;
  customerName: string;
  customerEmail: string;
  packageName: string;
  amountZAR: number;
  paymentType?: "deposit" | "balance" | "full";
  onSuccess?: () => void;
}

export function YocoPaymentModal({
  isOpen,
  onClose,
  bookingId,
  bookingReference,
  customerName,
  customerEmail,
  packageName,
  amountZAR,
  paymentType = "deposit"
}: YocoPaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const paymentTitle =
    paymentType === "balance"
      ? "Pay Remaining Balance (50%)"
      : paymentType === "full"
      ? "Pay in Full"
      : "Pay 50% Booking Deposit";

  const handleLaunchYocoCheckout = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await initiateYocoCheckout({
        bookingId,
        bookingReference,
        amountZAR,
        customerEmail,
        customerName,
        packageName,
        paymentType
      });

      if (!result.success || !result.redirectUrl) {
        setErrorMessage(result.error || "Failed to initialize Yoco payment session.");
        setIsLoading(false);
        return;
      }

      // Redirect customer to Yoco hosted checkout page
      window.location.href = result.redirectUrl;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error connecting to Yoco gateway";
      setErrorMessage(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF8F5] dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-lg max-w-lg w-full overflow-hidden shadow-2xl relative text-[#2C2420] dark:text-[#FAF8F5]">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          aria-label="Close payment modal"
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-[#2C2420] text-[#FAF8F5] p-6 border-b border-[#C5A880]/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
              Camryn Burger Photography • Secure Checkout
            </span>
            <div className="flex items-center gap-1.5 bg-[#C5A880]/20 text-[#C5A880] px-2 py-0.5 rounded text-[10px] font-semibold uppercase">
              <ShieldCheck className="w-3 h-3" />
              <span>Yoco Gateway</span>
            </div>
          </div>
          <h2 className="font-serif-heading text-2xl font-normal mt-1">{paymentTitle}</h2>
          <p className="text-xs text-[#EAE3D9]/75 mt-0.5">
            Booking Ref: <strong className="text-[#C5A880]">{bookingReference}</strong>
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {/* Order Summary Card */}
          <div className="bg-white dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] rounded p-4 space-y-2.5">
            <div className="flex justify-between items-center border-b border-[#EAE3D9] dark:border-[#3A332C] pb-2">
              <span className="text-neutral-500">Service Package:</span>
              <strong className="text-sm font-semibold">{packageName}</strong>
            </div>
            <div className="flex justify-between items-center border-b border-[#EAE3D9] dark:border-[#3A332C] pb-2">
              <span className="text-neutral-500">Client Name:</span>
              <span className="font-medium">{customerName}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                Total Due Now:
              </span>
              <span className="text-xl font-serif-heading font-bold text-[#2E5E43] dark:text-emerald-400">
                R {formatCurrency(amountZAR)}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Primary Action Button */}
          <div className="pt-1">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleLaunchYocoCheckout}
              className="w-full bg-[#2E5E43] hover:bg-[#254d37] text-white py-3.5 px-4 rounded font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-60 active:scale-98"
            >
              <CreditCard className="w-4 h-4" />
              <span>
                {isLoading
                  ? "Connecting to Yoco..."
                  : `Pay R ${formatCurrency(amountZAR)} with Yoco`}
              </span>
              <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-75" />
            </button>
          </div>

          {/* Security Assurance */}
          <div className="flex items-center justify-center gap-4 pt-3 text-[10px] text-neutral-500 border-t border-[#EAE3D9] dark:border-[#3A332C]">
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#2E5E43]" />
              <span>256-Bit SSL Encrypted</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#C5A880]" />
              <span>PCI-DSS Level 1 Certified</span>
            </div>
            <span>•</span>
            <span>South Africa (ZAR)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
