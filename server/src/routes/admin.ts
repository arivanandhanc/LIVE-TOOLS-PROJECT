import { Router } from "express";
import { z } from "zod";
import type { Request } from "express";
import { asyncHandler, HttpError } from "../middleware/error";
import { requireAdmin } from "../middleware/identity";
import * as admin from "../services/admin";
import { clientIp } from "../lib/client-ip";

export const adminRouter = Router();

// All admin routes require an authenticated ADMIN user.
adminRouter.use("/admin", requireAdmin);

function auditCtx(req: Request, metadata?: unknown) {
  return { ip: clientIp(req), userAgent: req.headers["user-agent"] ?? null, metadata };
}

// ───────────────────────────── overview ─────────────────────────────

adminRouter.get("/admin/stats", asyncHandler(async (_req, res) => {
  res.json(await admin.getStats());
}));

adminRouter.get("/admin/usage/series", asyncHandler(async (req, res) => {
  const days = Math.min(90, Math.max(7, Number(req.query.days) || 30));
  res.json({ series: await admin.getUsageSeries(days) });
}));

adminRouter.get("/admin/usage/regions", asyncHandler(async (_req, res) => {
  res.json({ regions: await admin.getUsageByRegion() });
}));

adminRouter.get("/admin/tools", asyncHandler(async (_req, res) => {
  res.json({ tools: await admin.getToolAnalytics() });
}));

// ───────────────────────────── users ─────────────────────────────

adminRouter.get("/admin/users", asyncHandler(async (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q : "";
  res.json({ users: await admin.listUsers(q) });
}));

adminRouter.get("/admin/users/:id", asyncHandler(async (req, res) => {
  res.json(await admin.getUserDetail(req.params.id));
}));

const patchUserSchema = z.object({
  status: z.enum(["ACTIVE", "SUSPENDED", "DELETED"]).optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
  planTier: z.enum(["FREE", "PRO", "BUSINESS", "ENTERPRISE"]).optional(),
});

adminRouter.patch("/admin/users/:id", asyncHandler(async (req, res) => {
  const parsed = patchUserSchema.safeParse(req.body);
  if (!parsed.success || Object.keys(parsed.data).length === 0) {
    throw new HttpError(400, "Provide status, role and/or planTier.");
  }
  const { id } = req.params;
  // Guard: an admin cannot strip their own admin role or suspend themselves.
  if (id === req.userId && (parsed.data.role === "USER" || parsed.data.status === "SUSPENDED")) {
    throw new HttpError(400, "You cannot demote or suspend your own account.");
  }
  const result: Record<string, unknown> = {};
  if (parsed.data.status) Object.assign(result, await admin.setUserStatus(id, parsed.data.status));
  if (parsed.data.role) Object.assign(result, await admin.setUserRole(id, parsed.data.role));
  if (parsed.data.planTier) Object.assign(result, await admin.setUserPlan(id, parsed.data.planTier));
  await admin.recordAudit("user.update", req.userId ?? null, id, auditCtx(req, parsed.data));
  res.json(result);
}));

adminRouter.delete("/admin/users/:id", asyncHandler(async (req, res) => {
  if (req.params.id === req.userId) throw new HttpError(400, "You cannot delete your own account.");
  const result = await admin.deleteUser(req.params.id);
  await admin.recordAudit("user.delete", req.userId ?? null, req.params.id, auditCtx(req));
  res.json(result);
}));

// ───────────────────────────── files & jobs ─────────────────────────────

adminRouter.get("/admin/files", asyncHandler(async (req, res) => {
  const page = Math.max(0, Number(req.query.page) || 0);
  res.json(await admin.listFiles(page));
}));

adminRouter.delete("/admin/files/:id", asyncHandler(async (req, res) => {
  const result = await admin.deleteFile(req.params.id);
  await admin.recordAudit("file.delete", req.userId ?? null, req.params.id, auditCtx(req));
  res.json(result);
}));

adminRouter.get("/admin/jobs", asyncHandler(async (req, res) => {
  const page = Math.max(0, Number(req.query.page) || 0);
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  res.json(await admin.listJobs(status, page));
}));

// ───────────────────────────── consents ─────────────────────────────

adminRouter.get("/admin/consent", asyncHandler(async (req, res) => {
  const page = Math.max(0, Number(req.query.page) || 0);
  const country = typeof req.query.country === "string" ? req.query.country : undefined;
  res.json(await admin.listConsents({ page, country }));
}));

adminRouter.get("/admin/consent/export", asyncHandler(async (req, res) => {
  // Default to native Excel (.xlsx); pass ?format=csv for plain CSV.
  if (req.query.format === "csv") {
    const csv = await admin.exportConsentCsv();
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="consent-records.csv"`);
    res.send(csv);
    return;
  }
  const xlsx = await admin.exportConsentXlsx();
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", `attachment; filename="consent-records.xlsx"`);
  res.send(xlsx);
}));

// ───────────────────────────── audit / services / health ─────────────────────────────

adminRouter.get("/admin/audit", asyncHandler(async (req, res) => {
  const page = Math.max(0, Number(req.query.page) || 0);
  res.json(await admin.getAuditLog(page));
}));

adminRouter.get("/admin/services", asyncHandler(async (_req, res) => {
  res.json({ flags: await admin.getServiceFlags() });
}));

const flagSchema = z.object({ enabled: z.boolean() });

adminRouter.put("/admin/services/:key", asyncHandler(async (req, res) => {
  const parsed = flagSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, "Provide { enabled: boolean }.");
  const result = await admin.setServiceFlag(req.params.key, parsed.data.enabled);
  await admin.recordAudit("service.toggle", req.userId ?? null, req.params.key, auditCtx(req, parsed.data));
  res.json(result);
}));

adminRouter.get("/admin/health", asyncHandler(async (_req, res) => {
  res.json(await admin.getSystemHealth());
}));

// TEMP diagnostic: reveals which proxy header carries the real client IP.
adminRouter.get("/admin/whoami", asyncHandler(async (req, res) => {
  const h = req.headers;
  res.json({
    reqIp: req.ip,
    reqIps: req.ips,
    resolvedClientIp: clientIp(req),
    headers: {
      "cf-connecting-ip": h["cf-connecting-ip"] ?? null,
      "true-client-ip": h["true-client-ip"] ?? null,
      "x-real-ip": h["x-real-ip"] ?? null,
      "x-forwarded-for": h["x-forwarded-for"] ?? null,
      "x-vercel-forwarded-for": h["x-vercel-forwarded-for"] ?? null,
      "x-vercel-ip-country": h["x-vercel-ip-country"] ?? null,
      "cf-ipcountry": h["cf-ipcountry"] ?? null,
    },
  });
}));
