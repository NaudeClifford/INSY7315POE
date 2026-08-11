"use client";

// Client portal login authentication page for viewing shoot status, invoices, and photo galleries
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Logo } from "@/components/ui/Logo";
import { loginUser, getAuthUser } from "@/lib/auth";
import { Eye, EyeOff, Lock, Mail, User, ShieldCheck, Camera, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  // Form input state with default demo credentials
  const [email, setEmail] = useState("nadine.dp@gmail.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in as client, redirect directly
  React.useEffect(() => {
    const user = getAuthUser();
    if (user && user.role === "client") {
      window.location.assign("/client/dashboard");
    }
  }, []);

  // Authentication submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill out both email and password.");
      return;
    }
    setError("");
    setLoading(true);

    loginUser("client", email, email.split("@")[0]);
    window.location.assign("/client/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#402615] text-[#f7f3ed]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-28">
        <div className="max-w-md w-full bg-[#f7f3ed] text-[#402615] p-8 sm:p-10 rounded-sm border border-[#bea683]/50 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <Logo variant="dark" size="md" className="justify-center" />
            <h1 className="font-serif-heading text-2xl font-semibold pt-2 text-[#402615]">
              Customer Login
            </h1>
            <p className="text-xs text-[#878679]">
              Access your upcoming bookings, invoices, and private galleries.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-900/10 border border-rose-500/40 rounded-sm text-rose-800 text-xs text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#7d5e3c] mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nadine@example.com"
                  className="w-full bg-white border border-[#bea683]/50 rounded-sm p-3 pl-10 text-sm text-[#402615] placeholder:text-[#878679] focus:outline-none focus:border-[#7d5e3c]"
                />
                <Mail className="w-4 h-4 text-[#878679] absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#7d5e3c]">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#7d5e3c] hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
              <span>{loading ? "Authenticating..." : "Sign In to Client Portal"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Access Helper */}
          <div className="p-3 bg-[#d6c8b1]/30 rounded-sm text-center border border-[#bea683]/30">
            <p className="text-[11px] text-[#7d5e3c] font-semibold">Demo Customer Credentials</p>
            <p className="text-[10px] text-[#878679]">Email: nadine.dp@gmail.com | Pass: password123</p>
          </div>

          <div className="pt-4 border-t border-[#bea683]/30 text-center text-xs space-y-3 text-[#878679]">
            <p>
              Don’t have an account?{" "}
              <Link href="/register" className="font-semibold text-[#7d5e3c] hover:underline">
                Create Account
              </Link>
            </p>

            <div className="pt-2 border-t border-[#bea683]/20 flex items-center justify-center gap-4 text-xs font-semibold">
              <Link
                href="/login/photographer"
                className="text-[#7d5e3c] hover:text-[#402615] flex items-center gap-1 bg-[#d6c8b1]/30 px-3 py-1.5 rounded-sm"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Photographer Portal</span>
              </Link>
              <Link
                href="/login/admin"
                className="text-[#402615] hover:text-[#7d5e3c] flex items-center gap-1 bg-[#d6c8b1]/30 px-3 py-1.5 rounded-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
