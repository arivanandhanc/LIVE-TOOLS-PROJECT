import { Router } from "express";
import multer from "multer";
import { env } from "../config/env";
import { asyncHandler, HttpError } from "../middleware/error";
import { uploadRateLimiter } from "../middleware/security";
import { runJob, JobError } from "../services/jobs";
import { getToolDefinition, supportedServerTools } from "../jobs/registry";

export const toolsRouter = Router();

const ALLOWED_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.maxUploadBytes, files: env.maxFilesPerRequest },
  fileFilter(_req, file, cb) {
    if (ALLOWED_MIME.has(file.mimetype)) return cb(null, true);
    cb(new HttpError(415, `Unsupported file type: ${file.mimetype}`));
  },
});

toolsRouter.get("/tools", (_req, res) => {
  res.json({ tools: supportedServerTools });
});

toolsRouter.post(
  "/tools/:tool",
  uploadRateLimiter,
  upload.array("files", env.maxFilesPerRequest),
  asyncHandler(async (req, res) => {
    const tool = req.params.tool;
    if (!getToolDefinition(tool)) throw new HttpError(404, "Unknown tool.");

    const uploaded = (req.files as Express.Multer.File[] | undefined) ?? [];
    if (!uploaded.length) throw new HttpError(400, "No files uploaded.");

    // params come as JSON string in a `params` field, or individual fields.
    let params: Record<string, unknown> = {};
    if (typeof req.body?.params === "string") {
      try {
        params = JSON.parse(req.body.params);
      } catch {
        throw new HttpError(400, "Invalid params JSON.");
      }
    } else if (req.body && typeof req.body === "object") {
      params = { ...req.body };
      delete (params as Record<string, unknown>).recaptchaToken;
    }

    try {
      const result = await runJob({
        tool,
        files: uploaded.map((f) => ({ buffer: f.buffer, originalName: f.originalname, mimeType: f.mimetype })),
        params,
        userId: req.userId ?? null,
        guestId: req.guestId ?? null,
      });

      res.json({
        jobId: result.jobId,
        durationMs: result.durationMs,
        file: {
          id: result.output.id,
          filename: result.output.filename,
          size: result.output.size,
          mimeType: result.output.mimeType,
          expiresAt: new Date(result.output.expiresAt).toISOString(),
          downloadUrl: `${env.apiBaseUrl}/api/files/${result.output.id}/download`,
        },
      });
    } catch (err) {
      if (err instanceof JobError) throw new HttpError(err.status, err.message);
      throw err;
    }
  })
);
