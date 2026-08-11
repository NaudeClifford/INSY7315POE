import React from "react";
import { BookingStatus, PaymentStatus } from "@/types/booking";

// Props interface for StatusBadge status value and context type
interface StatusBadgeProps {
  status: BookingStatus | PaymentStatus | "editing" | "ready" | "sent" | "expired";
  type?: "booking" | "payment" | "gallery";
}

// Visual status pill badge component for bookings, payments, and photoshoots
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Default muted grey badge style
  let styleClasses = "bg-[#878679]/20 text-[#878679] border-[#878679]/30";

  // Match status state to appropriate color badge style
  if (status === "Confirmed" || status === "Fully Paid" || status === "ready") {
    // Green success theme for confirmed/paid states
    styleClasses = "bg-emerald-900/30 text-emerald-300 border-emerald-500/30";
  } else if (status === "Pending" || status === "Deposit Paid" || status === "editing") {
    // Warm gold theme for pending/in-progress states
    styleClasses = "bg-[#bea683]/20 text-[#bea683] border-[#bea683]/40";
  } else if (status === "Completed" || status === "sent") {
    // Warm brown theme for finalized states
    styleClasses = "bg-[#7d5e3c]/30 text-[#d6c8b1] border-[#7d5e3c]/50";
  } else if (status === "Cancelled" || status === "Unpaid" || status === "expired") {
    // Rose red theme for cancelled/unpaid/expired states
    styleClasses = "bg-rose-900/30 text-rose-300 border-rose-500/30";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase border ${styleClasses}`}
    >
      {status}
    </span>
  );
};

