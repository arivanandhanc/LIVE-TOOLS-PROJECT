import { Router } from "express";
import { z } from "zod";
import { asyncHandler, HttpError } from "../middleware/error";
import { requireAdmin } from "../middleware/identity";
import * as admin from "../services/admin";
import { db } from "../db/prisma";

export const adminRouter = Router();

// All admin routes require an authenticated ADMIN user.
adminRouter.use("/admin", requireAdmin);

adminRouter.get("/admin/stats", asyncHandler(async (_req, res) => {
  res.json(await admin.getStats());
}));

adminRouter.get("/admin/tools", asyncHandler(async (_req, res) => {
  res.json({ tools: await admin.getToolAnalytics() });
}));

adminRouter.get("/admin/users", asyncHandler(async (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q : "";
  res.json({ users: await admin.listUsers(q) });
}));

const statusSchema = z.object({ status: z.enum(["ACTIVE", "SUSPENDED", "DELETED"]) });

adminRouter.patch("/admin/users/:id", asyncHandler(async (req, res) => {
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, "Invalid status.");
  res.json(await admin.setUserStatus(req.params.id, parsed.data.status));
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

// Audit log feed (admin)
adminRouter.get("/admin/audit", asyncHandler(async (_req, res) => {
  if (!db) throw new HttpError(503, "Audit log requires a database.");
  const logs = await db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  res.json({ logs });
}));
