export type UserRole = "Client" | "Photographer" | "Studio Admin" | "Owner / Photographer" | "client" | "photographer" | "admin" | string;

export interface UserProfile {
  id: string;          // User UID from Firebase Auth
  name: string;        // Full name
  email: string;       // Email address
  phone: string;       // Contact phone number (e.g. "+27 82 123 4567")
  role: "Client" | "Photographer" | "Studio Admin" | "Owner / Photographer" | string;
  createdAt: string;   // ISO Date string (e.g. "2026-09-22")
}

export interface PhotographerProfile {
  id: string;
  name: string;
  email: string;
  specialties: string[];            // e.g. ["Weddings", "Matric Dance", "Portraits"]
  isLead: boolean;                  // true = Lead, false = Associate
  activeShoots: number;
}

// Backward-compatible Photographer representation for UI listing
export interface Photographer extends UserProfile {
  isLead?: boolean;
  activeShoots?: number;
  bio?: string;
  specialties: string[];
  rating?: number;
  completedShoots?: number;
  availableDays?: string[];
  avatarUrl?: string;
  instagram?: string;
}

export interface Client extends UserProfile {
  totalBookings?: number;
  preferredLocations?: string[];
}
