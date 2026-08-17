"use client";

// Services and pricing breakdown page showcasing packages, package features, travel policy, and booking CTA
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MOCK_SERVICES } from "@/data/services";
import { formatCurrency } from "@/lib/utils";
import { Check, Calendar, Info, Clock, Camera, Sparkles, ArrowRight } from "lucide-react";

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7f3ed] text-[#402615]">
      <Navbar />


      {/* Header Banner */}
      <section className="bg-[#402615] text-[#f7f3ed] pt-32 pb-20 border-b border-[#bea683]/30 text-center relative">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-[#bea683] font-semibold">
            Bespoke Offerings
          </span>
          <h1 className="font-serif-heading text-4xl sm:text-6xl font-normal">
            Services & Pricing Guide
          </h1>
          <p className="text-xs sm:text-sm text-[#d6c8b1] max-w-2xl mx-auto font-light leading-relaxed">
            From fairytale wedding days to high school milestones and corporate branding, explore our comprehensive packages and add-ons.
          </p>
        </div>
      </section>

      {/* Pricing Disclaimer Alert Box */}
      <section className="bg-[#bea683]/20 border-b border-[#bea683]/30 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-start gap-3 text-xs text-[#402615]">
          <Info className="w-5 h-5 text-[#7d5e3c] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold uppercase tracking-wider text-[#7d5e3c]">
              Custom Pricing Notice:
            </span>{" "}
            Final shoot quotes may vary depending on chosen package tier, overall shoot duration, total requested retouched photographs, travel distance beyond 20km from Krugersdorp (charged at R5/km), and extra custom add-ons.
          </div>
        </div>
      </section>

      {/* Main Services List */}
      <section className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24 flex-1 content-visibility-auto">
        {MOCK_SERVICES.map((service, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={service.id}
              id={service.slug}
              className="bg-[#f7f3ed] border border-[#bea683]/40 rounded-sm p-5 sm:p-10 shadow-md scroll-mt-28"
            >
              <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center`}>
                {/* Image */}
                <div className={`lg:col-span-5 relative h-64 sm:h-96 rounded-sm overflow-hidden border-2 border-[#d6c8b1] ${isEven ? "" : "lg:order-last"}`}>
                  <Image
                    src={service.imageUrl}
                    alt={service.title}
                    fill
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#402615] text-[#bea683] text-[11px] sm:text-xs font-semibold px-3 py-1.5 rounded-sm shadow-md">
                    Starting from R{formatCurrency(service.startingPriceZAR)}
                  </div>
                </div>

                {/* Info */}
                <div className="lg:col-span-7 space-y-5 sm:space-y-6">
                  <div className="space-y-2">
                    <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#7d5e3c] font-semibold">
                      {service.approxDuration} • {service.editedImagesSummary}
                    </span>
                    <h2 className="font-serif-heading text-2xl sm:text-4xl text-[#402615] font-medium">
                      {service.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#7d5e3c] italic">
                      "{service.tagline}"
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-[#878679] leading-relaxed font-light">
                    {service.longDescription}
                  </p>

                  {/* What the Service Includes */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#402615] mb-3">
                      Package Inclusions:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#402615]">
                      {service.inclusions.map((inc, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#7d5e3c] shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Packages Breakdown Grid */}
                  <div className="pt-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#402615] mb-4">
                      Available Package Tiers:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {service.packages.map((pkg) => (
                        <div
                          key={pkg.id}
                          className={`p-4 rounded-sm border ${
                            pkg.popular
                              ? "border-[#7d5e3c] bg-[#d6c8b1]/30"
                              : "border-[#bea683]/30 bg-white/40"
                          } space-y-2 flex flex-col justify-between`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <h5 className="font-serif-heading text-lg font-bold text-[#402615]">
                                {pkg.name}
                              </h5>
                              {pkg.popular && (
                                <span className="text-[9px] uppercase font-bold bg-[#7d5e3c] text-white px-2 py-0.5 rounded-sm">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#878679]">{pkg.tagline}</p>
                            <div className="text-xs font-semibold text-[#7d5e3c]">
                              R{formatCurrency(pkg.startingPriceZAR)} • {pkg.durationHours} Hours • {pkg.editedImagesCount} Photos
                            </div>
                          </div>

                          <div className="pt-3 flex justify-end">
                            <Link
                              href={`/booking?service=${service.slug}&package=${pkg.id}`}
                              className="inline-flex items-center justify-center gap-1.5 bg-[#7d5e3c] hover:bg-[#402615] text-white text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-sm transition-all shadow-sm min-h-[38px] active:scale-95 w-full sm:w-auto"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Book {pkg.name}</span>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <Link
                      href={`/booking?service=${service.slug}`}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#7d5e3c] hover:bg-[#402615] text-white text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded-sm transition-all shadow-md min-h-[44px] active:scale-95"
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

      <Footer />
    </div>
  );
}
