"use client";

import { useMemo, useRef, useCallback, useEffect } from "react";

import { format, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";

import { getWeekDays, toDateString, GRID_HEIGHT } from "@/lib/date-utils";
import { useCalendarStore } from "@/stores/calendarStore";
import { useFilterStore } from "@/stores/filterStore";
import { TimeGrid } from "@/components/calendar/TimeGrid";
import { EventBlock } from "@/components/event/EventBlock";
import type { ExpandedEvent, Category, Member } from "@/types";

interface WeekViewProps {
  events: ExpandedEvent[];
  categories: Category[];
  members: Member[];
  onEventClick?: (event: ExpandedEvent) => void;
}

export function WeekView({ events, categories, members, onEventClick }: WeekViewProps) {
  const currentDate = useCalendarStore((s) => s.currentDate);
  const { selectedMemberIds, selectedCategoryIds } = useFilterStore();
  const days = useMemo(() => getWeekDays(currentDate), [currentDate]);
  const today = new Date();

  const headerScrollRef = useRef<HTMLDivElement>(null);
  const gridScrollRef = useRef<HTMLDivElement>(null);

  // 헤더-그리드 가로 스크롤 동기화
  const handleHeaderScroll = useCallback(() => {
    if (headerScrollRef.current && gridScrollRef.current) {
      gridScrollRef.current.scrollLeft = headerScrollRef.current.scrollLeft;
    }
  }, []);

  const handleGridScroll = useCallback(() => {
    if (headerScrollRef.current && gridScrollRef.current) {
      headerScrollRef.current.scrollLeft = gridScrollRef.current.scrollLeft;
    }
  }, []);

  // 오늘 날짜 컬럼으로 초기 스크롤 (모바일)
  useEffect(() => {
    const todayIndex = days.findIndex((d) => isSameDay(d, today));
    if (todayIndex >= 0 && gridScrollRef.current) {
      const colWidth = gridScrollRef.current.scrollWidth / 7;
      const scrollTarget = Math.max(0, colWidth * todayIndex - 50);
      gridScrollRef.current.scrollLeft = scrollTarget;
      if (headerScrollRef.current) {
        headerScrollRef.current.scrollLeft = scrollTarget;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]);

  const filteredEvents = useMemo(
    () =>
      events.filter(
        (e) =>
          e.memberIds.some((id) => selectedMemberIds.includes(id)) &&
          selectedCategoryIds.includes(e.categoryId)
      ),
    [events, selectedMemberIds, selectedCategoryIds]
  );

  const eventsByDate = useMemo(() => {
    const map = new Map<string, ExpandedEvent[]>();
    for (const day of days) {
      map.set(toDateString(day), []);
    }
    for (const event of filteredEvents) {
      const list = map.get(event.date);
      if (list) list.push(event);
    }
    return map;
  }, [filteredEvents, days]);

  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* 요일 헤더 */}
      <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="w-10 sm:w-14 flex-shrink-0" />
        <div
          ref={headerScrollRef}
          className="flex-1 overflow-x-auto scrollbar-hide"
          onScroll={handleHeaderScroll}
        >
          <div className="flex min-w-[700px]">
            {days.map((day) => {
              const isToday = isSameDay(day, today);
              return (
                <div
                  key={day.toISOString()}
                  className={`flex-1 min-w-[100px] text-center py-2 border-l border-gray-100 ${
                    isToday ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="text-xs text-gray-500">
                    {format(day, "EEE", { locale: ko })}
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      isToday
                        ? "inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white"
                        : "text-gray-900"
                    }`}
                  >
                    {format(day, "d")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 타임그리드 + 이벤트 */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex" style={{ height: `${GRID_HEIGHT}px` }}>
          <TimeGrid>
            <div
              ref={gridScrollRef}
              className="overflow-x-auto scrollbar-hide h-full"
              onScroll={handleGridScroll}
            >
              <div className="flex min-w-[700px] h-full">
                {days.map((day) => {
                  const dateStr = toDateString(day);
                  const dayEvents = eventsByDate.get(dateStr) ?? [];
                  const isToday = isSameDay(day, today);
                  return (
                    <div
                      key={dateStr}
                      className={`relative flex-1 min-w-[100px] border-l border-gray-100 ${
                        isToday ? "bg-blue-50/20" : ""
                      }`}
                      style={{ height: `${GRID_HEIGHT}px` }}
                    >
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
                  );
                })}
              </div>
            </div>
          </TimeGrid>
        </div>
      </div>
    </div>
  );
}
