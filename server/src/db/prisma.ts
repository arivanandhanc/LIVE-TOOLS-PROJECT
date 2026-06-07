import { env } from "../config/env";
import { logger } from "../config/logger";
import type { PrismaClient } from "@prisma/client";

/**
 * Optional Prisma client. Returns null when DATABASE_URL is not configured or
 * the generated client is unavailable, so the API still runs in guest-only mode.
 */
let prisma: PrismaClient | null = null;

if (env.databaseUrl) {
  try {
    // Lazy require so the server boots even before `prisma generate` runs.
    const { PrismaClient: Client } = require("@prisma/client") as typeof import("@prisma/client");
    prisma = new Client({ log: env.isProd ? ["error"] : ["warn", "error"] });
    logger.info("Database connected (Prisma)");
  } catch (err) {
    logger.warn({ err }, "DATABASE_URL set but Prisma client unavailable — run `npm run prisma:generate`. Running without persistence.");
    prisma = null;
  }
} else {
  logger.warn("No DATABASE_URL — running in guest-only mode (no persistence).");
}

export const db = prisma;
export const hasDb = () => db !== null;
