import { Router } from "express";
import { hasDb } from "../db/prisma";
import { env } from "../config/env";
import { supportedServerTools } from "../jobs/registry";

export const healthRouter = Router();

healthRouter.get("/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

healthRouter.get("/ready", (_req, res) => {
  res.json({
    status: "ok",
    services: {
      database: hasDb() ? "connected" : "disabled",
      storage: env.storageDriver,
      recaptcha: env.recaptcha.enabled ? "enabled" : "disabled",
    },
    serverTools: supportedServerTools,
    version: process.env.npm_package_version ?? "0.1.0",
  });
});
