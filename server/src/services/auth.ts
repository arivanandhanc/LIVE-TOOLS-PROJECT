import crypto from "crypto";
import { db } from "../db/prisma";
import { env } from "../config/env";
import { hashPassword, verifyPassword } from "../lib/password";
import { signJwt } from "../lib/jwt";
import { HttpError } from "../middleware/error";
import { sendOtpEmail } from "./email";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: PublicUser;
}

export interface VerificationRequired {
  verificationRequired: true;
  email: string;
}

export type AuthResult = AuthTokens | VerificationRequired;

export function isVerificationRequired(r: AuthResult): r is VerificationRequired {
  return (r as VerificationRequired).verificationRequired === true;
}

const OTP_TTL_MS = 10 * 60_000;
const OTP_MAX_ATTEMPTS = 5;

function hashOtp(code: string): string {
  return crypto.createHash("sha256").update(code).digest("hex");
}

/** Generate, store and email a fresh 6-digit verification code. */
export async function requestOtp(email: string, purpose = "verify"): Promise<void> {
  const database = requireDb();
  const normalized = email.toLowerCase().trim();
  const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
  await database.emailOtp.deleteMany({ where: { email: normalized, purpose } });
  await database.emailOtp.create({
    data: { email: normalized, purpose, codeHash: hashOtp(code), expiresAt: new Date(Date.now() + OTP_TTL_MS) },
  });
  await sendOtpEmail(normalized, code);
}

/** Verify a code; on success mark the email verified and issue tokens. */
export async function verifyOtp(
  email: string,
  code: string,
  ctx: { ip?: string | null; userAgent?: string | null }
): Promise<AuthTokens> {
  const database = requireDb();
  const normalized = email.toLowerCase().trim();
  const otp = await database.emailOtp.findFirst({
    where: { email: normalized, purpose: "verify" },
    orderBy: { createdAt: "desc" },
  });
  if (!otp) throw new HttpError(400, "No verification in progress. Please request a new code.");
  if (otp.expiresAt < new Date()) {
    await database.emailOtp.delete({ where: { id: otp.id } }).catch(() => undefined);
    throw new HttpError(400, "This code has expired. Please request a new one.");
  }
  if (otp.attempts >= OTP_MAX_ATTEMPTS) {
    await database.emailOtp.delete({ where: { id: otp.id } }).catch(() => undefined);
    throw new HttpError(429, "Too many attempts. Please request a new code.");
  }
  if (otp.codeHash !== hashOtp(code.trim())) {
    await database.emailOtp.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
    throw new HttpError(400, "Incorrect code. Please try again.");
  }

  const user = await database.user.findUnique({ where: { email: normalized } });
  if (!user) throw new HttpError(404, "Account not found.");
  await database.emailOtp.deleteMany({ where: { email: normalized } });
  const updated = user.emailVerified
    ? user
    : await database.user.update({ where: { id: user.id }, data: { emailVerified: new Date() } });

  const tokens = await issueTokens(updated, ctx);
  return { ...tokens, user: toPublic(updated) };
}

export interface PublicUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  planTier: string;
  mfaEnabled: boolean;
}

function requireDb() {
  if (!db) throw new HttpError(503, "Accounts require a database. Set DATABASE_URL to enable sign-in.");
  return db;
}

function toPublic(u: {
  id: string; email: string; name: string | null; role: string; planTier: string; mfaEnabled: boolean;
}): PublicUser {
  return { id: u.id, email: u.email, name: u.name, role: u.role, planTier: u.planTier, mfaEnabled: u.mfaEnabled };
}

async function issueTokens(
  user: { id: string; role: string },
  ctx: { ip?: string | null; userAgent?: string | null }
): Promise<{ accessToken: string; refreshToken: string }> {
  const database = requireDb();
  const accessToken = signJwt({ sub: user.id, role: user.role });
  const refreshToken = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + env.jwtRefreshTtlDays * 86400_000);
  await database.session.create({
    data: { userId: user.id, refreshToken, ip: ctx.ip ?? null, userAgent: ctx.userAgent ?? null, expiresAt },
  });
  return { accessToken, refreshToken };
}

export async function register(
  input: { email: string; password: string; name?: string },
  _ctx: { ip?: string | null; userAgent?: string | null }
): Promise<AuthResult> {
  const database = requireDb();
  const email = input.email.toLowerCase().trim();
  const existing = await database.user.findUnique({ where: { email } });
  if (existing) throw new HttpError(409, "An account with this email already exists.");

  const passwordHash = await hashPassword(input.password);
  await database.user.create({
    data: { email, name: input.name ?? null, passwordHash },
  });
  // Require email verification before issuing tokens.
  await requestOtp(email);
  return { verificationRequired: true, email };
}

