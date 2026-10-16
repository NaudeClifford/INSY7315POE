"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getPhotographers } from "@/lib/api";
import type { Photographer } from "@/types/user";
import { Calendar } from "lucide-react";

export default function AboutPage() {
  const [photographers, setPhotographers] = useState<Photographer[]>([]);

  useEffect(() => {
    getPhotographers().then((data) => {
      setPhotographers(data || []);
    });
  }, []);

  const timelineEvents = [
    {
      year: "2023",
      title: "The Founding",
      desc: "Camryn Burger established her boutique studio in Krugersdorp, starting with fewer than 5 client bookings per month focused on intimate portraiture and family milestones."
    },
    {
      year: "2024",
      title: "Rapid Growth & Recognition",
      desc: "Through word-of-mouth recommendations and consistent editorial quality, the studio expanded to over 50 monthly bookings across Gauteng."
    },
    {
      year: "2025",
      title: "Team & Creative Roster Expansion",
      desc: "Miah and Brendon joined our creative roster as dedicated photographers to expand wedding, portrait, and creative event availability."
    },
    {
      year: "2026",
      title: "National Vision",
      desc: "Launching nationwide destination coverage across South Africa with streamlined digital gallery workflows."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#141210] text-[#2C2420] dark:text-[#FAF8F5] transition-colors duration-300">
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* Header Banner */}
        <section className="bg-[#2C2420] dark:bg-[#141210] text-[#FAF8F5] pt-32 pb-20 border-b border-[#C5A880]/30 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
              Our Legacy & Story
            </span>
            <h1 className="font-serif-heading text-4xl sm:text-6xl font-normal">
              About Camryn Burger Photography
            </h1>
            <p className="text-xs sm:text-sm text-[#EAE3D9]/90 max-w-xl mx-auto font-light leading-relaxed">
              Documenting genuine human connection through timeless, editorial photography across South Africa.
            </p>
          </div>
        </section>

        {/* Founder Intro Section */}
        <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5 relative">
              <div className="relative h-[480px] w-full rounded-sm overflow-hidden border-4 border-[#C5A880]/40 bg-[#C5A880]/10 shadow-2xl">
                <Image
                  src="/backgrounds/camryn-portrait.jpg"
                  alt="Camryn Burger - Founder & Lead Photographer"
                  fill
                  sizes="(max-width: 768px) 100vw, 450px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="md:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
                Founder & Lead Photographer
              </span>
              <h2 className="font-serif-heading text-3xl sm:text-5xl text-[#2C2420] dark:text-[#FAF8F5] font-normal leading-tight">
                &ldquo;We believe photographs should feel like poetry in motion.&rdquo;
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
                Hi, I’m Camryn Burger. What began as a personal passion for capturing unscripted moments has grown into Camryn Burger Photography—a South African photography studio built on authenticity, warmth, and attention to detail.
              </p>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
                Whether documenting a tearful vow exchange under golden sunbeams, the glamour of a matric dance arrival, or executive corporate summits, our philosophy remains unchanged: every photograph must honor the genuine spirit of the occasion.
              </p>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 bg-white/60 dark:bg-[#1C1917] border-y border-[#EAE3D9] dark:border-[#3A332C]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                Milestones
              </span>
              <h2 className="font-serif-heading text-3xl sm:text-4xl text-[#2C2420] dark:text-[#FAF8F5]">
                Camryn Burger Photography Growth Story
              </h2>
            </div>

            <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 sm:before:left-1/2 before:w-0.5 before:bg-[#C5A880]/30">
              {timelineEvents.map((ev, i) => (
                <div
                  key={i}
                  className={`relative flex flex-col sm:flex-row items-start ${
                    i % 2 === 0 ? "sm:flex-row-reverse" : ""
                  }`}
                >
                  <div className="w-full sm:w-1/2 p-4 sm:px-8">
                    <div className="bg-[#FAF8F5] dark:bg-[#141210] p-6 rounded-sm border border-[#EAE3D9] dark:border-[#3A332C] shadow-sm space-y-2">
                      <span className="font-serif-heading text-3xl text-[#C5A880] font-bold">
                        {ev.year}
                      </span>
                      <h3 className="font-serif-heading text-xl text-[#2C2420] dark:text-[#FAF8F5] font-semibold">
                        {ev.title}
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{ev.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Showcase */}
        <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
              Behind The Lens
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl text-[#2C2420] dark:text-[#FAF8F5]">
              Meet Our Photography Team
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {photographers.map((photo) => (
              <div
                key={photo.id}
                className="bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm overflow-hidden shadow-sm p-6 flex flex-col items-center text-center space-y-4"
              >
                <div className="relative w-36 h-36 rounded-full overflow-hidden shrink-0 border-2 border-[#C5A880] shadow-md bg-[#C5A880]/20">
                  <Image
                    src={photo.avatarUrl || "/backgrounds/camryn-portrait.jpg"}
                    alt={photo.name}
                    fill
                    sizes="144px"
                    unoptimized={photo.avatarUrl?.startsWith("data:") || photo.avatarUrl?.startsWith("http")}
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2 flex-1 flex flex-col justify-between w-full">
                  <div className="space-y-1">
                    <h3 className="font-serif-heading text-2xl text-[#2C2420] dark:text-[#FAF8F5] font-semibold">
                      {photo.name}
                    </h3>
                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded bg-[#C5A880]/20 text-[#C5A880]">
                        {photo.id === "photo-camryn" || photo.isLead || photo.name.toLowerCase().includes("camryn")
                          ? "Owner / Lead Photographer"
                          : photo.role && photo.role.toLowerCase().includes("associate")
                          ? photo.role
                          : "Associate Photographer"}
                      </span>
                    </div>
                    {photo.instagram && (
                      <p className="text-xs text-[#C5A880] font-medium pt-0.5">
                        <a
                          href={`https://instagram.com/${photo.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline"
                        >
                          {photo.instagram}
                        </a>
                      </p>
                    )}
                    <p className="text-xs text-[#C5A880]/80 font-medium pt-1">
                      {photo.specialties.join(" • ")}
                    </p>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-light my-2">
                    {photo.bio}
                  </p>
                  <div className="pt-3 border-t border-[#EAE3D9] dark:border-[#3A332C] text-[11px] text-neutral-500 space-y-1 w-full text-center">
                    <div>✉️ {photo.email}</div>
                    <div>📞 {photo.phone}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-[#2C2420] dark:bg-[#141210] text-[#FAF8F5] text-center border-t border-[#C5A880]/30">
          <div className="max-w-3xl mx-auto px-4 space-y-6">
            <h2 className="font-serif-heading text-3xl sm:text-5xl font-normal">
              Ready to Plan Your Session?
            </h2>
            <p className="text-xs text-[#EAE3D9]/90">
              We would love to get to know you and capture your special memories.
            </p>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 bg-[#C5A880] hover:bg-white text-[#2C2420] text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded-sm transition-all shadow-lg"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Shoot</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
