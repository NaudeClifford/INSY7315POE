"use client";

// Reusable alert notification popup toast component with auto-dismiss timeout
import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

// Structure definition for a toast notification
export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  // Auto-dismiss toast notification after 4.5 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  // Don't render toast if no message object exists
  if (!toast) return null;

  // Icon mapping by toast type
  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-[#bea683] shrink-0" />,
  };

  return (
    /* Fixed bottom-right pop-up toast container */
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#402615] text-[#f7f3ed] border border-[#bea683]/50 rounded-md shadow-2xl p-4 flex items-start gap-3 animate-fade-in">
      {iconMap[toast.type]}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#bea683]">
          {toast.title}
        </h4>
        <p className="text-xs text-[#d6c8b1] mt-0.5 leading-relaxed">{toast.message}</p>
      </div>
      {/* Manual close button */}
      <button
        onClick={onClose}
        className="text-[#878679] hover:text-white p-1 rounded-sm focus:outline-none"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

