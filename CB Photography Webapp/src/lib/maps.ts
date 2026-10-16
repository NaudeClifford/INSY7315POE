// Google Maps & Studio Base Geolocation configuration
export const GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyAtknApNejNg5JtZM_GTB-oujhAF_AR6lc";

// Studio Base GPS in Krugersdorp, Gauteng
export const STUDIO_BASE = {
  name: "Camryn Burger Photography Studio Base",
  address: "Krugersdorp, Gauteng, South Africa",
  lat: -26.1015,
  lng: 27.7766,
  complimentaryRadiusKm: 20.0,
  travelRatePerKmZAR: 5.0,
};

export interface PredefinedVenue {
  id: string;
  name: string;
  suburb: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  isFreeZone: boolean;
  notes?: string;
}

// Popular Gauteng Predefined Venues preloaded into booking wizard
export const PREDEFINED_VENUES: PredefinedVenue[] = [
  {
    id: "venue-sisulu",
    name: "Walter Sisulu National Botanical Garden",
    suburb: "Roodepoort",
    city: "Johannesburg",
    province: "Gauteng",
    latitude: -26.0883,
    longitude: 27.8447,
    distanceKm: 8.0,
    isFreeZone: true,
    notes: "Cascading waterfall, lush indigenous gardens & golden evening light."
  },
  {
    id: "venue-maropeng",
    name: "Cradle of Humankind (Maropeng)",
    suburb: "Krugersdorp",
    city: "West Rand",
    province: "Gauteng",
    latitude: -25.9678,
    longitude: 27.6975,
    distanceKm: 17.0,
    isFreeZone: true,
    notes: "Rolling highveld grasslands, expansive horizons, and dramatic sunsets."
  },
  {
    id: "venue-kloofendal",
    name: "Kloofendal Nature Reserve",
    suburb: "Roodepoort",
    city: "Johannesburg",
    province: "Gauteng",
    latitude: -26.1302,
    longitude: 27.8732,
    distanceKm: 11.0,
    isFreeZone: true,
    notes: "Scenic koppies, tranquil dams, and wooded trail paths."
  },
  {
    id: "venue-greenhouse",
    name: "The Greenhouse Café",
    suburb: "Pretoria East",
    city: "Tshwane",
    province: "Gauteng",
    latitude: -25.7925,
    longitude: 28.4069,
    distanceKm: 73.0,
    isFreeZone: false,
    notes: "Architectural glasshouse surrounded by natural bushveld and open sky."
  },
  {
    id: "venue-rosebank",
    name: "Rosebank Studio & Rooftops",
    suburb: "Rosebank",
    city: "Johannesburg",
    province: "Gauteng",
    latitude: -26.1467,
    longitude: 28.0436,
    distanceKm: 29.0,
    isFreeZone: false,
    notes: "Urban chic skyline, modern concrete textures, and architectural light."
  }
];

// Haversine formula to compute great-circle distance between two GPS points in Kilometres
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

// Computes billable distance and travel fee from Krugersdorp studio base
export function calculateTravelFee(distanceKm: number): {
  billableKm: number;
  travelFeeZAR: number;
  isComplimentary: boolean;
} {
  const freeRadius = STUDIO_BASE.complimentaryRadiusKm;
  if (distanceKm <= freeRadius) {
    return {
      billableKm: 0,
      travelFeeZAR: 0,
      isComplimentary: true
    };
  }
  const billableKm = Math.round((distanceKm - freeRadius) * 10) / 10;
  const travelFeeZAR = Math.round(billableKm * STUDIO_BASE.travelRatePerKmZAR);
  return {
    billableKm,
    travelFeeZAR,
    isComplimentary: false
  };
}
