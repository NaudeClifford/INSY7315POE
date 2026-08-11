// Type definitions for system user roles (Client, Photographer, Admin)
export type UserRole = "client" | "photographer" | "admin";

// Base user account interface
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

// Client account interface
export interface Client extends User {
  role: "client";
  totalBookings: number;
  preferredLocations?: string[];
}

// Team photographer account interface
export interface Photographer extends User {
  role: "photographer";
  bio: string;
  specialties: string[];
  rating: number;
  completedShoots: number;
  availableDays: string[];
}

