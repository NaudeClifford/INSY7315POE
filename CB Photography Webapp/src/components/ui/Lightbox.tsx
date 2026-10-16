"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Camera, Gauge, ArrowRight } from "lucide-react";
import { GalleryItem } from "@/types/gallery";

interface LightboxProps {
  items: GalleryItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

// Fullscreen editorial image preview modal with EXIF camera specs & direct booking routing
export const Lightbox: React.FC<LightboxProps> = ({
  items,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [touchStartX, setTouchStartX] = React.useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        const prev = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
        onNavigate(prev);
      }
      if (e.key === "ArrowRight") {
        const next = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
        onNavigate(next);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, currentIndex, items.length, onClose, onNavigate]);

  if (!isOpen || items.length === 0) return null;

  const currentItem = items[currentIndex];

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const prev = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    onNavigate(prev);
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const next = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
    onNavigate(next);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;

    if (Math.abs(diffX) > 40) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setTouchStartX(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo lightbox: ${currentItem.title}`}
      className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-6 animate-fade-in touch-none select-none overflow-y-auto"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Header */}
      <div
        className="w-full max-w-7xl flex items-center justify-between text-[#FAF8F5] z-10 pt-1 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pr-2">
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
            {currentItem.category} • {currentIndex + 1} of {items.length}
          </span>
          <h2 className="font-serif-heading text-lg sm:text-2xl text-white font-medium line-clamp-1">
            {currentItem.title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Direct "Book Similar Session" button */}
          <Link
            href={`/booking?service=${currentItem.serviceSlug || "weddings"}`}
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#C5A880] hover:bg-white text-[#2C2420] text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-sm transition-all active:scale-95 shadow-md"
          >
            <span>Book Similar Session</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={onClose}
            className="p-3 min-w-[44px] min-h-[44px] rounded-full bg-white/10 hover:bg-[#C5A880] hover:text-[#2C2420] text-white transition-all flex items-center justify-center focus:outline-none shrink-0 active:scale-95"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div
        className="relative flex-1 w-full max-w-5xl my-2 sm:my-3 flex items-center justify-center min-h-[50vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handlePrev}
          className="absolute left-1 sm:-left-12 top-1/2 -translate-y-1/2 p-3 min-w-[44px] min-h-[44px] rounded-full bg-black/60 hover:bg-[#C5A880] text-white hover:text-[#2C2420] transition-all z-20 focus:outline-none border border-white/20 flex items-center justify-center active:scale-95"
          aria-label="Previous Image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-1 sm:-right-12 top-1/2 -translate-y-1/2 p-3 min-w-[44px] min-h-[44px] rounded-full bg-black/60 hover:bg-[#C5A880] text-white hover:text-[#2C2420] transition-all z-20 focus:outline-none border border-white/20 flex items-center justify-center active:scale-95"
          aria-label="Next Image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="relative w-full h-[55vh] sm:h-[65vh] rounded-sm overflow-hidden shadow-2xl">
          <Image
            src={currentItem.imageUrl}
            alt={currentItem.title}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Bottom Metadata & EXIF Gear Spec Footer */}
      <div
        className="w-full max-w-5xl bg-black/85 border border-[#C5A880]/30 rounded-md p-3.5 sm:p-4 text-[#EAE3D9] flex flex-col gap-3 z-10 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Caption and Location */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-4 sm:gap-6 text-[11px] sm:text-xs">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{currentItem.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{currentItem.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{currentItem.photographer}</span>
            </div>
          </div>

          {currentItem.description && (
            <p className="text-[11px] text-neutral-300 italic font-light line-clamp-1">
              "{currentItem.description}"
            </p>
          )}
        </div>

        {/* EXIF Camera & Lens Spec Badges for Photography Enthusiasts */}
        {currentItem.exif && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-[10px] sm:text-[11px]">
            <div className="flex flex-wrap items-center gap-2 text-neutral-300">
              <span className="text-[#C5A880] font-semibold uppercase tracking-wider flex items-center gap-1">
                <Gauge className="w-3 h-3" /> EXIF Specs:
              </span>
              <span className="bg-white/10 px-2 py-0.5 rounded border border-white/10 font-mono">
                {currentItem.exif.cameraBody}
              </span>
              <span className="bg-white/10 px-2 py-0.5 rounded border border-white/10 font-mono">
                {currentItem.exif.lens}
              </span>
              <span className="bg-white/10 px-2 py-0.5 rounded border border-white/10 font-mono">
                {currentItem.exif.focalLength} • {currentItem.exif.aperture}
              </span>
              <span className="bg-white/10 px-2 py-0.5 rounded border border-white/10 font-mono">
                {currentItem.exif.shutterSpeed} • {currentItem.exif.iso}
              </span>
            </div>

            {/* Mobile Book CTA */}
            <div className="sm:hidden w-full pt-1">
              <Link
                href={`/booking?service=${currentItem.serviceSlug || "weddings"}`}
                className="w-full inline-flex items-center justify-center gap-1.5 bg-[#C5A880] text-[#2C2420] text-xs font-semibold uppercase tracking-wider py-2 rounded-sm shadow-md"
              >
                <span>Book Similar Session</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
