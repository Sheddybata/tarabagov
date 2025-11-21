"use client";

import Link from "next/link";
import { Mail, Facebook, Twitter, Youtube, Instagram } from "lucide-react";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Logo Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        {/* Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Contact Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <p className="text-gray-400 mb-4">
              Taraba State Government<br />
              Ministry of Information and Reorientation
            </p>
            <p className="text-gray-400 mb-4">Taraba, Nigeria</p>
            <div className="flex items-center space-x-2 mb-4">
              <Mail className="h-4 w-4 text-taraba-green" />
              <a 
                href="mailto:info@tarabastate.gov.ng" 
                className="text-gray-400 hover:text-taraba-gold transition-colors"
              >
                info@tarabastate.gov.ng
              </a>
            </div>
            <div className="flex space-x-3">
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-taraba-green transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-taraba-green transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-taraba-green transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-taraba-green transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-taraba-gold transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-400 hover:text-taraba-gold transition-colors">
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-400 hover:text-taraba-gold transition-colors">
                  Latest News
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-taraba-gold transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Departments Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">Departments</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/departments/health" className="text-gray-400 hover:text-taraba-gold transition-colors">
                  Health
                </Link>
              </li>
              <li>
                <Link href="/departments/housing" className="text-gray-400 hover:text-taraba-gold transition-colors">
                  Housing & Land
                </Link>
              </li>
              <li>
                <Link href="/departments/education" className="text-gray-400 hover:text-taraba-gold transition-colors">
                  Education
                </Link>
              </li>
              <li>
                <Link href="/departments/transport" className="text-gray-400 hover:text-taraba-gold transition-colors">
                  Transport & Traffic
                </Link>
              </li>
              <li>
                <Link href="/departments/culture" className="text-gray-400 hover:text-taraba-gold transition-colors">
                  Arts & Culture
                </Link>
              </li>
            </ul>
          </div>

          {/* Explore Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/history" className="text-gray-400 hover:text-taraba-gold transition-colors">
                  History of Taraba
                </Link>
              </li>
              <li>
                <Link href="/culture" className="text-gray-400 hover:text-taraba-gold transition-colors">
                  Culture & Heritage
                </Link>
              </li>
              <li>
                <Link href="/tourism" className="text-gray-400 hover:text-taraba-gold transition-colors">
                  Tourism
                </Link>
              </li>
              <li>
                <Link href="/investment" className="text-gray-400 hover:text-taraba-gold transition-colors">
                  Investment Opportunities
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            © Copyright {new Date().getFullYear()} by Taraba State Government
          </p>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 h-12 w-12 rounded-full bg-taraba-green hover:bg-taraba-green-light text-white flex items-center justify-center shadow-lg transition-colors z-50"
        aria-label="Scroll to top"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </footer>
  );
}

