import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import { logger } from "../config/logger";

/**
 * Server-side reCAPTCHA verification (score-based / invisible).
 *
 * The browser sends a token in the `X-Recaptcha-Token` header; we verify it
 * with Google using credentials that never reach the client, and enforce a
 * minimum score to block bots/spam. Two tiers are supported:
 *
 *   • Enterprise — POST to the Assessments API with a GCP project + API key.
 *   • Classic v3 — POST to /recaptcha/api/siteverify with the secret key.
 *
 * No-ops gracefully when reCAPTCHA isn't configured so local dev still works.
 */

interface SiteVerifyResponse {
  success: boolean;
  score?: number;
  action?: string;
  "error-codes"?: string[];
}

interface AssessmentResponse {
  tokenProperties?: {
    valid?: boolean;
    action?: string;
    invalidReason?: string;
  };
  riskAnalysis?: { score?: number; reasons?: string[] };
  error?: { message?: string };
}

interface VerificationResult {
  ok: boolean;
  score?: number;
  action?: string;
  reason?: string;
}

/** reCAPTCHA Enterprise: create an assessment for the token. */
async function assessEnterprise(token: string, expectedAction?: string): Promise<VerificationResult> {
  const url =
    `https://recaptchaenterprise.googleapis.com/v1/projects/${env.recaptcha.projectId}` +
    `/assessments?key=${encodeURIComponent(env.recaptcha.apiKey!)}`;

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event: {
        token,
        siteKey: env.recaptcha.siteKey,
        ...(expectedAction ? { expectedAction } : {}),
      },
    }),
  });

  const data = (await resp.json()) as AssessmentResponse;
  if (!resp.ok) {
    // A bad API key / project is OUR misconfiguration, not a bot — surface it
    // loudly rather than silently rejecting real users.
    throw new Error(data.error?.message ?? `Assessment API returned ${resp.status}`);
  }

  const valid = data.tokenProperties?.valid === true;
  return {
    ok: valid,
    score: data.riskAnalysis?.score,
    action: data.tokenProperties?.action,
    reason: valid ? undefined : data.tokenProperties?.invalidReason ?? "invalid-token",
  };
}

/** Classic reCAPTCHA v3: siteverify with the secret key. */
async function assessClassic(token: string, remoteIp: string): Promise<VerificationResult> {
  const params = new URLSearchParams({
    secret: env.recaptcha.secret!,
    response: token,
    remoteip: remoteIp,
  });
  const resp = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  const data = (await resp.json()) as SiteVerifyResponse;
  return {
    ok: data.success,
    score: data.score,
    action: data.action,
    reason: data.success ? undefined : data["error-codes"]?.join(",") ?? "verification-failed",
  };
}

/**
 * Express middleware factory. `expectedAction` is optional — when omitted we
 * accept any action, which is what the sitewide guard needs (the action is
 * derived from the request path on the client).
 */
export function requireRecaptcha(expectedAction?: string) {
  return async function verify(req: Request, res: Response, next: NextFunction) {
    if (!env.recaptcha.enabled || !env.recaptcha.configured) return next();

    const token =
      (req.headers["x-recaptcha-token"] as string) ||
      (req.body?.recaptchaToken as string) ||
      // Google's HTML-button integration posts the token under this name.
      (req.body?.["g-recaptcha-response"] as string);

    if (!token) {
      return res.status(400).json({ error: "Missing reCAPTCHA token." });
    }

    try {
      const result =
        env.recaptcha.mode === "enterprise"
          ? await assessEnterprise(token, expectedAction)
          : await assessClassic(token, req.ip ?? "");

      if (!result.ok || (result.score ?? 0) < env.recaptcha.minScore) {
        logger.warn(
          { path: req.path, score: result.score, action: result.action, reason: result.reason },
          "reCAPTCHA rejected"
        );
        return res.status(403).json({ error: "Failed bot verification. Please try again." });
      }
      return next();
    } catch (err) {
      const detail = err instanceof Error ? err.message.slice(0, 200) : String(err).slice(0, 200);
      logger.error({ err, path: req.path }, "reCAPTCHA verification error");
      // Fail CLOSED unless explicitly opted out. `detail` is the upstream
      // failure reason (never a credential) — without it an operator has no way
      // to tell "Google is down" apart from "our API key is wrong".
      if (env.recaptcha.failOpen) return next();
      return res.status(503).json({ error: "Verification unavailable.", detail });
    }
  };
}

/** Back-compat alias for routes that opt in explicitly. */
export const verifyRecaptcha = requireRecaptcha();

/**
 * Derive the reCAPTCHA action from a request path.
 *
 * MUST stay byte-for-byte identical to `actionFromPath` in
 * frontend/src/lib/recaptcha.ts — the browser labels the token with this and
 * Google compares it against the `expectedAction` we send. Universal keys
 * REJECT an assessment that omits expectedAction outright, so this is required,
 * not optional. Google only accepts alphanumerics, slashes and underscores.
 */
export function actionFromPath(path: string): string {
  return path.split("?")[0].replace(/^\/+/, "").replace(/[^A-Za-z0-9/_]/g, "_") || "submit";
}

/**
 * Sitewide guard: verifies EVERY state-changing /api request. Safe methods and
 * the configured skip list (silent refresh, logout, OAuth redirects, telemetry)
 * pass straight through.
 */
export function recaptchaGuard(req: Request, res: Response, next: NextFunction) {
  if (!env.recaptcha.enabled || !env.recaptcha.configured) return next();
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();

  const path = req.originalUrl.split("?")[0];
  if (env.recaptcha.skipPaths.some((p) => path === p || path.startsWith(`${p}/`))) return next();

  // Derived per-request so it matches the action the browser used.
  return requireRecaptcha(actionFromPath(path))(req, res, next);
}
