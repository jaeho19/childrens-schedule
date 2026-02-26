import { NextRequest, NextResponse } from "next/server";

import { fetchEvent, fetchExceptions, createException } from "@/services/api";
import type { RecurrenceException } from "@/types";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(s: string): boolean {
  return DATE_RE.test(s);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const event = await fetchEvent(id);
    if (!event) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "일정을 찾을 수 없습니다." } },
        { status: 404 }
      );
    }

    const exceptions = await fetchExceptions(id);
    return NextResponse.json({ exceptions });
  } catch {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "서버 오류가 발생했습니다." } },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const event = await fetchEvent(id);
    if (!event) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "일정을 찾을 수 없습니다." } },
        { status: 404 }
      );
    }

    const body = await req.json() as Partial<Omit<RecurrenceException, "id" | "eventId">>;

    if (!body.date || !isValidDate(body.date)) {
      return NextResponse.json(
        { error: { code: "INVALID_DATE", message: "날짜 형식은 YYYY-MM-DD여야 합니다." } },
        { status: 400 }
      );
    }

    if (!body.type || !["cancel", "modify"].includes(body.type)) {
      return NextResponse.json(
        { error: { code: "INVALID_TYPE", message: "type은 'cancel' 또는 'modify'이어야 합니다." } },
        { status: 400 }
      );
    }

    const exception = await createException({
      eventId: id,
      date: body.date,
      type: body.type as "cancel" | "modify",
      modifiedFields: body.modifiedFields ?? null,
    });

    return NextResponse.json(exception, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "서버 오류가 발생했습니다." } },
      { status: 500 }
    );
  }
}
