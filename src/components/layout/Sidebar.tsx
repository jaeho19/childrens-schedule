"use client";

import { MiniCalendar } from "@/components/calendar/MiniCalendar";
import { MemberFilter } from "@/components/filter/MemberFilter";
import { CategoryFilter } from "@/components/filter/CategoryFilter";
import { useCalendarStore } from "@/stores/calendarStore";
import type { Member, Category } from "@/types";

interface SidebarProps {
  members: Member[];
  categories: Category[];
}

export function Sidebar({ members, categories }: SidebarProps) {
  const { currentDate, setCurrentDate } = useCalendarStore();

  return (
    <aside className="flex flex-col gap-5 p-4">
      <MiniCalendar selectedDate={currentDate} onDateSelect={setCurrentDate} />

      <hr className="border-gray-200" />

      <MemberFilter members={members} />

      <hr className="border-gray-200" />

      <CategoryFilter categories={categories} />
    </aside>
  );
}
