"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// This layout ensures the login page doesn't get the admin navbar
// If user is already logged in as admin, redirect to dashboard
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in
    if (typeof window !== "undefined") {
      const adminSession = localStorage.getItem("admin_session");
      if (adminSession === "authenticated") {
        router.push("/admin/dashboard");
      }
    }
  }, [router]);

  return <>{children}</>;
}

