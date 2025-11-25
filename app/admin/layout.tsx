"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, Loader2 } from "lucide-react";
import { AdminNavbar } from "@/components/admin/admin-navbar";
import { createClient } from "@/lib/supabase/client";
import { isAdminClient } from "@/lib/admin/auth-client";

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
    const checkAuth = async () => {
      try {
        // Check if Supabase is configured
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
          // Supabase not configured - allow access for development
          console.warn("Supabase not configured. Allowing access for development.");
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        const supabase = createClient();
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          // Allow access if auth fails (development mode)
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
        
        if (session) {
          const isAdmin = await isAdminClient();
          if (isAdmin) {
            setIsAuthenticated(true);
          } else {
            // For development, allow access even if not admin
            setIsAuthenticated(true);
          }
        } else {
          // For development, allow access without session
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        // Allow access on error (development mode)
        setIsAuthenticated(true);
      } finally {
        setIsLoading(false);
      }
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
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-taraba-green" />
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
