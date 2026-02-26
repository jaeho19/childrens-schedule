import { addDays, getISODay } from "date-fns";

import { fromDateString, toDateString } from "./date-utils";
import type { CalendarEvent, RecurrenceException, ExpandedEvent } from "@/types";

/**
 * 단일 일정을 ExpandedEvent로 변환
 */
function expandSingleEvent(event: CalendarEvent): ExpandedEvent | null {
  if (!event.date) return null;
  return {
    eventId: event.id,
    title: event.title,
    categoryId: event.categoryId,
    memberIds: event.memberIds,
    date: event.date,
    startTime: event.startTime,
    endTime: event.endTime,
    note: event.note,
    isRecurring: false,
    isCancelled: false,
    isModified: false,
  };
}

/**
 * 반복 일정을 날짜 범위 내에서 ExpandedEvent[]로 전개
 */
export function expandRecurrence(
  event: CalendarEvent,
  exceptions: RecurrenceException[],
  rangeStart: Date,
  rangeEnd: Date
): ExpandedEvent[] {
  // 단일 일정
  if (!event.recurrence) {
    if (!event.date) return [];
    const eventDate = fromDateString(event.date);
    if (eventDate < rangeStart || eventDate > rangeEnd) return [];
    const expanded = expandSingleEvent(event);
    return expanded ? [expanded] : [];
  }

  const { daysOfWeek, startDate, endDate } = event.recurrence;
  const recStart = fromDateString(startDate);
  const recEnd = endDate ? fromDateString(endDate) : null;

  // 유효 범위 계산
  const effectiveStart = recStart > rangeStart ? recStart : rangeStart;
  const effectiveEnd = recEnd && recEnd < rangeEnd ? recEnd : rangeEnd;

  if (effectiveStart > effectiveEnd) return [];

  const results: ExpandedEvent[] = [];
  let cursor = effectiveStart;

  while (cursor <= effectiveEnd) {
    const isoDay = getISODay(cursor); // 1=월 ~ 7=일
    if (daysOfWeek.includes(isoDay)) {
      const dateStr = toDateString(cursor);

      // 예외 확인
      const exception = exceptions.find(
        (ex) => ex.eventId === event.id && ex.date === dateStr
      );

      if (exception?.type === "cancel") {
        // 취소된 날짜 → 건너뛰기
      } else if (exception?.type === "modify" && exception.modifiedFields) {
        results.push({
          eventId: event.id,
          title: exception.modifiedFields.title ?? event.title,
          categoryId: event.categoryId,
          memberIds: event.memberIds,
          date: dateStr,
          startTime: exception.modifiedFields.startTime ?? event.startTime,
          endTime: exception.modifiedFields.endTime ?? event.endTime,
          note: exception.modifiedFields.note ?? event.note,
          isRecurring: true,
          isCancelled: false,
          isModified: true,
        });
      } else {
        results.push({
          eventId: event.id,
          title: event.title,
          categoryId: event.categoryId,
          memberIds: event.memberIds,
          date: dateStr,
          startTime: event.startTime,
          endTime: event.endTime,
          note: event.note,
          isRecurring: true,
          isCancelled: false,
          isModified: false,
        });
      }
    }
    cursor = addDays(cursor, 1);
  }

  return results;
}

/**
 * 여러 이벤트를 한 번에 전개
 */
export function expandAllEvents(
  events: CalendarEvent[],
  exceptions: RecurrenceException[],
  rangeStart: Date,
  rangeEnd: Date
): ExpandedEvent[] {
  return events.flatMap((event) =>
    expandRecurrence(event, exceptions, rangeStart, rangeEnd)
  );
}
