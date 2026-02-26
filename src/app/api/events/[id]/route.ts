import { NextRequest, NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";
import { fetchEvent, updateEvent, deleteEvent } from "@/services/api";
import type { CalendarEvent } from "@/types";

// Validation helpers
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;
const VALID_MEMBER_IDS = ["sunwoo", "chanwoo", "jaeho", "sooyoung"];

function isValidDate(s: string): boolean {
  return DATE_RE.test(s);
}

function isValidTime(s: string): boolean {
  return TIME_RE.test(s);
}

function isValidMemberIds(ids: unknown): ids is string[] {
  return (
    Array.isArray(ids) &&
    ids.length > 0 &&
    ids.every((id) => typeof id === "string" && VALID_MEMBER_IDS.includes(id))
  );
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth();
  if (authError) return authError;
  try {
    const { id } = await params;
    const event = await fetchEvent(id);
    if (!event) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "일정을 찾을 수 없습니다." } },
        { status: 404 }
      );
    }
    return NextResponse.json(event);
  } catch {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "서버 오류가 발생했습니다." } },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth();
  if (authError) return authError;
  try {
    const { id } = await params;

    const existing = await fetchEvent(id);
    if (!existing) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "일정을 찾을 수 없습니다." } },
        { status: 404 }
      );
    }

    const body = await req.json() as Partial<Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">>;

    if (body.startTime !== undefined && !isValidTime(body.startTime)) {
      return NextResponse.json(
        { error: { code: "INVALID_TIME", message: "시작 시간 형식은 HH:mm이어야 합니다." } },
        { status: 400 }
      );
    }

    if (body.endTime !== undefined && !isValidTime(body.endTime)) {
      return NextResponse.json(
        { error: { code: "INVALID_TIME", message: "종료 시간 형식은 HH:mm이어야 합니다." } },
        { status: 400 }
      );
    }

    if (body.date !== undefined && body.date !== null && !isValidDate(body.date)) {
      return NextResponse.json(
        { error: { code: "INVALID_DATE", message: "날짜 형식은 YYYY-MM-DD여야 합니다." } },
        { status: 400 }
      );
    }

    if (body.memberIds !== undefined && !isValidMemberIds(body.memberIds)) {
      return NextResponse.json(
        { error: { code: "INVALID_MEMBER_IDS", message: "유효하지 않은 구성원 ID입니다." } },
        { status: 400 }
      );
    }

    const updated = await updateEvent(id, body);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "서버 오류가 발생했습니다." } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth();
  if (authError) return authError;
  try {
    const { id } = await params;

    const existing = await fetchEvent(id);
    if (!existing) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "일정을 찾을 수 없습니다." } },
        { status: 404 }
      );
    }

    await deleteEvent(id);
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "서버 오류가 발생했습니다." } },
      { status: 500 }
    );
  }
}
