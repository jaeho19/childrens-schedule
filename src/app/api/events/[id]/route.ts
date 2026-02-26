import { NextRequest, NextResponse } from "next/server";
import { getEvent, editEvent, removeEvent } from "@/services/store";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const event = getEvent(id);
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }
  return NextResponse.json(event);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const data = await request.json().catch(() => null);
  if (!data) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const event = editEvent(id, data);
    return NextResponse.json(event);
  } catch {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  removeEvent(id);
  return NextResponse.json({ success: true });
}
