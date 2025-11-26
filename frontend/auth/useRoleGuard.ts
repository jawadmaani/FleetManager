"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/auth/authStore";
import { userHasRole, Role } from "@/auth/roleUtils";

export function useRoleGuard(allowedRoles: Role[]) {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    if (!userHasRole(user.Role, allowedRoles)) {
      router.replace("/unauthorized");
    }
  }, [user, router, allowedRoles]);

  return user;
}
