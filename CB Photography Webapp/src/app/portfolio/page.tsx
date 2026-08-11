"use client";

// Public portfolio gallery page featuring category tab filtering and interactive lightbox modal view
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Lightbox } from "@/components/ui/Lightbox";
import { MOCK_PORTFOLIO } from "@/data/portfolio";
import { PortfolioCategory } from "@/types/gallery";
import { Camera, Calendar } from "lucide-react";

export default function PortfolioPage() {
  // Category filter tab state
  const [selectedCategory, setSelectedCategory] = useState<PortfolioCategory>("All");
  // Lightbox modal view state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Available portfolio categories
  const categories: PortfolioCategory[] = [
    "All",
    "Weddings",
    "Matric Dances",
    "Graduations",
    "Corporate",
    "Couples",
    "Events",
    "Lifestyle"
  ];

  // Filter gallery photo list by category tab selection
  const filteredItems =
    selectedCategory === "All"
      ? MOCK_PORTFOLIO
      : MOCK_PORTFOLIO.filter((item) => item.category === selectedCategory);

  // Open full-screen photo lightbox modal
  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f3ed] text-[#402615]">
      <Navbar />


      {/* Header Banner */}
      <section className="bg-[#402615] text-[#f7f3ed] pt-32 pb-20 border-b border-[#bea683]/30 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-[#bea683] font-semibold">
            The Union Lab Portfolio
          </span>
          <h1 className="font-serif-heading text-4xl sm:text-6xl font-normal">
            Timeless Imagery & Stories
          </h1>
          <p className="text-xs sm:text-sm text-[#d6c8b1] max-w-xl mx-auto font-light leading-relaxed">
            Explore our curated gallery across weddings, matric dances, graduation ceremonies, corporate summits, and intimate couples sessions.
          </p>
        </div>
      </section>

      {/* Main Gallery Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs uppercase tracking-wider px-4 py-2 rounded-sm transition-all border ${
                selectedCategory === cat
                  ? "bg-[#7d5e3c] text-white border-[#7d5e3c] font-semibold shadow-md"
                  : "bg-[#f7f3ed] text-[#402615] border-[#bea683]/40 hover:bg-[#bea683]/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => handleOpenLightbox(index)}
              className="group relative h-96 rounded-sm overflow-hidden cursor-pointer bg-black/10 border border-[#bea683]/30 shadow-md hover:shadow-2xl transition-all duration-300"
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />

              {/* Hover Details Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#bea683] font-semibold">
                  {item.category}
                </span>
                <h3 className="font-serif-heading text-xl font-medium mt-1">
                  {item.title}
                </h3>
                <p className="text-xs text-[#d6c8b1] mt-1 font-light">
                  {item.location} • {item.date}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#bea683] uppercase tracking-wider">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Click to expand image</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 p-10 bg-[#d6c8b1]/30 border border-[#bea683]/40 rounded-sm text-center max-w-3xl mx-auto space-y-4">
          <h3 className="font-serif-heading text-3xl text-[#402615]">
            Envisioning Your Special Occasion?
          </h3>
          <p className="text-xs text-[#878679]">
            Let’s discuss date availability and create custom package options tailored for your event.
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 bg-[#7d5e3c] text-white hover:bg-[#402615] text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded-sm transition-all shadow-md"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Your Shoot</span>
          </Link>
        </div>
      </section>

      {/* Lightbox Component */}
      <Lightbox
        items={filteredItems}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />

      <Footer />
    </div>
  );
}
