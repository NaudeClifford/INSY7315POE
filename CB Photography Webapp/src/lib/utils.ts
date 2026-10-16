import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Merges class names cleanly with Tailwind merge support
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formats numbers with comma thousands separators (e.g. 12,500)
export function formatCurrency(amount: number): string {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
