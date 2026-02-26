"use client";

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";

import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";

import { useCalendarStore } from "@/stores/calendarStore";
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from "@/features/events/hooks/useEvents";
import { useMembers } from "@/features/members/hooks/useMembers";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { checkAuth } from "@/services/api";
import { getWeekRange, toDateString } from "@/lib/date-utils";
import { CalendarHeader } from "@/components/layout/CalendarHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileDrawer } from "@/components/layout/MobileDrawer";
import { PinLogin } from "@/components/auth/PinLogin";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import type { ExpandedEvent, CalendarEvent } from "@/types";

// Dynamic imports for view components (PO-01)
function ViewSkeleton() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
    </div>
  );
}

const WeekView = dynamic(
  () => import("@/components/calendar/WeekView").then((m) => ({ default: m.WeekView })),
  { loading: () => <ViewSkeleton /> }
);
const MonthView = dynamic(
  () => import("@/components/calendar/MonthView").then((m) => ({ default: m.MonthView })),
  { loading: () => <ViewSkeleton /> }
);
const DayView = dynamic(
  () => import("@/components/calendar/DayView").then((m) => ({ default: m.DayView })),
  { loading: () => <ViewSkeleton /> }
);
const TimetableView = dynamic(
  () => import("@/components/calendar/TimetableView").then((m) => ({ default: m.TimetableView })),
  { loading: () => <ViewSkeleton /> }
);

// Dynamic imports for modal components (PO-04)
const EventModal = dynamic(
  () => import("@/components/event/EventModal").then((m) => ({ default: m.EventModal })),
  { ssr: false }
);
const EventForm = dynamic(
  () => import("@/components/event/EventForm").then((m) => ({ default: m.EventForm })),
  { ssr: false }
);

export default function HomePage() {
  const { currentDate, viewMode, setViewMode, setCurrentDate, goToPrev, goToNext } = useCalendarStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ExpandedEvent | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ExpandedEvent | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const mainRef = useRef<HTMLElement>(null);

  // Check existing session on mount (JWT cookie persistence)
  useEffect(() => {
    checkAuth()
      .then((isAuth) => {
        setAuthenticated(isAuth);
        setAuthChecking(false);
      })
      .catch(() => setAuthChecking(false));
  }, []);

  // 스와이프 네비게이션 (MR-06)
  useSwipeNavigation(mainRef, {
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrev,
    enabled: viewMode !== "timetable",
  });

  // 뷰에 따른 조회 범위 계산
  const { from, to } = useMemo(() => {
    switch (viewMode) {
      case "week":
      case "timetable": {
        const { start, end } = getWeekRange(currentDate);
        return { from: toDateString(start), to: toDateString(end) };
      }
      case "month": {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
        const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
        return { from: toDateString(calStart), to: toDateString(calEnd) };
      }
      case "day":
        return { from: toDateString(currentDate), to: toDateString(currentDate) };
    }
  }, [currentDate, viewMode]);

  const { data: events = [], isLoading: eventsLoading } = useEvents(from, to);
  const { data: members = [] } = useMembers();
  const { data: categories = [] } = useCategories();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  const handleEventClick = useCallback((event: ExpandedEvent) => {
    setSelectedEvent(event);
  }, []);

  const handleDayClick = useCallback(
    (date: Date) => {
      setCurrentDate(date);
      setViewMode("day");
    },
    [setCurrentDate, setViewMode]
  );

  const handleEdit = useCallback(() => {
    if (selectedEvent) {
      setEditingEvent(selectedEvent);
      setSelectedEvent(null);
    }
  }, [selectedEvent]);

  const handleDelete = useCallback(
    (eventId: string) => {
      deleteEvent.mutate(eventId);
      setSelectedEvent(null);
    },
    [deleteEvent]
  );

  const renderView = () => {
    if (eventsLoading) {
      return <ViewSkeleton />;
    }

    switch (viewMode) {
      case "week":
        return (
          <WeekView
            events={events}
            categories={categories}
            members={members}
            onEventClick={handleEventClick}
          />
        );
      case "month":
        return (
          <MonthView
            events={events}
            categories={categories}
            members={members}
            onEventClick={handleEventClick}
            onDayClick={handleDayClick}
          />
        );
      case "day":
        return (
          <DayView
            events={events}
            categories={categories}
            members={members}
            onEventClick={handleEventClick}
          />
        );
      case "timetable":
        return (
          <TimetableView
            events={events}
            categories={categories}
            members={members}
          />
        );
    }
  };

  if (authChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!authenticated) {
    return <PinLogin onSuccess={() => setAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      <CalendarHeader onMenuToggle={() => setDrawerOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        {/* 데스크탑 사이드바 */}
        <div className="hidden lg:block w-64 border-r border-gray-200 overflow-y-auto flex-shrink-0">
          <Sidebar members={members} categories={categories} />
          <div className="px-4 pb-4">
            <button
              onClick={() => setShowForm(true)}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              + 일정 추가
            </button>
          </div>
        </div>

        {/* 모바일 드로어 */}
        <MobileDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          members={members}
          categories={categories}
        />

        {/* 메인 캘린더 영역 */}
        <main ref={mainRef} className="flex-1 overflow-hidden touch-pan-y">{renderView()}</main>
      </div>

      {/* 모바일 + 버튼 */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors lg:hidden flex items-center justify-center"
        aria-label="일정 추가"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* 이벤트 상세 모달 */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          category={categoryMap.get(selectedEvent.categoryId)}
          members={members}
          onClose={() => setSelectedEvent(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* 이벤트 생성 폼 */}
      {showForm && (
        <EventForm
          categories={categories}
          members={members}
          onSubmit={(data) => {
            createEvent.mutate(data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* 이벤트 수정 폼 */}
      {editingEvent && (
        <EventForm
          categories={categories}
          members={members}
          initialData={{
            title: editingEvent.title,
            categoryId: editingEvent.categoryId,
            memberIds: editingEvent.memberIds,
            startTime: editingEvent.startTime,
            endTime: editingEvent.endTime,
            date: editingEvent.isRecurring ? null : editingEvent.date,
            recurrence: null,
            note: editingEvent.note,
          }}
          onSubmit={(data) => {
            updateEvent.mutate({ id: editingEvent.eventId, data });
            setEditingEvent(null);
          }}
          onCancel={() => setEditingEvent(null)}
        />
      )}
    </div>
  );
}
