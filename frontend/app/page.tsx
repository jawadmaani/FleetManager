"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/auth/authStore";

export default function HomePage() {
  const router = useRouter();
  const { user, isInitialized: initialized } = useAuthStore();

  useEffect(() => {
    if (!initialized) return;

    if (user) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [initialized, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Loading...</p>
    </div>
  );
}
