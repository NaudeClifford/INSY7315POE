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
  const [touchStartX, setTouchStartX] = React.useState<number | null>(null);

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
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, currentIndex, items.length, onClose, onNavigate]);

  // Don't render modal when closed or gallery list is empty
  if (!isOpen || items.length === 0) return null;

  const currentItem = items[currentIndex];

  // Navigate to previous item with loop back to end
  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const prev = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    onNavigate(prev);
  };

  // Navigate to next item with loop to start
  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const next = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
    onNavigate(next);
  };

  // Mobile Touch Swipe Handlers
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
      className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-6 animate-fade-in touch-none select-none"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Bar: Image Title, Counter, and Close Button */}
      <div
        className="w-full max-w-7xl flex items-center justify-between text-[#f7f3ed] z-10 pt-1"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pr-2">
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#bea683] font-semibold">
            {currentItem.category} • {currentIndex + 1} of {items.length}
          </span>
          <h2 className="font-serif-heading text-lg sm:text-2xl text-white font-medium line-clamp-1">
            {currentItem.title}
          </h2>
        </div>

        <button
          onClick={onClose}
          className="p-3 min-w-[44px] min-h-[44px] rounded-full bg-white/10 hover:bg-[#bea683] hover:text-[#402615] text-white transition-all flex items-center justify-center focus:outline-none shrink-0 active:scale-95"
          aria-label="Close Lightbox"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Center Display: Previous / Next Buttons and Main High-Res Image */}
      <div
        className="relative flex-1 w-full max-w-5xl my-2 sm:my-4 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Previous Image Button */}
        <button
          onClick={handlePrev}
          className="absolute left-1 sm:-left-12 top-1/2 -translate-y-1/2 p-3 min-w-[44px] min-h-[44px] rounded-full bg-black/60 hover:bg-[#bea683] text-white hover:text-[#402615] transition-all z-20 focus:outline-none border border-white/20 flex items-center justify-center active:scale-95"
          aria-label="Previous Image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next Image Button */}
        <button
          onClick={handleNext}
          className="absolute right-1 sm:-right-12 top-1/2 -translate-y-1/2 p-3 min-w-[44px] min-h-[44px] rounded-full bg-black/60 hover:bg-[#bea683] text-white hover:text-[#402615] transition-all z-20 focus:outline-none border border-white/20 flex items-center justify-center active:scale-95"
          aria-label="Next Image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* High-Resolution Image Container */}
        <div className="relative w-full h-[65vh] sm:h-[75vh] rounded-sm overflow-hidden shadow-2xl">
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

      {/* Bottom Metadata Bar & Mobile Swipe Hint */}
      <div
        className="w-full max-w-4xl bg-black/80 border border-[#bea683]/30 rounded-md p-3 sm:p-4 text-[#d6c8b1] flex flex-col sm:flex-row items-center justify-between text-xs gap-2 sm:gap-4 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 sm:gap-6 text-[11px] sm:text-xs">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#bea683]" />
            <span>{currentItem.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#bea683]" />
            <span>{currentItem.date}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-medium text-[#f7f3ed] text-[11px] sm:text-xs">
          <Camera className="w-3.5 h-3.5 text-[#bea683]" />
          <span>Captured by {currentItem.photographer}</span>
        </div>
      </div>
    </div>
  );
};

