import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const AUTH_PIN = process.env.AUTH_PIN ?? "1234";
// Simple session token: base64-encoded timestamp + secret
const SESSION_SECRET = process.env.SESSION_SECRET ?? "kids-schedule-secret";

function createSessionToken(): string {
  const payload = JSON.stringify({ ts: Date.now(), ok: true });
  // Simple HMAC-like token using base64 — sufficient for a home app
  const token = Buffer.from(payload).toString("base64url");
  const sig = Buffer.from(`${token}.${SESSION_SECRET}`).toString("base64url");
  return `${token}.${sig}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pin } = body as { pin?: string };

    if (!pin) {
      return NextResponse.json(
        { error: { code: "MISSING_PIN", message: "PIN이 필요합니다." } },
        { status: 400 }
      );
    }

    if (pin !== AUTH_PIN) {
      return NextResponse.json(
        { error: { code: "INVALID_PIN", message: "PIN이 올바르지 않습니다." } },
        { status: 401 }
      );
    }

    const token = createSessionToken();
    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "서버 오류가 발생했습니다." } },
      { status: 500 }
    );
  }
}
