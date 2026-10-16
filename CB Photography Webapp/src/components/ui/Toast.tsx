"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message: string;
}

export interface ToastProps {
  toast?: ToastMessage | null;
  message?: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, message, onClose }) => {
  const activeToast = toast || message;

  useEffect(() => {
    if (!activeToast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [activeToast, onClose]);

  if (!activeToast) return null;

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-[#C5A880] shrink-0" />,
  };

  return (
    <aside
      role={activeToast.type === "error" ? "alert" : "status"}
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#2C2420] text-[#FAF8F5] border border-[#C5A880]/50 rounded-md shadow-2xl p-4 flex items-start gap-3 animate-fade-in"
    >
      {iconMap[activeToast.type]}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C5A880]">
          {activeToast.title}
        </h4>
        <p className="text-xs text-[#EAE3D9] mt-0.5 leading-relaxed">{activeToast.message}</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="text-neutral-400 hover:text-white p-1 rounded-sm focus:outline-none cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </aside>
  );
};
