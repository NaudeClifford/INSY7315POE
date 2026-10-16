"use client";

// Administrative portal login page for managing overall bookings, revenue, and client accounts
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Logo } from "@/components/ui/Logo";
import { loginUser, fetchCurrentUser } from "@/lib/auth";
import { ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  // Admin credentials state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Ask backend if an admin session exists
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const user = await fetchCurrentUser();
      if (!cancelled && user && user.role === "admin") {
        router.push("/admin/dashboard");
      }
    })();
    return () => { cancelled = true; };
  }, [router]);

  // Admin authentication submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setError("");
    setLoading(true);

    const result = await loginUser(email, password, "admin");

    if (!result.success) {
      setError(result.error ?? "Invalid admin credentials.");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#402615] text-[#f7f3ed]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-28">
        <div className="max-w-md w-full bg-[#f7f3ed] text-[#402615] p-8 sm:p-10 rounded-sm border border-[#bea683]/50 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="p-3 bg-[#402615] text-[#bea683] rounded-full w-fit mx-auto mb-2">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <Logo variant="dark" size="sm" className="justify-center" />
            <h1 className="font-serif-heading text-2xl font-semibold text-[#402615]">
              Admin Console Login
            </h1>
            <p className="text-xs text-[#878679]">
              Manage business analytics, bookings, packages, customers, and team roles.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-900/10 border border-rose-500/40 rounded-sm text-rose-800 text-xs text-center">
              {error}
            </div>
          )}

          <form method="POST" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#7d5e3c] mb-1">
                Admin Email
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
                Admin Security Password
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
              className="w-full bg-[#402615] hover:bg-[#7d5e3c] text-white text-xs font-semibold uppercase tracking-widest py-3.5 rounded-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? "Authenticating..." : "Access Admin Console"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>


          <div className="pt-4 border-t border-[#bea683]/30 text-center text-xs text-[#878679] flex items-center justify-between">
            <Link href="/login" className="hover:text-[#402615] underline">
              Client Login
            </Link>
            <Link href="/login/photographer" className="hover:text-[#402615] underline">
              Photographer Login
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
