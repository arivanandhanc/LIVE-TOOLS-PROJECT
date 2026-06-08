import { db } from "../db/prisma";
import { HttpError } from "../middleware/error";

function requireDb() {
  if (!db) throw new HttpError(503, "This feature requires a database. Set DATABASE_URL to enable it.");
  return db;
}

export interface DashboardStats {
  filesProcessed: number;
  thisMonth: number;
  favorites: number;
  storageBytes: number;
}

export interface ActivityItem {
  id: string;
  tool: string;
  success: boolean;
  durationMs: number | null;
  createdAt: string;
}

function startOfMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export async function getStats(userId: string): Promise<DashboardStats> {
  const database = requireDb();
  const [filesProcessed, thisMonth, favorites, storage] = await Promise.all([
    database.toolUsage.count({ where: { userId, success: true } }),
    database.toolUsage.count({ where: { userId, success: true, createdAt: { gte: startOfMonth() } } }),
    database.favorite.count({ where: { userId } }),
    database.file.aggregate({
      where: { userId, expiresAt: { gt: new Date() } },
      _sum: { size: true },
    }),
  ]);
  return {
    filesProcessed,
    thisMonth,
    favorites,
    storageBytes: storage._sum.size ?? 0,
  };
}

export async function getActivity(userId: string, limit = 15): Promise<ActivityItem[]> {
  const database = requireDb();
  const rows = await database.toolUsage.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: Math.min(limit, 50),
  });
  return rows.map((r) => ({
    id: r.id,
    tool: r.tool,
    success: r.success,
    durationMs: r.durationMs,
    createdAt: r.createdAt.toISOString(),
  }));
}

export async function getFavorites(userId: string): Promise<{ toolSlug: string; createdAt: string }[]> {
  const database = requireDb();
  const rows = await database.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({ toolSlug: r.toolSlug, createdAt: r.createdAt.toISOString() }));
}

export async function addFavorite(userId: string, toolSlug: string): Promise<void> {
  const database = requireDb();
  await database.favorite.upsert({
    where: { userId_toolSlug: { userId, toolSlug } },
    update: {},
    create: { userId, toolSlug },
  });
}

export async function removeFavorite(userId: string, toolSlug: string): Promise<void> {
  const database = requireDb();
  await database.favorite.deleteMany({ where: { userId, toolSlug } });
}

/**
 * Records a single tool run. Used by the client-tool usage beacon so
 * browser-side tools (which never hit the processing API) still show up in the
 * user's dashboard history. Best-effort: silently no-ops without a database.
 */
export async function recordUsage(opts: {
  tool: string;
  success?: boolean;
  durationMs?: number | null;
  userId?: string | null;
  guestId?: string | null;
}): Promise<void> {
  if (!db) return;
  const tool = opts.tool.slice(0, 80);
  await db.toolUsage
    .create({
      data: {
        tool,
        success: opts.success ?? true,
        durationMs: opts.durationMs ?? null,
        userId: opts.userId ?? null,
        guestId: opts.guestId ?? null,
      },
    })
    .catch(() => undefined);
}
