// Type definitions for portfolio categories, gallery items, and delivered client photo links
export type PortfolioCategory = 
  | "All" 
  | "Solo"
  | "Couples" 
  | "Graduations" 
  | "Events" 
  | "Group"
  | "Weddings" 
  | "Matric Dances" 
  | "Corporate" 
  | "Lifestyle";

// Single photo entry in the public portfolio gallery
export interface GalleryItem {
  id: string;
  title: string;
  category: PortfolioCategory;
  imageUrl: string;
  aspectRatio: "portrait" | "landscape" | "square";
  location: string;
  date: string;
  photographer: string;
}

export type GalleryLinkStatus = "editing" | "ready" | "sent" | "expired";

// Client digital photo gallery link delivery record
export interface GalleryLink {
  id: string;
  bookingId: string;
  clientId: string;
  externalUrl: string;
  status: GalleryLinkStatus;
  publishedAt?: string;
  notes?: string;
}

