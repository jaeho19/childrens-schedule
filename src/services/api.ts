/**
 * Client-side API layer — calls Next.js API Routes via fetch.
 */
import type { CalendarEvent, RecurrenceException, ExpandedEvent, Member, Category } from "@/types";

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Auth ────────────────────────────────────────────

export async function verifyAuth(pin: string): Promise<boolean> {
  const res = await fetch("/api/auth/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin }),
  });
  return res.ok;
}

export async function checkAuth(): Promise<boolean> {
  const data = await apiFetch<{ authenticated: boolean }>("/api/auth/status");
  return data.authenticated;
}

// ─── Members / Categories ────────────────────────────

export async function fetchMembers(): Promise<Member[]> {
  return apiFetch("/api/members");
}

export async function fetchCategories(): Promise<Category[]> {
  return apiFetch("/api/categories");
}

// ─── Events ──────────────────────────────────────────

export async function fetchEvents(from: string, to: string): Promise<ExpandedEvent[]> {
  return apiFetch(`/api/events?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
}

export async function fetchEvent(id: string): Promise<CalendarEvent> {
  return apiFetch(`/api/events/${encodeURIComponent(id)}`);
}

export async function createEvent(
  data: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">
): Promise<CalendarEvent> {
  return apiFetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateEvent(
  id: string,
  data: Partial<Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">>
): Promise<CalendarEvent> {
  return apiFetch(`/api/events/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteEvent(id: string): Promise<void> {
  await apiFetch(`/api/events/${encodeURIComponent(id)}`, { method: "DELETE" });
}

// ─── Exceptions ──────────────────────────────────────

export async function fetchExceptions(eventId: string): Promise<RecurrenceException[]> {
  return apiFetch(`/api/events/${encodeURIComponent(eventId)}/exceptions`);
}

export async function createException(
  data: Omit<RecurrenceException, "id">
): Promise<RecurrenceException> {
  return apiFetch(`/api/events/${encodeURIComponent(data.eventId)}/exceptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteException(eventId: string, exId: string): Promise<void> {
  await apiFetch(
    `/api/events/${encodeURIComponent(eventId)}/exceptions/${encodeURIComponent(exId)}`,
    { method: "DELETE" }
  );
}
