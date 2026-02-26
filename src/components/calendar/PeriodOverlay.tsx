"use client";

import { timeToY, eventHeight } from "@/lib/date-utils";
import type { SchoolPeriod } from "@/lib/schedule";

interface PeriodOverlayProps {
  periods: SchoolPeriod[];
}

export function PeriodOverlay({ periods }: PeriodOverlayProps) {
  return (
    <>
      {periods.map((period) => {
        const top = timeToY(period.startTime);
        const height = eventHeight(period.startTime, period.endTime);
        return (
          <div
            key={period.label}
            className="pointer-events-none absolute left-0 right-0 border-l-2 border-blue-200 bg-blue-50/30"
            style={{ top: `${top}px`, height: `${height}px` }}
          >
            <span className="absolute left-1 top-0 text-[9px] font-medium text-blue-400">
              {period.label}
            </span>
          </div>
        );
      })}
    </>
  );
}
