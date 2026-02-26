export interface Recurrence {
  type: "weekly";
  daysOfWeek: number[]; // 1=월 ~ 7=일
  startDate: string;    // YYYY-MM-DD
  endDate: string | null;
}
