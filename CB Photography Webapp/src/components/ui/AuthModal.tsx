"use client";

import React, { useState } from "react";
import { X, Mail, Lock, User, Phone, LogIn, UserPlus } from "lucide-react";
import { auth, db, googleProvider, isFirebaseConfigured } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { loginUser, registerUser, AuthUser } from "@/lib/auth";
import { UserProfile } from "@/types/user";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
  initialMode?: "signin" | "register";
  redirectNotice?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = "signin",
  redirectNotice,
}) => {
  const [tab, setTab] = useState<"signin" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("+27 ");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Handle email/password sign-in
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await loginUser(email, password);
      if (!result.success || !result.user) {
        setError(result.error || "Failed to sign in. Please check your credentials.");
        return;
      }
      onSuccess(result.user);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Handle user account registration (Create Account Tab)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const result = await registerUser(email, password, fullName, phone);
      if (!result.success || !result.user) {
        setError(result.error || "Failed to register account.");
        return;
      }
      onSuccess(result.user);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to register account.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Single Sign-On (OAuth)
  const handleGoogleSSO = async () => {
    setError(null);
    setLoading(true);
    try {
      if (!isFirebaseConfigured() || !auth || !googleProvider) {
        throw new Error("Google Sign-In is not configured.");
      }

      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      let role: "admin" | "photographer" | "client" = "client";
      let name = fbUser.displayName || fbUser.email?.split("@")[0] || "Client";
      let phoneVal = fbUser.phoneNumber || "";

      if (db) {
        try {
          const docRef = doc(db, "users", fbUser.uid);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data();
            name = data.name || name;
            const rawRole = (data.role || "").toLowerCase();
            if (rawRole.includes("admin")) role = "admin";
            else if (rawRole.includes("photo")) role = "photographer";
            phoneVal = data.phone || phoneVal;
          } else {
            await setDoc(docRef, {
              id: fbUser.uid,
              name,
              email: fbUser.email || "",
              phone: phoneVal,
              role: "Client",
              createdAt: new Date().toISOString().split("T")[0]
            });
          }
        } catch (err) {
          console.warn("Firestore user sync warning:", err);
        }
      }

      const authUser: AuthUser = {
        email: fbUser.email || "",
        name,
        role,
        phone: phoneVal
      };

      if (typeof window !== "undefined") {
        try { localStorage.setItem("cb_auth_user", JSON.stringify(authUser)); } catch {}
        document.cookie = `cb_auth_role=${role};path=/;max-age=604800;SameSite=Lax`;
        document.cookie = `cb_auth_email=${authUser.email};path=/;max-age=604800;SameSite=Lax`;
        window.dispatchEvent(new Event("auth_changed"));
      }

      onSuccess(authUser);
      onClose();
    } catch (err: any) {
      setError(err.message || "Google Sign-In was cancelled or failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#FAF8F5] dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-md shadow-2xl p-6 relative text-[#2C2420] dark:text-[#FAF8F5]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#C5A880] hover:text-[#2C2420] dark:hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
            Camryn Burger Studio
          </span>
          <h2 className="font-serif-heading text-2xl sm:text-3xl font-normal mt-1">
            {tab === "signin" ? "Sign In to Your Account" : "Create Studio Account"}
          </h2>
          {redirectNotice && (
            <p className="text-xs text-[#2E5E43] dark:text-emerald-400 mt-2 bg-[#2E5E43]/10 dark:bg-emerald-900/20 py-1.5 px-3 rounded-sm">
              {redirectNotice}
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#EAE3D9] dark:border-[#3A332C] mb-5">
          <button
            type="button"
            onClick={() => { setTab("signin"); setError(null); }}
            className={`flex-1 pb-2.5 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
              tab === "signin"
                ? "border-[#C5A880] text-[#2C2420] dark:text-[#FAF8F5]"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab("register"); setError(null); }}
            className={`flex-1 pb-2.5 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
              tab === "register"
                ? "border-[#C5A880] text-[#2C2420] dark:text-[#FAF8F5]"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-rose-900/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs rounded-sm">
            {error}
          </div>
        )}

        {/* Form Body */}
        {tab === "signin" ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#C5A880] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#C5A880] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2C2420] hover:bg-[#C5A880] text-white hover:text-[#2C2420] text-xs font-semibold uppercase tracking-widest py-3 rounded-sm transition-all duration-300 shadow-md flex items-center justify-center gap-2 mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? "Signing In..." : "Sign In & Continue"}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#C5A880] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full bg-white dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#C5A880] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="w-full bg-white dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
                Contact Phone / WhatsApp *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#C5A880] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+27 82 123 4567"
                  className="w-full bg-white dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
                Password (min 6 characters) *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#C5A880] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2E5E43] hover:bg-[#2C2420] text-white text-xs font-semibold uppercase tracking-widest py-3 rounded-sm transition-all duration-300 shadow-md flex items-center justify-center gap-2 mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? "Creating Account..." : "Create Account & Continue"}</span>
            </button>
          </form>
        )}

        {/* Google SSO Button */}
        <div className="mt-4 pt-4 border-t border-[#EAE3D9] dark:border-[#3A332C]">
          <button
            type="button"
            onClick={handleGoogleSSO}
            disabled={loading}
            className="w-full bg-white dark:bg-[#1F1B18] border border-[#EAE3D9] dark:border-[#3A332C] hover:border-[#C5A880] text-xs font-medium py-2.5 rounded-sm flex items-center justify-center gap-2 transition-colors active:scale-98"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};
