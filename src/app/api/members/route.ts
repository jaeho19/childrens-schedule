import { NextResponse } from "next/server";
import { getMembers } from "@/services/store";

export async function GET() {
  return NextResponse.json(getMembers());
}
