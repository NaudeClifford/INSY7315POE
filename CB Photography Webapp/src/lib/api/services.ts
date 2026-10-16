import { Service, PackageOption, Testimonial } from "@/types/service";
import { Photographer } from "@/types/user";
import { db, isFirebaseConfigured, cleanForFirestore } from "@/lib/firebase";
import { collection, getDocs, query, where, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

// Returns all offered photography services directly from Cloud Firestore
export async function getServices(): Promise<Service[]> {
  if (!isFirebaseConfigured() || !db) return [];

  try {
    const snap = await getDocs(collection(db, "services"));
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Service));
    }
  } catch (err) {
    console.error("Firestore getServices failed:", err);
  }

  return [];
}

// Finds a single service by URL slug (e.g., "weddings") directly from Cloud Firestore
export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  if (!isFirebaseConfigured() || !db || !slug) return undefined;

  try {
    const directDoc = await getDoc(doc(db, "services", slug));
    if (directDoc.exists()) {
      return { id: directDoc.id, ...directDoc.data() } as Service;
    }

    const q = query(collection(db, "services"), where("slug", "==", slug));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const d = snap.docs[0];
      return { id: d.id, ...d.data() } as Service;
    }
  } catch (err) {
    console.error(`Firestore getServiceBySlug(${slug}) failed:`, err);
  }

  return undefined;
}

// Returns pricing packages, optionally filtered by parent service ID
export async function getPackages(serviceId?: string): Promise<PackageOption[]> {
  const allServices = await getServices();
  const allPackages = allServices.flatMap((s) => s.packages || []);
  if (serviceId) {
    return allPackages.filter((p) => p.serviceId === serviceId);
  }
  return allPackages;
}

// Adjust price of a specific package directly in Cloud Firestore
export async function updatePackagePrice(
  packageId: string,
  newPriceZAR: number
): Promise<PackageOption | null> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firestore is not configured. Unable to update package price.");
  }

  const services = await getServices();
  let updatedPackage: PackageOption | null = null;
  let targetService: Service | null = null;

  for (const s of services) {
    const pkgIndex = s.packages?.findIndex((p) => p.id === packageId) ?? -1;
    if (pkgIndex !== -1) {
      s.packages[pkgIndex] = {
        ...s.packages[pkgIndex],
        startingPriceZAR: Math.max(0, newPriceZAR)
      };
      updatedPackage = s.packages[pkgIndex];

      if (s.packages.length > 0) {
        s.startingPriceZAR = Math.min(...s.packages.map((p) => p.startingPriceZAR));
      }
      targetService = s;
      break;
    }
  }

  if (updatedPackage && targetService) {
    await setDoc(doc(db, "services", targetService.id), cleanForFirestore(targetService), { merge: true });
  }

  return updatedPackage;
}

// Update full package details directly in Cloud Firestore
export async function updatePackage(
  serviceId: string,
  updatedPackage: PackageOption
): Promise<PackageOption> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firestore is not configured. Unable to update package.");
  }

  const services = await getServices();
  let targetService = services.find((s) => s.id === serviceId);

  if (!targetService) {
    targetService = services.find((s) => s.packages?.some((p) => p.id === updatedPackage.id));
  }

  if (!targetService) {
    throw new Error(`Target service not found for package ${updatedPackage.id}`);
  }

  if (!targetService.packages) targetService.packages = [];
  const pkgIdx = targetService.packages.findIndex((p) => p.id === updatedPackage.id);
  if (pkgIdx !== -1) {
    targetService.packages[pkgIdx] = { ...updatedPackage, serviceId: targetService.id };
  } else {
    targetService.packages.push({ ...updatedPackage, serviceId: targetService.id });
  }

  if (targetService.packages.length > 0) {
    targetService.startingPriceZAR = Math.min(...targetService.packages.map((p) => p.startingPriceZAR));
  }

  await setDoc(doc(db, "services", targetService.id), cleanForFirestore(targetService), { merge: true });
  return updatedPackage;
}

