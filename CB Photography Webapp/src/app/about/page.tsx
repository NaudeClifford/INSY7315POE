"use client";

// About page introducing Camryn Burger, studio timeline history, team members, and gear specs
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MOCK_PHOTOGRAPHERS } from "@/data/photographers";
import { Award, Heart, ShieldCheck, Sparkles, TrendingUp, Users, Calendar, ArrowRight } from "lucide-react";

export default function AboutPage() {
  // Studio growth milestone timeline history items
  const timelineEvents = [

    {
      year: "2023",
      title: "The Founding",
      desc: "Camryn Burger established The Union Lab in Krugersdorp, starting with fewer than 5 client bookings per month focused on intimate portraiture and family milestones."
    },
    {
      year: "2024",
      title: "Rapid Growth & Recognition",
      desc: "Through word-of-mouth recommendations and consistent editorial quality, the studio expanded to over 50 monthly bookings across Gauteng."
    },
    {
      year: "2025",
      title: "Team & Service Expansion",
      desc: "Lethabo Ndlovu joined as Senior Associate Photographer to expand corporate event and graduation session availability."
    },
    {
      year: "2026",
      title: "National Vision",
      desc: "Launching nationwide destination coverage across South Africa with streamlined digital gallery workflows."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f3ed] text-[#402615]">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-[#402615] text-[#f7f3ed] pt-32 pb-20 border-b border-[#bea683]/30 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-[#bea683] font-semibold">
            Our Legacy & Story
          </span>
          <h1 className="font-serif-heading text-4xl sm:text-6xl font-normal">
            About Camryn Burger Photography
          </h1>
          <p className="text-xs sm:text-sm text-[#d6c8b1] max-w-xl mx-auto font-light leading-relaxed">
            Documenting genuine human connection through timeless, editorial photography across South Africa.
          </p>
        </div>
      </section>

      {/* Founder Intro Section */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5 relative">
            <div className="relative h-[480px] w-full rounded-sm overflow-hidden border-4 border-[#d6c8b1] shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"
                alt="Camryn Burger Founder"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="md:col-span-7 space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#7d5e3c] font-semibold">
              Founder & Lead Photographer
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-5xl text-[#402615] font-normal leading-tight">
              "We believe photographs should feel like poetry in motion."
            </h2>
            <p className="text-xs sm:text-sm text-[#7d5e3c] leading-relaxed font-light">
              Hi, I’m Camryn Burger. What began as a personal passion for capturing unscripted moments has grown into Camryn Burger Photography—a South African photography studio built on authenticity, warmth, and attention to detail.
            </p>
            <p className="text-xs sm:text-sm text-[#878679] leading-relaxed font-light">
              Whether documenting a tearful vow exchange under golden sunbeams, the glamour of a matric dance arrival, or executive corporate summits, our philosophy remains unchanged: every photograph must honor the genuine spirit of the occasion.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-[#d6c8b1]/30 border-y border-[#bea683]/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#7d5e3c] font-semibold">
              Milestones
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl text-[#402615]">
              Camryn Burger Photography Growth Story
            </h2>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 sm:before:left-1/2 before:w-0.5 before:bg-[#bea683]/50">
            {timelineEvents.map((ev, i) => (
              <div
                key={i}
                className={`relative flex flex-col sm:flex-row items-start ${
                  i % 2 === 0 ? "sm:flex-row-reverse" : ""
                }`}
              >
                <div className="w-full sm:w-1/2 p-4 sm:px-8">
                  <div className="bg-[#f7f3ed] p-6 rounded-sm border border-[#bea683]/40 shadow-sm space-y-2">
                    <span className="font-serif-heading text-3xl text-[#7d5e3c] font-bold">
                      {ev.year}
                    </span>
                    <h3 className="font-serif-heading text-xl text-[#402615] font-semibold">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-[#878679] leading-relaxed">{ev.desc}</p>
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
          <span className="text-xs uppercase tracking-[0.25em] text-[#7d5e3c] font-semibold">
            Behind The Lens
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl text-[#402615]">
            Meet Our Photography Team
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {MOCK_PHOTOGRAPHERS.map((photo) => (
            <div
              key={photo.id}
              className="bg-[#f7f3ed] border border-[#bea683]/40 rounded-sm overflow-hidden shadow-sm p-6 flex flex-col sm:flex-row gap-6 items-center"
            >
              <div className="relative w-36 h-36 rounded-full overflow-hidden shrink-0 border-2 border-[#bea683]">
                <Image src={photo.avatarUrl!} alt={photo.name} fill className="object-cover" />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="font-serif-heading text-2xl text-[#402615] font-semibold">
                  {photo.name}
                </h3>
                <p className="text-xs text-[#7d5e3c] font-medium">{photo.specialties.join(" • ")}</p>
                <p className="text-xs text-[#878679] leading-relaxed">{photo.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#402615] text-[#f7f3ed] text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <h2 className="font-serif-heading text-3xl sm:text-5xl font-normal">
            Ready to Plan Your Session?
          </h2>
          <p className="text-xs text-[#d6c8b1]">
            We would love to get to know you and capture your special memories.
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 bg-[#7d5e3c] hover:bg-[#bea683] hover:text-[#402615] text-white text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded-sm transition-all shadow-lg"
          >
            <Calendar className="w-4 h-4" />
            <span>Book a Shoot</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
