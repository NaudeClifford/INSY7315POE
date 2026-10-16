export type ServiceCategory = 
  | "matric-dance"
  | "matric-dances"
  | "weddings" 
  | "couples" 
  | "graduations" 
  | "corporate" 
  | "portraits"
  | "events"
  | "lifestyle"
  | string;

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
  imageUrl?: string;
}

export interface ServiceAddon {
  id: string;
  name: string;
  description: string;
  priceZAR: number;
}

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

export interface Testimonial {
  id: string;
  clientName: string;
  roleOrEvent: string;
  quote: string;
  rating: number;
  imageUrl?: string;
  date: string;
}

