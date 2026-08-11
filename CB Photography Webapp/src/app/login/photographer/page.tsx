"use client";

// Photographer portal login page for assigned team members to view shoot schedules and upload gallery links
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Logo } from "@/components/ui/Logo";
import { loginUser, getAuthUser } from "@/lib/auth";
import { Camera, Lock, Mail, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function PhotographerLoginPage() {
  const router = useRouter();
  // Photographer credentials state
  const [email, setEmail] = useState("camryn@cbphotography.co.za");
  const [password, setPassword] = useState("photo123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already logged in as photographer, redirect directly
  React.useEffect(() => {
    const user = getAuthUser();
    if (user && user.role === "photographer") {
      window.location.assign("/photographer/dashboard");
    }
  }, []);

  // Photographer authentication submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    loginUser("photographer", email, "Camryn Burger");
    window.location.assign("/photographer/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#402615] text-[#f7f3ed]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-28">
        <div className="max-w-md w-full bg-[#f7f3ed] text-[#402615] p-8 sm:p-10 rounded-sm border border-[#bea683]/50 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="p-3 bg-[#7d5e3c]/20 text-[#7d5e3c] rounded-full w-fit mx-auto mb-2">
              <Camera className="w-6 h-6" />
            </div>
            <Logo variant="dark" size="sm" className="justify-center" />
            <h1 className="font-serif-heading text-2xl font-semibold text-[#402615]">
              Photographer Portal Login
            </h1>
            <p className="text-xs text-[#878679]">
              Manage shoot schedules, task checklists, and external gallery links.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#7d5e3c] mb-1">
                Photographer Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-[#bea683]/50 rounded-sm p-3 pl-10 text-sm text-[#402615] placeholder:text-[#878679] focus:outline-none focus:border-[#7d5e3c]"
                />
                <Mail className="w-4 h-4 text-[#878679] absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#7d5e3c] mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-[#bea683]/50 rounded-sm p-3 pl-10 pr-10 text-sm text-[#402615] placeholder:text-[#878679] focus:outline-none focus:border-[#7d5e3c]"
                />
                <Lock className="w-4 h-4 text-[#878679] absolute left-3 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-[#878679] hover:text-[#402615]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 text-[#7d5e3c]" /> : <Eye className="w-4 h-4 text-[#878679]" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7d5e3c] hover:bg-[#402615] text-white text-xs font-semibold uppercase tracking-widest py-3.5 rounded-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>{loading ? "Authenticating..." : "Access Photographer Dashboard"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Access Helper */}
          <div className="p-3 bg-[#d6c8b1]/30 rounded-sm text-center border border-[#bea683]/30">
            <p className="text-[11px] text-[#7d5e3c] font-semibold">Demo Credentials Loaded</p>
            <p className="text-[10px] text-[#878679]">Email: camryn@cbphotography.co.za | Pass: photo123</p>
          </div>

          <div className="pt-4 border-t border-[#bea683]/30 text-center text-xs text-[#878679] flex items-center justify-between">
            <Link href="/login" className="hover:text-[#402615] underline">
              Client Login
            </Link>
            <Link href="/login/admin" className="hover:text-[#402615] underline">
              Admin Login
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
