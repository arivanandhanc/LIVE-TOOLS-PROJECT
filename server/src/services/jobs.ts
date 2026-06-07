import { getToolDefinition } from "../jobs/registry";
import type { ProcessorFile } from "../jobs/types";
import { storeOutput, type FileMeta } from "./files";
import { db } from "../db/prisma";
import { logger } from "../config/logger";

export interface RunJobResult {
  jobId: string | null;
  output: FileMeta;
  durationMs: number;
}

export class JobError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

export async function runJob(opts: {
  tool: string;
  files: ProcessorFile[];
  params: Record<string, unknown>;
  userId?: string | null;
  guestId?: string | null;
}): Promise<RunJobResult> {
  const def = getToolDefinition(opts.tool);
  if (!def) throw new JobError(`Unknown or unsupported tool: ${opts.tool}`, 404);

  if (opts.files.length < def.minFiles)
    throw new JobError(`This tool needs at least ${def.minFiles} file(s).`);
  if (opts.files.length > def.maxFiles)
    throw new JobError(`This tool accepts at most ${def.maxFiles} file(s).`);

  if (def.accept.length) {
    for (const f of opts.files) {
      if (!def.accept.some((a) => f.mimeType === a || f.mimeType.startsWith(a))) {
        throw new JobError(`Unsupported file type for ${opts.tool}: ${f.mimeType}`);
      }
    }
  }

  const start = Date.now();
  let jobId: string | null = null;

  if (db) {
    try {
      const job = await db.job.create({
        data: {
          tool: opts.tool,
          status: "PROCESSING",
          userId: opts.userId ?? null,
          guestId: opts.guestId ?? null,
          params: opts.params as object,
          startedAt: new Date(),
        },
      });
      jobId = job.id;
    } catch (err) {
      logger.warn({ err }, "Failed to create job record");
    }
  }

  try {
    const result = await def.processor({ files: opts.files, params: opts.params });
    const output = await storeOutput({
      buffer: result.buffer,
      filename: result.filename,
      mimeType: result.mimeType,
      ownerUserId: opts.userId ?? null,
    });
    const durationMs = Date.now() - start;

    await recordUsage(opts.tool, true, durationMs, opts.userId, opts.guestId);
    if (db && jobId) {
      await db.job
        .update({
          where: { id: jobId },
          data: { status: "COMPLETED", finishedAt: new Date(), durationMs, outputs: { connect: { id: output.id } } },
        })
        .catch(() => undefined);
    }
    return { jobId, output, durationMs };
  } catch (err) {
    const durationMs = Date.now() - start;
    await recordUsage(opts.tool, false, durationMs, opts.userId, opts.guestId);
    if (db && jobId) {
      await db.job
        .update({ where: { id: jobId }, data: { status: "FAILED", finishedAt: new Date(), error: String(err) } })
        .catch(() => undefined);
    }
    if (err instanceof JobError) throw err;
    logger.error({ err, tool: opts.tool }, "Processing failed");
    throw new JobError("We couldn't process this file. It may be corrupt or password-protected.", 422);
  }
}

async function recordUsage(
  tool: string,
  success: boolean,
  durationMs: number,
  userId?: string | null,
  guestId?: string | null
) {
  if (!db) return;
  await db.toolUsage
    .create({ data: { tool, success, durationMs, userId: userId ?? null, guestId: guestId ?? null } })
    .catch(() => undefined);
}
