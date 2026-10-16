"use client";

// New client account registration page with automatic Firebase verification email
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Logo } from "@/components/ui/Logo";
import { Eye, EyeOff, Lock, Mail, User, Phone, CheckCircle2, ArrowRight } from "lucide-react";
import { registerUser } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdEmail, setCreatedEmail] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      setError("Please complete all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    const result = await registerUser(
      formData.email,
      formData.password,
      formData.fullName,
      formData.phone
    );

    setLoading(false);

    if (!result.success) {
      setError(result.error || "Failed to create account.");
      return;
    }

    // Set registered email to trigger the verification confirmation screen
    setCreatedEmail(formData.email.trim().toLowerCase());
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#402615] text-[#f7f3ed]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-28">
        <div className="max-w-md w-full bg-[#f7f3ed] text-[#402615] p-8 sm:p-10 rounded-sm border border-[#bea683]/50 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <Logo variant="dark" size="md" className="justify-center" />
            <h1 className="font-serif-heading text-2xl font-semibold pt-2 text-[#402615]">
              {createdEmail ? "Account Created!" : "Create Client Account"}
            </h1>
            <p className="text-xs text-[#878679]">
              {createdEmail
                ? "Your client profile is ready. Please check your email to verify your address."
                : "Register to manage your bookings, invoices, and photo galleries."}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-900/10 border border-rose-500/40 rounded-sm text-rose-800 text-xs text-center">
              {error}
            </div>
          )}

          {createdEmail ? (
            <div className="p-6 bg-emerald-900/10 border border-emerald-500/40 rounded-sm text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-serif-heading text-lg font-semibold text-emerald-900">
                  Welcome to CB Photography
                </h3>
                <p className="text-xs text-[#878679] leading-relaxed">
                  We have dispatched an account verification email to{" "}
                  <strong className="text-[#402615] font-semibold">{createdEmail}</strong>.
                </p>
              </div>

              <div className="text-[11px] text-[#878679] bg-white/70 p-3 rounded-sm border border-[#bea683]/30 text-left space-y-1">
                <p className="font-semibold text-[#7d5e3c]">Verification notice:</p>
                <p>
                  Click the link in the email to verify your email address. You can also proceed straight to your dashboard now.
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push("/client/dashboard")}
                className="w-full bg-[#402615] hover:bg-[#7d5e3c] text-white text-xs font-semibold uppercase tracking-widest py-3.5 rounded-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Access Client Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#7d5e3c] mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Jane Doe"
                    className="w-full bg-white border border-[#bea683]/50 rounded-sm p-3 pl-10 text-sm text-[#402615] placeholder:text-[#878679] focus:outline-none focus:border-[#7d5e3c]"
                  />
                  <User className="w-4 h-4 text-[#878679] absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#7d5e3c] mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@example.com"
                    className="w-full bg-white border border-[#bea683]/50 rounded-sm p-3 pl-10 text-sm text-[#402615] placeholder:text-[#878679] focus:outline-none focus:border-[#7d5e3c]"
                  />
                  <Mail className="w-4 h-4 text-[#878679] absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#7d5e3c] mb-1">
                  Phone / WhatsApp Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+27 83 123 4567"
                    className="w-full bg-white border border-[#bea683]/50 rounded-sm p-3 pl-10 text-sm text-[#402615] placeholder:text-[#878679] focus:outline-none focus:border-[#7d5e3c]"
                  />
                  <Phone className="w-4 h-4 text-[#878679] absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#7d5e3c] mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="At least 6 characters"
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

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#7d5e3c] mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Re-enter password"
                    className="w-full bg-white border border-[#bea683]/50 rounded-sm p-3 pl-10 text-sm text-[#402615] placeholder:text-[#878679] focus:outline-none focus:border-[#7d5e3c]"
                  />
                  <Lock className="w-4 h-4 text-[#878679] absolute left-3 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#7d5e3c] hover:bg-[#402615] text-white text-xs font-semibold uppercase tracking-widest py-3.5 rounded-sm transition-all shadow-md cursor-pointer disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Complete Registration"}
              </button>
            </form>
          )}

          {!createdEmail && (
            <div className="pt-4 border-t border-[#bea683]/30 text-center text-xs text-[#878679]">
              Already registered?{" "}
              <Link href="/login" className="font-semibold text-[#7d5e3c] hover:underline">
                Sign In Here
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
