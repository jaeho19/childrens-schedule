"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMembers } from "@/services/api";
import { MEMBERS } from "@/lib/seed-data";

export function useMembers() {
  return useQuery({
    queryKey: ["members"],
    queryFn: fetchMembers,
    staleTime: Infinity,
    initialData: MEMBERS,
  });
}
