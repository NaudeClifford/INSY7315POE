// API access layer for fetching services, pricing packages, team photographers, and availability slots
import { MOCK_SERVICES } from "@/data/services";
import { MOCK_PHOTOGRAPHERS } from "@/data/photographers";
import { Service, PackageOption } from "@/types/service";
import { Photographer } from "@/types/user";

// Fetch all available photography services
export async function getServices(): Promise<Service[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return MOCK_SERVICES;
}

// Fetch a single photography service by its unique URL slug or ID
export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return MOCK_SERVICES.find((s) => s.slug === slug || s.id === slug);
}

// Fetch photography package tiers filtered by service ID
export async function getPackages(serviceId?: string): Promise<PackageOption[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const allPackages = MOCK_SERVICES.flatMap((s) => s.packages);
  if (serviceId) {
    return allPackages.filter((p) => p.serviceId === serviceId);
  }
  return allPackages;
}

// Fetch team photographer profiles
export async function getPhotographers(): Promise<Photographer[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return MOCK_PHOTOGRAPHERS;
}

// Query photographer booking timeslot availability for a specific calendar date
export async function getAvailability(photographerId: string, date: string): Promise<string[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  const allSlots = ["09:00 - 11:00", "11:30 - 13:30", "14:00 - 17:00", "17:30 - 19:30"];
  if (date.endsWith("15") || date.endsWith("30")) {
    return ["09:00 - 11:00", "14:00 - 17:00"];
  }
  return allSlots;
}

