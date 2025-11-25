"use client";

import { useAuthStore } from "@/auth/authStore";
import { userHasRole, Role } from "@/auth/roleUtils";

export function RoleGate({ roles, children }: { roles: Role[], children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;
  if (!userHasRole(user.role, roles)) return null;

  return <>{children}</>;
}