// Add a new package to an existing service directly in Cloud Firestore
export async function addPackage(
  serviceId: string,
  packageData: Omit<PackageOption, "id" | "serviceId"> & { id?: string }
): Promise<PackageOption> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firestore is not configured. Unable to add package.");
  }

  const services = await getServices();
  const targetService = services.find((s) => s.id === serviceId || s.slug === serviceId);

  if (!targetService) {
    throw new Error(`Service not found for id/slug: ${serviceId}`);
  }

  const newPackage: PackageOption = {
    id: packageData.id || `pkg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    serviceId: targetService.id,
    name: packageData.name,
    tagline: packageData.tagline,
    durationHours: packageData.durationHours,
    editedImagesCount: packageData.editedImagesCount,
    startingPriceZAR: packageData.startingPriceZAR,
    features: packageData.features,
    popular: packageData.popular || false,
    imageUrl: packageData.imageUrl || undefined
  };

  if (!targetService.packages) {
    targetService.packages = [];
  }

  targetService.packages.push(newPackage);
  targetService.startingPriceZAR = Math.min(...targetService.packages.map((p) => p.startingPriceZAR));

  await setDoc(doc(db, "services", targetService.id), cleanForFirestore(targetService), { merge: true });
  return newPackage;
}

// Delete a package from a service directly in Cloud Firestore
export async function deletePackage(serviceId: string, packageId: string): Promise<boolean> {
  if (!isFirebaseConfigured() || !db) return false;

  const services = await getServices();
  const targetService = services.find(
    (s) => s.id === serviceId || s.packages?.some((p) => p.id === packageId)
  );

  if (!targetService) return false;

  targetService.packages = (targetService.packages || []).filter((p) => p.id !== packageId);
  if (targetService.packages.length > 0) {
    targetService.startingPriceZAR = Math.min(...targetService.packages.map((p) => p.startingPriceZAR));
  }

  await setDoc(doc(db, "services", targetService.id), cleanForFirestore(targetService), { merge: true });
  return true;
}

// Update service category details directly in Cloud Firestore
export async function updateService(serviceData: Service): Promise<Service> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firestore is not configured. Unable to update service.");
  }

  await setDoc(doc(db, "services", serviceData.id), cleanForFirestore(serviceData), { merge: true });
  return serviceData;
}

// Create a new photography service offering category directly in Cloud Firestore
export async function createService(serviceData: Service): Promise<Service> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firestore is not configured. Unable to create service.");
  }

  await setDoc(doc(db, "services", serviceData.id), cleanForFirestore(serviceData));
  return serviceData;
}

// Returns the team of photographers directly from Cloud Firestore
export async function getPhotographers(): Promise<Photographer[]> {
  if (!isFirebaseConfigured() || !db) return [];

  try {
    const snap = await getDocs(collection(db, "photographers"));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Photographer));
  } catch (err) {
    console.error("Firestore getPhotographers failed:", err);
    return [];
  }
}

// Update existing photographer profile directly in Cloud Firestore
export async function updatePhotographer(photoData: Photographer): Promise<Photographer> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firestore is not configured. Unable to update photographer.");
  }

  const cleaned = cleanForFirestore(photoData);
  await setDoc(doc(db, "photographers", photoData.id), cleaned, { merge: true });
  return photoData;
}

// Add a new photographer to the roster directly in Cloud Firestore
export async function addPhotographer(photoData: Photographer): Promise<Photographer> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firestore is not configured. Unable to add photographer.");
  }

  const cleaned = cleanForFirestore(photoData);
  await setDoc(doc(db, "photographers", photoData.id), cleaned);
  return photoData;
}

// Remove a photographer from the team directly in Cloud Firestore
export async function deletePhotographer(id: string): Promise<boolean> {
  if (!isFirebaseConfigured() || !db) return false;

  try {
    await deleteDoc(doc(db, "photographers", id));
    return true;
  } catch (err) {
    console.error("Firestore deletePhotographer failed:", err);
    return false;
  }
}

// Fetches client reviews and testimonials directly from Cloud Firestore
export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isFirebaseConfigured() || !db) return [];

  try {
    const snap = await getDocs(collection(db, "testimonials"));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Testimonial));
  } catch (err) {
    console.error("Firestore getTestimonials failed:", err);
    return [];
  }
}
