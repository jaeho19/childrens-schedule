/**
 * Server-side in-memory data store.
 * API Routes import from here. Will be replaced with real DB later.
 */
import type { CalendarEvent, RecurrenceException, Member, Category, ExpandedEvent } from "@/types";
import { MEMBERS, CATEGORIES, EVENTS, EXCEPTIONS } from "@/lib/seed-data";
import { expandAllEvents } from "@/lib/recurrence";
import { fromDateString } from "@/lib/date-utils";

let events = [...EVENTS];
let exceptions: RecurrenceException[] = [...EXCEPTIONS];

export function getMembers(): Member[] {
  return [...MEMBERS];
}

export function getCategories(): Category[] {
  return [...CATEGORIES];
}

export function getEvents(from: string, to: string): ExpandedEvent[] {
  const rangeStart = fromDateString(from);
  const rangeEnd = fromDateString(to);
  return expandAllEvents(events, exceptions, rangeStart, rangeEnd);
}

export function getEvent(id: string): CalendarEvent | null {
  return events.find((e) => e.id === id) ?? null;
}

export function getExceptions(eventId: string): RecurrenceException[] {
  return exceptions.filter((ex) => ex.eventId === eventId);
}

export function addEvent(
  data: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">
): CalendarEvent {
  const now = new Date().toISOString();
  const newEvent: CalendarEvent = {
    ...data,
    id: `evt-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  events.push(newEvent);
  return newEvent;
}

export function editEvent(
  id: string,
  data: Partial<Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">>
): CalendarEvent {
  const idx = events.findIndex((e) => e.id === id);
  if (idx === -1) throw new Error("Event not found");
  events[idx] = { ...events[idx], ...data, updatedAt: new Date().toISOString() };
  return events[idx];
}

export function removeEvent(id: string): void {
  events = events.filter((e) => e.id !== id);
  exceptions = exceptions.filter((ex) => ex.eventId !== id);
}

export function addException(
  data: Omit<RecurrenceException, "id">
): RecurrenceException {
  const newException: RecurrenceException = {
    ...data,
    id: `exc-${Date.now()}`,
  };
  exceptions.push(newException);
  return newException;
}

export function removeException(id: string): void {
  exceptions = exceptions.filter((ex) => ex.id !== id);
}
