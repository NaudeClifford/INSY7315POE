// Shared utility functions for style merging and number formatting
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge dynamic Tailwind CSS class names without class duplication or conflicts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format numbers into ZAR currency format with comma separators (e.g. 10,500)
export function formatCurrency(amount: number): string {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

