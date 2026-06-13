import crypto from "crypto";
import { Router } from "express";
import { z } from "zod";
import { asyncHandler, HttpError } from "../middleware/error";
import { verifyRecaptcha } from "../middleware/recaptcha";
import { requireAuth } from "../middleware/identity";
import * as auth from "../services/auth";
import { isServiceEnabled } from "../services/admin";
import { env } from "../config/env";

export const authRouter = Router();

const REFRESH_COOKIE = "cf_refresh";
// In production the web app (e.g. tools.arivanandhan.in) and the API
// (e.g. tools-live.onrender.com) are on DIFFERENT registrable domains, which
// makes the refresh request cross-site. A `lax` cookie is NOT sent on those
// cross-site fetches, so the silent refresh on page load fails and the user
// is logged out on every reload. `sameSite:"none"` + `secure:true` fixes that.
// Locally (same-site http://localhost) we keep `lax` since browsers reject
// `none` without `secure`.
const cookieOpts = {
  httpOnly: true as const,
  sameSite: (env.isProd ? "none" : "lax") as "none" | "lax",
  secure: env.isProd,
  path: "/api/auth",
  maxAge: env.jwtRefreshTtlDays * 86400_000,
};

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters.").max(200),
  name: z.string().max(120).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(200),
});

function ctxOf(req: import("express").Request) {
  return { ip: req.ip ?? null, userAgent: req.headers["user-agent"] ?? null };
}

authRouter.post(
  "/auth/register",
  verifyRecaptcha,
  asyncHandler(async (req, res) => {
    if (!(await isServiceEnabled("registration_enabled"))) {
      throw new HttpError(503, "New registrations are temporarily disabled.");
    }
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, "Invalid input", parsed.error.flatten());
    const result = await auth.register(parsed.data, ctxOf(req));
    if (auth.isVerificationRequired(result)) {
      return res.status(202).json({ verificationRequired: true, email: result.email });
    }
    res.cookie(REFRESH_COOKIE, result.refreshToken, cookieOpts);
    res.status(201).json({ accessToken: result.accessToken, user: result.user });
  })
);

authRouter.post(
  "/auth/login",
  verifyRecaptcha,
  asyncHandler(async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, "Invalid input", parsed.error.flatten());
    const result = await auth.login(parsed.data, ctxOf(req));
    if (auth.isVerificationRequired(result)) {
      return res.status(202).json({ verificationRequired: true, email: result.email });
    }
    res.cookie(REFRESH_COOKIE, result.refreshToken, cookieOpts);
    res.json({ accessToken: result.accessToken, user: result.user });
  })
);

const verifyOtpSchema = z.object({ email: z.string().email(), code: z.string().min(4).max(8) });

authRouter.post(
  "/auth/verify-otp",
  asyncHandler(async (req, res) => {
    const parsed = verifyOtpSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, "Enter the 6-digit code we emailed you.");
    const result = await auth.verifyOtp(parsed.data.email, parsed.data.code, ctxOf(req));
    res.cookie(REFRESH_COOKIE, result.refreshToken, cookieOpts);
    res.json({ accessToken: result.accessToken, user: result.user });
  })
);

const resendOtpSchema = z.object({ email: z.string().email() });

authRouter.post(
  "/auth/resend-otp",
  asyncHandler(async (req, res) => {
    const parsed = resendOtpSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, "Invalid email.");
    await auth.requestOtp(parsed.data.email);
    res.json({ ok: true });
  })
);

authRouter.post(
  "/auth/refresh",
  asyncHandler(async (req, res) => {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (!token) throw new HttpError(401, "No session.");
    const result = await auth.refresh(token, ctxOf(req));
    res.cookie(REFRESH_COOKIE, result.refreshToken, cookieOpts);
    res.json({ accessToken: result.accessToken, user: result.user });
  })
);

authRouter.post(
  "/auth/logout",
  asyncHandler(async (req, res) => {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (token) await auth.logout(token);
    res.clearCookie(REFRESH_COOKIE, { path: "/api/auth", sameSite: cookieOpts.sameSite, secure: cookieOpts.secure });
    res.json({ ok: true });
  })
);

authRouter.get(
  "/auth/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await auth.getMe(req.userId!);
    res.json({ user });
  })
);

// Lets the web app know which social providers are live on this deployment.
authRouter.get("/auth/oauth/status", (_req, res) => {
  res.json({ google: auth.googleConfigured() });
});

const OAUTH_STATE_COOKIE = "cf_oauth_state";

// Step 1: redirect the user to Google's consent screen.
authRouter.get(
  "/auth/oauth/google",
  asyncHandler(async (_req, res) => {
    if (!auth.googleConfigured()) {
      throw new HttpError(501, "Google sign-in isn't configured yet. Add OAUTH_GOOGLE_CLIENT_ID/SECRET.");
    }
    const state = crypto.randomBytes(16).toString("hex");
    res.cookie(OAUTH_STATE_COOKIE, state, {
      httpOnly: true,
      sameSite: cookieOpts.sameSite,
      secure: cookieOpts.secure,
      maxAge: 10 * 60_000,
      path: "/api/auth",
    });
    res.redirect(auth.googleAuthUrl(state));
  })
);

// Step 2: Google redirects back here with a code; finish sign-in and bounce to the web app.
authRouter.get(
  "/auth/oauth/google/callback",
  asyncHandler(async (req, res) => {
    const webApp = env.oauth.webAppUrl;
    const code = typeof req.query.code === "string" ? req.query.code : null;
    const state = typeof req.query.state === "string" ? req.query.state : null;
    const expected = req.cookies?.[OAUTH_STATE_COOKIE];
    res.clearCookie(OAUTH_STATE_COOKIE, { path: "/api/auth" });

    if (!code || !state || !expected || state !== expected) {
      return res.redirect(`${webApp}/login?error=oauth`);
    }
    try {
      const result = await auth.loginWithGoogle(code, ctxOf(req));
      res.cookie(REFRESH_COOKIE, result.refreshToken, cookieOpts);
      // Pass the access token in the URL fragment (not sent to servers/logs).
      return res.redirect(`${webApp}/auth/callback#token=${encodeURIComponent(result.accessToken)}`);
    } catch {
      return res.redirect(`${webApp}/login?error=oauth`);
    }
  })
);

// Other providers are scaffolded but not yet wired.
authRouter.get(
  "/auth/oauth/:provider",
  asyncHandler(async (req, res) => {
    throw new HttpError(501, `${req.params.provider} sign-in isn't available yet. Please use Google or email.`);
  })
);
