import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Phone, Mail, MapPin, Clock, MessageCircle, Camera, Share2 } from "lucide-react";

// Website footer component displaying studio background, sitemap, services, and contact info
export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#402615] text-[#f7f3ed] border-t border-[#bea683]/30 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer 4-Column Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Studio Brand Summary & Social Links */}
          <div className="space-y-4">
            <Logo variant="light" size="lg" />
            <p className="text-xs leading-relaxed text-[#d6c8b1]/90">
              Camryn Burger Photography is a premier South African photography studio dedicated to documenting weddings, matric dances, graduations, corporate milestones and raw human connections through timeless imagery.
            </p>
            <div className="pt-2 flex items-center space-x-3 text-[#bea683]">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full border border-[#bea683]/30 hover:bg-[#bea683] hover:text-[#402615] transition-all"
                aria-label="Instagram"
              >
                <Camera className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full border border-[#bea683]/30 hover:bg-[#bea683] hover:text-[#402615] transition-all"
                aria-label="Facebook"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/27824567890"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full border border-[#bea683]/30 hover:bg-[#bea683] hover:text-[#402615] transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>


          {/* Column 2: Quick Links & Site Navigation */}
          <div>
            <h3 className="font-serif-heading text-lg font-semibold tracking-wider text-[#bea683] mb-4 uppercase">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-xs text-[#d6c8b1]">
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
                <Link href="/booking" className="hover:text-white transition-colors font-medium text-[#bea683]">Book a Shoot</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">About Camryn Burger</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Photography Service Specialisations */}
          <div>
            <h3 className="font-serif-heading text-lg font-semibold tracking-wider text-[#bea683] mb-4 uppercase">
              Specialisations
            </h3>
            <ul className="space-y-2.5 text-xs text-[#d6c8b1]">
              <li>
                <Link href="/services#weddings" className="hover:text-white transition-colors">Wedding Photography</Link>
              </li>
              <li>
                <Link href="/services#matric-dances" className="hover:text-white transition-colors">Matric Dance Sessions</Link>
              </li>
              <li>
                <Link href="/services#graduations" className="hover:text-white transition-colors">Graduation Portraits</Link>
              </li>
              <li>
                <Link href="/services#corporate" className="hover:text-white transition-colors">Corporate & Commercial</Link>
              </li>
              <li>
                <Link href="/services#couples" className="hover:text-white transition-colors">Couples & Engagements</Link>
              </li>
              <li>
                <Link href="/services#events" className="hover:text-white transition-colors">Parties & Celebrations</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Studio Contact Information & Operating Hours */}
          <div>
            <h3 className="font-serif-heading text-lg font-semibold tracking-wider text-[#bea683] mb-4 uppercase">
              Studio Details
            </h3>
            <ul className="space-y-3 text-xs text-[#d6c8b1]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#bea683] shrink-0 mt-0.5" />
                <span>Base Studio: Krugersdorp, Gauteng.<br />Serving nationwide in South Africa.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#bea683] shrink-0" />
                <a href="tel:+271233457890" className="hover:text-white transition-colors">+27 (0)123 345 7890</a>
              </li>

              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#bea683] shrink-0" />
                <a href="mailto:hello@cbphotography.co.za" className="hover:text-white transition-colors">hello@cbphotography.co.za</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#bea683] shrink-0 mt-0.5" />
                <span>Mon - Sat: 08:00 - 18:00<br />Sun: By Appointment Only</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-[#bea683]/20 my-8" />

        {/* Footer Bottom Bar: Copyright Notice & Internal Portal Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#878679] gap-4">
          <p>© {new Date().getFullYear()} Camryn Burger Photography. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link href="/terms" className="hover:text-[#bea683] transition-colors">Terms & Conditions</Link>
            <Link href="/login" className="hover:text-[#bea683] transition-colors">Client Portal</Link>
            <Link href="/login/photographer" className="hover:text-[#bea683] transition-colors">Photographer Portal</Link>
            <Link href="/login/admin" className="hover:text-[#bea683] transition-colors">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

