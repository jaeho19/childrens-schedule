import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SESSION_SECRET = process.env.SESSION_SECRET ?? "kids-schedule-secret";

export function isValidSession(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const [payload, sig] = parts;
    const expectedSig = Buffer.from(`${payload}.${SESSION_SECRET}`).toString("base64url");
    if (sig !== expectedSig) return false;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8")) as {
      ts: number;
      ok: boolean;
    };
    if (!data.ok) return false;
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    return Date.now() - data.ts < sevenDays;
  } catch {
    return false;
  }
}

export async function requireAuth(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  if (!session || !isValidSession(session.value)) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "인증이 필요합니다." } },
      { status: 401 }
    );
  }
  return null;
}
