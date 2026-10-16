import { GalleryItem, GalleryLink } from "@/types/gallery";
import { db, isFirebaseConfigured, cleanForFirestore } from "@/lib/firebase";
import { collection, doc, getDocs, getDoc, setDoc, query, where } from "firebase/firestore";

// Saves or updates external gallery link (like Pixieset) directly in Cloud Firestore
export async function saveGalleryLink(
  bookingId: string,
  externalUrl: string,
  clientId = "client-user"
): Promise<GalleryLink> {
  const linkId = `gl-${Date.now()}`;
  const newLink: GalleryLink = {
    id: linkId,
    bookingId,
    clientId,
    externalUrl,
    status: "ready",
    publishedAt: new Date().toISOString().split("T")[0]
  };

  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firestore is not configured. Unable to save gallery link.");
  }

  await setDoc(doc(db, "gallery_links", bookingId), cleanForFirestore(newLink));
  return newLink;
}

// Retrieves gallery link directly from Cloud Firestore
export async function getGalleryLink(bookingId: string): Promise<GalleryLink | null> {
  if (!isFirebaseConfigured() || !db || !bookingId) return null;

  try {
    const snap = await getDoc(doc(db, "gallery_links", bookingId));
    if (snap.exists()) {
      return snap.data() as GalleryLink;
    }
  } catch (err) {
    console.error("Firestore getGalleryLink failed:", err);
  }

  return null;
}

// Fetches public portfolio items directly from Cloud Firestore
export async function getPortfolioItems(category?: string): Promise<GalleryItem[]> {
  if (!isFirebaseConfigured() || !db) return [];

  try {
    const portfolioCol = collection(db, "portfolio");
    const snap = await getDocs(portfolioCol);
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryItem));

    if (!category || category === "All") {
      return items;
    }

    const target = category.toLowerCase().trim();

    return items.filter((item) => {
      const itemCat = (item.category || "").toLowerCase().trim();

      // Direct exact match
      if (itemCat === target) return true;

      // Portraits matches Solo, Portraits, Portrait, Graduations
      if (target === "portraits" || target === "portrait") {
        return (
          itemCat.includes("portrait") ||
          itemCat.includes("solo") ||
          itemCat.includes("grad")
        );
      }

      // Couples matches Couples, Couple
      if (target === "couples" || target === "couple") {
        return itemCat.includes("couple");
      }

      // Matric Dance matches Matric Dances, Matric Dance, Matric
      if (target.includes("matric")) {
        return itemCat.includes("matric");
      }

      // Corporate matches Corporate, Commercial, Events
      if (target === "corporate" || target === "commercial") {
        return (
          itemCat.includes("corp") ||
          itemCat.includes("commercial") ||
          itemCat.includes("event")
        );
      }

      // Weddings matches Wedding, Weddings
      if (target.includes("wedding")) {
        return itemCat.includes("wed");
      }

      return itemCat.includes(target) || target.includes(itemCat);
    });
  } catch (err) {
    console.error("Firestore getPortfolioItems failed:", err);
    return [];
  }
}
