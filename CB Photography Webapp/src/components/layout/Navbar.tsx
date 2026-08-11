"use client";

// Navigation bar header component with scroll detection, portal authentication links, and mobile drawer
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Calendar, User, LogOut, ShieldCheck, Camera } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

import { getAuthUser, logoutUser } from "@/lib/auth";

export const Navbar: React.FC = () => {
  // State for header background shift when scrolled past top threshold
  const [isScrolled, setIsScrolled] = useState(false);
  // State for toggling mobile full-screen slide-out drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Authenticated user state
  const [authUser, setAuthUser] = useState<{ role: string; email: string } | null>(null);
  // Current active URL path
  const pathname = usePathname();
  const router = useRouter();

  // Check login state on mount and route change
  useEffect(() => {
    setAuthUser(getAuthUser());
  }, [pathname]);

  const handleSignOut = () => {
    logoutUser();
    setAuthUser(null);
    window.location.assign("/login");
  };

  // Main website navigation links
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  // Helper method to highlight current active page route
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Sticky top navigation header bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#402615]/95 backdrop-blur-md py-3 shadow-md border-b border-[#bea683]/20 text-[#f7f3ed]"
            : "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5 text-[#f7f3ed]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Studio Brand Logo */}
          <Logo variant="light" size={isScrolled ? "sm" : "md"} />

          {/* Desktop Navigation Link List */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm tracking-widest uppercase transition-colors duration-200 relative font-medium ${
                    active
                      ? "text-[#bea683] font-semibold"
                      : "text-[#f7f3ed]/90 hover:text-[#d6c8b1]"
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#bea683] rounded-full animate-fade-in" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Action Buttons: Staff/Client Portal Logins & Booking CTA */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="relative group">
              <button className="inline-flex items-center gap-1.5 text-xs tracking-wider uppercase font-medium text-[#d6c8b1] hover:text-white px-3 py-2 transition-colors">
                <User className="w-4 h-4 text-[#bea683]" />
                <span>{authUser ? `Portal (${authUser.role})` : "Portal Logins"} ▾</span>
              </button>

              <div className="absolute right-0 top-full hidden group-hover:block bg-[#402615] border border-[#bea683]/40 rounded-sm shadow-xl p-2 w-52 space-y-1 text-xs z-50">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-[#bea683] tracking-widest border-b border-[#bea683]/20 pb-1 mb-1">
                  Access Portals
                </div>
                <Link href="/login" className="block px-3 py-2 text-[#f7f3ed] hover:bg-[#bea683]/20 rounded-sm flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-[#bea683]" />
                  <span>Client Login</span>
                </Link>
                <Link href="/login/photographer" className="block px-3 py-2 text-[#f7f3ed] hover:bg-[#bea683]/20 rounded-sm flex items-center gap-2">
                  <Camera className="w-3.5 h-3.5 text-[#bea683]" />
                  <span>Photographer Login</span>
                </Link>
                <Link href="/login/admin" className="block px-3 py-2 text-[#bea683] font-semibold hover:bg-[#bea683]/20 rounded-sm flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Console Login</span>
                </Link>

                {authUser && (
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 text-rose-300 hover:bg-rose-900/30 rounded-sm border-t border-[#bea683]/20 mt-1 flex items-center gap-2 font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            </div>

            <Link
              href="/booking"
              className="inline-flex items-center gap-2 bg-[#7d5e3c] hover:bg-[#bea683] text-white hover:text-[#402615] text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-sm transition-all duration-300 shadow-sm border border-[#bea683]/40"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Shoot</span>
            </Link>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              href="/booking"
              className="bg-[#7d5e3c] text-white text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-sm"
            >
              Book
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#f7f3ed] hover:text-[#bea683] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Slide-out Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-6 pt-24 animate-fade-in md:hidden">
          <div className="flex flex-col space-y-4 text-center">
            <Logo variant="light" size="lg" className="justify-center mb-2" />
            <hr className="border-[#bea683]/20 my-1" />
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-serif-heading tracking-widest uppercase py-1 transition-colors ${
                  isActive(link.href)
                    ? "text-[#bea683] font-semibold"
                    : "text-[#f7f3ed] hover:text-[#d6c8b1]"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-[#bea683]/20 my-1" />
            
            <div className="space-y-2 text-xs">
              <span className="text-[10px] uppercase tracking-widest text-[#bea683] font-bold">Portal Logins:</span>
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-[#bea683]/20 text-[#f7f3ed] py-2 px-4 rounded-sm flex items-center justify-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-[#bea683]" />
                  <span>Client Login</span>
                </Link>
                <Link
                  href="/login/photographer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-[#bea683]/20 text-[#f7f3ed] py-2 px-4 rounded-sm flex items-center justify-center gap-2"
                >
                  <Camera className="w-3.5 h-3.5 text-[#bea683]" />
                  <span>Photographer Login</span>
                </Link>
                <Link
                  href="/login/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-[#bea683]/30 text-[#bea683] font-bold py-2 px-4 rounded-sm flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Console Login</span>
                </Link>
              </div>
            </div>

            <Link
              href="/booking"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex justify-center items-center gap-2 bg-[#7d5e3c] text-white font-semibold uppercase tracking-wider py-3 px-6 rounded-sm text-xs mt-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Shoot Now</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
