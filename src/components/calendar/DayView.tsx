"use client";

import { useMemo } from "react";

import { toDateString, GRID_HEIGHT, formatDateKo } from "@/lib/date-utils";
import { TimeGrid } from "./TimeGrid";
import { EventBlock } from "@/components/event/EventBlock";
import { useCalendarStore } from "@/stores/calendarStore";
import { useFilterStore } from "@/stores/filterStore";
import type { ExpandedEvent, Category, Member } from "@/types";

interface DayViewProps {
  events: ExpandedEvent[];
  categories: Category[];
  members: Member[];
  onEventClick?: (event: ExpandedEvent) => void;
}

export function DayView({ events, categories, members, onEventClick }: DayViewProps) {
  const currentDate = useCalendarStore((s) => s.currentDate);
  const { selectedMemberIds, selectedCategoryIds } = useFilterStore();
  const dateStr = toDateString(currentDate);

  const dayEvents = useMemo(
    () =>
      events.filter(
        (e) =>
          e.date === dateStr &&
          e.memberIds.some((id) => selectedMemberIds.includes(id)) &&
          selectedCategoryIds.includes(e.categoryId)
      ),
    [events, dateStr, selectedMemberIds, selectedCategoryIds]
  );

  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="border-b border-gray-200 bg-white py-3 px-4">
        <h2 className="text-base font-semibold text-gray-800">
          {formatDateKo(currentDate, "M월 d일 (EEEE)")}
        </h2>
        <p className="text-xs text-gray-500">{dayEvents.length}개 일정</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <TimeGrid>
          <div className="relative" style={{ height: `${GRID_HEIGHT}px` }}>
            {dayEvents.map((event) => (
              <EventBlock
                key={`${event.eventId}-${event.date}`}
                event={event}
                category={categoryMap.get(event.categoryId)}
                members={members}
                onClick={onEventClick}
              />
            ))}
          </div>
        </TimeGrid>
      </div>
    </div>
  );
}
