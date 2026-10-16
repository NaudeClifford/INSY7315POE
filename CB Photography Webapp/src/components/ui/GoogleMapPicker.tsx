"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  GOOGLE_MAPS_API_KEY,
  STUDIO_BASE,
  PREDEFINED_VENUES,
  PredefinedVenue,
  calculateDistanceKm,
  calculateTravelFee
} from "@/lib/maps";
import { MapPin, Search, Info } from "lucide-react";

interface GoogleMapPickerProps {
  venueName: string;
  address: string;
  suburb: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  travelFeeZAR: number;
  onLocationChange: (loc: {
    venueName: string;
    address: string;
    suburb: string;
    latitude: number;
    longitude: number;
    distanceKm: number;
    travelFeeZAR: number;
  }) => void;
}

export const GoogleMapPicker: React.FC<GoogleMapPickerProps> = ({
  venueName,
  address,
  suburb,
  latitude,
  longitude,
  distanceKm,
  travelFeeZAR,
  onLocationChange,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [markerInstance, setMarkerInstance] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Initialize Google Maps script
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ((window as any).google?.maps) {
      setMapLoaded(true);
      return;
    }

    const scriptId = "google-maps-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      script.onerror = () => {
        console.warn("Google Maps script failed to load, using interactive fallback.");
      };
      document.head.appendChild(script);
    }
  }, []);

  // Initialize Map and Circle
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !(window as any).google?.maps) return;

    const google = (window as any).google;
    const baseCenter = { lat: STUDIO_BASE.lat, lng: STUDIO_BASE.lng };
    const initialPos = {
      lat: latitude || STUDIO_BASE.lat,
      lng: longitude || STUDIO_BASE.lng,
    };

    const map = new google.maps.Map(mapRef.current, {
      center: initialPos,
      zoom: 11,
      styles: [
        {
          featureType: "all",
          elementType: "geometry",
          stylers: [{ saturation: -20 }]
        }
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true
    });

    // 20 km Complimentary Radius Circle from Krugersdorp base
    new google.maps.Circle({
      strokeColor: "#2E5E43",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#2E5E43",
      fillOpacity: 0.12,
      map,
      center: baseCenter,
      radius: STUDIO_BASE.complimentaryRadiusKm * 1000 // 20,000 metres
    });

    // Studio Base Marker
    new google.maps.Marker({
      position: baseCenter,
      map,
      title: "CB Photography Studio Base (Krugersdorp)",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#C5A880",
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "#2C2420"
      }
    });

    // Shoot Venue Draggable Marker
    const marker = new google.maps.Marker({
      position: initialPos,
      map,
      draggable: true,
      title: venueName || "Photoshoot Location",
      animation: google.maps.Animation.DROP
    });

    // Drag end listener with reverse geocoding
    marker.addListener("dragend", () => {
      const pos = marker.getPosition();
      if (!pos) return;
      const newLat = pos.lat();
      const newLng = pos.lng();
      const dist = calculateDistanceKm(STUDIO_BASE.lat, STUDIO_BASE.lng, newLat, newLng);
      const { travelFeeZAR } = calculateTravelFee(dist);

      if ((window as any).google?.maps?.Geocoder) {
        const geocoder = new (window as any).google.maps.Geocoder();
        geocoder.geocode({ location: { lat: newLat, lng: newLng } }, (results: any, status: any) => {
          if (status === "OK" && results && results[0]) {
            const formatted = results[0].formatted_address;
            const parts = formatted.split(",");
            const resolvedName = parts[0]?.trim() || "Client Chosen Location";
            const resolvedSub = parts[1]?.trim() || "Gauteng";

            onLocationChange({
              venueName: resolvedName,
              address: formatted,
              suburb: resolvedSub,
              latitude: newLat,
              longitude: newLng,
              distanceKm: dist,
              travelFeeZAR
            });
          } else {
            onLocationChange({
              venueName: "Client Chosen Location",
              address: `Pin at ${newLat.toFixed(4)}, ${newLng.toFixed(4)}`,
              suburb: "Gauteng",
              latitude: newLat,
              longitude: newLng,
              distanceKm: dist,
              travelFeeZAR
            });
          }
        });
      } else {
        onLocationChange({
          venueName: "Client Chosen Location",
          address: `Pin at ${newLat.toFixed(4)}, ${newLng.toFixed(4)}`,
          suburb: "Gauteng",
          latitude: newLat,
          longitude: newLng,
          distanceKm: dist,
          travelFeeZAR
        });
      }
    });

    setMapInstance(map);
    setMarkerInstance(marker);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLoaded]);

  // Update map & marker position when venue changes externally
  useEffect(() => {
    if (mapInstance && markerInstance && latitude && longitude) {
      const pos = { lat: latitude, lng: longitude };
      markerInstance.setPosition(pos);
      mapInstance.panTo(pos);
    }
  }, [latitude, longitude, mapInstance, markerInstance]);

  // Handle selecting a predefined Gauteng venue
  const handleSelectPredefined = (venue: PredefinedVenue) => {
    const dist = calculateDistanceKm(STUDIO_BASE.lat, STUDIO_BASE.lng, venue.latitude, venue.longitude);
    const { travelFeeZAR } = calculateTravelFee(dist);

    onLocationChange({
      venueName: venue.name,
      address: `${venue.name}, ${venue.suburb}`,
      suburb: venue.suburb,
      latitude: venue.latitude,
      longitude: venue.longitude,
      distanceKm: dist,
      travelFeeZAR
    });
  };

  // Handle address geocoding search
  const handleSearchAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if ((window as any).google?.maps) {
      setIsGeocoding(true);
      const geocoder = new (window as any).google.maps.Geocoder();
      geocoder.geocode(
        { address: searchQuery + ", Gauteng, South Africa" },
        (results: any, status: any) => {
          setIsGeocoding(false);
          if (status === "OK" && results && results[0]) {
            const loc = results[0].geometry.location;
            const newLat = loc.lat();
            const newLng = loc.lng();
            const dist = calculateDistanceKm(STUDIO_BASE.lat, STUDIO_BASE.lng, newLat, newLng);
            const { travelFeeZAR } = calculateTravelFee(dist);

            const parts = results[0].formatted_address.split(",");
            const resolvedName = searchQuery.trim() || parts[0]?.trim() || "Client Chosen Location";
            const resolvedSub = parts[1]?.trim() || "Gauteng";

            onLocationChange({
              venueName: resolvedName,
              address: results[0].formatted_address,
              suburb: resolvedSub,
              latitude: newLat,
              longitude: newLng,
              distanceKm: dist,
              travelFeeZAR
            });
          } else {
            alert("Could not find location. Please enter a location name below or drag the map pin.");
          }
        }
      );
    }
  };

  const isComplimentary = distanceKm <= STUDIO_BASE.complimentaryRadiusKm;

  return (
    <div className="space-y-4">
      {/* Predefined Venues Quick-Select Pills */}
      <div>
        <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#C5A880] mb-2">
          Popular Gauteng Shoot Venues (Tap to auto-fill)
        </label>
        <div className="flex flex-wrap gap-2">
          {PREDEFINED_VENUES.map((v) => {
            const isSelected = venueName === v.name;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => handleSelectPredefined(v)}
                className={`text-xs py-2 px-3 rounded-sm border transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                  isSelected
                    ? "bg-[#C5A880] text-[#2C2420] border-[#C5A880] font-bold shadow-sm"
                    : "bg-white dark:bg-[#1F1B18] border-[#EAE3D9] dark:border-[#3A332C] hover:border-[#C5A880] text-[#2C2420] dark:text-[#FAF8F5]"
                }`}
              >
                <MapPin className={`w-3.5 h-3.5 ${isSelected ? "text-[#2C2420]" : "text-[#C5A880]"}`} />
                <span>{v.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded ${
                    v.isFreeZone
                      ? "bg-[#2E5E43]/15 text-[#2E5E43] dark:text-emerald-300 font-semibold"
                      : "bg-amber-600/15 text-amber-700 dark:text-amber-300"
                  }`}
                >
                  {v.isFreeZone ? "Free Zone" : `+R${calculateTravelFee(v.distanceKm).travelFeeZAR}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Venue Name & Address Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm">
        <div>
          <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
            Venue / Shoot Location Name *
          </label>
          <input
            type="text"
            value={venueName}
            onChange={(e) => {
              const val = e.target.value;
              onLocationChange({
                venueName: val || "Client Chosen Location",
                address: address || val,
                suburb,
                latitude,
                longitude,
                distanceKm,
                travelFeeZAR
              });
            }}
            placeholder="e.g. Walter Sisulu Gardens, My Home, Steyn City"
            className="w-full bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-2.5 text-xs text-[#2C2420] dark:text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
          />
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
            Street Address / Suburb *
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => {
              const val = e.target.value;
              onLocationChange({
                venueName: venueName || "Client Chosen Location",
                address: val,
                suburb: val.split(",")[0] || suburb,
                latitude,
                longitude,
                distanceKm,
                travelFeeZAR
              });
            }}
            placeholder="e.g. Malcolm Rd, Poortview, Roodepoort"
            className="w-full bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-2.5 text-xs text-[#2C2420] dark:text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
          />
        </div>
      </div>

      {/* Address Search Bar */}
      <form onSubmit={handleSearchAddress} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#C5A880] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search venue or address on Google Maps..."
            className="w-full bg-white dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm py-2.5 pl-9 pr-3 text-xs text-[#2C2420] dark:text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
          />
        </div>
        <button
          type="submit"
          disabled={isGeocoding}
          className="bg-[#2C2420] dark:bg-[#C5A880] hover:bg-[#C5A880] text-white dark:text-[#2C2420] text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-sm transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <span>{isGeocoding ? "Locating..." : "Search Map"}</span>
        </button>
      </form>

      {/* Interactive Map Container */}
      <div className="relative w-full h-72 sm:h-80 rounded-sm overflow-hidden border border-[#EAE3D9] dark:border-[#3A332C] shadow-inner bg-[#EAE3D9]/20 dark:bg-neutral-900">
        <div ref={mapRef} className="w-full h-full" />

        {/* Map Legend Overlay */}
        <div className="absolute top-3 left-3 bg-white/95 dark:bg-[#1C1917]/95 backdrop-blur-sm p-2.5 rounded-sm border border-[#EAE3D9] dark:border-[#3A332C] text-[11px] space-y-1 shadow-md z-10 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C5A880] border border-black inline-block" />
            <span className="font-semibold text-[#2C2420] dark:text-[#FAF8F5]">Krugersdorp Studio Base</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full border-2 border-[#2E5E43] bg-[#2E5E43]/20 inline-block" />
            <span className="text-neutral-600 dark:text-neutral-300">20 km Complimentary Radius</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-rose-600" />
            <span className="text-neutral-600 dark:text-neutral-300">Shoot Venue (Drag to move)</span>
          </div>
        </div>

        {/* Distance & Surcharge Badge */}
        <div className="absolute bottom-3 right-3 bg-white/95 dark:bg-[#1C1917]/95 backdrop-blur-sm px-3 py-2 rounded-sm border border-[#EAE3D9] dark:border-[#3A332C] text-xs shadow-md z-10 flex items-center gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Distance from Base</span>
            <span className="font-bold text-[#2C2420] dark:text-[#FAF8F5]">~{distanceKm} km</span>
          </div>
          <div className="h-6 w-px bg-neutral-300 dark:bg-neutral-700" />
          <div>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Travel Fee</span>
            <span className={`font-bold ${isComplimentary ? "text-[#2E5E43] dark:text-emerald-400" : "text-[#C5A880]"}`}>
              {isComplimentary ? "R 0.00 (Complimentary)" : `+R ${travelFeeZAR}.00`}
            </span>
          </div>
        </div>
      </div>

      {/* Travel Surcharge Policy Note */}
      <div className="p-3 bg-[#FAF8F5] dark:bg-[#1F1B18] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
        <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-[11px]">
          <strong>Studio Travel Policy:</strong> Complimentary travel within a 20 km radius of our Krugersdorp studio base. Locations exceeding 20 km are billed at <strong>R 5.00 per km</strong> for the surplus distance.
        </p>
      </div>
    </div>
  );
};
