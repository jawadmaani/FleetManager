"use client";

import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { bootstrapAuth } from "../auth/bootstrapAuth";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/auth/authStore";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  const pathname = usePathname();
  const markInitialized = useAuthStore((s) => s.markInitialized);

  useEffect(() => {
    if (pathname !== "/login" && pathname !== "/register") {
      bootstrapAuth();
      return;
    }
    markInitialized();
  }, [pathname, markInitialized]);

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
