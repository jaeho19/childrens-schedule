"use client";

import { useCalendarStore, type ViewMode } from "@/stores/calendarStore";
import { formatDateKo, getWeekRange } from "@/lib/date-utils";
import { format } from "date-fns";

const VIEW_LABELS: { mode: ViewMode; label: string }[] = [
  { mode: "month", label: "월" },
  { mode: "week", label: "주" },
  { mode: "day", label: "일" },
  { mode: "timetable", label: "시간표" },
];

export function CalendarHeader({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const { currentDate, viewMode, setViewMode, goToToday, goToPrev, goToNext } =
    useCalendarStore();

  const getFullTitle = () => {
    switch (viewMode) {
      case "month":
        return formatDateKo(currentDate, "yyyy년 M월");
      case "week":
      case "timetable": {
        const { start, end } = getWeekRange(currentDate);
        const startStr = format(start, "M/d");
        const endStr = format(end, "M/d");
        return `${formatDateKo(currentDate, "yyyy년 M월")} (${startStr}~${endStr})`;
      }
      case "day":
        return formatDateKo(currentDate, "yyyy년 M월 d일 (EEEE)");
    }
  };

  const getShortTitle = () => {
    switch (viewMode) {
      case "month":
        return formatDateKo(currentDate, "M월");
      case "week":
      case "timetable": {
        const { start, end } = getWeekRange(currentDate);
        return `${format(start, "M/d")}~${format(end, "M/d")}`;
      }
      case "day":
        return formatDateKo(currentDate, "M/d (EEE)");
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      {/* 1단: 메뉴 + 타이틀 + 오늘 + 네비 + 날짜 + (lg: 뷰탭) */}
      <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
              aria-label="메뉴"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <h1 className="hidden sm:block text-lg font-bold text-gray-900">가족 캘린더</h1>
          <button
            onClick={goToToday}
            className="rounded-lg border border-gray-300 px-2.5 py-1 text-sm font-medium hover:bg-gray-50 sm:px-3"
          >
            오늘
          </button>
          <div className="flex items-center gap-0.5">
            <button
              onClick={goToPrev}
              className="rounded-lg p-1.5 hover:bg-gray-100"
              aria-label="이전"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="rounded-lg p-1.5 hover:bg-gray-100"
              aria-label="다음"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          {/* 날짜: 모바일 축약 / 데스크탑 풀 */}
          <span className="text-sm font-semibold text-gray-800 truncate sm:text-base">
            <span className="hidden sm:inline">{getFullTitle()}</span>
            <span className="sm:hidden">{getShortTitle()}</span>
          </span>
        </div>

        {/* 뷰 탭: lg 이상에서만 1단에 표시 */}
        <div className="hidden lg:flex rounded-lg border border-gray-300">
          {VIEW_LABELS.map(({ mode, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                viewMode === mode
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } ${mode === "month" ? "rounded-l-lg" : ""} ${mode === "timetable" ? "rounded-r-lg" : ""}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 2단: 뷰 탭 (lg 미만에서 표시, 풀폭 균등 분할) */}
      <div className="flex border-t border-gray-100 lg:hidden">
        {VIEW_LABELS.map(({ mode, label }) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              viewMode === mode
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </header>
  );
}
