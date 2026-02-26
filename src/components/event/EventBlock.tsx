/**
 * 주간/일간 뷰 이벤트 블록
 *
 * 색상 체계:
 * - 배경/테두리/텍스트: 카테고리 색상 기반
 * - 좌측 굵은 바: 구성원 색상 (복수 구성원 시 분할)
 * - 카테고리: 아이콘으로 구분
 * - 구성원 이름: MemberTag로 하이라이트
 */
"use client";

import { timeToY, eventHeight } from "@/lib/date-utils";
import { getEventMemberColor, getEventMembers } from "@/lib/member-color";
import { MemberTag, HighlightedText } from "./MemberTag";
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
  const eventMembers = getEventMembers(event.memberIds, members);
  const 구성원색상 = getEventMemberColor(event.memberIds, members);
  const 카테고리색상 = category?.color ?? "#9E9E9E";

  return (
    <button
      onClick={() => onClick?.(event)}
      onDoubleClick={(e) => e.stopPropagation()}
      className="absolute left-1 right-1 z-20 overflow-hidden rounded-md text-left transition-shadow hover:shadow-md"
      style={{
        top: `${top}px`,
        height: `${Math.max(height, 44)}px`,
        backgroundColor: `${카테고리색상}20`,
        borderLeft: `4px solid ${구성원색상}`,
        borderTop: `1px solid ${카테고리색상}40`,
        borderRight: `1px solid ${카테고리색상}40`,
        borderBottom: `1px solid ${카테고리색상}40`,
      }}
    >
      {/* 복수 구성원일 때 상단에 색상 도트 표시 */}
      {eventMembers.length >= 2 && height > 44 && (
        <div className="absolute top-0.5 right-1 flex gap-0.5">
          {eventMembers.map((m) => (
            <span
              key={m.id}
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: m.color }}
              title={m.name}
            />
          ))}
        </div>
      )}

      <div className="pl-1.5 pr-1 py-0.5">
        <div className="truncate text-xs font-bold" style={{ color: 카테고리색상 }}>
          {category?.icon} {event.title}
        </div>
        {height > 30 && (
          <div className="truncate text-[10px] font-medium" style={{ color: `${카테고리색상}CC` }}>
            {event.startTime}~{event.endTime}
          </div>
        )}
        {height > 50 && (
          <div className="flex items-center gap-1 flex-wrap">
            {eventMembers.map((m) => (
              <MemberTag key={m.id} member={m} size="xs" />
            ))}
          </div>
        )}
        {height > 65 && event.note && (
          <HighlightedText
            text={event.note}
            members={members}
            className="truncate text-[10px] text-gray-500 block"
          />
        )}
      </div>
    </button>
  );
}
