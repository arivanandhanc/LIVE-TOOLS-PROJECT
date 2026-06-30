import type { Express, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { randomUUID } from "crypto";
import { env } from "../config/env";
import { logger } from "../config/logger";
import { clientIp } from "../lib/client-ip";

/**
 * Rate-limit key. `req.ip` is derived from the forwarded-for chain under
 * `trust proxy`, which a client hitting the Render origin directly can pad to
 * rotate `req.ip` and slip the limit. `clientIp()` prefers the non-forgeable
 * `x-vercel-forwarded-for` (set by our own proxy) before falling back, giving a
 * stabler key for the normal browser path.
 */
function rateLimitKey(req: Request): string {
  return clientIp(req) ?? req.ip ?? "unknown";
}

/** Attach a request id for tracing. */
function requestId(req: Request, res: Response, next: NextFunction) {
  const id = (req.headers["x-request-id"] as string) || randomUUID();
  res.setHeader("x-request-id", id);
  (req as Request & { id: string }).id = id;
  next();
}

const corsMiddleware = cors({
  origin(origin, callback) {
    // Allow same-origin / server-to-server (no origin) and allowlisted origins.
    if (!origin || env.corsOrigins.includes(origin)) return callback(null, true);
    logger.warn({ origin }, "Blocked by CORS");
    // Reject by withholding CORS headers (callback(null, false)) rather than
    // throwing — throwing surfaces as a 500 to the error handler. The browser
    // still blocks the cross-origin read because no ACAO header is sent.
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Recaptcha-Token", "X-CSRF-Token"],
});

export const apiRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: rateLimitKey,
  message: { error: "Too many requests — please slow down." },
});

export const uploadRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.uploadRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: rateLimitKey,
  message: { error: "Too many uploads — please try again shortly." },
});

// Brute-force / credential-stuffing protection for auth endpoints. Successful
// requests aren't counted, so a legitimate user who logs in is never blocked;
// only repeated failed attempts from an IP trip the limit.
export const authRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.authRateLimitMax,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: rateLimitKey,
  message: { error: "Too many attempts — please wait a few minutes and try again." },
});

export function applySecurity(app: Express) {
  app.disable("x-powered-by");
  // Two hops in production: Vercel (same-origin API proxy) -> Render edge -> app.
  // This makes req.ip the real client IP for consent/audit logging & rate limits.
  app.set("trust proxy", 2);
  app.use(requestId);
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      contentSecurityPolicy: false, // API serves JSON/files; the web app owns its CSP
    })
  );
  app.use(corsMiddleware);
  app.use(compression());
  app.use(cookieParser());
  app.use(hpp());
}
