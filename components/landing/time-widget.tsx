"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function TimeWidget() {
  const [time, setTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(new Date());
    
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).toLowerCase();
  };

  // Prevent hydration mismatch - only render time after client mount
  if (!mounted || !time) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 min-w-[180px]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Time:</p>
            <p className="text-2xl font-bold text-gray-900">--:-- --</p>
          </div>
          <Clock className="h-10 w-10 text-taraba-green" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 min-w-[180px]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">Time:</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatTime(time)}
          </p>
        </div>
        <Clock className="h-10 w-10 text-taraba-green" />
      </div>
    </div>
  );
}

