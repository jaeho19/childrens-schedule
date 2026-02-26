"use client";

import { timeToY, eventHeight } from "@/lib/date-utils";
import type { ExpandedEvent, Category, Member } from "@/types";

interface EventBlockProps {
  event: ExpandedEvent;
  category?: Category;
  members: Member[];
  onClick?: (event: ExpandedEvent) => void;
}

export function EventBlock({ event, category, members, onClick }: EventBlockProps) {
  const top = timeToY(event.startTime);
  const height = eventHeight(event.startTime, event.endTime);
  const eventMembers = members.filter((m) => event.memberIds.includes(m.id));
  const bgColor = category?.color ?? "#9E9E9E";

  return (
    <button
      onClick={() => onClick?.(event)}
      className="absolute left-1 right-1 overflow-hidden rounded-md border text-left transition-shadow hover:shadow-md"
      style={{
        top: `${top}px`,
        height: `${Math.max(height, 44)}px`,
        backgroundColor: `${bgColor}20`,
        borderColor: `${bgColor}60`,
      }}
    >
      {/* 구성원 색상 바 */}
      <div className="absolute left-0 top-0 bottom-0 w-1">
        {eventMembers.length === 1 ? (
          <div className="h-full" style={{ backgroundColor: eventMembers[0].color }} />
        ) : eventMembers.length >= 2 ? (
          <>
            <div className="h-1/2" style={{ backgroundColor: eventMembers[0].color }} />
            <div className="h-1/2" style={{ backgroundColor: eventMembers[1].color }} />
          </>
        ) : null}
      </div>

      <div className="pl-2.5 pr-1 py-0.5">
        <div className="truncate text-xs font-semibold" style={{ color: bgColor }}>
          {category?.icon} {event.title}
        </div>
        {height > 30 && (
          <div className="truncate text-[10px] text-gray-600">
            {event.startTime}~{event.endTime}
          </div>
        )}
        {height > 50 && (
          <div className="truncate text-[10px] text-gray-500">
            {eventMembers.map((m) => m.name).join(", ")}
          </div>
        )}
        {height > 65 && event.note && (
          <div className="truncate text-[10px] text-gray-400">{event.note}</div>
        )}
      </div>
    </button>
  );
}
