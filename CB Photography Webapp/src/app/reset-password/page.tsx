"use client";

// Dedicated in-app password reset completion page handling Firebase OOB codes
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Logo } from "@/components/ui/Logo";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { verifyResetCode, completePasswordReset } from "@/lib/auth";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!oobCode) {
      setVerifying(false);
      setError("No password reset code found in URL. Please request a new link.");
      return;
    }

    (async () => {
      const result = await verifyResetCode(oobCode);
      setVerifying(false);
      if (!result.success) {
        setError(result.error || "The password reset link is invalid or has expired.");
      } else {
        setEmail(result.email || null);
      }
    })();
  }, [oobCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oobCode) return;

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setError(null);
    setLoading(true);

    const result = await completePasswordReset(oobCode, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error || "Failed to update your password.");
      return;
    }

    setSuccess(true);
  };

  return (
    <div className="max-w-md w-full bg-[#f7f3ed] text-[#402615] p-8 sm:p-10 rounded-sm border border-[#bea683]/50 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <Logo variant="dark" size="md" className="justify-center" />
        <h1 className="font-serif-heading text-2xl font-semibold pt-2 text-[#402615]">
          Set New Password
        </h1>
        <p className="text-xs text-[#878679]">
          {email ? `Updating credentials for ${email}` : "Choose a new secure password for your studio account."}
        </p>
      </div>

      {verifying && (
        <div className="py-8 text-center text-xs text-[#878679]">
          Verifying security recovery token...
        </div>
      )}

      {error && !verifying && (
        <div className="p-4 bg-rose-900/10 border border-rose-500/40 rounded-sm text-rose-800 text-xs text-center space-y-2">
          <AlertCircle className="w-6 h-6 mx-auto text-rose-600" />
          <p>{error}</p>
          <div className="pt-2">
            <Link
              href="/forgot-password"
              className="font-semibold underline hover:text-rose-900"
            >
              Request a new password reset link
            </Link>
          </div>
        </div>
      )}

      {success && (
        <div className="p-6 bg-emerald-900/10 border border-emerald-500/40 rounded-sm text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-serif-heading text-lg font-semibold text-emerald-900">
              Password Successfully Updated!
            </h3>
            <p className="text-xs text-[#878679]">
              Your account password has been updated. You can now sign in with your new credentials.
            </p>
          </div>
          <Link
            href="/login"
            className="w-full bg-[#402615] hover:bg-[#7d5e3c] text-white text-xs font-semibold uppercase tracking-widest py-3.5 rounded-sm transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Sign In Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {!verifying && !error && !success && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#7d5e3c] mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-white border border-[#bea683]/50 rounded-sm p-3 pl-10 pr-10 text-sm focus:outline-none focus:border-[#7d5e3c]"
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
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full bg-white border border-[#bea683]/50 rounded-sm p-3 pl-10 text-sm focus:outline-none focus:border-[#7d5e3c]"
              />
              <Lock className="w-4 h-4 text-[#878679] absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7d5e3c] hover:bg-[#402615] text-white text-xs font-semibold uppercase tracking-widest py-3.5 rounded-sm transition-all shadow-md disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Updating Password..." : "Save New Password"}
          </button>
        </form>
      )}

      <div className="pt-4 border-t border-[#bea683]/30 text-center text-xs text-[#878679]">
        <Link href="/login" className="font-semibold text-[#7d5e3c] hover:underline">
          Return to Sign In
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#402615] text-[#f7f3ed]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-28">
        <Suspense fallback={
          <div className="max-w-md w-full bg-[#f7f3ed] p-10 text-center text-xs text-[#878679] rounded-sm">
            Loading recovery console...
          </div>
        }>
          <ResetPasswordContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
