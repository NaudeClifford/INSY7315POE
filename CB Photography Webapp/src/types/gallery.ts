// Portfolio filter categories matching mobile specification
export type PortfolioCategory =
  | "All"
  | "Weddings"
  | "Portraits"
  | "Couples"
  | "Matric Dance"
  | "Corporate"
  | "Commercial"
  | "Solo"
  | "Graduations"
  | "Events"
  | "Group";

export interface ExifData {
  cameraBody: string;      // e.g. "Sony A7 IV" or "Canon EOS R5"
  lens: string;            // e.g. "Sony FE 85mm f/1.4 GM"
  focalLength: string;     // e.g. "85mm"
  aperture: string;        // e.g. "f/1.8"
  shutterSpeed: string;    // e.g. "1/500s"
  iso: string;             // e.g. "ISO 100"
}

// Photo card representation in public gallery & lightbox
export interface GalleryItem {
  id: string;
  title: string;
  category: PortfolioCategory;
  imageUrl: string;
  aspectRatio: "portrait" | "landscape" | "square";
  location: string;
  date: string;
  photographer: string;
  description?: string;
  serviceSlug?: string;    // Direct link to booking this service
  exif?: ExifData;
}

// Workflow state for digital photo deliveries
export type GalleryLinkStatus = "editing" | "ready" | "sent" | "expired";

// External delivery link (Pixieset, SmugMug) attached to completed shoots
export interface GalleryLink {
  id: string;
  bookingId: string;
  clientId: string;
  externalUrl: string;
  status: GalleryLinkStatus;
  publishedAt?: string;
  notes?: string;
}
