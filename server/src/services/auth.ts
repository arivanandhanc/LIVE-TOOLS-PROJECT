import crypto from "crypto";
import { db } from "../db/prisma";
import { env } from "../config/env";
import { hashPassword, verifyPassword } from "../lib/password";
import { signJwt } from "../lib/jwt";
import { HttpError } from "../middleware/error";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: PublicUser;
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
  ctx: { ip?: string | null; userAgent?: string | null }
): Promise<AuthTokens> {
  const database = requireDb();
  const email = input.email.toLowerCase().trim();
  const existing = await database.user.findUnique({ where: { email } });
  if (existing) throw new HttpError(409, "An account with this email already exists.");

  const passwordHash = await hashPassword(input.password);
  const user = await database.user.create({
    data: { email, name: input.name ?? null, passwordHash },
  });
  const tokens = await issueTokens(user, ctx);
  return { ...tokens, user: toPublic(user) };
}

export async function login(
  input: { email: string; password: string },
  ctx: { ip?: string | null; userAgent?: string | null }
): Promise<AuthTokens> {
  const database = requireDb();
  const email = input.email.toLowerCase().trim();
  const user = await database.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) throw new HttpError(401, "Invalid email or password.");
  if (user.status !== "ACTIVE") throw new HttpError(403, "This account is not active.");

  const ok = await verifyPassword(input.password, user.passwordHash);
  if (!ok) throw new HttpError(401, "Invalid email or password.");

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
