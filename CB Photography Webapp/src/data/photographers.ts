// Studio photographers mock dataset containing team profiles and specialties
import { Photographer } from "@/types/user";

// Team of lead and associate photographers assigned to client shoots
export const MOCK_PHOTOGRAPHERS: Photographer[] = [
  {
    id: "photo-camryn",
    name: "Camryn Burger",
    email: "camryn@cbphotography.co.za",
    phone: "+27 123 345 7890",
    role: "photographer",
    bio: "Founder & Creative Director of Camryn Burger Photography. Over 4 years of experience documenting weddings, matric dances, and high-profile events across Gauteng and nationwide.",
    specialties: ["Weddings", "Matric Dances", "Couples", "Editorial Portraits"],
    rating: 4.98,
    completedShoots: 340,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    avatarUrl: "place holder 1",
    createdAt: "2023-01-15"
  },
  {
    id: "photo-associate",
    name: "Lethabo Ndlovu",
    email: "lethabo@cbphotography.co.za",
    phone: "+27 71 987 6543",
    role: "photographer",
    bio: "Senior Associate Photographer specializing in corporate functions, outdoor graduations, and vibrant party celebrations.",
    specialties: ["Corporate Events", "Graduations", "Parties", "Lifestyle"],
    rating: 4.92,
    completedShoots: 160,
    availableDays: ["Tue", "Wed", "Thu", "Fri", "Sat"],
    avatarUrl: "place holder 2",
    createdAt: "2024-03-01"
  }
];
