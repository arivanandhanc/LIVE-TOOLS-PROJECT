import crypto from "crypto";
import { env } from "../config/env";

/** Minimal dependency-free HS256 JWT (sign + verify). */

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

function parseTtl(ttl: string): number {
  const m = ttl.match(/^(\d+)([smhd])$/);
  if (!m) return 900; // 15m default
  const n = parseInt(m[1], 10);
  return n * ({ s: 1, m: 60, h: 3600, d: 86400 }[m[2]] ?? 60);
}

export interface JwtPayload {
  sub: string;
  role?: string;
  [key: string]: unknown;
}

export function signJwt(payload: JwtPayload, ttl = env.jwtAccessTtl): string {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const body = base64url(
    JSON.stringify({ ...payload, iat: now, exp: now + parseTtl(ttl) })
  );
  const data = `${header}.${body}`;
  const sig = crypto.createHmac("sha256", env.jwtSecret).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifyJwt(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, body, sig] = parts;
  const expected = crypto.createHmac("sha256", env.jwtSecret).update(`${header}.${body}`).digest("base64url");
  // Constant-time comparison
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as JwtPayload & { exp: number };
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
