import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-fallback-secret-change-in-production"
);

export const COOKIE_NAME = "family-calendar-session";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function signToken(): Promise<string> {
  return new SignJWT({ authenticated: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function verifyPin(pin: string): Promise<boolean> {
  const hash = process.env.AUTH_PIN_HASH;
  if (!hash) return false;
  return bcrypt.compare(pin, hash);
}
