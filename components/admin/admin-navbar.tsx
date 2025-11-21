"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/landing/logo";
import {
  LayoutDashboard,
  AlertCircle,
  Baby,
  Map,
  DollarSign,
  GraduationCap,
  Heart,
  FileCheck,
  Users,
  Settings,
  LogOut,
  Shield,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/reports", label: "Citizen Reports", icon: AlertCircle },
  { href: "/admin/birth-registrations", label: "Birth Registrations", icon: Baby },
  { href: "/admin/land-services", label: "Land Services", icon: Map },
  { href: "/admin/tax-services", label: "Tax Services", icon: DollarSign },
  { href: "/admin/schools", label: "School Records", icon: GraduationCap },
  { href: "/admin/hospitals", label: "Hospital Records", icon: Heart },
  { href: "/admin/documents", label: "Document Verification", icon: FileCheck },
  { href: "/admin/social-services", label: "Social Services", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface AdminNavbarProps {
  isMobileOpen: boolean;
  onClose: () => void;
}

export function AdminNavbar({ isMobileOpen, onClose }: AdminNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    // TEMPORARY: Simple logout - remove when Supabase is set up
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_session");
    }
    router.push("/admin/login");
    router.refresh();
  };

  const handleNavClick = (href: string) => {
    router.push(href);
    onClose();
  };

  const NavLinks = ({ showLabels = true }: { showLabels?: boolean }) => (
    <nav className="mt-6 space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname?.startsWith(item.href);
        return (
          <button
            key={item.href}
            onClick={() => handleNavClick(item.href)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-taraba-green/10 text-taraba-green"
                : "text-gray-600 hover:bg-gray-100",
              !showLabels && "justify-center"
            )}
          >
            <Icon className="h-4 w-4" />
            {showLabels && <span>{item.label}</span>}
          </button>
        );
      })}
    </nav>
  );

  const SidebarContent = ({ showLabels = true }: { showLabels?: boolean }) => (
    <div className="flex h-full flex-col px-3 py-4">
      <button
        className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-left shadow-sm transition hover:border-taraba-green focus:outline-none"
        onClick={() => setIsCollapsed((prev) => !prev)}
        aria-label={isCollapsed ? "Expand navigation" : "Collapse navigation"}
      >
        <div className="flex items-center gap-3">
          <Logo size={showLabels ? "md" : "sm"} />
          {showLabels && (
            <div>
              <p className="text-sm font-semibold text-gray-900">Taraba State</p>
              <p className="text-xs text-gray-500">Admin Portal</p>
            </div>
          )}
        </div>
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        )}
      </button>

      <NavLinks showLabels={showLabels} />

      <div className="mt-auto space-y-2">
        <div
          className={cn(
            "rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 text-xs text-gray-500",
            !showLabels && "text-center"
          )}
        >
          {showLabels ? (
            <>
              <p className="font-semibold text-gray-700">Need assistance?</p>
              <p>support@tarabastate.gov.ng</p>
            </>
          ) : (
            <Shield className="mx-auto h-4 w-4 text-gray-500" />
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-2",
            !showLabels && "justify-center px-3"
          )}
        >
          <LogOut className="h-4 w-4" />
          {showLabels && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "hidden lg:flex lg:flex-col lg:border-r lg:bg-white lg:shadow-sm lg:transition-all lg:duration-300",
          isCollapsed ? "lg:w-20" : "lg:w-64"
        )}
      >
        <SidebarContent showLabels={!isCollapsed} />
      </aside>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">
          <div className="absolute inset-y-0 left-0 w-72 max-w-full bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-taraba-green p-2">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Taraba State</p>
                  <p className="text-xs text-gray-500">Admin Portal</p>
                </div>
              </div>
              <button
                className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50"
                onClick={onClose}
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            <div className="h-full overflow-y-auto">
              <div className="px-4 py-4">
                <NavLinks showLabels />
                <div className="mt-6 border-t pt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <button className="absolute inset-0 w-full cursor-default" onClick={onClose} />
        </div>
      )}
    </>
  );
}

