import { NextResponse } from "next/server";
import { getCategories } from "@/services/store";

export async function GET() {
  return NextResponse.json(getCategories());
}
