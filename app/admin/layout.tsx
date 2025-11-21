"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { AdminNavbar } from "@/components/admin/admin-navbar";

// TEMPORARY: Simple auth check - remove this when Supabase is properly set up
const TEMP_ADMIN_EMAIL = "admin@tarabastate.gov.ng";
const TEMP_ADMIN_PASSWORD = "admin123";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const adminSession = localStorage.getItem("admin_session");
        if (adminSession === "authenticated") {
          setIsAuthenticated(true);
        } else if (pathname !== "/admin/login") {
          router.push("/admin/login");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-taraba-green" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNavbar
        isMobileOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm lg:hidden">
          <button
            className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50"
            onClick={() => setIsMobileNavOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </button>
          <div className="text-sm font-semibold text-gray-900">Taraba Admin</div>
          <div className="text-xs text-gray-500">Secure access</div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}

/* rest of file */
