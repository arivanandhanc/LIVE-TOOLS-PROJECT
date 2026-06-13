import { db } from "../db/prisma";
import { logger } from "../config/logger";
import { hashPassword } from "../lib/password";

/**
 * On startup, ensure an ADMIN account exists when ADMIN_EMAIL / ADMIN_PASSWORD
 * are configured. Creates the user if missing, otherwise promotes the existing
 * account to ADMIN (and resets its password to the configured one). Idempotent.
 * No-op when the env vars are absent or there is no database.
 */
export async function bootstrapAdmin(): Promise<void> {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;
  if (!db) {
    logger.warn("ADMIN_EMAIL set but no database — skipping admin bootstrap.");
    return;
  }

  try {
    const passwordHash = await hashPassword(password);
    await db.user.upsert({
      where: { email },
      create: {
        email,
        name: "Admin",
        passwordHash,
        role: "ADMIN",
        status: "ACTIVE",
        emailVerified: new Date(),
      },
      update: {
        passwordHash,
        role: "ADMIN",
        status: "ACTIVE",
      },
    });
    logger.info({ email }, "Admin account ensured (bootstrap).");
  } catch (err) {
    logger.error({ err }, "Admin bootstrap failed.");
  }
}
