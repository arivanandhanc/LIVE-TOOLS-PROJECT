import express from "express";
import pinoHttp from "pino-http";
import { logger } from "./config/logger";
import { applySecurity, apiRateLimiter } from "./middleware/security";
import { identity } from "./middleware/identity";
import { errorHandler, notFound } from "./middleware/error";
import { healthRouter } from "./routes/health";
import { toolsRouter } from "./routes/tools";
import { filesRouter } from "./routes/files";
import { consentRouter } from "./routes/consent";
import { authRouter } from "./routes/auth";
import { adminRouter } from "./routes/admin";

export function createApp() {
  const app = express();

  applySecurity(app);
  app.use(pinoHttp({ logger, autoLogging: { ignore: (req) => req.url === "/health" } }));

  // JSON for API endpoints (multipart handled per-route by multer).
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: false, limit: "1mb" }));
  app.use(identity);

  // Health/readiness (no rate limit)
  app.use("/", healthRouter);

  // API surface
  app.use("/api", apiRateLimiter);
  app.use("/api", authRouter);
  app.use("/api", adminRouter);
  app.use("/api", toolsRouter);
  app.use("/api", filesRouter);
  app.use("/api", consentRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
