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
    return callback(new Error("Not allowed by CORS"));
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
  message: { error: "Too many requests — please slow down." },
});

export const uploadRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.uploadRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
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
