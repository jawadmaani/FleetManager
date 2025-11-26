"use client";

import Link from "next/link";
import { useAuthGuard } from "@/auth/useAuthGuard";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { DashboardIcon } from "@/components/ui/DashboardIcon";
import { VehicleIcon } from "@/components/ui/VehicleIcon";
import { DriversIcon } from "@/components/ui/DriversIcon";
import { MaintenanceIcon } from "@/components/ui/MaintenanceIcon";
import { ReportsIcon } from "@/components/ui/ReportsIcon";

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
      <aside className="bg-white shadow-md border-r h-screen fixed top-0 left-0 w-64 py-6 px-4 flex flex-col">
        <h2 className="text-2xl font-semibold mb-8 px-2">Fleet Manager</h2>

        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center py-2 px-4 rounded hover:bg-gray-100 transition text-gray-700 font-medium"
          >
            <DashboardIcon />
            Dashboard
          </Link>

          <Link
            href="/vehicles"
            className="flex items-center py-2 px-4 rounded hover:bg-gray-100 transition text-gray-700 font-medium"
          >
            <VehicleIcon />
            Vehicles
          </Link>

          <Link
            href="/drivers"
            className="flex items-center py-2 px-4 rounded hover:bg-gray-100 transition text-gray-700 font-medium"
          >
            <DriversIcon />
            Drivers
          </Link>

          <Link
            href="/maintenance"
            className="flex items-center py-2 px-4 rounded hover:bg-gray-100 transition text-gray-700 font-medium"
          >
            <MaintenanceIcon />
            Maintenance Logs
          </Link>

          <Link
            href="/reports"
            className="flex items-center py-2 px-4 rounded hover:bg-gray-100 transition text-gray-700 font-medium"
          >
            <ReportsIcon />
            Reports
          </Link>
        </nav>
      </aside>

      <main className="flex-1 ml-64">
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold">Logged in as: {user.Username}</p>
            <p className="text-sm text-gray-500">{user.Role}</p>
          </div>
          <LogoutButton />
        </header>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
