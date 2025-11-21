"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/#about" },
  { name: "Services", href: "/#services" },
  { name: "News", href: "/news" },
  { name: "Departments", href: "/departments" },
  { name: "Gallery", href: "/#gallery" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-taraba-green"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-taraba-green font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Login Button */}
          <Button 
            className="bg-taraba-green hover:bg-taraba-green-light text-white"
            size="sm"
          >
            Login
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-2 text-gray-700 hover:text-taraba-green font-medium transition-colors"
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  if (item.href.startsWith("/#")) {
                    e.preventDefault();
                    const hash = item.href.split("#")[1];
                    if (window.location.pathname === "/") {
                      setTimeout(() => {
                        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    } else {
                      window.location.href = `/#${hash}`;
                    }
                  }
                }}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

