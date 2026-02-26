import { NextRequest, NextResponse } from "next/server";
import { getExceptions, addException } from "@/services/store";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  return NextResponse.json(getExceptions(id));
}

export async function POST(request: NextRequest, { params }: Params) {
  const { id: eventId } = await params;
  const data = await request.json().catch(() => null);
  if (!data) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { date, type, modifiedFields } = data;
  if (!date || !type) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const exception = addException({
    eventId,
    date,
    type,
    modifiedFields: modifiedFields ?? null,
  });

  return NextResponse.json(exception, { status: 201 });
}
