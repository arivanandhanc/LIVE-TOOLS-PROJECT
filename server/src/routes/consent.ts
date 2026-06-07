import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../middleware/error";
import { db } from "../db/prisma";
import { logger } from "../config/logger";

export const consentRouter = Router();

const consentSchema = z.object({
  necessary: z.boolean().default(true),
  analytics: z.boolean().default(false),
  marketing: z.boolean().default(false),
  consentVersion: z.string().min(1).max(20),
});

/** Rough browser detection from a user-agent string. */
function detectBrowser(ua: string): string {
  if (/edg/i.test(ua)) return "Edge";
  if (/chrome|crios/i.test(ua)) return "Chrome";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  if (/safari/i.test(ua)) return "Safari";
  return "Other";
}

consentRouter.post(
  "/consent",
  asyncHandler(async (req, res) => {
    const parsed = consentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid consent payload", details: parsed.error.flatten() });
    }
    const ua = req.headers["user-agent"] ?? "";
    const record = {
      userId: req.userId ?? null,
      ip: req.ip ?? null,
      userAgent: ua,
      browser: detectBrowser(ua),
      // CDN (Cloudflare) provides country in this header.
      country: (req.headers["cf-ipcountry"] as string) ?? null,
      ...parsed.data,
    };

    if (db) {
      await db.consentRecord.create({ data: record }).catch((err) => logger.warn({ err }, "consent persist failed"));
    } else {
      logger.info({ record }, "Consent recorded (no DB — logged only)");
    }
    res.status(201).json({ ok: true });
  })
);
