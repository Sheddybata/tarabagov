"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribe:", email);
    setEmail("");
  };

  return (
    <section className="py-16 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Subscribe to Newsletter
          </h2>
          <p className="text-gray-300 mb-8">
            Stay updated with the latest news and updates from Taraba State Government
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="flex-1 px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-taraba-green focus:border-transparent"
            />
            <Button
              type="submit"
              className="bg-taraba-green hover:bg-taraba-green-light text-white px-8"
            >
              <Mail className="h-4 w-4 mr-2" />
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

