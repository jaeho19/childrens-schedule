"use client";

import { useMemo } from "react";

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  format,
} from "date-fns";
import { ko } from "date-fns/locale";

import { toDateString } from "@/lib/date-utils";
import { useCalendarStore } from "@/stores/calendarStore";
import { useFilterStore } from "@/stores/filterStore";
import { EventBar } from "@/components/event/EventBar";
import type { ExpandedEvent, Category, Member } from "@/types";

interface MonthViewProps {
  events: ExpandedEvent[];
  categories: Category[];
  members: Member[];
  onEventClick?: (event: ExpandedEvent) => void;
  onDayClick?: (date: Date) => void;
}

const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];
const MAX_VISIBLE_EVENTS = 3;

export function MonthView({ events, categories, members, onEventClick, onDayClick }: MonthViewProps) {
  const currentDate = useCalendarStore((s) => s.currentDate);
  const { selectedMemberIds, selectedCategoryIds } = useFilterStore();
  const today = new Date();

  const filteredEvents = useMemo(
    () =>
      events.filter(
        (e) =>
          e.memberIds.some((id) => selectedMemberIds.includes(id)) &&
          selectedCategoryIds.includes(e.categoryId)
      ),
    [events, selectedMemberIds, selectedCategoryIds]
  );

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentDate]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, ExpandedEvent[]>();
    for (const event of filteredEvents) {
      if (!map.has(event.date)) map.set(event.date, []);
      map.get(event.date)!.push(event);
    }
    return map;
  }, [filteredEvents]);

  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  return (
    <div className="flex flex-col h-full">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-white">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-2 text-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* 달력 격자 */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr">
        {calendarDays.map((day) => {
          const dateStr = toDateString(day);
          const dayEvents = eventsByDate.get(dateStr) ?? [];
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, today);
          const overflow = dayEvents.length - MAX_VISIBLE_EVENTS;

          return (
            <div
              key={dateStr}
              className={`border-b border-r border-gray-100 p-1 min-h-[80px] cursor-pointer hover:bg-gray-50 ${
                !isCurrentMonth ? "bg-gray-50/50" : ""
              }`}
              onClick={() => onDayClick?.(day)}
            >
              <div
                className={`text-xs font-medium mb-1 ${
                  isToday
                    ? "inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white"
                    : isCurrentMonth
                    ? "text-gray-900"
                    : "text-gray-400"
                }`}
              >
                {format(day, "d")}
              </div>

              {dayEvents.slice(0, MAX_VISIBLE_EVENTS).map((event) => (
                <EventBar
                  key={`${event.eventId}-${event.date}`}
                  event={event}
                  category={categoryMap.get(event.categoryId)}
                  onClick={onEventClick}
                />
              ))}

              {overflow > 0 && (
                <div className="text-[10px] text-gray-500 pl-1">
                  +{overflow}개 더보기
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
