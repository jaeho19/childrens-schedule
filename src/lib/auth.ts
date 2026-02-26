import { SignJWT, jwtVerify } from "jose";
import crypto from "crypto";

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

/**
 * PIN verification using HMAC-SHA256.
 * AUTH_PIN_HASH = hex output of HMAC-SHA256(pin, JWT_SECRET).
 * No $ characters, safe for all env var systems.
 */
export async function verifyPin(pin: string): Promise<boolean> {
  const storedHash = process.env.AUTH_PIN_HASH;
  const secret = process.env.JWT_SECRET || "dev-fallback-secret-change-in-production";
  if (!storedHash) return false;

  const inputHash = crypto
    .createHmac("sha256", secret)
    .update(pin)
    .digest("hex");

  // Timing-safe comparison to prevent timing attacks
  if (inputHash.length !== storedHash.length) return false;
  return crypto.timingSafeEqual(
    Buffer.from(inputHash),
    Buffer.from(storedHash)
  );
}
