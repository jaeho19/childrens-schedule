/**
 * 월간 뷰 이벤트 바
 *
 * 카테고리 색상 기반 배경 + 구성원 색상 좌측 바로 직관적 구분
 */
"use client";

import { getEventMemberColor, getEventMembers } from "@/lib/member-color";
import type { ExpandedEvent, Category, Member } from "@/types";

interface EventBarProps {
  event: ExpandedEvent;
  category?: Category;
  members?: Member[];
  onClick?: (event: ExpandedEvent) => void;
}

export function EventBar({ event, category, members = [], onClick }: EventBarProps) {
  const icon = category?.icon ?? "";
  const eventMembers = getEventMembers(event.memberIds, members);
  const 구성원색상 = getEventMemberColor(event.memberIds, members);
  const 카테고리색상 = category?.color ?? "#9E9E9E";

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(event);
      }}
      className="mb-0.5 block w-full truncate rounded border-l-[3px] pl-1.5 pr-1 py-0.5 text-left text-[10px] font-semibold transition-opacity hover:opacity-80"
      style={{
        backgroundColor: `${카테고리색상}20`,
        borderLeftColor: 구성원색상,
        color: 카테고리색상,
      }}
      title={`${event.title} (${event.startTime}~${event.endTime}) - ${eventMembers.map((m) => m.name).join(", ")}`}
    >
      {icon} {event.title}
    </button>
  );
}
