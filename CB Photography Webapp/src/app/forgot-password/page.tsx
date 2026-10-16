"use client";

// Password recovery page sending password reset instructions link via Firebase Authentication
import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Logo } from "@/components/ui/Logo";
import { Mail, ArrowLeft, CheckCircle2, RotateCw } from "lucide-react";
import { requestPasswordReset } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setError(null);
    setLoading(true);

    const result = await requestPasswordReset(email);
    setLoading(false);

    if (!result.success) {
      setError(result.error || "Failed to send password reset email.");
      return;
    }

    setSubmitted(true);
    setCooldown(30);

    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (cooldown > 0 || !email) return;
    setLoading(true);
    setError(null);

    const result = await requestPasswordReset(email);
    setLoading(false);

    if (!result.success) {
      setError(result.error || "Failed to resend password reset email.");
      return;
    }

    setCooldown(30);
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#402615] text-[#f7f3ed]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-28">
        <div className="max-w-md w-full bg-[#f7f3ed] text-[#402615] p-8 sm:p-10 rounded-sm border border-[#bea683]/50 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <Logo variant="dark" size="md" className="justify-center" />
            <h1 className="font-serif-heading text-2xl font-semibold pt-2 text-[#402615]">
              Reset Password
            </h1>
            <p className="text-xs text-[#878679]">
              Enter your account email to receive direct password recovery instructions.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-900/10 border border-rose-500/40 rounded-sm text-rose-800 text-xs text-center">
              {error}
            </div>
          )}

          {submitted ? (
            <div className="p-6 bg-emerald-900/10 border border-emerald-500/40 rounded-sm text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-serif-heading text-lg font-semibold text-emerald-900">
                  Recovery Email Dispatched
                </h3>
                <p className="text-xs text-[#878679] leading-relaxed">
                  We have dispatched password reset instructions to{" "}
                  <strong className="text-[#402615] font-semibold">{email}</strong>.
                </p>
              </div>

              <div className="text-[11px] text-[#878679] bg-white/60 p-3 rounded-sm border border-[#bea683]/30 text-left space-y-1">
                <p className="font-semibold text-[#7d5e3c]">Next steps:</p>
                <ol className="list-decimal list-inside space-y-0.5">
                  <li>Open the email from <strong>Camryn Burger Photography</strong>.</li>
                  <li>Click the secure password reset link.</li>
                  <li>Enter your new password and sign in.</li>
                </ol>
                <p className="text-[10px] text-[#878679] pt-1 italic">
                  Tip: Be sure to check your spam/junk folder if it doesn’t arrive within 2 minutes.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={cooldown > 0 || loading}
                  className="w-full py-2.5 px-3 border border-[#7d5e3c]/40 text-[#7d5e3c] hover:bg-[#7d5e3c]/10 text-xs font-semibold rounded-sm transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  <span>
                    {cooldown > 0 ? `Resend Link (${cooldown}s)` : "Resend Password Reset Email"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => { setSubmitted(false); setEmail(""); }}
                  className="text-xs text-[#878679] hover:text-[#402615] underline cursor-pointer"
                >
                  Use a different email address
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#7d5e3c] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full bg-white border border-[#bea683]/50 rounded-sm p-3 pl-10 text-sm focus:outline-none focus:border-[#7d5e3c]"
                  />
                  <Mail className="w-4 h-4 text-[#878679] absolute left-3 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#7d5e3c] hover:bg-[#402615] text-white text-xs font-semibold uppercase tracking-widest py-3.5 rounded-sm transition-all shadow-md disabled:opacity-60 cursor-pointer"
              >
                {loading ? "Sending Recovery Email..." : "Send Password Reset Email"}
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-[#bea683]/30 text-center text-xs text-[#878679]">
            <Link href="/login" className="inline-flex items-center gap-1 font-semibold text-[#7d5e3c] hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
