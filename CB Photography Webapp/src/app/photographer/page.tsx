"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchCurrentUser } from "@/lib/auth";

// Photographer portal entry page - routes to dashboard if logged in or login screen if not
export default function PhotographerIndexPage() {
  const router = useRouter();

  // Check auth role and redirect accordingly
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const user = await fetchCurrentUser();
      if (cancelled) return;

      if (user && user.role === "photographer") {
        router.replace("/photographer/dashboard");
      } else {
        router.replace("/login/photographer");
      }
    })();
    return () => { cancelled = true; };
  }, [router]);

  return (
    <div className="min-h-screen bg-[#402615] flex items-center justify-center text-[#f7f3ed]">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#bea683] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs uppercase tracking-widest text-[#d6c8b1]">Redirecting to Photographer Portal...</p>
      </div>
    </div>
  );
}
