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
  addMonths,
  format,
} from "date-fns";
import { ko } from "date-fns/locale";
import { useState } from "react";

interface MiniCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];

export function MiniCalendar({ selectedDate, onDateSelect }: MiniCalendarProps) {
  const [viewMonth, setViewMonth] = useState(selectedDate);
  const today = new Date();

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(viewMonth);
    const monthEnd = endOfMonth(viewMonth);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [viewMonth]);

  return (
    <div className="select-none">
      {/* 월 네비게이션 */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setViewMonth(addMonths(viewMonth, -1))}
          className="rounded p-1 hover:bg-gray-100"
        >
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-xs font-semibold text-gray-700">
          {format(viewMonth, "yyyy년 M월", { locale: ko })}
        </span>
        <button
          onClick={() => setViewMonth(addMonths(viewMonth, 1))}
          className="rounded p-1 hover:bg-gray-100"
        >
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center text-[10px] text-gray-400 font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 */}
      <div className="grid grid-cols-7 gap-0.5">
        {calendarDays.map((day) => {
          const isCurrentMonth = isSameMonth(day, viewMonth);
          const isToday = isSameDay(day, today);
          const isSelected = isSameDay(day, selectedDate);
          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateSelect(day)}
              className={`h-6 w-6 rounded-full text-[10px] flex items-center justify-center transition-colors ${
                isSelected
                  ? "bg-blue-600 text-white"
                  : isToday
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : isCurrentMonth
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-gray-300"
              }`}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
