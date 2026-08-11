"use client";

// Fullscreen interactive gallery image viewer modal with keyboard navigation support
import React, { useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Camera } from "lucide-react";
import { GalleryItem } from "@/types/gallery";

interface LightboxProps {
  items: GalleryItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  items,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  // Listen for Escape and Left/Right Arrow keyboard shortcuts when open
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
    // Lock background scroll when modal is active
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, currentIndex, items.length, onClose, onNavigate]);

  // Don't render modal when closed or gallery list is empty
  if (!isOpen || items.length === 0) return null;

  const currentItem = items[currentIndex];

  // Navigate to previous item with loop back to end
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prev = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    onNavigate(prev);
  };

  // Navigate to next item with loop to start
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
    onNavigate(next);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-8 animate-fade-in"
      onClick={onClose}
    >
      {/* Top Bar: Image Title, Counter, and Close Button */}
      <div
        className="w-full max-w-7xl flex items-center justify-between text-[#f7f3ed] z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <span className="text-xs uppercase tracking-widest text-[#bea683] font-semibold">
            {currentItem.category} • {currentIndex + 1} of {items.length}
          </span>
          <h2 className="font-serif-heading text-xl sm:text-2xl text-white font-medium">
            {currentItem.title}
          </h2>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/10 hover:bg-[#bea683] hover:text-[#402615] text-white transition-all focus:outline-none"
          aria-label="Close Lightbox"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Center Display: Previous / Next Buttons and Main High-Res Image */}
      <div
        className="relative flex-1 w-full max-w-5xl my-4 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Previous Image Button */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-[#bea683] text-white hover:text-[#402615] transition-all z-20 focus:outline-none border border-white/10"
          aria-label="Previous Image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next Image Button */}
        <button
          onClick={handleNext}
          className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-[#bea683] text-white hover:text-[#402615] transition-all z-20 focus:outline-none border border-white/10"
          aria-label="Next Image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* High-Resolution Image Container */}
        <div className="relative w-full h-[70vh] sm:h-[75vh] rounded-sm overflow-hidden shadow-2xl">
          <Image
            src={currentItem.imageUrl}
            alt={currentItem.title}
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Bottom Metadata Bar: Location, Date, Photographer Credit */}
      <div
        className="w-full max-w-4xl bg-black/70 border border-[#bea683]/30 rounded-md p-4 text-[#d6c8b1] flex flex-wrap items-center justify-between text-xs gap-4 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#bea683]" />
            <span>{currentItem.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#bea683]" />
            <span>{currentItem.date}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-medium text-[#f7f3ed]">
          <Camera className="w-4 h-4 text-[#bea683]" />
          <span>Captured by {currentItem.photographer}</span>
        </div>
      </div>
    </div>
  );
};

