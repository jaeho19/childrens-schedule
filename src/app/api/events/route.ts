import { NextRequest, NextResponse } from "next/server";

import { fetchEvents, createEvent } from "@/services/api";
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!from || !to) {
      return NextResponse.json(
        { error: { code: "MISSING_PARAMS", message: "from, to 파라미터가 필요합니다." } },
        { status: 400 }
      );
    }

    if (!isValidDate(from) || !isValidDate(to)) {
      return NextResponse.json(
        { error: { code: "INVALID_DATE", message: "날짜 형식은 YYYY-MM-DD여야 합니다." } },
        { status: 400 }
      );
    }

    const events = await fetchEvents(from, to);
    return NextResponse.json({ events });
  } catch {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "서버 오류가 발생했습니다." } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Partial<Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">>;

    // Required field validation
    if (!body.title || typeof body.title !== "string") {
      return NextResponse.json(
        { error: { code: "MISSING_TITLE", message: "제목이 필요합니다." } },
        { status: 400 }
      );
    }

    if (!body.startTime || !isValidTime(body.startTime)) {
      return NextResponse.json(
        { error: { code: "INVALID_TIME", message: "시작 시간 형식은 HH:mm이어야 합니다." } },
        { status: 400 }
      );
    }

    if (!body.endTime || !isValidTime(body.endTime)) {
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

    if (!isValidMemberIds(body.memberIds)) {
      return NextResponse.json(
        { error: { code: "INVALID_MEMBER_IDS", message: "유효하지 않은 구성원 ID입니다." } },
        { status: 400 }
      );
    }

    const event = await createEvent({
      title: body.title,
      categoryId: body.categoryId ?? "etc",
      memberIds: body.memberIds,
      startTime: body.startTime,
      endTime: body.endTime,
      date: body.date ?? null,
      recurrence: body.recurrence ?? null,
      note: body.note ?? null,
    });

    return NextResponse.json(event, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "서버 오류가 발생했습니다." } },
      { status: 500 }
    );
  }
}
