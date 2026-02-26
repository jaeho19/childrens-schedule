import type { Recurrence } from "./recurrence";

export interface CalendarEvent {
  id: string;
  title: string;
  categoryId: string;
  memberIds: string[];
  startTime: string;           // HH:mm
  endTime: string;             // HH:mm
  date: string | null;         // YYYY-MM-DD (단일) or null (반복)
  recurrence: Recurrence | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RecurrenceException {
  id: string;
  eventId: string;
  date: string;                // YYYY-MM-DD
  type: "cancel" | "modify";
  modifiedFields: {
    title?: string;
    startTime?: string;
    endTime?: string;
    note?: string;
  } | null;
}

export interface ExpandedEvent {
  eventId: string;
  title: string;
  categoryId: string;
  memberIds: string[];
  date: string;                // YYYY-MM-DD
  startTime: string;
  endTime: string;
  note: string | null;
  isRecurring: boolean;
  isCancelled: boolean;
  isModified: boolean;
}
