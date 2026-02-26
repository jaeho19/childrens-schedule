"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/services/api";
import { CATEGORIES } from "@/lib/seed-data";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: Infinity,
    initialData: CATEGORIES,
  });
}
