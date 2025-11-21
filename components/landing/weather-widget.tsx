"use client";

import { Sun } from "lucide-react";

export function WeatherWidget() {
  // In a real app, this would fetch from a weather API
  const temperature = "32";
  const fahrenheit = "90";

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 min-w-[180px]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">Today:</p>
          <p className="text-2xl font-bold text-gray-900">
            {temperature}°C / {fahrenheit}°F
          </p>
        </div>
        <Sun className="h-10 w-10 text-taraba-gold" />
      </div>
    </div>
  );
}

