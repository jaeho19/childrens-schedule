import { NextRequest, NextResponse } from "next/server";

const SESSION_SECRET = process.env.SESSION_SECRET ?? "kids-schedule-secret";

// Public paths that do NOT require authentication
const PUBLIC_PATHS = ["/api/auth/verify", "/login"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

function isValidSession(token: string): boolean {
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
    // Session valid for 7 days
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    return Date.now() - data.ts < sevenDays;
  } catch {
    return false;
  }
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Only protect /api/* routes (page routes handled client-side)
  if (pathname.startsWith("/api/")) {
    const sessionCookie = req.cookies.get("session");
    if (!sessionCookie || !isValidSession(sessionCookie.value)) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "인증이 필요합니다." } },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
