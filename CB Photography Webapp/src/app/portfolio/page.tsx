"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Lightbox } from "@/components/ui/Lightbox";
import { getPortfolioItems } from "@/lib/api";
import { GalleryItem, PortfolioCategory } from "@/types/gallery";
import { Gauge } from "lucide-react";

export default function PortfolioPage() {
  // Filterable categories: All, Weddings, Portraits, Couples, Matric Dance, Corporate
  const categories: PortfolioCategory[] = ["All", "Weddings", "Portraits", "Couples", "Matric Dance", "Corporate"];
  const [selectedCategory, setSelectedCategory] = useState<PortfolioCategory>("All");
  const [portfolioItems, setPortfolioItems] = useState<GalleryItem[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    getPortfolioItems(selectedCategory).then((items) => setPortfolioItems(items || []));
  }, [selectedCategory]);

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#141210] text-[#2C2420] dark:text-[#FAF8F5] transition-colors duration-300">
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* Banner */}
        <section className="bg-[#2C2420] dark:bg-[#141210] text-[#FAF8F5] pt-32 pb-20 border-b border-[#C5A880]/30 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
              Camryn Burger Photography Portfolio
            </span>
            <h1 className="font-serif-heading text-4xl sm:text-6xl font-normal">
              Timeless Imagery & Stories
            </h1>
            <p className="text-xs sm:text-sm text-[#EAE3D9]/90 max-w-xl mx-auto font-light leading-relaxed">
              Explore our curated editorial gallery across Weddings, Portraits, Couples, Matric Dance, and Corporate sessions with camera EXIF specs.
            </p>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
          {/* Category Filters: All, Weddings, Portraits, Matric Dance, Commercial */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs uppercase tracking-wider px-4 py-2.5 rounded-sm transition-all border shrink-0 active:scale-95 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#C5A880] text-[#2C2420] border-[#C5A880] font-bold shadow-md"
                    : "bg-white dark:bg-[#1F1B18] text-[#2C2420] dark:text-[#FAF8F5] border-[#EAE3D9] dark:border-[#3A332C] hover:border-[#C5A880]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => handleOpenLightbox(index)}
                className="group relative h-72 sm:h-80 w-full rounded-sm overflow-hidden cursor-pointer bg-[#2C2420] border border-[#C5A880]/30 shadow-md hover:shadow-2xl transition-all duration-300"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-5 flex flex-col justify-end text-white opacity-95 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold">
                    <span>{item.category}</span>
                    <span>{item.date}</span>
                  </div>

                  <h3 className="font-serif-heading text-lg font-medium mt-1 line-clamp-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#EAE3D9] mt-0.5 font-light line-clamp-1">
                    {item.location}
                  </p>

                  {item.exif && (
                    <div className="mt-3 pt-2 border-t border-white/20 flex items-center justify-between text-[10px] text-neutral-300 font-mono">
                      <span className="flex items-center gap-1 text-[#C5A880]">
                        <Gauge className="w-3 h-3" /> {item.exif.cameraBody}
                      </span>
                      <span>{item.exif.focalLength} • {item.exif.aperture}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Lightbox
        items={portfolioItems}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIndex) => setLightboxIndex(newIndex)}
      />

      <Footer />
    </div>
  );
}
