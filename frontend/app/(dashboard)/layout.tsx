"use client";

import Link from "next/link";
import { useAuthGuard } from "@/auth/useAuthGuard";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuthGuard();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading session...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-white border-r shadow-sm p-5">
        <h2 className="text-xl font-semibold mb-5">Fleet Manager</h2>

        <nav className="space-y-3">
          <Link
            href="/dashboard"
            className="block py-2 text-gray-700 hover:text-black"
          >
            Dashboard
          </Link>
          <Link
            href="/vehicles"
            className="block py-2 text-gray-700 hover:text-black"
          >
            Vehicles
          </Link>
          <Link
            href="/drivers"
            className="block py-2 text-gray-700 hover:text-black"
          >
            Drivers
          </Link>
          <Link
            href="/maintenance"
            className="block py-2 text-gray-700 hover:text-black"
          >
            Maintenance Logs
          </Link>
          <Link
            href="/reports"
            className="block py-2 text-gray-700 hover:text-black"
          >
            Reports
          </Link>
        </nav>
      </aside>

      <main className="flex-1">
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold">Logged in as: {user.username}</p>
            <p className="text-sm text-gray-500">{user.role}</p>
          </div>

          <LogoutButton />
        </header>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
