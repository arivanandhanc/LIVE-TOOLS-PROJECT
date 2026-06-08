import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import { verifyJwt } from "../lib/jwt";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string | null;
      userRole?: string | null;
      guestId?: string;
    }
  }
}

/**
 * Optional authentication: if a valid Bearer token is present, attach the user.
 * Otherwise the request proceeds as a guest (login is optional by design).
 * Also ensures a stable guest id cookie for anonymous history/rate-keys.
 */
export function identity(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    const payload = verifyJwt(auth.slice(7));
    if (payload) {
      req.userId = payload.sub;
      req.userRole = (payload.role as string) ?? "USER";
    }
  }

  if (!req.userId) {
    let guestId = req.cookies?.cf_guest as string | undefined;
    if (!guestId) {
      guestId = randomUUID();
      const isProd = process.env.NODE_ENV === "production";
      res.cookie("cf_guest", guestId, {
        httpOnly: true,
        // Cross-site (web app ⇄ API on different domains) needs SameSite=None
        // so the guest id persists across requests in production.
        sameSite: isProd ? "none" : "lax",
        secure: isProd,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });
    }
    req.guestId = guestId;
  }
  next();
}

/** Require an authenticated user. */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.userId) return res.status(401).json({ error: "Authentication required." });
  next();
}

/** Require an admin user. */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.userId) return res.status(401).json({ error: "Authentication required." });
  if (req.userRole !== "ADMIN") return res.status(403).json({ error: "Admin access required." });
  next();
}
