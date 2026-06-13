import * as XLSX from "xlsx";
import { db } from "../db/prisma";
import { HttpError } from "../middleware/error";
import { env } from "../config/env";
import { storage } from "../storage/storage";
import { logger } from "../config/logger";

function requireDb() {
  if (!db) throw new HttpError(503, "Admin features require a database (set DATABASE_URL).");
  return db;
}

const DAY = 86400_000;

// ───────────────────────────── overview stats ─────────────────────────────

export async function getStats() {
  const d = requireDb();
  const now = Date.now();
  const since30 = new Date(now - 30 * DAY);
  const since7 = new Date(now - 7 * DAY);
  const since1 = new Date(now - DAY);

  const [
    totalUsers,
    activeUsers,
    suspendedUsers,
    adminUsers,
    newUsers7d,
    totalFiles,
    totalJobs,
    usageLast30,
    usageLast24h,
    consentCount,
    analyticsOptIn,
    marketingOptIn,
    storageAgg,
    jobsByStatus,
  ] = await Promise.all([
    d.user.count(),
    d.user.count({ where: { status: "ACTIVE" } }),
    d.user.count({ where: { status: "SUSPENDED" } }),
    d.user.count({ where: { role: "ADMIN" } }),
    d.user.count({ where: { createdAt: { gte: since7 } } }),
    d.file.count(),
    d.job.count(),
    d.toolUsage.count({ where: { createdAt: { gte: since30 } } }),
    d.toolUsage.count({ where: { createdAt: { gte: since1 } } }),
    d.consentRecord.count(),
    d.consentRecord.count({ where: { analytics: true } }),
    d.consentRecord.count({ where: { marketing: true } }),
    d.file.aggregate({ _sum: { size: true } }),
    d.job.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const jobStatus: Record<string, number> = { QUEUED: 0, PROCESSING: 0, COMPLETED: 0, FAILED: 0 };
  for (const j of jobsByStatus) jobStatus[j.status] = j._count._all;

  return {
    totalUsers,
    activeUsers,
    suspendedUsers,
    adminUsers,
    newUsers7d,
    totalFiles,
    totalJobs,
    usageLast30,
    usageLast24h,
    consentCount,
    analyticsOptIn,
    marketingOptIn,
    storageBytes: storageAgg._sum.size ?? 0,
    jobStatus,
    revenue: 0, // payments disabled
  };
}

/** Daily tool-usage counts for the last N days (for the trend chart). */
export async function getUsageSeries(days = 30) {
  const d = requireDb();
  const since = new Date(Date.now() - days * DAY);
  const rows = await d.toolUsage.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true, success: true },
  });
  const buckets = new Map<string, { uses: number; failures: number }>();
  for (let i = days - 1; i >= 0; i--) {
    const key = new Date(Date.now() - i * DAY).toISOString().slice(0, 10);
    buckets.set(key, { uses: 0, failures: 0 });
  }
  for (const r of rows) {
    const key = r.createdAt.toISOString().slice(0, 10);
    const b = buckets.get(key);
    if (b) {
      b.uses++;
      if (!r.success) b.failures++;
    }
  }
  return Array.from(buckets, ([date, v]) => ({ date, ...v }));
}

/** Consent records grouped by country (region distribution). */
export async function getUsageByRegion() {
  const d = requireDb();
  const grouped = await d.consentRecord.groupBy({
    by: ["country"],
    _count: { _all: true },
    orderBy: { _count: { country: "desc" } },
    take: 50,
  });
  return grouped.map((g) => ({ country: g.country ?? "Unknown", count: g._count._all }));
}

export async function getToolAnalytics() {
  const d = requireDb();
  const grouped = await d.toolUsage.groupBy({
    by: ["tool"],
    _count: { _all: true },
    _avg: { durationMs: true },
    orderBy: { _count: { tool: "desc" } },
    take: 50,
  });
  const failures = await d.toolUsage.groupBy({
    by: ["tool"],
    where: { success: false },
    _count: { _all: true },
  });
  const failMap = new Map(failures.map((f) => [f.tool, f._count._all]));
  return grouped.map((g) => ({
    tool: g.tool,
    uses: g._count._all,
    failures: failMap.get(g.tool) ?? 0,
    avgDurationMs: Math.round(g._avg.durationMs ?? 0),
  }));
}

// ───────────────────────────── users ─────────────────────────────

