"use client";

import type { ExpandedEvent, Category } from "@/types";

interface EventBarProps {
  event: ExpandedEvent;
  category?: Category;
  onClick?: (event: ExpandedEvent) => void;
}

export function EventBar({ event, category, onClick }: EventBarProps) {
  const color = category?.color ?? "#9E9E9E";
  const icon = category?.icon ?? "";

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(event);
      }}
      className="mb-0.5 block w-full truncate rounded px-1 py-0.5 text-left text-[10px] font-medium transition-opacity hover:opacity-80"
      style={{
        backgroundColor: `${color}20`,
        color,
      }}
      title={`${event.title} (${event.startTime}~${event.endTime})`}
    >
      {icon} {event.title}
    </button>
  );
}
