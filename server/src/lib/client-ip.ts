import type { Request } from "express";

/**
 * The real client IP for audit/consent logging.
 *
 * The app sits behind Cloudflare -> Vercel -> Render, so Express's req.ip (and
 * even a tuned `trust proxy`) resolves to a proxy hop, not the visitor. When
 * Cloudflare is in front it sets `CF-Connecting-IP` to the authoritative client
 * IP — prefer that, then fall back to the left-most X-Forwarded-For entry, then
 * req.ip.
 */
export function clientIp(req: Request): string | null {
  const cf = req.headers["cf-connecting-ip"];
  if (typeof cf === "string" && cf.trim()) return cf.trim();

  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.trim()) return xff.split(",")[0].trim();

  return req.ip ?? null;
}
