import { NextRequest, NextResponse } from "next/server";
import { getEvents, addEvent } from "@/services/store";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return NextResponse.json(
      { error: "from and to query parameters are required" },
      { status: 400 }
    );
  }

  return NextResponse.json(getEvents(from, to));
}

export async function POST(request: NextRequest) {
  const data = await request.json().catch(() => null);
  if (!data) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { title, categoryId, memberIds, startTime, endTime, date, recurrence, note } = data;
  if (!title || !categoryId || !memberIds || !startTime || !endTime) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const event = addEvent({
    title,
    categoryId,
    memberIds,
    startTime,
    endTime,
    date: date ?? null,
    recurrence: recurrence ?? null,
    note: note ?? null,
  });

  return NextResponse.json(event, { status: 201 });
}
