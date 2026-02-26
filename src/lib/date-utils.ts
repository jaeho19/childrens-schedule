import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addWeeks,
  addMonths,
  addDays,
  format,
  parse,
  isSameDay,
  isWithinInterval,
  eachDayOfInterval,
  getISODay,
} from "date-fns";
import { ko } from "date-fns/locale";

export const START_HOUR = 8;
export const END_HOUR = 21;
export const MINUTE_HEIGHT = 1.2; // px per minute
export const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60;
export const GRID_HEIGHT = TOTAL_MINUTES * MINUTE_HEIGHT;

/** "HH:mm" → Y position (px) */
export function timeToY(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return ((h - START_HOUR) * 60 + m) * MINUTE_HEIGHT;
}

/** EventBlock height (px) */
export function eventHeight(startTime: string, endTime: string): number {
  return timeToY(endTime) - timeToY(startTime);
}

/** "HH:mm" → minutes from midnight */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** Get week range (월~일) for a given date */
export function getWeekRange(date: Date) {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return { start, end };
}

/** Get month range for a given date */
export function getMonthRange(date: Date) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return { start, end };
}

/** Format date as YYYY-MM-DD */
export function toDateString(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/** Parse YYYY-MM-DD to Date */
export function fromDateString(dateStr: string): Date {
  return parse(dateStr, "yyyy-MM-dd", new Date());
}

/** Format for display */
export function formatDateKo(date: Date, fmt: string): string {
  return format(date, fmt, { locale: ko });
}

/** Get days of a week as Date[] */
export function getWeekDays(date: Date): Date[] {
  const { start, end } = getWeekRange(date);
  return eachDayOfInterval({ start, end });
}

/** Hour labels for time grid */
export function getHourLabels(): string[] {
  const labels: string[] = [];
  for (let h = START_HOUR; h < END_HOUR; h++) {
    labels.push(`${h.toString().padStart(2, "0")}:00`);
  }
  return labels;
}

export {
  addWeeks,
  addMonths,
  addDays,
  format,
  isSameDay,
  isWithinInterval,
  eachDayOfInterval,
  getISODay,
  startOfWeek,
  startOfMonth,
};
