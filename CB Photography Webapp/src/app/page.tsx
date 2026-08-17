"use client";

// Homepage view featuring hero banner, service overview, filterable portfolio grid, client testimonials, and booking CTA
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Lightbox } from "@/components/ui/Lightbox";
import { MOCK_SERVICES } from "@/data/services";
import { MOCK_PORTFOLIO } from "@/data/portfolio";
import { MOCK_TESTIMONIALS } from "@/data/testimonials";
import { PortfolioCategory } from "@/types/gallery";
import { formatCurrency } from "@/lib/utils";
import {
  Calendar,
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  Award,
  Sparkles,
  Camera,
  Star,
  CheckCircle,
  Heart
} from "lucide-react";

export default function HomePage() {
  // State for filtering portfolio gallery items by category tab
  const [selectedCategory, setSelectedCategory] = useState<PortfolioCategory>("All");
  // State for active fullscreen photo lightbox modal
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Available portfolio gallery filter categories
  const categories: PortfolioCategory[] = [
    "All",
    "Solo",
    "Couples",
    "Graduations",
    "Events",
    "Group",
    "Weddings",
    "Matric Dances"
  ];

  // Filter portfolio images according to selected category
  const filteredPortfolio =
    selectedCategory === "All"
      ? MOCK_PORTFOLIO
      : MOCK_PORTFOLIO.filter((item) => item.category === selectedCategory);

  // Trigger lightbox viewer modal for selected image
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f3ed] text-[#402615]">
      <Navbar />


      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden gpu-accelerate">
        {/* Photography Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/backgrounds/hero-bg.jpg"
            alt="Hero Photography backdrop"
            fill
            priority
            loading="eager"
            sizes="100vw"
            quality={85}
            style={{ objectFit: "cover", objectPosition: "center" }}
            className="scale-105 transition-transform duration-10000"
          />
          {/* Dark Overlay for contrast & luxury feel */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#402615] via-black/60 to-black/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-[#f7f3ed] pt-12">
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-[#bea683] font-semibold mb-4 px-4 py-1.5 rounded-full border border-[#bea683]/40 bg-black/40 backdrop-blur-sm animate-fade-in">
            Based in South Africa
          </span>

          <h1 className="font-serif-heading text-4xl sm:text-6xl md:text-7xl font-light tracking-wide leading-tight mb-6">
            Your story, <br className="hidden sm:block" />
            <span className="italic font-normal text-[#d6c8b1]">captured beautifully.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#d6c8b1]/90 leading-relaxed mb-10 font-light">
            Camryn Burger Photography is a South African photography studio dedicated to documenting weddings, matric dances, graduations, corporate events and meaningful connections through timeless, editorial imagery.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none">
            <Link
              href="/booking"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#7d5e3c] hover:bg-[#bea683] text-white hover:text-[#402615] text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded-sm transition-all duration-300 shadow-xl border border-[#bea683]/40 min-h-[44px] active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Shoot</span>
            </Link>

            <Link
              href="/portfolio"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black/40 hover:bg-white/10 text-[#f7f3ed] text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded-sm transition-all duration-300 border border-[#bea683]/30 backdrop-blur-sm min-h-[44px] active:scale-95"
            >
              <span>View Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Subtle Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-[#d6c8b1]/70 animate-bounce pointer-events-none">
          <span className="text-[10px] uppercase tracking-widest mb-1">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* 2. INTRODUCTION SECTION */}
      <section className="py-16 sm:py-24 bg-[#f7f3ed] border-b border-[#bea683]/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="md:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-[#7d5e3c] font-semibold">
                About The Studio
              </span>
              <h2 className="font-serif-heading text-3xl sm:text-5xl text-[#402615] leading-tight font-normal">
                Crafting visual heirlooms with warmth, romance & authenticity.
              </h2>
              <p className="text-sm sm:text-base text-[#7d5e3c] leading-relaxed font-light">
                Camryn Burger Photography is a South African photography studio dedicated to documenting weddings, celebrations, milestones and meaningful connections through timeless imagery.
              </p>
              <p className="text-xs sm:text-sm text-[#878679] leading-relaxed font-light">
                Founded by Camryn Burger in 2023, the studio started with a quiet passion for authentic storytelling. Through dedication to client trust and creative consistency, the business grew rapidly from handling fewer than five shoots a month to over 50 monthly bookings across Gauteng and national destinations.
              </p>

              <div className="pt-4 flex items-center justify-between sm:justify-start sm:space-x-8 text-center sm:text-left">
                <div>
                  <span className="block font-serif-heading text-2xl sm:text-3xl text-[#402615]">50+</span>
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#878679]">Monthly Shoots</span>
                </div>
                <div className="h-8 w-px bg-[#bea683]/30" />
                <div>
                  <span className="block font-serif-heading text-2xl sm:text-3xl text-[#402615]">100%</span>
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#878679]">Satisfaction</span>
                </div>
                <div className="h-8 w-px bg-[#bea683]/30" />
                <div>
                  <span className="block font-serif-heading text-2xl sm:text-3xl text-[#402615]">14 Days</span>
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#878679]">Turnaround</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 relative mt-6 md:mt-0">
              <div className="relative h-64 sm:h-[450px] w-full rounded-sm overflow-hidden shadow-2xl border-4 border-[#d6c8b1] bg-[#bea683]/20 flex items-center justify-center">
                <span className="font-serif-heading text-lg sm:text-xl uppercase tracking-widest text-[#7d5e3c] font-bold">
                  Camryn Burger Studio
                </span>
              </div>
              <div className="absolute -bottom-4 sm:-bottom-6 -left-2 sm:-left-6 bg-[#402615] text-[#f7f3ed] p-4 sm:p-6 rounded-sm shadow-xl max-w-[280px] sm:max-w-xs border border-[#bea683]/30">
                <p className="font-serif-heading text-sm sm:text-lg italic text-[#d6c8b1]">
                  "Every photograph should evoke the exact feeling of the moment."
                </p>
                <span className="block text-[10px] sm:text-[11px] uppercase tracking-widest text-[#bea683] mt-2 font-semibold">
                  — Camryn Burger, Founder
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED SERVICES */}
      <section className="py-16 sm:py-24 bg-[#d6c8b1]/20 border-b border-[#bea683]/20 content-visibility-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#7d5e3c] font-semibold">
              Our Expertise
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-5xl text-[#402615] font-normal">
              Featured Photography Services
            </h2>
            <p className="text-xs sm:text-sm text-[#878679] font-light">
              Tailored luxury packages crafted for life's most precious occasions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {MOCK_SERVICES.map((service) => (
              <div
                key={service.id}
                className="group bg-[#f7f3ed] border border-[#bea683]/30 rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 sm:h-64 w-full overflow-hidden">
                    <Image
                      src={service.imageUrl}
                      alt={service.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[#f7f3ed]">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-[#bea683] bg-black/50 px-2.5 py-1 rounded-sm backdrop-blur-sm">
                        From R{formatCurrency(service.startingPriceZAR)}
                      </span>

                      <span className="text-[11px] font-medium text-[#d6c8b1]">
                        {service.approxDuration}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 space-y-3">
                    <h3 className="font-serif-heading text-xl sm:text-2xl text-[#402615] font-medium group-hover:text-[#7d5e3c] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-[#878679] leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 sm:p-6 pt-0">
                  <hr className="border-[#bea683]/20 mb-4" />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#7d5e3c] font-medium">
                      {service.editedImagesSummary}
                    </span>
                    <Link
                      href={`/booking?service=${service.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#402615] hover:text-[#7d5e3c] transition-colors py-2 active:scale-95"
                    >
                      <span>Book Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 sm:mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 bg-[#402615] text-[#f7f3ed] hover:bg-[#7d5e3c] text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded-sm transition-colors shadow-md min-h-[44px] active:scale-95"
            >
              <span>Explore All Packages & Add-ons</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PORTFOLIO GALLERY */}
      <section className="py-16 sm:py-24 bg-[#402615] text-[#f7f3ed] content-visibility-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-[#bea683] font-semibold">
                Visual Showcase
              </span>
              <h2 className="font-serif-heading text-3xl sm:text-5xl text-white font-normal">
                Featured Portfolio
              </h2>
            </div>

            {/* Mobile Touch Stacked Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs uppercase tracking-wider px-3.5 py-2 rounded-sm transition-all shrink-0 min-h-[38px] active:scale-95 cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#bea683] text-[#402615] font-semibold shadow-md"
                      : "bg-white/10 text-[#d6c8b1] hover:bg-white/20 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Editorial Responsive Grid (Uniform Fixed Box Size) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredPortfolio.map((item, index) => (
              <div
                key={item.id}
                onClick={() => openLightbox(index)}
                className="group relative h-64 sm:h-80 w-full rounded-sm overflow-hidden cursor-pointer bg-[#2b190e] border border-[#bea683]/40 shadow-md hover:shadow-2xl transition-all duration-300 active:scale-98"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-contain p-1.5 group-hover:scale-105 transition-transform duration-700"
                />
                {/* Always show overlay title on mobile for better touch discovery */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 p-4 sm:p-5 flex flex-col justify-end text-white pointer-events-none">
                  <span className="text-[10px] uppercase tracking-widest text-[#bea683] font-semibold">
                    {item.category}
                  </span>
                  <h3 className="font-serif-heading text-base sm:text-lg font-medium mt-0.5 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#d6c8b1] mt-0.5 font-light">
                    {item.location} • {item.date}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 sm:mt-12 text-center">
            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center gap-2 border border-[#bea683] text-[#bea683] hover:bg-[#bea683] hover:text-[#402615] text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded-sm transition-all min-h-[44px] active:scale-95 cursor-pointer"
            >
              <span>View Full Gallery</span>
              <Camera className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. HOW BOOKING WORKS */}
      <section className="py-24 bg-[#f7f3ed] border-b border-[#bea683]/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#7d5e3c] font-semibold">
              Seamless Process
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-5xl text-[#402615]">
              How Booking Works
            </h2>
            <p className="text-xs sm:text-sm text-[#878679] font-light">
              Simple, transparent 4-step reservation designed for your convenience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Select a Service",
                desc: "Choose from weddings, matric dances, corporate events, or couples sessions."
              },
              {
                step: "02",
                title: "Choose Date & Package",
                desc: "Pick your preferred photographer, date, time slot, and customized package."
              },
              {
                step: "03",
                title: "Pay Deposit",
                desc: "Secure your date with a 50% online deposit via Yoco or direct EFT."
              },
              {
                step: "04",
                title: "Shoot & Deliver",
                desc: "Attend your session and receive your private high-res digital gallery."
              }
            ].map((st, idx) => (
              <div
                key={idx}
                className="bg-[#d6c8b1]/20 p-8 rounded-sm border border-[#bea683]/30 relative space-y-4"
              >
                <span className="font-serif-heading text-4xl text-[#bea683] font-bold block">
                  {st.step}
                </span>
                <h3 className="font-serif-heading text-xl text-[#402615] font-semibold">
                  {st.title}
                </h3>
                <p className="text-xs text-[#878679] leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE CAMRYN BURGER PHOTOGRAPHY */}
      <section className="py-24 bg-[#d6c8b1]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#7d5e3c] font-semibold">
              The Camryn Burger Standard
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-5xl text-[#402615]">
              Why Choose Our Studio
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Camera className="w-6 h-6 text-[#7d5e3c]" />,
                title: "Professional Photographers",
                desc: "Equipped with high-end full-frame gear, backup cameras, and artful eye for posing."
              },
              {
                icon: <Sparkles className="w-6 h-6 text-[#7d5e3c]" />,
                title: "Personalised Packages",
                desc: "Customisable packages tailored to your duration, budget, and additional requests."
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-[#7d5e3c]" />,
                title: "Secure Online Booking",
                desc: "Instant booking wizard with transparent quote breakdowns and automated receipts."
              },
              {
                icon: <Award className="w-6 h-6 text-[#7d5e3c]" />,
                title: "Transparent Pricing",
                desc: "No hidden costs. Clear travel calculations (free within 20km Krugersdorp)."
              },
              {
                icon: <CheckCircle className="w-6 h-6 text-[#7d5e3c]" />,
                title: "Reliable 14-Day Delivery",
                desc: "Receive your retouched high-resolution photographs within 14 working days guaranteed."
              },
              {
                icon: <Heart className="w-6 h-6 text-[#7d5e3c]" />,
                title: "Private Online Galleries",
                desc: "Share your high-res digital gallery with friends & family via password-protected links."
              }
            ].map((pill, idx) => (
              <div
                key={idx}
                className="bg-[#f7f3ed] p-8 rounded-sm border border-[#bea683]/40 shadow-sm space-y-3"
              >
                <div className="p-3 bg-[#bea683]/20 rounded-sm w-fit mb-2">
                  {pill.icon}
                </div>
                <h3 className="font-serif-heading text-xl text-[#402615] font-semibold">
                  {pill.title}
                </h3>
                <p className="text-xs text-[#878679] leading-relaxed">{pill.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="py-24 bg-[#402615] text-[#f7f3ed]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#bea683] font-semibold">
              Kind Words
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-5xl text-white">
              Client Testimonials
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {MOCK_TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="bg-black/40 border border-[#bea683]/30 p-8 rounded-sm space-y-4 relative"
              >
                <div className="flex items-center space-x-1 text-[#bea683]">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#bea683]" />
                  ))}
                </div>
                <p className="font-serif-heading text-lg italic text-[#d6c8b1] leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="pt-2 flex items-center justify-between text-xs border-t border-[#bea683]/20">
                  <span className="font-semibold text-white">{t.clientName}</span>
                  <span className="text-[#878679]">{t.roleOrEvent}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FINAL CALL TO ACTION */}
      <section className="py-24 bg-[#bea683]/20 border-t border-[#bea683]/30 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <span className="text-xs uppercase tracking-[0.3em] text-[#7d5e3c] font-semibold">
            Ready to Begin?
          </span>
          <h2 className="font-serif-heading text-4xl sm:text-6xl text-[#402615] font-normal">
            Let’s create something worth remembering.
          </h2>
          <p className="text-xs sm:text-sm text-[#7d5e3c] max-w-xl mx-auto font-light">
            Secure your preferred shoot date online or reach out to our team to discuss your bespoke photography vision.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/booking"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#7d5e3c] hover:bg-[#402615] text-white text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded-sm transition-all shadow-lg"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Shoot Now</span>
            </Link>

            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#402615] text-[#402615] hover:bg-[#402615] hover:text-white text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded-sm transition-all"
            >
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox Component */}
      <Lightbox
        items={filteredPortfolio}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIndex) => setLightboxIndex(newIndex)}
      />

      <Footer />
    </div>
  );
}
