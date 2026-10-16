"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Lightbox } from "@/components/ui/Lightbox";
import { getServices, getPortfolioItems, getTestimonials } from "@/lib/api";
import { PREDEFINED_VENUES } from "@/lib/maps";
import { Service, Testimonial } from "@/types/service";
import { GalleryItem, PortfolioCategory } from "@/types/gallery";
import { formatCurrency } from "@/lib/utils";
import {
  Calendar,
  ArrowRight,
  ChevronDown,
  Camera,
  Star,
  MapPin
} from "lucide-react";

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<GalleryItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // Portfolio category filter & lightbox
  const [selectedCategory, setSelectedCategory] = useState<PortfolioCategory>("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    getServices().then((data) => setServices(data || []));
    getTestimonials().then((data) => setTestimonials(data || []));
  }, []);

  useEffect(() => {
    getPortfolioItems(selectedCategory).then((data) => setPortfolioItems(data || []));
  }, [selectedCategory]);

  const categories: PortfolioCategory[] = ["All", "Weddings", "Portraits", "Couples", "Matric Dance", "Corporate"];

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#141210] text-[#2C2420] dark:text-[#FAF8F5] transition-colors duration-300">
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* 1. HERO BANNER */}
        <section className="relative min-h-screen flex items-center justify-center pt-20 pb-20 sm:pb-16 overflow-hidden gpu-accelerate">
          <div className="absolute inset-0 z-0">
            <Image
              src="/backgrounds/hero-bg.jpg"
              alt="Hero Photography backdrop"
              fill
              priority
              sizes="100vw"
              quality={85}
              className="object-cover object-center scale-105"
            />
            {/* Editorial overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2C2420] via-black/60 to-black/80 dark:from-[#141210] dark:via-black/75 dark:to-black/90" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-[#FAF8F5] pt-12 pb-6">
            <span className="inline-block text-xs uppercase tracking-[0.3em] text-[#C5A880] font-semibold mb-4 px-4 py-1.5 rounded-full border border-[#C5A880]/40 bg-black/40 backdrop-blur-sm animate-fade-in">
              Fine-Art Photography • Gauteng & Nationwide
            </span>

            <h1 className="font-serif-heading text-4xl sm:text-6xl md:text-7xl font-light tracking-wide leading-tight mb-6">
              Your story, <br className="hidden sm:block" />
              <span className="italic font-normal text-[#C5A880]">captured beautifully.</span>
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#EAE3D9]/90 leading-relaxed mb-10 font-light">
              Camryn Burger Photography crafts timeless visual heirlooms. Documenting genuine emotions, sacred wedding vows, matric dance arrivals, and executive milestones with fine-art precision.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none">
              <Link
                href="/booking"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C5A880] hover:bg-white text-[#2C2420] text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded-sm transition-all duration-300 shadow-xl border border-[#C5A880]/40 min-h-[44px] active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>Book a Photoshoot</span>
              </Link>

              <Link
                href="/services"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black/40 hover:bg-white/10 text-[#FAF8F5] text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded-sm transition-all duration-300 border border-[#C5A880]/30 backdrop-blur-sm min-h-[44px] active:scale-95"
              >
                <span>Explore Services</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-[#EAE3D9]/70 animate-bounce pointer-events-none">
            <span className="text-[10px] uppercase tracking-widest mb-1">Scroll</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </section>

        {/* 2. QUICK STATISTICS BAR */}
        <section className="bg-[#FAF8F5] dark:bg-[#1C1917] border-y border-[#EAE3D9] dark:border-[#3A332C] py-12 sm:py-14 transition-colors">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-[#EAE3D9] dark:divide-[#3A332C]">
              {/* Stat 1: Experience */}
              <div className="pt-6 sm:pt-0 sm:px-6 flex flex-col items-center justify-center">
                <span className="block font-serif-heading text-4xl sm:text-5xl lg:text-5xl text-[#2C2420] dark:text-[#FAF8F5] font-light leading-none tracking-tight mb-3">
                  8+ Years
                </span>
                <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold mb-2">
                  Professional Experience
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed max-w-xs">
                  Mastery in fine-art lighting &amp; candid storytelling
                </p>
              </div>

              {/* Stat 2: Sessions */}
              <div className="pt-6 sm:pt-0 sm:px-6 flex flex-col items-center justify-center">
                <span className="block font-serif-heading text-4xl sm:text-5xl lg:text-5xl text-[#2C2420] dark:text-[#FAF8F5] font-light leading-none tracking-tight mb-3">
                  350+
                </span>
                <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold mb-2">
                  Weddings &amp; Portraits
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed max-w-xs">
                  Cherished sessions documented across South Africa
                </p>
              </div>

              {/* Stat 3: Rating & Reviews */}
              <div className="pt-6 sm:pt-0 sm:px-6 flex flex-col items-center justify-center">
                <span className="block font-serif-heading text-4xl sm:text-5xl lg:text-5xl text-[#2C2420] dark:text-[#FAF8F5] font-light leading-none tracking-tight mb-3">
                  4.9 Rating
                </span>
                <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold mb-2">
                  Client Excellence Score
                </p>
                <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                  <div className="flex items-center gap-0.5 text-[#C5A880]" aria-label="5 out of 5 stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C5A880]" />
                    ))}
                  </div>
                  <span>• 100+ Five-Star Reviews</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. SERVICE HIGHLIGHTS GRID (Matric Dance, Weddings, Portraits) */}
        <section className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
              Signature Portfolios
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-5xl font-normal">
              Service Highlights
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-light">
              Tailored luxury packages crafted for life's most momentous chapters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((serv) => (
              <div
                key={serv.id}
                className="group bg-white dark:bg-[#1F1B18] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                    <Image
                      src={serv.imageUrl}
                      alt={serv.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                      <span className="text-xs font-semibold text-[#C5A880] bg-black/60 px-2.5 py-1 rounded backdrop-blur-sm">
                        From R{formatCurrency(serv.startingPriceZAR)}
                      </span>
                      <span className="text-[11px] text-[#EAE3D9]">{serv.approxDuration}</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="font-serif-heading text-2xl font-medium group-hover:text-[#C5A880] transition-colors">
                      {serv.title}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3 font-light">
                      {serv.description}
                    </p>

                    <div className="pt-2 border-t border-[#EAE3D9] dark:border-[#3A332C]">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-[#C5A880] block mb-2">
                        Available Packages:
                      </span>
                      <ul className="space-y-1 text-xs text-neutral-600 dark:text-neutral-300">
                        {serv.packages?.map((pkg) => (
                          <li key={pkg.id} className="flex items-center justify-between text-[11px]">
                            <span>• {pkg.name}</span>
                            <span className="font-semibold text-[#2C2420] dark:text-[#FAF8F5]">
                              R{formatCurrency(pkg.startingPriceZAR)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={`/booking?service=${serv.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#2C2420] dark:bg-[#27221E] hover:bg-[#C5A880] text-white hover:text-[#2C2420] text-xs font-semibold uppercase tracking-wider py-3 rounded-sm transition-colors shadow-sm"
                  >
                    <span>Book {serv.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#C5A880] hover:text-[#2C2420] dark:hover:text-white transition-colors"
            >
              <span>Explore All 6 Service Categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* 4. PORTFOLIO PREVIEW CAROUSEL */}
        <section className="py-20 bg-[#2C2420] dark:bg-[#141210] text-[#FAF8F5] border-y border-[#C5A880]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                  Visual Showcase
                </span>
                <h2 className="font-serif-heading text-3xl sm:text-5xl text-white font-normal">
                  Curated Portfolio Preview
                </h2>
                <p className="text-xs text-[#EAE3D9]/70 font-light">
                  Tap any photograph to inspect camera EXIF specs, lens gear, and book a similar session.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-sm transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-[#C5A880] text-[#2C2420] font-bold shadow-md"
                        : "bg-white/10 text-[#EAE3D9] hover:bg-white/20"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {portfolioItems.slice(0, 6).map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => openLightbox(idx)}
                  className="group relative h-72 sm:h-80 w-full rounded-sm overflow-hidden cursor-pointer bg-[#1F1B18] border border-[#C5A880]/30 shadow-md hover:shadow-2xl transition-all duration-300"
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-5 flex flex-col justify-end text-white opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold">
                      {item.category}
                    </span>
                    <h4 className="font-serif-heading text-lg font-medium mt-0.5 line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#EAE3D9] mt-0.5 font-light">
                      {item.location}
                    </p>
                    {item.exif && (
                      <span className="text-[10px] text-[#C5A880] font-mono mt-2 block">
                        {item.exif.cameraBody} • {item.exif.lens}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center gap-2 border border-[#C5A880] text-[#C5A880] hover:bg-[#C5A880] hover:text-[#2C2420] text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded-sm transition-all min-h-[44px]"
              >
                <span>View Full Portfolio Gallery</span>
                <Camera className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 5. INTERACTIVE STUDIO BASE MAP */}
        <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-6 sm:p-10 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                  Operational Coverage
                </span>
                <h2 className="font-serif-heading text-3xl sm:text-4xl font-normal">
                  Interactive Studio Base & Travel Radius
                </h2>
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                Studio GPS: <strong>-26.1015, 27.7766</strong> (Krugersdorp, Gauteng)
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
              Our primary operational studio base is located in <strong>Krugersdorp, Gauteng</strong>. All shoot destinations within a <strong>20.0 km radius</strong> enjoy 100% complimentary travel with zero surcharge. Any distance beyond 20 km is billed at our transparent flat rate of <strong>R 5.00 per km</strong>.
            </p>

            {/* Coverage Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm">
                <span className="text-[10px] uppercase font-bold text-[#2E5E43] dark:text-emerald-400 block mb-1">
                  ✓ Complimentary Zone
                </span>
                <span className="text-xl font-serif-heading font-semibold text-[#2C2420] dark:text-[#FAF8F5]">
                  0 - 20.0 km
                </span>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                  Walter Sisulu Gardens, Cradle of Humankind & Kloofendal included free.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm">
                <span className="text-[10px] uppercase font-bold text-[#C5A880] block mb-1">
                  Extended Travel Rate
                </span>
                <span className="text-xl font-serif-heading font-semibold text-[#2C2420] dark:text-[#FAF8F5]">
                  R 5.00 / km
                </span>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                  Only billed for distance exceeding the 20 km complimentary radius.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm">
                <span className="text-[10px] uppercase font-bold text-[#1D2D44] dark:text-sky-300 block mb-1">
                  Nationwide Coverage
                </span>
                <span className="text-xl font-serif-heading font-semibold text-[#2C2420] dark:text-[#FAF8F5]">
                  All 9 Provinces
                </span>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                  Available for destination weddings across Cape Town, Drakensberg, and Mpumalanga.
                </p>
              </div>
            </div>

            {/* Popular Predefined Venues Pill Strip */}
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block mb-2">
                Popular Verified Gauteng Venues:
              </span>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_VENUES.map((v) => (
                  <Link
                    key={v.id}
                    href={`/booking?venue=${encodeURIComponent(v.name)}`}
                    className="p-2.5 rounded-sm border border-[#EAE3D9] dark:border-[#3A332C] bg-[#FAF8F5] dark:bg-[#141210] hover:border-[#C5A880] text-xs flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span className="font-medium text-[#2C2420] dark:text-[#FAF8F5]">{v.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${v.isFreeZone ? "bg-[#2E5E43]/15 text-[#2E5E43] dark:text-emerald-400 font-bold" : "bg-amber-500/15 text-amber-700 dark:text-amber-300"}`}>
                      {v.distanceKm} km ({v.isFreeZone ? "Free" : `+R${(v.distanceKm - 20) * 5}`})
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 6. CLIENT TESTIMONIALS WITH 5-STAR BADGES */}
        <section className="py-20 bg-[#FAF8F5] dark:bg-[#1C1917] border-t border-[#EAE3D9] dark:border-[#3A332C]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                Authentic Reviews
              </span>
              <h2 className="font-serif-heading text-3xl sm:text-5xl font-normal">
                What Couples & Clients Say
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="bg-white dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-8 rounded-sm space-y-4 shadow-sm relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-[#C5A880]">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#C5A880]" />
                      ))}
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#2E5E43] dark:text-emerald-400 bg-[#2E5E43]/10 px-2 py-0.5 rounded">
                      Verified Shoot
                    </span>
                  </div>

                  <p className="font-serif-heading text-lg italic text-neutral-700 dark:text-neutral-300 leading-relaxed font-light">
                    "{t.quote}"
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs border-t border-[#EAE3D9] dark:border-[#3A332C]">
                    <span className="font-semibold text-[#2C2420] dark:text-[#FAF8F5]">
                      {t.clientName}
                    </span>
                    <span className="text-neutral-500 dark:text-neutral-400">
                      {t.roleOrEvent}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. FINAL CALL TO ACTION */}
        <section className="py-24 bg-[#C5A880]/15 dark:bg-[#C5A880]/10 border-t border-[#C5A880]/30 text-center">
          <div className="max-w-4xl mx-auto px-4 space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
              Ready to Begin?
            </span>
            <h2 className="font-serif-heading text-4xl sm:text-6xl font-normal text-[#2C2420] dark:text-[#FAF8F5]">
              Let’s create something worth remembering.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto font-light">
              Secure your date with a 50% deposit online, check live weather for your location, and enjoy editorial coverage.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/booking"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2C2420] dark:bg-[#C5A880] hover:bg-[#C5A880] dark:hover:bg-white text-white dark:text-[#2C2420] text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded-sm transition-all shadow-lg"
              >
                <Calendar className="w-4 h-4" />
                <span>Book a Photoshoot Now</span>
              </Link>

              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#2C2420] dark:border-[#FAF8F5] text-[#2C2420] dark:text-[#FAF8F5] hover:bg-[#2C2420] hover:text-white dark:hover:bg-white dark:hover:text-[#2C2420] text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded-sm transition-all"
              >
                <span>Direct Studio Inquiries</span>
              </Link>
            </div>
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
