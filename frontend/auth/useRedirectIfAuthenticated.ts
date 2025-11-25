"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/auth/authStore";
import { useRouter } from "next/navigation";

export function useRedirectIfAuthenticated() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);
}