export async function login(
  input: { email: string; password: string },
  ctx: { ip?: string | null; userAgent?: string | null }
): Promise<AuthResult> {
  const database = requireDb();
  const email = input.email.toLowerCase().trim();
  const user = await database.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) throw new HttpError(401, "Invalid email or password.");
  if (user.status !== "ACTIVE") throw new HttpError(403, "This account is not active.");

  const ok = await verifyPassword(input.password, user.passwordHash);
  if (!ok) throw new HttpError(401, "Invalid email or password.");

  // Unverified accounts must confirm an emailed code before signing in.
  if (!user.emailVerified) {
    await requestOtp(email);
    return { verificationRequired: true, email };
  }

  const tokens = await issueTokens(user, ctx);
  return { ...tokens, user: toPublic(user) };
}

export async function refresh(
  refreshToken: string,
  ctx: { ip?: string | null; userAgent?: string | null }
): Promise<AuthTokens> {
  const database = requireDb();
  const session = await database.session.findUnique({ where: { refreshToken }, include: { user: true } });
  if (!session || session.expiresAt < new Date()) throw new HttpError(401, "Session expired. Please sign in again.");

  // Rotate refresh token.
  await database.session.delete({ where: { id: session.id } });
  const tokens = await issueTokens(session.user, ctx);
  return { ...tokens, user: toPublic(session.user) };
}

export async function logout(refreshToken: string): Promise<void> {
  if (!db || !refreshToken) return;
  await db.session.deleteMany({ where: { refreshToken } });
}

export async function getMe(userId: string): Promise<PublicUser> {
  const database = requireDb();
  const user = await database.user.findUnique({ where: { id: userId } });
  if (!user) throw new HttpError(404, "User not found.");
  return toPublic(user);
}

// ─────────────────────────── Google OAuth ───────────────────────────

function googleRedirectUri(): string {
  return `${env.apiBaseUrl}/api/auth/oauth/google/callback`;
}

export function googleConfigured(): boolean {
  return Boolean(env.oauth.google.clientId && env.oauth.google.clientSecret);
}

/** Build the Google consent-screen URL. */
export function googleAuthUrl(state: string): string {
  if (!env.oauth.google.clientId) throw new HttpError(501, "Google sign-in isn't configured.");
  const params = new URLSearchParams({
    client_id: env.oauth.google.clientId,
    redirect_uri: googleRedirectUri(),
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

interface GoogleProfile {
  sub: string;
  email: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

/** Exchange the auth code, fetch the profile, upsert the user, and issue our tokens. */
export async function loginWithGoogle(
  code: string,
  ctx: { ip?: string | null; userAgent?: string | null }
): Promise<AuthTokens> {
  const database = requireDb();
  if (!env.oauth.google.clientId || !env.oauth.google.clientSecret) {
    throw new HttpError(501, "Google sign-in isn't configured.");
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.oauth.google.clientId,
      client_secret: env.oauth.google.clientSecret,
      redirect_uri: googleRedirectUri(),
      grant_type: "authorization_code",
    }),
  });
  if (!tokenRes.ok) throw new HttpError(401, "Google sign-in failed (token exchange).");
  const tokenJson = (await tokenRes.json()) as { access_token?: string };
  if (!tokenJson.access_token) throw new HttpError(401, "Google sign-in failed (no access token).");

  const profileRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${tokenJson.access_token}` },
  });
  if (!profileRes.ok) throw new HttpError(401, "Google sign-in failed (profile fetch).");
  const profile = (await profileRes.json()) as GoogleProfile;
  if (!profile.email) throw new HttpError(401, "Google account has no email.");

  const email = profile.email.toLowerCase().trim();
  let user = await database.user.findUnique({ where: { email } });
  if (!user) {
    user = await database.user.create({
      data: {
        email,
        name: profile.name ?? null,
        image: profile.picture ?? null,
        emailVerified: profile.email_verified ? new Date() : null,
      },
    });
  } else if (!user.emailVerified && profile.email_verified) {
    user = await database.user.update({ where: { id: user.id }, data: { emailVerified: new Date() } });
  }
  if (user.status !== "ACTIVE") throw new HttpError(403, "This account is not active.");

  // Link the OAuth account (idempotent).
  await database.account
    .upsert({
      where: { provider_providerAccountId: { provider: "google", providerAccountId: profile.sub } },
      update: { accessToken: tokenJson.access_token, userId: user.id },
      create: { provider: "google", providerAccountId: profile.sub, userId: user.id, accessToken: tokenJson.access_token },
    })
    .catch(() => undefined);

  const tokens = await issueTokens(user, ctx);
  return { ...tokens, user: toPublic(user) };
}
