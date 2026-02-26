"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMembers } from "@/services/api";

export function useMembers() {
  return useQuery({
    queryKey: ["members"],
    queryFn: fetchMembers,
    staleTime: Infinity,
  });
}
