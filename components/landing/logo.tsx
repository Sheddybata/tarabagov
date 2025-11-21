"use client";

import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ size = "md", showText = false }: LogoProps) {
  const sizes = {
    sm: { container: "h-10 w-10", image: 40 },
    md: { container: "h-14 w-14", image: 56 },
    lg: { container: "h-24 w-24", image: 96 },
  };

  const currentSize = sizes[size];

  return (
    <div className="flex items-center space-x-3">
      <div className={`relative ${currentSize.container} rounded-full overflow-hidden flex items-center justify-center`}>
        <Image
          src="/images/logo/Tarabastategovernmentlogo.jpg"
          alt="Taraba State Government Logo"
          width={currentSize.image}
          height={currentSize.image}
          className="object-contain rounded-full"
          priority
        />
      </div>
      {showText && (
        <div className="hidden md:block">
          <div className="text-white font-bold text-sm">Taraba State</div>
          <div className="text-gray-300 text-xs">Government</div>
        </div>
      )}
    </div>
  );
}

