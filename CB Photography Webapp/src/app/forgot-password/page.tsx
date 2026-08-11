"use client";

// Password recovery page sending password reset instructions link
import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Logo } from "@/components/ui/Logo";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Handle password reset submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
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
              Enter your email address to receive password recovery instructions.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 bg-emerald-900/10 border border-emerald-500/40 rounded-sm text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-serif-heading text-lg font-semibold text-emerald-800">
                Recovery Link Sent!
              </h3>
              <p className="text-xs text-[#878679]">
                If an account exists for <strong>{email}</strong>, password reset instructions have been sent.
              </p>
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
                    placeholder="nadine@example.com"
                    className="w-full bg-white border border-[#bea683]/50 rounded-sm p-3 pl-10 text-sm focus:outline-none"
                  />
                  <Mail className="w-4 h-4 text-[#878679] absolute left-3 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#7d5e3c] hover:bg-[#402615] text-white text-xs font-semibold uppercase tracking-widest py-3.5 rounded-sm transition-all shadow-md"
              >
                Send Password Reset Email
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
