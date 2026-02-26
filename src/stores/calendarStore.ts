import { create } from "zustand";
import { addWeeks, addMonths, addDays } from "date-fns";

export type ViewMode = "week" | "month" | "day" | "threeday" | "timetable";

interface CalendarStore {
  currentDate: Date;
  viewMode: ViewMode;
  setCurrentDate: (date: Date) => void;
  setViewMode: (mode: ViewMode) => void;
  goToToday: () => void;
  goToPrev: () => void;
  goToNext: () => void;
}

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  currentDate: new Date(),
  viewMode: "week",

  setCurrentDate: (date) => set({ currentDate: date }),
  setViewMode: (mode) => set({ viewMode: mode }),
  goToToday: () => set({ currentDate: new Date() }),

  goToPrev: () => {
    const { currentDate, viewMode } = get();
    switch (viewMode) {
      case "week":
      case "timetable":
        set({ currentDate: addWeeks(currentDate, -1) });
        break;
      case "month":
        set({ currentDate: addMonths(currentDate, -1) });
        break;
      case "threeday":
        set({ currentDate: addDays(currentDate, -3) });
        break;
      case "day":
        set({ currentDate: addDays(currentDate, -1) });
        break;
    }
  },

  goToNext: () => {
    const { currentDate, viewMode } = get();
    switch (viewMode) {
      case "week":
      case "timetable":
        set({ currentDate: addWeeks(currentDate, 1) });
        break;
      case "month":
        set({ currentDate: addMonths(currentDate, 1) });
        break;
      case "threeday":
        set({ currentDate: addDays(currentDate, 3) });
        break;
      case "day":
        set({ currentDate: addDays(currentDate, 1) });
        break;
    }
  },
}));
