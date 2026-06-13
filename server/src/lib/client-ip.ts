import type { Request } from "express";

function firstHeader(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) value = value[0];
  if (typeof value === "string" && value.trim()) return value.split(",")[0].trim();
  return null;
}

/**
 * The real client IP for audit/consent logging.
 *
 * The app sits behind Cloudflare -> Vercel -> Render, so req.ip (and even a
 * tuned `trust proxy`) resolves to a proxy hop, not the visitor. The true client
 * IP is carried in different headers depending on the path (verified live):
 *  - Browser traffic is proxied by Vercel, which preserves the original client
 *    in `x-vercel-forwarded-for` (not forgeable through Vercel). On this path
 *    `cf-connecting-ip` is Vercel's own IP, so it must NOT win.
 *  - Direct-to-backend traffic via Cloudflare sets `cf-connecting-ip`.
 *  - Otherwise the left-most `x-forwarded-for` entry is the originating client.
 */
export function clientIp(req: Request): string | null {
  return (
    firstHeader(req.headers["x-vercel-forwarded-for"]) ??
    firstHeader(req.headers["cf-connecting-ip"]) ??
    firstHeader(req.headers["x-forwarded-for"]) ??
    req.ip ??
    null
  );
}
