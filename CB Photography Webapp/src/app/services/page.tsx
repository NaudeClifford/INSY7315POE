"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getServices } from "@/lib/api";
import { Service } from "@/types/service";
import { formatCurrency } from "@/lib/utils";
import { Check, Calendar, Info } from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    getServices().then((data) => setServices(data || []));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#141210] text-[#2C2420] dark:text-[#FAF8F5] transition-colors duration-300">
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* Banner */}
        <section className="bg-[#2C2420] dark:bg-[#141210] text-[#FAF8F5] pt-32 pb-20 border-b border-[#C5A880]/30 text-center relative">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
              Bespoke Studio Offerings
            </span>
            <h1 className="font-serif-heading text-4xl sm:text-6xl font-normal">
              Services & Pricing Guide
            </h1>
            <p className="text-xs sm:text-sm text-[#EAE3D9]/90 max-w-2xl mx-auto font-light leading-relaxed">
              Explore our 6 photography categories with transparent packages, clear durations, and direct online booking.
            </p>
          </div>
        </section>

        {/* Pricing Disclaimer Alert Box */}
        <section className="bg-[#C5A880]/15 dark:bg-[#C5A880]/10 border-b border-[#C5A880]/30 py-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-start gap-3 text-xs text-[#2C2420] dark:text-[#FAF8F5]">
            <Info className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-semibold uppercase tracking-wider text-[#C5A880]">
                Complimentary Radius & Travel Policy:
              </span>{" "}
              All shoots within a <strong>20.0 km radius</strong> of our Krugersdorp studio base are 100% free of travel surcharges. Distances exceeding 20 km are billed at a flat <strong>R 5.00 per km</strong>.
            </div>
          </div>
        </section>

        {/* Main Services List */}
        <section className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24 flex-1">
          {services.map((service, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={service.id}
                id={service.slug}
                className="bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-6 sm:p-10 shadow-md scroll-mt-28"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
                  {/* Image Column */}
                  <div className={`lg:col-span-5 relative h-72 sm:h-96 rounded-sm overflow-hidden border border-[#EAE3D9] dark:border-[#3A332C] ${isEven ? "" : "lg:order-last"}`}>
                    <Image
                      src={service.imageUrl}
                      alt={service.title}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, 500px"
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#2C2420] text-[#C5A880] text-[11px] sm:text-xs font-semibold px-3 py-1.5 rounded-sm shadow-md">
                      Starting from R {formatCurrency(service.startingPriceZAR)}
                    </div>
                  </div>

                  {/* Info Column */}
                  <div className="lg:col-span-7 space-y-5 sm:space-y-6">
                    <div className="space-y-2">
                      <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
                        {service.approxDuration} • {service.editedImagesSummary}
                      </span>
                      <h2 className="font-serif-heading text-3xl sm:text-4xl font-medium">
                        {service.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#C5A880] italic">
                        "{service.tagline}"
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
                      {service.longDescription}
                    </p>

                    {/* What the Service Includes */}
                    {service.inclusions && service.inclusions.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 text-[#2C2420] dark:text-[#FAF8F5]">
                          Signature Inclusions:
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-neutral-600 dark:text-neutral-300">
                          {service.inclusions.map((inc, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                              <span>{inc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Package Tiers Breakdown */}
                    {service.packages && service.packages.length > 0 && (
                      <div className="pt-2 space-y-2.5">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2C2420] dark:text-[#FAF8F5]">
                          Package Options & Pricing:
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {service.packages.map((pkg) => (
                            <Link
                              key={pkg.id}
                              href={`/booking?service=${service.slug}&package=${pkg.id}`}
                              className={`p-3.5 rounded border text-xs flex flex-col justify-between space-y-2 transition-all hover:scale-[1.01] hover:border-[#C5A880] ${
                                pkg.popular
                                  ? "bg-[#FAF8F5] dark:bg-[#141210] border-[#C5A880] ring-1 ring-[#C5A880]/30 shadow-sm"
                                  : "bg-[#FAF8F5]/60 dark:bg-[#141210]/60 border-[#EAE3D9] dark:border-[#3A332C]"
                              }`}
                            >
                              {pkg.imageUrl && (
                                <div className="relative h-24 w-full rounded-sm overflow-hidden mb-1 border border-[#EAE3D9] dark:border-[#3A332C]">
                                  <Image
                                    src={pkg.imageUrl}
                                    alt={pkg.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <span className="font-serif-heading font-bold text-sm text-[#2C2420] dark:text-[#FAF8F5]">
                                    {pkg.name}
                                  </span>
                                  {pkg.popular && (
                                    <span className="bg-[#C5A880] text-[#2C2420] text-[9px] font-bold px-1.5 py-0.5 rounded">
                                      Popular
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-neutral-500 line-clamp-1">{pkg.tagline}</p>
                              </div>

                              <div className="flex items-baseline justify-between pt-2 border-t border-[#EAE3D9]/60 dark:border-[#3A332C]/60">
                                <span className="text-[10px] text-neutral-400">
                                  {pkg.durationHours}h • {pkg.editedImagesCount} Photos
                                </span>
                                <span className="font-serif-heading text-sm font-semibold text-[#2C2420] dark:text-[#FAF8F5]">
                                  R {formatCurrency(pkg.startingPriceZAR)}
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t border-[#EAE3D9] dark:border-[#3A332C] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        Select your preferred package tier, date & photographer on the booking page.
                      </div>
                      <Link
                        href={`/booking?service=${service.slug}`}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2C2420] dark:bg-[#C5A880] text-white dark:text-[#2C2420] hover:bg-[#C5A880] hover:text-[#2C2420] text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded-sm transition-all shadow-md active:scale-95"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Book {service.title}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </main>

      <Footer />
    </div>
  );
}
