import { NextResponse } from "next/server";

import { fetchCategories } from "@/services/api";

export async function GET() {
  try {
    const categories = await fetchCategories();
    return NextResponse.json({ categories });
  } catch {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "서버 오류가 발생했습니다." } },
      { status: 500 }
    );
  }
}
