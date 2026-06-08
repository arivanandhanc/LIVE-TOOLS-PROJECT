import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { env } from "../config/env";
import { asyncHandler, HttpError } from "../middleware/error";
import { requireAuth } from "../middleware/identity";
import { uploadRateLimiter } from "../middleware/security";
import * as ai from "../services/ai";
import * as me from "../services/me";

export const aiRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.maxUploadBytes, files: 1 },
});

// Public: lets the web app know whether AI tools are live on this deployment.
aiRouter.get("/ai/status", (_req, res) => {
  res.json({ enabled: ai.aiEnabled() });
});

const textSchema = z.object({
  text: z.string().min(1).max(200_000).optional(),
  prompt: z.string().min(1).max(20_000).optional(),
  question: z.string().max(2_000).optional(),
});

// Text-input tools: document-summary, content-generator.
aiRouter.post(
  "/ai/:tool",
  requireAuth,
  uploadRateLimiter,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const tool = req.params.tool;
    const start = Date.now();

    // Parse JSON fields (may arrive as multipart text fields or JSON body).
    const parsed = textSchema.safeParse(req.body ?? {});
    const body = parsed.success ? parsed.data : {};
    const file = req.file;

    let result: string;
    try {
      switch (tool) {
        case "document-summary": {
          if (!body.text) throw new HttpError(400, "Provide text to summarize.");
          result = await ai.documentSummary(body.text);
          break;
        }
        case "content-generator": {
          if (!body.prompt) throw new HttpError(400, "Provide a prompt describing what to generate.");
          result = await ai.generateContent(body.prompt);
          break;
        }
        case "image-analysis": {
          if (!file) throw new HttpError(400, "Upload an image to analyze.");
          result = await ai.analyzeImage(file.buffer.toString("base64"), ai.imageMediaTypeFrom(file.mimetype), body.question);
          break;
        }
        case "ocr-extraction": {
          if (!file) throw new HttpError(400, "Upload an image to extract text from.");
          result = await ai.ocrImage(file.buffer.toString("base64"), ai.imageMediaTypeFrom(file.mimetype));
          break;
        }
        case "pdf-summary": {
          if (!file) throw new HttpError(400, "Upload a PDF to summarize.");
          if (file.mimetype !== "application/pdf") throw new HttpError(415, "Please upload a PDF file.");
          result = await ai.pdfSummary(file.buffer.toString("base64"));
          break;
        }
        default:
          throw new HttpError(404, "Unknown AI tool.");
      }
    } catch (err) {
      await me.recordUsage({ tool, success: false, durationMs: Date.now() - start, userId: req.userId ?? null });
      throw err;
    }

    await me.recordUsage({ tool, success: true, durationMs: Date.now() - start, userId: req.userId ?? null });
    res.json({ result });
  })
);
