// API layer for client digital gallery links (e.g. Pixieset) and portfolio retrieval
import { MOCK_PORTFOLIO } from "@/data/portfolio";
import { GalleryItem, GalleryLink } from "@/types/gallery";

// In-memory store for client photo gallery delivery links
const galleryLinksStore: Record<string, GalleryLink> = {
  "bk-1002": {
    id: "gl-1002",
    bookingId: "bk-1002",
    clientId: "client-sarah",
    externalUrl: "https://cbphotography.pixieset.com/liamsarahmatric2026/",
    status: "ready",
    publishedAt: "2026-08-01",
    notes: "High-resolution edited gallery with print access enabled."
  }
};

// Save a client's published gallery link to store
export async function saveGalleryLink(bookingId: string, externalUrl: string, clientId = "client-user"): Promise<GalleryLink> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const newLink: GalleryLink = {
    id: `gl-${Date.now()}`,
    bookingId,
    clientId,
    externalUrl,
    status: "ready",
    publishedAt: new Date().toISOString().split("T")[0]
  };
  galleryLinksStore[bookingId] = newLink;
  return newLink;
}

// Retrieve published gallery link for a given booking ID
export async function getGalleryLink(bookingId: string): Promise<GalleryLink | null> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return galleryLinksStore[bookingId] || null;
}

// Fetch portfolio items filtered by category tab
export async function getPortfolioItems(category?: string): Promise<GalleryItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  if (!category || category === "All") {
    return MOCK_PORTFOLIO;
  }
  return MOCK_PORTFOLIO.filter((item) => item.category.toLowerCase() === category.toLowerCase());
}

