import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import { logger } from "../config/logger";

interface SiteVerifyResponse {
  success: boolean;
  score?: number;
  action?: string;
  "error-codes"?: string[];
}

/**
 * Server-side reCAPTCHA v3 verification. The browser sends a token in the
 * `X-Recaptcha-Token` header; we verify it against Google using the SECRET key
 * (never exposed to the client) and enforce a minimum score to block bots/spam.
 *
 * No-ops gracefully when reCAPTCHA isn't configured so local dev still works.
 */
export async function verifyRecaptcha(req: Request, res: Response, next: NextFunction) {
  if (!env.recaptcha.enabled || !env.recaptcha.secret) return next();

  const token = (req.headers["x-recaptcha-token"] as string) || (req.body?.recaptchaToken as string);
  if (!token) {
    return res.status(400).json({ error: "Missing reCAPTCHA token." });
  }

  try {
    const params = new URLSearchParams({
      secret: env.recaptcha.secret,
      response: token,
      remoteip: req.ip ?? "",
    });
    const resp = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const data = (await resp.json()) as SiteVerifyResponse;

    if (!data.success || (data.score ?? 0) < env.recaptcha.minScore) {
      logger.warn({ score: data.score, codes: data["error-codes"] }, "reCAPTCHA rejected");
      return res.status(403).json({ error: "Failed bot verification. Please try again." });
    }
    return next();
  } catch (err) {
    logger.error({ err }, "reCAPTCHA verification error");
    // Fail-open in dev, fail-closed in prod.
    return env.isProd ? res.status(503).json({ error: "Verification unavailable." }) : next();
  }
}
