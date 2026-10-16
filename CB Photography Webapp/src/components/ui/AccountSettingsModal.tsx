"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthUser, updateUserProfile, logoutUser } from "@/lib/auth";
import {
  User,
  Mail,
  Phone,
  Shield,
  CheckCircle2,
  X,
  Save,
  LogOut
} from "lucide-react";

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onUserUpdated?: (user: AuthUser) => void;
}

export function AccountSettingsModal({
  isOpen,
  onClose,
  currentUser,
  onUserUpdated
}: AccountSettingsModalProps) {
  const router = useRouter();
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [phone, setPhone] = useState(currentUser?.phone || "+27 ");
  const [role, setRole] = useState<"admin" | "photographer" | "client">(currentUser?.role || "client");

  const [notifications, setNotifications] = useState({
    shootReminders: true,
    weatherAlerts: true,
    galleryDeliveries: true,
    marketingUpdates: false
  });

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "security">("profile");

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setPhone(currentUser.phone || "+27 ");
      setRole(currentUser.role);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const updated = await updateUserProfile({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        role
      });

      if (onUserUpdated && updated) onUserUpdated(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch {
      console.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1C1917] text-[#2C2420] dark:text-[#FAF8F5] w-full max-w-xl rounded-md border border-[#EAE3D9] dark:border-[#3A332C] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#EAE3D9] dark:border-[#3A332C]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C5A880]/20 text-[#C5A880] flex items-center justify-center font-serif-heading text-lg font-bold">
              {name.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h3 className="font-serif-heading text-xl font-normal">Account & Studio Settings</h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Manage your credentials, shoot notifications and contact details
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#EAE3D9] dark:border-[#3A332C] bg-[#FAF8F5] dark:bg-[#141210] px-6">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === "profile"
                ? "border-[#C5A880] text-[#C5A880]"
                : "border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            }`}
          >
            Profile Information
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("notifications")}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === "notifications"
                ? "border-[#C5A880] text-[#C5A880]"
                : "border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            }`}
          >
            Notifications
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === "security"
                ? "border-[#C5A880] text-[#C5A880]"
                : "border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            }`}
          >
            Security
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {savedSuccess && (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs rounded-sm flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Your profile changes have been saved and synchronized across the studio!</span>
            </div>
          )}

          {/* TAB 1: Profile Info */}
          {activeTab === "profile" && (
            <form id="settings-form" onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Camryn Burger"
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] pl-9 pr-3 py-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="camryn@cbphotography.co.za"
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] pl-9 pr-3 py-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                  Phone / WhatsApp (For booking confirmations)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+27 82 123 4567"
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] pl-9 pr-3 py-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: Notifications */}
          {activeTab === "notifications" && (
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm flex items-center justify-between">
                <div>
                  <strong className="block text-[#2C2420] dark:text-[#FAF8F5]">Shoot Reminders & Invoices</strong>
                  <span className="text-neutral-400 text-[11px]">Instant automated email & WhatsApp booking confirmation</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.shootReminders}
                  onChange={(e) => setNotifications({ ...notifications, shootReminders: e.target.checked })}
                  className="accent-[#C5A880] w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="p-3.5 bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm flex items-center justify-between">
                <div>
                  <strong className="block text-[#2C2420] dark:text-[#FAF8F5]">Venue Weather Warnings (48h Notice)</strong>
                  <span className="text-neutral-400 text-[11px]">Receive rain and golden-hour sunset alerts for Gauteng outdoor shoots</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.weatherAlerts}
                  onChange={(e) => setNotifications({ ...notifications, weatherAlerts: e.target.checked })}
                  className="accent-[#C5A880] w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="p-3.5 bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm flex items-center justify-between">
                <div>
                  <strong className="block text-[#2C2420] dark:text-[#FAF8F5]">High-Resolution Gallery Delivery</strong>
                  <span className="text-neutral-400 text-[11px]">Direct alert once your edited gallery is published by the photographer</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.galleryDeliveries}
                  onChange={(e) => setNotifications({ ...notifications, galleryDeliveries: e.target.checked })}
                  className="accent-[#C5A880] w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TAB 3: Security */}
          {activeTab === "security" && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm space-y-2">
                <div className="flex items-center gap-2 text-[#C5A880] font-semibold">
                  <Shield className="w-4 h-4" />
                  <span>Current Active Access Level</span>
                </div>
                <p className="text-neutral-500 dark:text-neutral-400">
                  Signed in as <strong>{role.toUpperCase()}</strong> ({email})
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm space-y-2">
                <span className="text-[11px] font-semibold text-[#2C2420] dark:text-[#FAF8F5] block">
                  Password & Encryption
                </span>
                <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Your credentials and session tokens are protected using standard 256-bit encryption. To update your password or profile credentials, please contact studio administration or reset via the authentication portal.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#FAF8F5] dark:bg-[#141210] border-t border-[#EAE3D9] dark:border-[#3A332C] flex items-center justify-between">
          <button
            type="button"
            onClick={async () => {
              await logoutUser();
              onClose();
              router.push("/login");
            }}
            className="text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1.5 hover:underline"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#EAE3D9] dark:border-[#3A332C] rounded uppercase text-[11px] font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Close
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="px-5 py-2 bg-[#2C2420] dark:bg-[#C5A880] text-white dark:text-[#2C2420] rounded uppercase text-[11px] font-semibold hover:bg-[#C5A880] hover:text-[#2C2420] flex items-center gap-1.5 cursor-pointer shadow"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? "Saving..." : "Save Settings"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
