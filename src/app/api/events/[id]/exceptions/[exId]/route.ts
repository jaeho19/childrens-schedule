import { NextRequest, NextResponse } from "next/server";
import { removeException } from "@/services/store";

type Params = { params: Promise<{ id: string; exId: string }> };

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { exId } = await params;
  removeException(exId);
  return NextResponse.json({ success: true });
}
