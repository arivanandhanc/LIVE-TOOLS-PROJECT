import * as XLSX from "xlsx";
import { db } from "../db/prisma";
import { HttpError } from "../middleware/error";

function requireDb() {
  if (!db) throw new HttpError(503, "Admin features require a database (set DATABASE_URL).");
  return db;
}

export async function getStats() {
  const d = requireDb();
  const since = new Date(Date.now() - 30 * 86400_000);
  const [totalUsers, activeUsers, totalFiles, totalJobs, usageLast30, consentCount] = await Promise.all([
    d.user.count(),
    d.user.count({ where: { status: "ACTIVE" } }),
    d.file.count(),
    d.job.count(),
    d.toolUsage.count({ where: { createdAt: { gte: since } } }),
    d.consentRecord.count(),
  ]);
  return {
    totalUsers,
    activeUsers,
    totalFiles,
    totalJobs,
    usageLast30,
    consentCount,
    revenue: 0, // payments disabled
  };
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
  // Failure counts per tool
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

export async function setUserStatus(id: string, status: "ACTIVE" | "SUSPENDED" | "DELETED") {
  const d = requireDb();
  return d.user.update({ where: { id }, data: { status }, select: { id: true, status: true } });
}

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
