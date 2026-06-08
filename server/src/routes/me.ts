import { Router } from "express";
import { z } from "zod";
import { asyncHandler, HttpError } from "../middleware/error";
import { requireAuth } from "../middleware/identity";
import * as me from "../services/me";

export const meRouter = Router();

meRouter.get(
  "/me/stats",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json(await me.getStats(req.userId!));
  })
);

meRouter.get(
  "/me/activity",
  requireAuth,
  asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit) || 15;
    res.json({ activity: await me.getActivity(req.userId!, limit) });
  })
);

meRouter.get(
  "/me/favorites",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({ favorites: await me.getFavorites(req.userId!) });
  })
);

const favoriteSchema = z.object({ toolSlug: z.string().min(1).max(80) });

meRouter.post(
  "/me/favorites",
  requireAuth,
  asyncHandler(async (req, res) => {
    const parsed = favoriteSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, "Invalid tool.");
    await me.addFavorite(req.userId!, parsed.data.toolSlug);
    res.status(201).json({ ok: true });
  })
);

meRouter.delete(
  "/me/favorites/:slug",
  requireAuth,
  asyncHandler(async (req, res) => {
    await me.removeFavorite(req.userId!, req.params.slug);
    res.json({ ok: true });
  })
);

// Best-effort country detection from CDN/proxy headers (Cloudflare, Vercel,
// Render/Fastly). Used by the pricing page to pick the right currency. Falls
// back to null so the client can use its own (timezone) heuristic.
meRouter.get("/geo", (req, res) => {
  const country = (
    (req.headers["cf-ipcountry"] as string) ||
    (req.headers["x-vercel-ip-country"] as string) ||
    (req.headers["x-country-code"] as string) ||
    ""
  )
    .toUpperCase()
    .slice(0, 2) || null;
  res.json({ country, currency: country === "IN" ? "INR" : "USD" });
});

// Lightweight usage beacon for browser-side tools. Optional auth: records the
// run against the user when signed in, otherwise against the guest id.
const usageSchema = z.object({
  tool: z.string().min(1).max(80),
  success: z.boolean().optional(),
  durationMs: z.number().int().nonnegative().max(3_600_000).optional(),
});

meRouter.post(
  "/usage",
  asyncHandler(async (req, res) => {
    const parsed = usageSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, "Invalid usage payload.");
    await me.recordUsage({
      tool: parsed.data.tool,
      success: parsed.data.success,
      durationMs: parsed.data.durationMs ?? null,
      userId: req.userId ?? null,
      guestId: req.guestId ?? null,
    });
    res.status(202).json({ ok: true });
  })
);
