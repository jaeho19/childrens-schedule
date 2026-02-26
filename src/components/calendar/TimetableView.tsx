"use client";

import { useMemo } from "react";

import { getWeekDays, toDateString, timeToMinutes } from "@/lib/date-utils";
import { SCHOOL_PERIODS } from "@/lib/schedule";
import { useCalendarStore } from "@/stores/calendarStore";
import { useFilterStore } from "@/stores/filterStore";
import type { ExpandedEvent, Category, Member } from "@/types";

interface TimetableViewProps {
  events: ExpandedEvent[];
  categories: Category[];
  members: Member[];
}

const WEEKDAY_LABELS = ["월", "화", "수", "목", "금"];

export function TimetableView({ events, categories, members }: TimetableViewProps) {
  const currentDate = useCalendarStore((s) => s.currentDate);
  const { selectedMemberIds, selectedCategoryIds } = useFilterStore();
  const days = useMemo(() => getWeekDays(currentDate).slice(0, 5), [currentDate]); // 월~금만

  const filteredEvents = useMemo(
    () =>
      events.filter(
        (e) =>
          e.memberIds.some((id) => selectedMemberIds.includes(id)) &&
          selectedCategoryIds.includes(e.categoryId)
      ),
    [events, selectedMemberIds, selectedCategoryIds]
  );

  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  // 교시 시간대에 걸치는 이벤트 찾기
  const getEventsInPeriod = (dateStr: string, periodStart: string, periodEnd: string) => {
    const pStart = timeToMinutes(periodStart);
    const pEnd = timeToMinutes(periodEnd);
    return filteredEvents.filter((e) => {
      if (e.date !== dateStr) return false;
      const eStart = timeToMinutes(e.startTime);
      const eEnd = timeToMinutes(e.endTime);
      return eStart < pEnd && eEnd > pStart;
    });
  };

  // 방과후 이벤트 (14:30 이후)
  const getAfterSchoolEvents = (dateStr: string) => {
    return filteredEvents.filter((e) => {
      if (e.date !== dateStr) return false;
      return timeToMinutes(e.startTime) >= timeToMinutes("14:30") ||
             (timeToMinutes(e.startTime) >= timeToMinutes("13:40") && e.categoryId !== "school");
    });
  };

  return (
    <div className="h-full overflow-auto p-2 sm:p-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 min-w-[540px]">
          <colgroup>
            <col className="w-14 sm:w-20" />
            {days.map((_, i) => <col key={i} />)}
          </colgroup>
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-2 py-2 text-xs sm:text-sm font-medium text-gray-600">
                교시
              </th>
              {days.map((day, i) => (
                <th
                  key={i}
                  className="border border-gray-200 px-2 py-2 text-xs sm:text-sm font-medium text-gray-600"
                >
                  {WEEKDAY_LABELS[i]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SCHOOL_PERIODS.map((period) => (
              <tr key={period.label}>
                <td className="border border-gray-200 px-1.5 py-1.5 sm:px-3 sm:py-2 text-center">
                  <div className="text-[10px] sm:text-xs font-medium text-gray-700">{period.label}</div>
                  <div className="text-[9px] sm:text-[10px] text-gray-400">
                    {period.startTime}~{period.endTime}
                  </div>
                </td>
                {days.map((day) => {
                  const dateStr = toDateString(day);
                  const cellEvents = getEventsInPeriod(dateStr, period.startTime, period.endTime);
                  return (
                    <td
                      key={dateStr}
                      className="border border-gray-200 px-1 py-1 sm:px-2 sm:py-1.5 align-top"
                    >
                      {cellEvents.map((event) => {
                        const cat = categoryMap.get(event.categoryId);
                        const eventMembers = members.filter((m) =>
                          event.memberIds.includes(m.id)
                        );
                        return (
                          <div
                            key={`${event.eventId}-${event.date}`}
                            className="mb-1 rounded px-1 py-0.5 text-[10px] sm:text-xs"
                            style={{
                              backgroundColor: `${cat?.color ?? "#9E9E9E"}15`,
                              borderLeft: `2px solid ${cat?.color ?? "#9E9E9E"}`,
                            }}
                          >
                            <div className="font-medium" style={{ color: cat?.color }}>
                              {cat?.icon} {event.title}
                            </div>
                            {event.note && (
                              <div className="text-[9px] sm:text-[10px] text-gray-400">{event.note}</div>
                            )}
                            {eventMembers.length === 1 && (
                              <div className="text-[9px] sm:text-[10px] text-gray-400">
                                ({eventMembers[0].name})
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </td>
                  );
                })}
              </tr>
            ))}
            {/* 방과후 행 */}
            <tr>
              <td className="border border-gray-200 px-1.5 py-1.5 sm:px-3 sm:py-2 text-center">
                <div className="text-[10px] sm:text-xs font-medium text-gray-700">방과후</div>
                <div className="text-[9px] sm:text-[10px] text-gray-400">14:30~</div>
              </td>
              {days.map((day) => {
                const dateStr = toDateString(day);
                const afterEvents = getAfterSchoolEvents(dateStr);
                return (
                  <td
                    key={dateStr}
                    className="border border-gray-200 px-1 py-1 sm:px-2 sm:py-1.5 align-top"
                  >
                    {afterEvents.map((event) => {
                      const cat = categoryMap.get(event.categoryId);
                      const eventMembers = members.filter((m) =>
                        event.memberIds.includes(m.id)
                      );
                      return (
                        <div
                          key={`${event.eventId}-${event.date}`}
                          className="mb-1 rounded px-1 py-0.5 text-[10px] sm:text-xs"
                          style={{
                            backgroundColor: `${cat?.color ?? "#9E9E9E"}15`,
                            borderLeft: `2px solid ${cat?.color ?? "#9E9E9E"}`,
                          }}
                        >
                          <div className="font-medium" style={{ color: cat?.color }}>
                            {cat?.icon} {event.title}
                          </div>
                          <div className="text-[9px] sm:text-[10px] text-gray-500">
                            {event.startTime}~{event.endTime}
                          </div>
                          {eventMembers.length === 1 && (
                            <div className="text-[9px] sm:text-[10px] text-gray-400">
                              ({eventMembers[0].name})
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
