"use client";

import { useAuthGuard } from "@/auth/useAuthGuard";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { useAuthStore } from "@/auth/authStore";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthGuard();
  const username = user?.username;
  const role = user?.role;

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-gray-100">
      
      <aside className="w-64 bg-white border-r shadow-sm p-5">
        <h2 className="text-xl font-semibold mb-5">Fleet Manager</h2>

        <nav className="space-y-3">
          <a href="/dashboard" className="block py-2 text-gray-700 hover:text-black">Dashboard</a>
          <a href="/vehicles" className="block py-2 text-gray-700 hover:text-black">Vehicles</a>
          <a href="/drivers" className="block py-2 text-gray-700 hover:text-black">Drivers</a>
          <a href="/maintenance" className="block py-2 text-gray-700 hover:text-black">Maintenance Logs</a>
          <a href="/reports" className="block py-2 text-gray-700 hover:text-black">Reports</a>
        </nav>
      </aside>

      <main className="flex-1">
        
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold">Logged in as: {username}</p>
            <p className="text-sm text-gray-500">{role}</p>
          </div>

          <LogoutButton />
        </header>

        <div className="p-6">
          {children}
        </div>

      </main>
    </div>
  );
}
