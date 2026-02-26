"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  createException,
} from "@/services/api";
import type { CalendarEvent, RecurrenceException } from "@/types";

export function useEvents(from: string, to: string) {
  return useQuery({
    queryKey: ["events", from, to],
    queryFn: () => fetchEvents(from, to),
    staleTime: 60 * 1000,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">) =>
      createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">>;
    }) => updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useCreateException() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<RecurrenceException, "id">) => createException(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
