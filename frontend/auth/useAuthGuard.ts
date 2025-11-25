"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/auth/authStore";
import { useRouter } from "next/navigation";

export function useAuthGuard() {
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !user) {
      router.replace("/login");
    }
  }, [user, router, isInitialized]);

  return { user, isLoading: !isInitialized };
}
