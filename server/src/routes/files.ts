import { Router } from "express";
import { asyncHandler, HttpError } from "../middleware/error";
import { getFile } from "../services/files";

export const filesRouter = Router();

filesRouter.get(
  "/files/:id/download",
  asyncHandler(async (req, res) => {
    const result = await getFile(req.params.id);
    if (!result) throw new HttpError(404, "File not found or expired.");

    const { meta, buffer } = result;
    res.setHeader("Content-Type", meta.mimeType);
    res.setHeader("Content-Disposition", `attachment; filename="${meta.filename}"`);
    res.setHeader("Content-Length", String(buffer.length));
    res.setHeader("Cache-Control", "private, no-store");
    res.send(buffer);
  })
);
