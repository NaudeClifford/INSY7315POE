"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Logo } from "@/components/ui/Logo";
import { loginUser, fetchCurrentUser } from "@/lib/auth";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check active session on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const user = await fetchCurrentUser();
      if (!cancelled && user) {
        if (user.role === "admin") router.push("/admin/dashboard");
        else if (user.role === "photographer") router.push("/photographer/dashboard");
        else router.push("/client/dashboard");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Please fill out both email and password.");
      return;
    }
    setError("");
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const result = await loginUser(cleanEmail, password);

    if (!result.success || !result.user) {
      setError(result.error ?? "Invalid email or password.");
      setLoading(false);
      return;
    }

    // Auto-direct to the correct dashboard based on account role
    if (result.user.role === "admin") {
      router.push("/admin/dashboard");
    } else if (result.user.role === "photographer") {
      router.push("/photographer/dashboard");
    } else {
      router.push("/client/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#141210] text-[#2C2420] dark:text-[#FAF8F5] transition-colors duration-300">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-28">
        <div className="max-w-md w-full bg-white dark:bg-[#1C1917] p-8 sm:p-10 rounded-sm border border-[#EAE3D9] dark:border-[#3A332C] shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <Logo variant="dark" size="md" className="justify-center" />
            <h1 className="font-serif-heading text-2xl font-semibold pt-2 text-[#2C2420] dark:text-[#FAF8F5]">
              Studio Portal Sign In
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Sign in with your credentials to automatically access your client, photographer, or admin portal.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-sm text-rose-600 dark:text-rose-400 text-xs text-center">
              {error}
            </div>
          )}

          <form method="POST" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-3 pl-10 text-xs text-[#2C2420] dark:text-[#FAF8F5] placeholder:text-neutral-400 focus:outline-none focus:border-[#C5A880]"
                />
                <Mail className="w-4 h-4 text-[#C5A880] absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs uppercase tracking-wider font-semibold text-neutral-600 dark:text-neutral-300">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#C5A880] hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-3 pl-10 pr-10 text-xs text-[#2C2420] dark:text-[#FAF8F5] placeholder:text-neutral-400 focus:outline-none focus:border-[#C5A880]"
                />
                <Lock className="w-4 h-4 text-[#C5A880] absolute left-3 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-neutral-400 hover:text-[#C5A880]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2C2420] dark:bg-[#C5A880] hover:bg-[#C5A880] dark:hover:bg-white text-white dark:text-[#2C2420] text-xs font-semibold uppercase tracking-widest py-3.5 rounded-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>{loading ? "Authenticating..." : "Sign In"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-neutral-500 dark:text-neutral-400">
            Don’t have an account?{" "}
            <Link href="/register" className="font-semibold text-[#C5A880] hover:underline">
              Create Client Account
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
