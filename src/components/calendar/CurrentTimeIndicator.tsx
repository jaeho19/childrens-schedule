"use client";

import { useEffect, useState } from "react";
import { timeToY, START_HOUR, END_HOUR } from "@/lib/date-utils";

export function CurrentTimeIndicator() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  if (!now) return null;

  const hours = now.getHours();
  const minutes = now.getMinutes();
  if (hours < START_HOUR || hours >= END_HOUR) return null;

  const timeStr = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  const top = timeToY(timeStr);

  return (
    <div className="pointer-events-none absolute left-0 right-0 z-20" style={{ top: `${top}px` }}>
      <div className="flex items-center">
        <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
        <div className="h-[2px] flex-1 bg-red-500" />
      </div>
    </div>
  );
}
