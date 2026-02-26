import { NextRequest, NextResponse } from "next/server";

import { deleteException } from "@/services/api";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; exId: string }> }
) {
  try {
    const { exId } = await params;
    await deleteException(exId);
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "서버 오류가 발생했습니다." } },
      { status: 500 }
    );
  }
}
