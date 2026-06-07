import { nanoid } from "nanoid";
import { storage } from "../storage/storage";
import { db } from "../db/prisma";
import { env } from "../config/env";
import { logger } from "../config/logger";

export interface FileMeta {
  id: string;
  storageKey: string;
  filename: string;
  mimeType: string;
  size: number;
  ownerUserId: string | null;
  expiresAt: number; // epoch ms
}

/**
 * In-memory index of processed files (always present, even without a DB) so
 * downloads work immediately. When a DB is configured we also persist a record
 * for history/auditing. Files themselves live in the storage driver.
 */
const index = new Map<string, FileMeta>();

export async function storeOutput(opts: {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  ownerUserId?: string | null;
}): Promise<FileMeta> {
  const id = nanoid();
  const storageKey = `${id}-${opts.filename}`.replace(/[^a-zA-Z0-9._-]/g, "_");
  await storage.put(storageKey, opts.buffer, opts.mimeType);

  const ttl = opts.ownerUserId ? env.userRetentionMs : env.guestRetentionMs;
  const meta: FileMeta = {
    id,
    storageKey,
    filename: opts.filename,
    mimeType: opts.mimeType,
    size: opts.buffer.length,
    ownerUserId: opts.ownerUserId ?? null,
    expiresAt: Date.now() + ttl,
  };
  index.set(id, meta);

  if (db) {
    try {
      await db.file.create({
        data: {
          id,
          ownerType: opts.ownerUserId ? "USER" : "GUEST",
          userId: opts.ownerUserId ?? null,
          originalName: opts.filename,
          storageKey,
          mimeType: opts.mimeType,
          size: opts.buffer.length,
          scanned: true,
          expiresAt: new Date(meta.expiresAt),
        },
      });
    } catch (err) {
      logger.warn({ err }, "Failed to persist file record");
    }
  }
  return meta;
}

export async function getFile(id: string): Promise<{ meta: FileMeta; buffer: Buffer } | null> {
  const meta = index.get(id);
  if (!meta) return null;
  if (meta.expiresAt < Date.now()) {
    await purge(meta);
    return null;
  }
  try {
    const buffer = await storage.get(meta.storageKey);
    return { meta, buffer };
  } catch {
    return null;
  }
}

async function purge(meta: FileMeta) {
  index.delete(meta.id);
  await storage.delete(meta.storageKey).catch(() => undefined);
  if (db) {
    await db.file.delete({ where: { id: meta.id } }).catch(() => undefined);
  }
}

/** Periodic sweeper enforcing auto-deletion (guest 1h / user 24h). */
export function startRetentionSweeper(intervalMs = 5 * 60 * 1000) {
  const tick = async () => {
    const now = Date.now();
    let removed = 0;
    for (const meta of index.values()) {
      if (meta.expiresAt < now) {
        await purge(meta);
        removed++;
      }
    }
    if (removed) logger.info({ removed }, "Retention sweep: deleted expired files");
  };
  const timer = setInterval(tick, intervalMs);
  timer.unref?.();
  return timer;
}
