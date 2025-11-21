"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { Hand } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  image?: string;
  color: string;
  textColor: string;
  comingSoon?: boolean;
}

export function ServiceCard({
  title,
  description,
  icon: Icon,
  href,
  image,
  color,
  textColor,
  comingSoon = false,
}: ServiceCardProps) {
  const isExternalLink = href?.startsWith("http");

  const cardContent = (
    <div
      className={`relative rounded-lg overflow-hidden h-full min-h-[280px] group transition-all duration-300 hover:shadow-xl ${
        image ? "" : `${color} border-2`
      }`}
      style={
        image
          ? {
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}
      }
    >
      {/* Dark Overlay for Image Background */}
      {image && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 group-hover:from-black/75 group-hover:via-black/65 group-hover:to-black/85 transition-all duration-300" />
      )}

      {/* Content */}
      <div className="relative h-full flex flex-col p-6 z-10">
        {/* Icon */}
        <div
          className={`w-14 h-14 rounded-lg flex items-center justify-center mb-4 ${
            image
              ? "bg-white/20 backdrop-blur-sm border border-white/30"
              : `${color.replace("bg-", "bg-").replace("-50", "-100")}`
          }`}
        >
          <Icon
            className={`h-7 w-7 ${
              image ? "text-white" : textColor
            }`}
          />
        </div>

        {/* Title */}
        <h3
          className={`text-xl font-semibold mb-2 ${
            image ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className={`flex-1 mb-4 ${
            image ? "text-white/90" : "text-gray-600"
          }`}
        >
          {description}
        </p>

        {/* CTA */}
        <div
          className={`font-medium flex items-center gap-2 ${
            image ? "text-white" : textColor
          }`}
        >
          {comingSoon ? "Coming Soon" : href ? "Click Here" : "View Details"}{" "}
          {!comingSoon && <Hand className="h-4 w-4 group-hover:scale-110 transition-transform" />}
        </div>
      </div>
    </div>
  );

  if (href && !comingSoon) {
    if (isExternalLink) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {cardContent}
        </a>
      );
    }

    return <Link href={href}>{cardContent}</Link>;
  }

  return cardContent;
}

