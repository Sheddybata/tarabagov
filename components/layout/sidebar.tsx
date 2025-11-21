"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  HelpCircle,
  Menu,
  X,
  Building2,
  CreditCard,
  Calendar,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Services", href: "/services", icon: FileText },
  { name: "Citizens", href: "/citizens", icon: Users },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "Departments", href: "/departments", icon: Building2 },
  { name: "Security", href: "/security", icon: Shield },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help & Support", href: "/help", icon: HelpCircle },
];

export function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white shadow-md"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-taraba-green text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Brand */}
          <div className="flex h-16 items-center justify-center border-b border-taraba-green-light px-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-taraba-gold" />
              <div>
                <h2 className="text-lg font-bold">Taraba State</h2>
                <p className="text-xs text-gray-300">Citizen Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-taraba-gold text-taraba-green"
                      : "text-gray-200 hover:bg-taraba-green-light hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-taraba-green-light p-4">
            <p className="text-xs text-center text-gray-300">
              © {new Date().getFullYear()} Taraba State Government
            </p>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

