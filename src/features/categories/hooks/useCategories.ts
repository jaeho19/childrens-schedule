"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/services/api";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: Infinity,
  });
}
