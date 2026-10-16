"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toast, ToastMessage } from "@/components/ui/Toast";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "Weddings & Elopements",
    preferredDate: "",
    message: ""
  });

  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setToast({
        id: Date.now().toString(),
        type: "error",
        title: "Validation Error",
        message: "Please fill out your name, email, and inquiry vision message."
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setToast({
        id: Date.now().toString(),
        type: "success",
        title: "Inquiry Dispatched Successfully!",
        message: `Thank you, ${formData.name}. Camryn Burger Studio will respond to ${formData.email} within 24 hours.`
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        reason: "Weddings & Elopements",
        preferredDate: "",
        message: ""
      });
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#141210] text-[#2C2420] dark:text-[#FAF8F5] transition-colors duration-300">
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* Banner */}
        <section className="bg-[#2C2420] dark:bg-[#141210] text-[#FAF8F5] pt-32 pb-16 border-b border-[#C5A880]/30 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 space-y-3">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
              Connect With Us
            </span>
            <h1 className="font-serif-heading text-4xl sm:text-6xl font-normal">
              Direct Inquiries & Studio Base
            </h1>
            <p className="text-xs sm:text-sm text-[#EAE3D9]/90 max-w-lg mx-auto font-light leading-relaxed">
              Based in Krugersdorp, Gauteng. Available nationwide for bespoke wedding and portrait commissions.
            </p>
          </div>
        </section>

        {/* Contact Grid Section */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12">
            {/* Left Column: Direct Studio Channels */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
                  Direct Communication
                </span>
                <h2 className="font-serif-heading text-2xl sm:text-3xl font-normal">
                  Let's Discuss Your Vision
                </h2>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                  Reach out directly via WhatsApp, phone, email or visit our Krugersdorp base. We respond to all wedding and shoot inquiries promptly.
                </p>
              </div>

              {/* 4 Direct Contact Action Cards */}
              <div className="space-y-3 pt-2">
                {/* 1. Click-to-call direct studio line */}
                <a
                  href="tel:+27837041228"
                  className="p-4 bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] hover:border-[#C5A880] rounded-sm flex items-center gap-4 transition-colors shadow-sm group"
                >
                  <div className="p-3 rounded-full bg-[#C5A880]/20 text-[#2C2420] dark:text-[#C5A880] group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">
                      Get in contact with Camryn
                    </span>
                    <strong className="text-sm text-[#2C2420] dark:text-[#FAF8F5]">
                      +27 83 704 1228
                    </strong>
                    <span className="text-[11px] text-neutral-500 block">Mon - Sat: 08:00 - 18:00</span>
                  </div>
                </a>

                {/* 2. Direct WhatsApp Chat Link */}
                <a
                  href="https://wa.me/27837041228"
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] hover:border-[#2E5E43] rounded-sm flex items-center gap-4 transition-colors shadow-sm group"
                >
                  <div className="p-3 rounded-full bg-[#2E5E43]/20 text-[#2E5E43] dark:text-emerald-400 group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">
                      Direct WhatsApp Chat
                    </span>
                    <strong className="text-sm text-[#2E5E43] dark:text-emerald-400">
                      Chat on WhatsApp Now
                    </strong>
                    <span className="text-[11px] text-neutral-500 block">+27 83 704 1228</span>
                  </div>
                </a>

                {/* 3. Click-to-Email */}
                <a
                  href="mailto:photo@camrynburgerphoto.co.za"
                  className="p-4 bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] hover:border-[#C5A880] rounded-sm flex items-center gap-4 transition-colors shadow-sm group"
                >
                  <div className="p-3 rounded-full bg-[#C5A880]/20 text-[#2C2420] dark:text-[#C5A880] group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">
                      Official Email Inquiry
                    </span>
                    <strong className="text-sm text-[#2C2420] dark:text-[#FAF8F5]">
                      photo@camrynburgerphoto.co.za
                    </strong>
                    <span className="text-[11px] text-neutral-500 block">Formal contracts & brief submissions</span>
                  </div>
                </a>

                {/* 4. Instagram Page */}
                <a
                  href="https://instagram.com/camrynburgerphoto"
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] hover:border-[#C5A880] rounded-sm flex items-center gap-4 transition-colors shadow-sm group"
                >
                  <div className="p-3 rounded-full bg-[#C5A880]/20 text-[#2C2420] dark:text-[#C5A880] group-hover:scale-105 transition-transform">
                    <InstagramIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">
                      Instagram Page
                    </span>
                    <strong className="text-sm text-[#2C2420] dark:text-[#FAF8F5]">
                      @camrynburgerphoto
                    </strong>
                    <span className="text-[11px] text-neutral-500 block">Follow our latest work & portfolio</span>
                  </div>
                </a>

                {/* 4. Physical Studio Base Location in Krugersdorp, Gauteng */}
                <div className="p-4 bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm flex items-center gap-4 shadow-sm">
                  <div className="p-3 rounded-full bg-[#C5A880]/20 text-[#2C2420] dark:text-[#C5A880]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">
                      Physical Base Location
                    </span>
                    <strong className="text-sm text-[#2C2420] dark:text-[#FAF8F5]">
                      Krugersdorp, Gauteng, South Africa
                    </strong>
                    <span className="text-[11px] text-neutral-500 block">
                      GPS: -26.1015, 27.7766 • 20km Complimentary Radius
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Direct Contact Inquiry Submission Form */}
            <div className="lg:col-span-7 bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-6 sm:p-10 shadow-md">
              <div className="border-b border-[#EAE3D9] dark:border-[#3A332C] pb-4 mb-6">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#C5A880]">
                  Online Inquiry Form
                </span>
                <h3 className="font-serif-heading text-2xl font-normal mt-0.5">
                  Send a Direct Message
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sarah and Michael"
                      className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-3 rounded-sm focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. sarah@example.com"
                      className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-3 rounded-sm focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+27 82 123 4567"
                      className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-3 rounded-sm focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                      Shoot Category
                    </label>
                    <select
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-3 rounded-sm focus:outline-none focus:border-[#C5A880]"
                    >
                      <option value="Weddings & Elopements">Weddings & Elopements</option>
                      <option value="Matric Dance Packages">Matric Dance Packages</option>
                      <option value="Couples & Engagements">Couples & Engagements</option>
                      <option value="Graduation Sessions">Graduation Sessions</option>
                      <option value="Corporate & Headshots">Corporate & Headshots</option>
                      <option value="Solo & Creative Portraits">Solo & Creative Portraits</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Vision, Date & Location Details *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your shoot date, venue/location in Gauteng or nationwide, guest count, and creative vision..."
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-3 rounded-sm focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#2C2420] dark:bg-[#C5A880] text-white dark:text-[#2C2420] hover:bg-[#C5A880] text-xs font-semibold uppercase tracking-widest py-3.5 rounded-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Sending Inquiry..." : "Submit Direct Inquiry"}</span>
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <Footer />
    </div>
  );
}
