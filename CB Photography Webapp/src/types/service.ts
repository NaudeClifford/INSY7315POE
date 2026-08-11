// Type definitions for photography service offerings, package tiers, and add-on options
export type ServiceCategory = 
  | "weddings" 
  | "matric-dances" 
  | "graduations" 
  | "corporate" 
  | "couples" 
  | "events"
  | "lifestyle";

// Individual package option tier within a photography service
export interface PackageOption {
  id: string;
  serviceId: string;
  name: string;
  tagline: string;
  durationHours: number;
  editedImagesCount: number;
  startingPriceZAR: number;
  features: string[];
  popular?: boolean;
}

// Optional service add-on (e.g. extra hours, drone footage, photo album)
export interface ServiceAddon {
  id: string;
  name: string;
  description: string;
  priceZAR: number;
}

// Service offering master interface
export interface Service {
  id: string;
  slug: ServiceCategory;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  startingPriceZAR: number;
  approxDuration: string;
  editedImagesSummary: string;
  inclusions: string[];
  packages: PackageOption[];
  addons?: ServiceAddon[];
}

