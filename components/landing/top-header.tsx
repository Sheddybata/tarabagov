"use client";

import { Mail, Clock, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";

export function TopHeader() {
  return (
    <div className="bg-gray-800 text-white py-2 px-4">
      <div className="container mx-auto flex items-center justify-between flex-wrap gap-4">
        {/* Logo Section */}
        <Logo size="md" />

        {/* Contact Information */}
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-taraba-green" />
            <a 
              href="mailto:info@tarabastate.gov.ng" 
              className="text-sm hover:text-taraba-gold transition-colors"
            >
              info@tarabastate.gov.ng
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-taraba-gold" />
            <span className="text-sm">Open hours: Mon - Fri 8.00 am - 6.00 pm</span>
          </div>
        </div>

        {/* FAQ Button */}
        <Button 
          className="bg-taraba-green hover:bg-taraba-green-light text-white"
          size="sm"
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          FAQ
        </Button>
      </div>
    </div>
  );
}

