import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";
import { fetchMembers } from "@/services/api";

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;
  try {
    const members = await fetchMembers();
    return NextResponse.json({ members });
  } catch {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "서버 오류가 발생했습니다." } },
      { status: 500 }
    );
  }
}
