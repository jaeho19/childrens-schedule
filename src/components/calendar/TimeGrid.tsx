"use client";

import { getHourLabels, GRID_HEIGHT } from "@/lib/date-utils";
import { SCHOOL_PERIODS } from "@/lib/schedule";
import { CurrentTimeIndicator } from "./CurrentTimeIndicator";
import { PeriodOverlay } from "./PeriodOverlay";

interface TimeGridProps {
  showPeriodOverlay?: boolean;
  children: React.ReactNode;
}

export function TimeGrid({ showPeriodOverlay = true, children }: TimeGridProps) {
  const hours = getHourLabels();

  return (
    <div className="relative flex" style={{ height: `${GRID_HEIGHT}px` }}>
      {/* 시간 라벨 컬럼: 모바일 축소 */}
      <div className="w-10 sm:w-14 flex-shrink-0">
        {hours.map((label) => {
          const hour = parseInt(label);
          const top = (hour - 8) * 60 * 1.2;
          return (
            <div
              key={label}
              className="absolute text-right text-[10px] sm:text-xs text-gray-500 pr-1 sm:pr-2"
              style={{ top: `${top - 8}px`, width: "2.5rem" }}
            >
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{hour}</span>
            </div>
          );
        })}
      </div>

      {/* 그리드 영역 */}
      <div className="relative flex-1">
        {/* 시간 가로선 */}
        {hours.map((label) => {
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

        {/* 30분 점선 */}
        {hours.map((label) => {
          const hour = parseInt(label);
          const top = (hour - 8) * 60 * 1.2 + 30 * 1.2;
          return (
            <div
              key={`${label}-half`}
              className="absolute left-0 right-0 border-t border-dashed border-gray-50"
              style={{ top: `${top}px` }}
            />
          );
        })}

        {/* 교시 오버레이 */}
        {showPeriodOverlay && <PeriodOverlay periods={SCHOOL_PERIODS} />}

        {/* 현재 시간 인디케이터 */}
        <CurrentTimeIndicator />

        {/* 이벤트 콘텐츠 */}
        {children}
      </div>
    </div>
  );
}
