import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Phone, Mail, MapPin, Clock, MessageCircle, Share2 } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#2C2420] dark:bg-[#141210] text-[#FAF8F5] border-t border-[#C5A880]/30 pt-16 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Studio branding and social media icons */}
          <div className="space-y-4">
            <Logo variant="light" size="lg" />
            <p className="text-xs leading-relaxed text-[#EAE3D9]/90 font-light">
              Camryn Burger Photography is an editorial South African studio documenting weddings, matric dances, graduations, corporate events, and fine-art portraits.
            </p>
            <div className="pt-2 flex items-center space-x-3 text-[#C5A880]">
              <a
                href="https://instagram.com/camrynburgerphoto"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full border border-[#C5A880]/30 hover:bg-[#C5A880] hover:text-[#2C2420] transition-all"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full border border-[#C5A880]/30 hover:bg-[#C5A880] hover:text-[#2C2420] transition-all"
                aria-label="Facebook"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/27821234567"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full border border-[#C5A880]/30 hover:bg-[#C5A880] hover:text-[#2C2420] transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-serif-heading text-lg font-semibold tracking-wider text-[#C5A880] mb-4 uppercase">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-xs text-[#EAE3D9]">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-white transition-colors">Portfolio Gallery</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">Services & Pricing</Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-white transition-colors font-semibold text-[#C5A880]">Book a Shoot</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">About the Studio</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Contact & Base Map</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif-heading text-lg font-semibold tracking-wider text-[#C5A880] mb-4 uppercase">
              6 Categories
            </h3>
            <ul className="space-y-2.5 text-xs text-[#EAE3D9]">
              <li>
                <Link href="/services#matric-dance" className="hover:text-white transition-colors">Matric Dance Packages</Link>
              </li>
              <li>
                <Link href="/services#weddings" className="hover:text-white transition-colors">Weddings & Elopements</Link>
              </li>
              <li>
                <Link href="/services#couples" className="hover:text-white transition-colors">Couples & Engagements</Link>
              </li>
              <li>
                <Link href="/services#graduations" className="hover:text-white transition-colors">Graduation Sessions</Link>
              </li>
              <li>
                <Link href="/services#corporate" className="hover:text-white transition-colors">Corporate & Headshots</Link>
              </li>
              <li>
                <Link href="/services#portraits" className="hover:text-white transition-colors">Solo & Creative Portraits</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif-heading text-lg font-semibold tracking-wider text-[#C5A880] mb-4 uppercase">
              Studio Details
            </h3>
            <ul className="space-y-3 text-xs text-[#EAE3D9]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <span>Base: Krugersdorp, Gauteng.<br />20km Complimentary Travel Radius.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A880] shrink-0" />
                <a href="tel:+27837041228" className="hover:text-white transition-colors">+27 83 704 1228</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A880] shrink-0" />
                <a href="mailto:photo@camrynburgerphoto.co.za" className="hover:text-white transition-colors">photo@camrynburgerphoto.co.za</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <span>Mon - Sat: 08:00 - 18:00<br />Sun: By Appointment Only</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-[#C5A880]/20 my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 gap-4">
          <p>© {new Date().getFullYear()} Camryn Burger Photography. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link href="/terms" className="hover:text-[#C5A880] transition-colors">Terms & Conditions</Link>
            <Link href="/client/dashboard" className="hover:text-[#C5A880] transition-colors">Client Portal</Link>
            <Link href="/photographer/dashboard" className="hover:text-[#C5A880] transition-colors">Photographer Portal</Link>
            <Link href="/admin/dashboard" className="hover:text-[#C5A880] transition-colors">Admin Console</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
