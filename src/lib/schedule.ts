export interface SchoolPeriod {
  label: string;
  startTime: string;
  endTime: string;
}

export const SCHOOL_PERIODS: SchoolPeriod[] = [
  { label: "등교", startTime: "08:40", endTime: "08:50" },
  { label: "1교시", startTime: "09:00", endTime: "09:40" },
  { label: "2교시", startTime: "09:50", endTime: "10:30" },
  { label: "3교시", startTime: "10:40", endTime: "11:20" },
  { label: "4교시", startTime: "11:30", endTime: "12:10" },
  { label: "급식", startTime: "12:10", endTime: "13:00" },
  { label: "5교시", startTime: "13:00", endTime: "13:40" },
  { label: "6교시", startTime: "13:50", endTime: "14:30" },
];
