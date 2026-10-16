"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthUser } from "@/lib/auth";

export default function ClientIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getAuthUser();
    if (user && user.role === "client") {
      router.replace("/client/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#402615] flex items-center justify-center text-[#f7f3ed]">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#bea683] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs uppercase tracking-widest text-[#d6c8b1]">Redirecting to Client Portal...</p>
      </div>
    </div>
  );
}
