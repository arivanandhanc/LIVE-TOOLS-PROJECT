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

    // Access control: files owned by a registered user are scoped to that user —
    // knowing the (unguessable) id is not sufficient. Guest outputs
    // (ownerUserId === null) stay capability-based: anyone holding the id may
    // fetch them until they expire. Return 404 (not 403) so a non-owner cannot
    // confirm the id exists.
    if (meta.ownerUserId && meta.ownerUserId !== req.userId) {
      throw new HttpError(404, "File not found or expired.");
    }

    res.setHeader("Content-Type", meta.mimeType);
    res.setHeader("Content-Disposition", contentDisposition(meta.filename));
    res.setHeader("Content-Length", String(buffer.length));
    res.setHeader("Cache-Control", "private, no-store");
    res.send(buffer);
  })
);

/**
 * Build a safe `Content-Disposition` value. The original filename is
 * user-controlled, so a raw `filename="<name>"` lets a crafted name inject a
 * stray quote and spoof the saved-as filename. We emit an ASCII-sanitized
 * `filename` for legacy clients plus an RFC 5987 `filename*` for full fidelity.
 */
function contentDisposition(name: string): string {
  const fallback = name.replace(/[^\x20-\x7e]/g, "_").replace(/["\\]/g, "_") || "download";
  const encoded = encodeURIComponent(name);
  return `attachment; filename="${fallback}"; filename*=UTF-8''${encoded}`;
}
