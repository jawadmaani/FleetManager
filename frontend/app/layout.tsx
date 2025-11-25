"use client";

import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { bootstrapAuth } from "../auth/bootstrapAuth";
import { usePathname } from "next/navigation";
import "./globals.css";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  const pathname = usePathname();

useEffect(() => {
    if (pathname !== "/login" && pathname !== "/register") {
      bootstrapAuth();
    }
  }, [pathname]);

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
