"use client";

import { useState } from "react";
import type { CalendarEvent, Category, Member } from "@/types";

type EventFormData = Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">;

interface EventFormProps {
  categories: Category[];
  members: Member[];
  initialData?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
}

const WEEKDAYS = [
  { value: 7, label: "일" },
  { value: 1, label: "월" },
  { value: 2, label: "화" },
  { value: 3, label: "수" },
  { value: 4, label: "목" },
  { value: 5, label: "금" },
  { value: 6, label: "토" },
];

export function EventForm({ categories, members, initialData, onSubmit, onCancel }: EventFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? categories[0]?.id ?? "");
  const [selectedMembers, setSelectedMembers] = useState<string[]>(
    initialData?.memberIds ?? members.map((m) => m.id)
  );
  const [startTime, setStartTime] = useState(initialData?.startTime ?? "09:00");
  const [endTime, setEndTime] = useState(initialData?.endTime ?? "10:00");
  const [isRecurring, setIsRecurring] = useState(!!initialData?.recurrence);
  const [date, setDate] = useState(initialData?.date ?? "");
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(
    initialData?.recurrence?.daysOfWeek ?? []
  );
  const [startDate, setStartDate] = useState(initialData?.recurrence?.startDate ?? "");
  const [endDate, setEndDate] = useState(initialData?.recurrence?.endDate ?? "");
  const [note, setNote] = useState(initialData?.note ?? "");

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const toggleDay = (day: number) => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      categoryId,
      memberIds: selectedMembers,
      startTime,
      endTime,
      date: isRecurring ? null : date || null,
      recurrence: isRecurring
        ? {
            type: "weekly",
            daysOfWeek,
            startDate,
            endDate: endDate || null,
          }
        : null,
      note: note || null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/30 hidden sm:block" onClick={onCancel} />
      <div className="relative w-full bg-white shadow-2xl sm:max-w-lg sm:rounded-xl h-full sm:h-auto sm:max-h-[90vh] flex flex-col">
        {/* 헤더: 모바일은 취소/등록 버튼 포함 */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 sm:px-5 sm:py-4 flex-shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="sm:hidden text-sm text-gray-500"
          >
            취소
          </button>
          <h2 className="text-lg font-bold text-gray-900">
            {initialData ? "일정 수정" : "새 일정"}
          </h2>
          <button
            type="submit"
            form="event-form"
            className="sm:hidden text-sm font-medium text-blue-600"
          >
            {initialData ? "수정" : "등록"}
          </button>
        </div>

        <form id="event-form" onSubmit={handleSubmit} className="px-4 py-4 sm:px-5 space-y-4 overflow-y-auto flex-1">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="일정 제목"
            />
          </div>

          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* 구성원 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">구성원</label>
            <div className="flex flex-wrap gap-2">
              {members.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggleMember(m.id)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                    selectedMembers.includes(m.id)
                      ? "text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                  style={
                    selectedMembers.includes(m.id)
                      ? { backgroundColor: m.color }
                      : undefined
                  }
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* 시간 */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">시작</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">종료</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* 반복 토글 */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">반복 일정</span>
            </label>
          </div>

          {isRecurring ? (
            <>
              {/* 반복 요일 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">반복 요일</label>
                <div className="flex gap-1">
                  {WEEKDAYS.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleDay(value)}
                      className={`h-9 w-9 rounded-full text-xs font-medium transition-colors ${
                        daysOfWeek.includes(value)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 반복 기간 */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">시작일</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    종료일 <span className="text-gray-400">(선택)</span>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </>
          ) : (
            /* 단일 날짜 */
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          )}

          {/* 비고 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비고 <span className="text-gray-400">(선택)</span>
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="메모"
            />
          </div>

          {/* 버튼: 데스크탑만 표시 (모바일은 헤더에 버튼 있음) */}
          <div className="hidden sm:flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {initialData ? "수정" : "등록"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
