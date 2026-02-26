"use client";

import type { ExpandedEvent, Category, Member } from "@/types";
import { HighlightedText } from "./MemberTag";

interface EventModalProps {
  event: ExpandedEvent;
  category?: Category;
  members: Member[];
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: (eventId: string) => void;
}

export function EventModal({ event, category, members, onClose, onEdit, onDelete }: EventModalProps) {
  const eventMembers = members.filter((m) => event.memberIds.includes(m.id));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full bg-white shadow-2xl sm:max-w-md sm:rounded-xl rounded-t-xl max-h-[85vh] overflow-y-auto">
        {/* 모바일 드래그 핸들 */}
        <div className="sm:hidden flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* 헤더 */}
        <div
          className="flex items-start justify-between px-4 py-3 sm:px-5 sm:py-4 sm:rounded-t-xl"
          style={{ backgroundColor: `${category?.color ?? "#9E9E9E"}15` }}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">{category?.icon}</span>
              <h2 className="text-lg font-bold text-gray-900">{event.title}</h2>
            </div>
            <span
              className="inline-block mt-1 rounded-full px-2 py-0.5 text-xs font-medium"
              style={{ backgroundColor: `${category?.color}20`, color: category?.color }}
            >
              {category?.name}
            </span>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-white/50">
            <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 내용 */}
        <div className="px-4 py-3 sm:px-5 sm:py-4 space-y-3">
          <div className="flex items-center gap-3">
            <svg className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-gray-700">{event.date}</span>
          </div>

          <div className="flex items-center gap-3">
            <svg className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-700">
              {event.startTime} ~ {event.endTime}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <svg className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div className="flex items-center gap-1.5 flex-wrap">
              {eventMembers.map((m) => (
                <span
                  key={m.id}
                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-white"
                  style={{ backgroundColor: m.color }}
                >
                  {m.name}
                </span>
              ))}
            </div>
          </div>

          {event.isRecurring && (
            <div className="flex items-center gap-3">
              <svg className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-xs text-gray-500">반복 일정</span>
              {event.isModified && (
                <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] text-yellow-700">
                  수정됨
                </span>
              )}
            </div>
          )}

          {event.note && (
            <div className="flex items-start gap-3">
              <svg className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <HighlightedText text={event.note} members={members} className="text-sm text-gray-600" />
            </div>
          )}
        </div>

        {/* 액션 */}
        <div className="flex justify-end gap-2 border-t border-gray-100 px-4 py-3 sm:px-5">
          {onDelete && (
            <button
              onClick={() => onDelete(event.eventId)}
              className="rounded-lg px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
            >
              삭제
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              수정
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
