"use client";

// Contact page featuring inquiry contact form, studio map location details, phone/email, and FAQ accordion
import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toast, ToastMessage } from "@/components/ui/Toast";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Camera,
  Share2,
  Send,
  ChevronDown,
  CheckCircle2
} from "lucide-react";

export default function ContactPage() {
  // Contact inquiry form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "Wedding Inquiry",
    preferredDate: "",
    message: ""
  });

  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setToast({
        id: Date.now().toString(),
        type: "error",
        title: "Validation Error",
        message: "Please complete your name, email, and message before sending."
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setToast({
        id: Date.now().toString(),
        type: "success",
        title: "Message Sent Successfully!",
        message: `Thank you ${formData.name}. Camryn Burger Photography will reply to ${formData.email} within 24 hours.`
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        reason: "Wedding Inquiry",
        preferredDate: "",
        message: ""
      });
    }, 600);
  };

  const faqs = [
    {
      q: "How far in advance should we book our wedding or shoot date?",
      a: "We recommend reserving wedding dates 6 to 12 months in advance. For matric dances and graduations, 4 to 8 weeks in advance is ideal."
    },
    {
      q: "What is your travel policy beyond Krugersdorp?",
      a: "Shoots within 20 km of Krugersdorp carry zero travel fee. For locations beyond 20 km, travel is charged at R5 per kilometre."
    },
    {
      q: "When and how will our photographs be delivered?",
      a: "Edited photographs are delivered via a password-protected online gallery within 14 working days."
    },
    {
      q: "How does payment work?",
      a: "A 50% deposit secures your date and time. The remaining balance is payable before the shoot commences."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f3ed] text-[#402615]">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-[#402615] text-[#f7f3ed] pt-32 pb-20 border-b border-[#bea683]/30 text-center relative">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-[#bea683] font-semibold">
            Get In Touch
          </span>
          <h1 className="font-serif-heading text-4xl sm:text-6xl font-normal">
            Contact Camryn Burger
          </h1>
          <p className="text-xs sm:text-sm text-[#d6c8b1] max-w-xl mx-auto font-light leading-relaxed">
            Have questions or want to discuss a custom concept? Reach out directly via form, WhatsApp, or email.
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Studio Details & Quick WhatsApp */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#d6c8b1]/30 p-8 rounded-sm border border-[#bea683]/40 space-y-6">
              <h2 className="font-serif-heading text-2xl text-[#402615] font-semibold">
                Studio Information
              </h2>
              <ul className="space-y-4 text-xs text-[#402615]">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#7d5e3c] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Base Location:</strong>
                    <span>Krugersdorp, Gauteng, South Africa.<br />Travel available nationwide.</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#7d5e3c] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Call / Phone:</strong>
                    <a href="tel:+271233457890" className="hover:text-[#7d5e3c] transition-colors">
                      +27 (0)123 345 7890
                    </a>
                  </div>
                </li>


                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#7d5e3c] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Email Enquiries:</strong>
                    <a href="mailto:hello@cbphotography.co.za" className="hover:text-[#7d5e3c] transition-colors">
                      hello@cbphotography.co.za
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#7d5e3c] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Operating Hours:</strong>
                    <span>Mon - Sat: 08:00 - 18:00<br />Sun: Closed (Except confirmed events)</span>
                  </div>
                </li>
              </ul>

              {/* Direct WhatsApp Button */}
              <div className="pt-2">
                <a
                  href="https://wa.me/27824567890"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider py-3.5 px-6 rounded-sm transition-all shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat Direct on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-[#402615] p-6 rounded-sm border border-[#bea683]/40 text-[#f7f3ed] space-y-3">
              <h3 className="font-serif-heading text-xl text-[#bea683]">Service Area Map</h3>
              <p className="text-xs text-[#d6c8b1]">
                Serving Krugersdorp, Muldersdrift, Sandton, Pretoria, Magaliesburg, Johannesburg, and national destination weddings.
              </p>
              <div className="relative h-48 w-full rounded-sm overflow-hidden border border-[#bea683]/30 flex items-center justify-center bg-black/40 text-center p-4">
                <div className="space-y-1">
                  <MapPin className="w-8 h-8 text-[#bea683] mx-auto" />
                  <span className="text-xs text-[#d6c8b1] block font-semibold">
                    Interactive Map Integration Placeholder
                  </span>
                  <span className="text-[10px] text-[#878679] block">
                    Krugersdorp 20km Free Travel Radius
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7 bg-[#f7f3ed] border border-[#bea683]/40 rounded-sm p-8 shadow-sm">
            <h2 className="font-serif-heading text-3xl text-[#402615] font-medium mb-6">
              Send an Enquiry
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#7d5e3c] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full Name"
                    className="w-full bg-white border border-[#bea683]/50 rounded-sm p-3 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#7d5e3c] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email Address"
                    className="w-full bg-white border border-[#bea683]/50 rounded-sm p-3 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#7d5e3c] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+27..."
                    className="w-full bg-white border border-[#bea683]/50 rounded-sm p-3 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#7d5e3c] mb-1">
                    Reason for Enquiry
                  </label>
                  <select
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full bg-white border border-[#bea683]/50 rounded-sm p-3 text-sm focus:outline-none"
                  >
                    <option value="Wedding Inquiry">Wedding Photography</option>
                    <option value="Matric Dance">Matric Dance Session</option>
                    <option value="Graduation">Graduation Session</option>
                    <option value="Corporate">Corporate Event / Headshots</option>
                    <option value="Couples">Couples & Engagement Shoot</option>
                    <option value="Other">Other Event Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#7d5e3c] mb-1">
                  Preferred Shoot Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="w-full bg-white border border-[#bea683]/50 rounded-sm p-3 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#7d5e3c] mb-1">
                  Message *
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your event, venue vision, or specific questions..."
                  className="w-full bg-white border border-[#bea683]/50 rounded-sm p-3 text-sm focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#7d5e3c] hover:bg-[#402615] text-white text-xs font-semibold uppercase tracking-widest py-4 rounded-sm transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Sending Message..." : "Submit Enquiry"}</span>
              </button>
            </form>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="mt-20 max-w-4xl mx-auto space-y-6">
          <h2 className="font-serif-heading text-3xl text-[#402615] text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-[#bea683]/40 rounded-sm bg-white overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-4 text-left font-serif-heading text-lg text-[#402615] font-semibold flex justify-between items-center focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#7d5e3c] transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-xs text-[#878679] leading-relaxed border-t border-[#bea683]/20 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Toast toast={toast} onClose={() => setToast(null)} />
      <Footer />
    </div>
  );
}
