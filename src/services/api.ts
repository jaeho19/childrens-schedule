import type { CalendarEvent, RecurrenceException, Member, Category } from "@/types";
import { MEMBERS, CATEGORIES, EVENTS, EXCEPTIONS } from "@/lib/seed-data";
import { expandAllEvents } from "@/lib/recurrence";
import { fromDateString } from "@/lib/date-utils";
import type { ExpandedEvent } from "@/types";

// 현재는 시드 데이터 기반 로컬 구현
// 추후 BKIT 백엔드 API로 교체 예정

let events = [...EVENTS];
let exceptions = [...EXCEPTIONS];

export async function fetchMembers(): Promise<Member[]> {
  return MEMBERS;
}

export async function fetchCategories(): Promise<Category[]> {
  return CATEGORIES;
}

export async function fetchEvents(from: string, to: string): Promise<ExpandedEvent[]> {
  const rangeStart = fromDateString(from);
  const rangeEnd = fromDateString(to);
  return expandAllEvents(events, exceptions, rangeStart, rangeEnd);
}

export async function fetchRawEvents(): Promise<CalendarEvent[]> {
  return events;
}

export async function fetchEvent(id: string): Promise<CalendarEvent | null> {
  return events.find((e) => e.id === id) ?? null;
}

export async function fetchExceptions(eventId: string): Promise<RecurrenceException[]> {
  return exceptions.filter((ex) => ex.eventId === eventId);
}

export async function createEvent(
  data: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">
): Promise<CalendarEvent> {
  const newEvent: CalendarEvent = {
    ...data,
    id: `evt-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  events.push(newEvent);
  return newEvent;
}

export async function updateEvent(
  id: string,
  data: Partial<Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">>
): Promise<CalendarEvent> {
  const idx = events.findIndex((e) => e.id === id);
  if (idx === -1) throw new Error("Event not found");
  events[idx] = { ...events[idx], ...data, updatedAt: new Date().toISOString() };
  return events[idx];
}

export async function deleteEvent(id: string): Promise<void> {
  events = events.filter((e) => e.id !== id);
  exceptions = exceptions.filter((ex) => ex.eventId !== id);
}

export async function createException(
  data: Omit<RecurrenceException, "id">
): Promise<RecurrenceException> {
  const newException: RecurrenceException = {
    ...data,
    id: `exc-${Date.now()}`,
  };
  exceptions.push(newException);
  return newException;
}

export async function deleteException(id: string): Promise<void> {
  exceptions = exceptions.filter((ex) => ex.id !== id);
}
