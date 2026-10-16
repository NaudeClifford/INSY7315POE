"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Calendar, User, LogOut, LogIn, Sun, Moon, Settings } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useTheme } from "@/components/layout/ThemeContext";
import { fetchCurrentUser, logoutUser, AuthUser } from "@/lib/auth";
import { AuthModal } from "@/components/ui/AuthModal";
import { AccountSettingsModal } from "@/components/ui/AccountSettingsModal";

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const loadUser = () => {
    fetchCurrentUser().then((u) => {
      setAuthUser(u);
    });
  };

  useEffect(() => {
    loadUser();
    const handleAuthChanged = () => loadUser();
    window.addEventListener("auth_changed", handleAuthChanged);
    return () => window.removeEventListener("auth_changed", handleAuthChanged);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const handleSignOut = async () => {
    await logoutUser();
    setAuthUser(null);
    router.push("/login");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 pointer-events-auto ${
          isScrolled
            ? "bg-[#2C2420]/95 dark:bg-[#141210]/95 backdrop-blur-md py-2.5 shadow-md border-b border-[#C5A880]/20 text-[#FAF8F5]"
            : "bg-gradient-to-b from-black/85 via-black/50 to-transparent py-4 text-[#FAF8F5]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between relative z-[100]">
          <Logo variant="light" size={isScrolled ? "sm" : "md"} />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm tracking-widest uppercase transition-colors duration-200 relative font-medium ${
                    active
                      ? "text-[#C5A880] font-semibold"
                      : "text-[#FAF8F5]/90 hover:text-[#EAE3D9]"
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#C5A880] rounded-full animate-fade-in" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions: Theme Toggle, Portals, Book CTA */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Dual-Theme Instant Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-[#EAE3D9] hover:text-[#C5A880] transition-colors rounded-full hover:bg-white/10 active:scale-95"
              aria-label={`Switch to ${theme === "dark" ? "Cream Light" : "Dark"} Mode`}
              title={`Switch to ${theme === "dark" ? "Cream Light" : "Dark"} Mode`}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-[#C5A880]" />
              ) : (
                <Moon className="w-4 h-4 text-[#EAE3D9]" />
              )}
            </button>

            {/* Single Sign In Button / User Dashboard Status */}
            {authUser ? (
              <div className="flex items-center gap-1.5">
                <Link
                  href={
                    authUser.role === "admin"
                      ? "/admin/dashboard"
                      : authUser.role === "photographer"
                      ? "/photographer/dashboard"
                      : "/client/dashboard"
                  }
                  className="inline-flex items-center gap-1.5 text-xs tracking-wider uppercase font-medium text-[#EAE3D9] hover:text-[#C5A880] px-2.5 py-2 transition-colors"
                >
                  <User className="w-4 h-4 text-[#C5A880]" />
                  <span>{authUser.name.split(" ")[0]}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setSettingsOpen(true)}
                  className="text-xs text-[#EAE3D9] hover:text-[#C5A880] p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                  title="Account & Studio Settings"
                  aria-label="Account & Studio Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-xs text-rose-300 hover:text-rose-400 p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs tracking-wider uppercase font-medium text-[#EAE3D9] hover:text-white px-3 py-2 transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-[#C5A880]" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Book a Shoot CTA */}
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 bg-[#C5A880] hover:bg-white text-[#2C2420] text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-sm transition-all duration-300 shadow-md border border-[#C5A880]/40 active:scale-95 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Shoot</span>
            </Link>
          </div>

          {/* Mobile Right Menu Icons */}
          <div className="flex md:hidden items-center space-x-2 relative z-[105]">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-[#EAE3D9] hover:text-[#C5A880] rounded-full active:scale-95"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-[#C5A880]" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              href="/booking"
              className="bg-[#C5A880] text-[#2C2420] text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-sm shadow-sm active:scale-95 transition-transform flex items-center gap-1 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book</span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              className="p-2 text-[#FAF8F5] hover:text-[#C5A880] active:scale-95 transition-transform flex items-center justify-center focus:outline-none cursor-pointer bg-black/30 rounded-sm"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#C5A880]" /> : <Menu className="w-6 h-6 text-[#FAF8F5]" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="fixed inset-0 z-[90] bg-[#2C2420]/98 dark:bg-[#141210]/98 backdrop-blur-xl flex flex-col justify-between p-6 pt-24 pb-8 overflow-y-auto animate-fade-in md:hidden text-[#FAF8F5]"
        >
          <div className="flex flex-col space-y-4 text-center my-auto">
            <Logo variant="light" size="lg" className="justify-center mb-2" />
            <hr className="border-[#C5A880]/20 my-1" />

            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-lg font-serif-heading tracking-widest uppercase py-2 transition-transform active:scale-95 ${
                  isActive(link.href)
                    ? "text-[#C5A880] font-semibold"
                    : "text-[#FAF8F5] hover:text-[#EAE3D9]"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <hr className="border-[#C5A880]/20 my-1" />

            <div className="space-y-3 text-xs pt-1">
              {authUser ? (
                <div className="flex flex-col gap-2 max-w-xs mx-auto">
                  <Link
                    href={
                      authUser.role === "admin"
                        ? "/admin/dashboard"
                        : authUser.role === "photographer"
                        ? "/photographer/dashboard"
                        : "/client/dashboard"
                    }
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-[#C5A880] text-[#2C2420] font-bold py-2.5 px-4 rounded-sm flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    <span>My Dashboard ({authUser.name.split(" ")[0]})</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setSettingsOpen(true);
                    }}
                    className="bg-white/10 hover:bg-white/20 text-[#FAF8F5] py-2 px-4 rounded-sm flex items-center justify-center gap-2 text-xs"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Account Settings</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="text-rose-300 hover:text-rose-400 text-xs py-2 flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-white/10 text-[#FAF8F5] hover:bg-white/20 py-2.5 px-4 rounded-sm flex items-center justify-center gap-2 max-w-xs mx-auto w-full"
                >
                  <LogIn className="w-4 h-4 text-[#C5A880]" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>

            <Link
              href="/booking"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex justify-center items-center gap-2 bg-[#C5A880] text-[#2C2420] font-semibold uppercase tracking-wider py-3.5 px-6 rounded-sm text-xs mt-3 shadow-lg active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Shoot Now</span>
            </Link>
          </div>
        </div>
      )}

      {/* Account & Studio Settings Modal */}
      <AccountSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        currentUser={authUser}
        onUserUpdated={(u) => setAuthUser(u)}
      />

      {/* Auth Modal Trigger */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(u) => setAuthUser(u)}
      />
    </>
  );
};
