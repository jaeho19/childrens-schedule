"use client";

import { useMemo } from "react";

import { format, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";

import { getWeekDays, toDateString, GRID_HEIGHT, getHourLabels } from "@/lib/date-utils";
import { SCHOOL_PERIODS } from "@/lib/schedule";
import { useCalendarStore } from "@/stores/calendarStore";
import { useFilterStore } from "@/stores/filterStore";
import { EventBlock } from "@/components/event/EventBlock";
import { CurrentTimeIndicator } from "./CurrentTimeIndicator";
import { PeriodOverlay } from "./PeriodOverlay";
import type { ExpandedEvent, Category, Member } from "@/types";

interface WeekViewProps {
  events: ExpandedEvent[];
  categories: Category[];
  members: Member[];
  onEventClick?: (event: ExpandedEvent) => void;
  onSlotDoubleClick?: (date: string, startTime?: string) => void;
}

export function WeekView({ events, categories, members, onEventClick, onSlotDoubleClick }: WeekViewProps) {
  const currentDate = useCalendarStore((s) => s.currentDate);
  const { selectedMemberIds, selectedCategoryIds } = useFilterStore();
  const days = useMemo(() => getWeekDays(currentDate), [currentDate]);
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
      {/* 요일 헤더 — week-grid-row로 본문과 동일한 컬럼 공유 */}
      <div className="week-grid-row border-b border-gray-200 bg-white sticky top-0 z-10">
        {/* 시간축 빈 셀 */}
        <div />
        {days.map((day, i) => {
          const isToday = isSameDay(day, today);
          return (
            <div
              key={day.toISOString()}
              className={`week-day-col text-center py-2 ${
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

      {/* 타임그리드 + 이벤트 — 동일한 week-grid-row 사용 */}
      <div className="flex-1 overflow-y-auto">
        <div className="relative" style={{ height: `${GRID_HEIGHT}px` }}>
          {/* 교시 오버레이 + 현재시간 인디케이터 (시간 라벨 제외, 7컬럼 영역) */}
          <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{ left: "var(--week-time-col)" }}
          >
            <PeriodOverlay periods={SCHOOL_PERIODS} />
            <CurrentTimeIndicator />
          </div>

          <div className="week-grid-row h-full">
            {/* 시간 라벨 열 */}
            <div className="relative">
              {getHourLabels().map((label) => {
                const hour = parseInt(label);
                const top = (hour - 8) * 60 * 1.2;
                return (
                  <div
                    key={label}
                    className="absolute text-right text-[10px] sm:text-xs text-gray-500 pr-1 sm:pr-2 w-full"
                    style={{ top: `${top - 8}px` }}
                  >
                    <span className="hidden sm:inline">{label}</span>
                    <span className="sm:hidden">{hour}</span>
                  </div>
                );
              })}
            </div>

            {/* 7일 컬럼 — 각각 grid 셀 */}
            {days.map((day) => {
              const dateStr = toDateString(day);
              const dayEvents = eventsByDate.get(dateStr) ?? [];
              const isToday = isSameDay(day, today);
              return (
                <div
                  key={dateStr}
                  className={`week-day-col relative ${
                    isToday ? "bg-blue-50/20" : ""
                  }`}
                  onDoubleClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const y = e.clientY - rect.top;
                    const minutes = Math.floor(y / 1.2);
                    const hour = Math.floor(minutes / 60) + 8;
                    const min = Math.floor(minutes % 60 / 30) * 30;
                    const time = `${String(Math.min(hour, 21)).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
                    onSlotDoubleClick?.(dateStr, time);
                  }}
                >
                  {/* 시간 가로선 */}
                  {getHourLabels().map((label) => {
                    const hour = parseInt(label);
                    const top = (hour - 8) * 60 * 1.2;
                    return (
                      <div
                        key={label}
                        className="absolute left-0 right-0 border-t border-gray-100"
                        style={{ top: `${top}px` }}
                      />
                    );
                  })}

                  {/* 이벤트 블록 */}
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
      </div>
    </div>
  );
}
