"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Programs", href: "/programs" },
    { name: "About", href: "/about" },
    { name: "Admissions", href: "/admissions" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-eiba-blue">
              EIBA
            </div>
            <span className="hidden sm:block text-sm text-eiba-gray-dark">
              International Bible Academy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-eiba-gray-dark hover:text-eiba-blue transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Button asChild variant="accent" size="sm">
              <Link href="/admissions">Apply Now</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-eiba-gray-dark hover:bg-eiba-gray-light"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-eiba-gray-dark hover:bg-eiba-gray-light rounded-md"
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4">
              <Button asChild variant="accent" className="w-full">
                <Link href="/admissions">Apply Now</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}


