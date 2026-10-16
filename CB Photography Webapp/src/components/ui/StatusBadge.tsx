import React from "react";
import { BookingStatus, PaymentStatus } from "@/types/booking";

interface StatusBadgeProps {
  status: BookingStatus | PaymentStatus | "editing" | "ready" | "sent" | "expired" | string;
  type?: "booking" | "payment" | "gallery";
}

// Displays color-coded pills for shoot status, payment status, and gallery delivery
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let styleClasses = "bg-neutral-500/20 text-neutral-400 border-neutral-500/30";

  // Pick suitable theme colors based on state
  if (status === "Confirmed" || status === "Paid in Full" || status === "Fully Paid" || status === "ready") {
    styleClasses = "bg-[#2E5E43]/20 text-[#2E5E43] dark:text-emerald-300 border-[#2E5E43]/30";
  } else if (status === "Pending" || status === "Deposit Paid" || status === "editing") {
    styleClasses = "bg-[#C5A880]/20 text-[#C5A880] border-[#C5A880]/40";
  } else if (status === "Completed" || status === "sent") {
    styleClasses = "bg-[#1D2D44]/20 text-sky-400 border-[#1D2D44]/40";
  } else if (status === "Cancelled" || status === "Unpaid" || status === "expired") {
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
