"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Search, 
  Building2, 
  ExternalLink,
  Wallet,
  Receipt,
  Map,
  TrendingUp,
  Handshake,
  Scale,
  Cpu,
  Sprout,
  MapPin,
  ShoppingCart,
  Leaf,
  LucideIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { mdas } from "@/lib/data/mdas";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Wallet,
  Receipt,
  Map,
  TrendingUp,
  Handshake,
  Scale,
  Cpu,
  Sprout,
  MapPin,
  Building2,
  ShoppingCart,
  Leaf,
};

export function MDADirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Ministry", "Department", "Agency"];

  const filteredMDAs = mdas.filter((mda) => {
    const matchesSearch = mda.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || mda.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search ministries, departments, or agencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div>
        <p className="text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredMDAs.length}</span> of{" "}
          {mdas.length} MDAs
        </p>
      </div>

      {/* MDA Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMDAs.map((mda) => {
          const Icon = iconMap[mda.iconName] || Building2;
          return (
            <a
              key={mda.id}
              href={mda.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="relative rounded-lg overflow-hidden h-full min-h-[280px] transition-all duration-300 hover:shadow-xl">
                {/* Optimized Background Image */}
                {mda.image && (
                  <>
                    <Image
                      src={mda.image}
                      alt={mda.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                      loading="lazy"
                      quality={85}
                    />
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 group-hover:from-black/75 group-hover:via-black/65 group-hover:to-black/85 transition-all duration-300 z-0" />
                  </>
                )}

                {/* Content */}
                <div className="relative h-full flex flex-col p-6 z-10">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 bg-white/20 backdrop-blur-sm border border-white/30">
                    <Icon className="h-7 w-7 text-white" />
                  </div>

                {/* Category Badge */}
                <div className="mb-2">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded">
                    {mda.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold mb-4 text-white line-clamp-3">
                  {mda.name}
                </h3>

                {/* CTA */}
                <div className="mt-auto font-medium flex items-center gap-2 text-white">
                  Visit Website
                  <ExternalLink className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </div>
              </div>
            </div>
          </a>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredMDAs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No MDAs found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
}