export async function listUsers(query: string, take = 50) {
  const d = requireDb();
  return d.user.findMany({
    where: query
      ? { OR: [{ email: { contains: query, mode: "insensitive" } }, { name: { contains: query, mode: "insensitive" } }] }
      : undefined,
    select: { id: true, email: true, name: true, role: true, status: true, planTier: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take,
  });
}

/** Full profile for one user, with related counts and recent activity. */
export async function getUserDetail(id: string) {
  const d = requireDb();
  const user = await d.user.findUnique({
    where: { id },
    select: {
      id: true, email: true, name: true, role: true, status: true, planTier: true,
      mfaEnabled: true, emailVerified: true, createdAt: true, updatedAt: true,
    },
  });
  if (!user) throw new HttpError(404, "User not found.");
  const [fileCount, jobCount, usageCount, recentJobs, sessions] = await Promise.all([
    d.file.count({ where: { userId: id } }),
    d.job.count({ where: { userId: id } }),
    d.toolUsage.count({ where: { userId: id } }),
    d.job.findMany({
      where: { userId: id },
      select: { id: true, tool: true, status: true, durationMs: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    d.session.count({ where: { userId: id } }),
  ]);
  return { user, fileCount, jobCount, usageCount, recentJobs, activeSessions: sessions };
}

export async function setUserStatus(id: string, status: "ACTIVE" | "SUSPENDED" | "DELETED") {
  const d = requireDb();
  return d.user.update({ where: { id }, data: { status }, select: { id: true, status: true } });
}

export async function setUserRole(id: string, role: "USER" | "ADMIN") {
  const d = requireDb();
  return d.user.update({ where: { id }, data: { role }, select: { id: true, role: true } });
}

export async function setUserPlan(id: string, planTier: "FREE" | "PRO" | "BUSINESS" | "ENTERPRISE") {
  const d = requireDb();
  return d.user.update({ where: { id }, data: { planTier }, select: { id: true, planTier: true } });
}

/** Hard-delete a user and cascade-related rows (sessions/accounts/etc). */
export async function deleteUser(id: string) {
  const d = requireDb();
  await d.user.delete({ where: { id } });
  return { id, deleted: true };
}

// ───────────────────────────── files & jobs ─────────────────────────────

export async function listFiles(page = 0, take = 50) {
  const d = requireDb();
  const [items, total] = await Promise.all([
    d.file.findMany({
      select: { id: true, originalName: true, mimeType: true, size: true, ownerType: true, userId: true, createdAt: true, expiresAt: true },
      orderBy: { createdAt: "desc" },
      skip: page * take,
      take,
    }),
    d.file.count(),
  ]);
  return { items, total, page, take };
}

export async function deleteFile(id: string) {
  const d = requireDb();
  const file = await d.file.findUnique({ where: { id }, select: { storageKey: true } });
  if (!file) throw new HttpError(404, "File not found.");
  await storage.delete(file.storageKey).catch(() => undefined);
  await d.file.delete({ where: { id } });
  return { id, deleted: true };
}

export async function listJobs(status: string | undefined, page = 0, take = 50) {
  const d = requireDb();
  const where = status && ["QUEUED", "PROCESSING", "COMPLETED", "FAILED"].includes(status)
    ? { status: status as "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED" }
    : undefined;
  const [items, total] = await Promise.all([
    d.job.findMany({
      where,
      select: { id: true, tool: true, status: true, userId: true, guestId: true, error: true, durationMs: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      skip: page * take,
      take,
    }),
    d.job.count({ where }),
  ]);
  return { items, total, page, take };
}

// ───────────────────────────── consents ─────────────────────────────

export async function listConsents(opts: { country?: string; page?: number; take?: number } = {}) {
  const d = requireDb();
  const page = opts.page ?? 0;
  const take = opts.take ?? 50;
  const where = opts.country ? { country: opts.country } : undefined;
  const [items, total] = await Promise.all([
    d.consentRecord.findMany({ where, orderBy: { createdAt: "desc" }, skip: page * take, take }),
    d.consentRecord.count({ where }),
  ]);
  return { items, total, page, take };
}

// ───────────────────────────── audit log ─────────────────────────────

export async function recordAudit(action: string, actorId: string | null, targetId: string | null, ctx: { ip?: string | null; userAgent?: string | null; metadata?: unknown } = {}) {
  if (!db) return;
  await db.auditLog
    .create({
      data: {
        action,
        actorId,
        targetId,
        ip: ctx.ip ?? null,
        userAgent: ctx.userAgent ?? null,
        metadata: (ctx.metadata ?? undefined) as object | undefined,
      },
    })
    .catch((err) => logger.warn({ err }, "audit write failed"));
}

export async function getAuditLog(page = 0, take = 50) {
  const d = requireDb();
  const [items, total] = await Promise.all([
    d.auditLog.findMany({
      select: { id: true, action: true, actorId: true, targetId: true, ip: true, metadata: true, createdAt: true, actor: { select: { email: true } } },
      orderBy: { createdAt: "desc" },
      skip: page * take,
      take,
    }),
    d.auditLog.count(),
  ]);
  return {
    items: items.map((i) => ({ ...i, actorEmail: i.actor?.email ?? null, actor: undefined })),
    total,
    page,
    take,
  };
}

// ───────────────────────────── service flags ─────────────────────────────

/** Known toggleable services, with their default (enabled) state. */
export const SERVICE_FLAGS = [
  { key: "registration_enabled", label: "New user registration", default: true },
  { key: "ai_tools_enabled", label: "AI tools", default: true },
  { key: "uploads_enabled", label: "File uploads", default: true },
  { key: "maintenance_mode", label: "Maintenance mode (read-only)", default: false },
] as const;

type FlagKey = (typeof SERVICE_FLAGS)[number]["key"];

export async function getServiceFlags() {
  const d = requireDb();
  const stored = await d.setting.findMany({ where: { key: { in: SERVICE_FLAGS.map((f) => f.key) } } });
  const map = new Map(stored.map((s) => [s.key, s.value]));
  return SERVICE_FLAGS.map((f) => ({
    key: f.key,
    label: f.label,
    enabled: map.has(f.key) ? Boolean(map.get(f.key)) : f.default,
  }));
}

export async function setServiceFlag(key: string, enabled: boolean) {
  const d = requireDb();
  if (!SERVICE_FLAGS.some((f) => f.key === key)) throw new HttpError(400, "Unknown service flag.");
  await d.setting.upsert({
    where: { key },
    create: { key, value: enabled },
    update: { value: enabled },
  });
  return { key, enabled };
}

/** Runtime check used by other routes to honour an admin toggle. */
export async function isServiceEnabled(key: FlagKey): Promise<boolean> {
  if (!db) return true;
  const row = await db.setting.findUnique({ where: { key } }).catch(() => null);
  if (!row) return SERVICE_FLAGS.find((f) => f.key === key)?.default ?? true;
  return Boolean(row.value);
}

// ───────────────────────────── system health ─────────────────────────────

export async function getSystemHealth() {
  const checks: Record<string, { ok: boolean; detail: string }> = {};

  // Database
  if (db) {
    try {
      await db.$queryRaw`SELECT 1`;
      checks.database = { ok: true, detail: "Connected (PostgreSQL)" };
    } catch (err) {
      checks.database = { ok: false, detail: err instanceof Error ? err.message : "Query failed" };
    }
  } else {
    checks.database = { ok: false, detail: "DATABASE_URL not set (guest-only mode)" };
  }

  checks.redis = env.redisUrl
    ? { ok: true, detail: "Configured" }
    : { ok: false, detail: "Not configured (in-memory rate limits)" };

  checks.storage = {
    ok: true,
    detail: env.storageDriver === "s3" ? `S3 (${env.s3.bucket ?? "no bucket"})` : "Local disk",
  };

  const aiProviders = [
    env.ai.groqKey && "Groq",
    env.ai.hfKey && "HuggingFace",
    env.ai.anthropicKey && "Anthropic",
  ].filter(Boolean) as string[];
  checks.ai = aiProviders.length
    ? { ok: true, detail: aiProviders.join(", ") }
    : { ok: false, detail: "No AI provider configured" };

  checks.email = env.smtp.host
    ? { ok: true, detail: `SMTP via ${env.smtp.host}` }
    : { ok: false, detail: "Not configured (OTP logged only)" };

  checks.recaptcha = env.recaptcha.enabled
    ? { ok: true, detail: `Enabled (min score ${env.recaptcha.minScore})` }
    : { ok: false, detail: "Disabled" };

  return {
    checks,
    uptimeSeconds: Math.round(process.uptime()),
    memoryMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
    nodeEnv: env.nodeEnv,
    timestamp: new Date().toISOString(),
  };
}

// ───────────────────────────── consent export ─────────────────────────────

function csvEscape(value: unknown): string {
  const s = value == null ? "" : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function exportConsentCsv(): Promise<string> {
  const d = requireDb();
  const records = await d.consentRecord.findMany({ orderBy: { createdAt: "desc" }, take: 10000 });
  const header = ["id", "createdAt", "ip", "country", "browser", "necessary", "analytics", "marketing", "consentVersion", "userId"];
  const rows = records.map((r) =>
    [r.id, r.createdAt.toISOString(), r.ip, r.country, r.browser, r.necessary, r.analytics, r.marketing, r.consentVersion, r.userId]
      .map(csvEscape)
      .join(",")
  );
  return [header.join(","), ...rows].join("\n");
}

/** Native Excel (.xlsx) export of consent records. */
export async function exportConsentXlsx(): Promise<Buffer> {
  const d = requireDb();
  const records = await d.consentRecord.findMany({ orderBy: { createdAt: "desc" }, take: 10000 });
  const data = records.map((r) => ({
    "Record ID": r.id,
    "Date (UTC)": r.createdAt.toISOString(),
    "IP": r.ip,
    "Country": r.country,
    "Browser": r.browser,
    "Necessary": r.necessary,
    "Analytics": r.analytics,
    "Marketing": r.marketing,
    "Consent version": r.consentVersion,
    "User ID": r.userId,
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Consents");
  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
}
