"use client";

import { logout } from "@/lib/api/authApi";
import { useAuthStore } from "@/auth/authStore";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const router = useRouter();

  async function handleLogout() {
    await logout();
    clearAuth();
    router.push("/login");
  }

  return (
    <button 
      onClick={handleLogout}
      className="px-4 py-2 text-sm bg-red-500 text-white rounded-md"
    >
      Logout
    </button>
  );
}
