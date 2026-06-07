import { Router } from "express";
import { z } from "zod";
import { asyncHandler, HttpError } from "../middleware/error";
import { verifyRecaptcha } from "../middleware/recaptcha";
import { requireAuth } from "../middleware/identity";
import * as auth from "../services/auth";
import { env } from "../config/env";

export const authRouter = Router();

const REFRESH_COOKIE = "cf_refresh";
const cookieOpts = {
  httpOnly: true as const,
  sameSite: "lax" as const,
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
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, "Invalid input", parsed.error.flatten());
    const result = await auth.register(parsed.data, ctxOf(req));
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
    res.cookie(REFRESH_COOKIE, result.refreshToken, cookieOpts);
    res.json({ accessToken: result.accessToken, user: result.user });
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
    res.clearCookie(REFRESH_COOKIE, { path: "/api/auth" });
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

// OAuth scaffolding — providers activate when client id/secret env vars are set.
const providers = ["google", "github", "microsoft"] as const;
authRouter.get(
  "/auth/oauth/:provider",
  asyncHandler(async (req, res) => {
    const provider = req.params.provider;
    if (!providers.includes(provider as (typeof providers)[number])) throw new HttpError(404, "Unknown provider.");
    const clientId = process.env[`OAUTH_${provider.toUpperCase()}_CLIENT_ID`];
    if (!clientId) {
      throw new HttpError(501, `${provider} sign-in isn't configured yet. Add OAUTH_${provider.toUpperCase()}_CLIENT_ID/SECRET.`);
    }
    // When configured, redirect to the provider's authorize endpoint here.
    res.json({ status: "configured", provider, message: "OAuth redirect would happen here." });
  })
);
