"use client";

import * as React from "react";
import { FileTool } from "@/components/tools/file-tool";
import { Field } from "@/components/tools/panel";
import { Input } from "@/components/ui/input";
import { loadImageFromFile, drawToCanvas, canvasToBlob } from "@/lib/image";
import { formatBytes } from "@/lib/utils";

type Fmt = "jpg" | "png" | "webp";

const MIME: Record<Fmt, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

function displaySize(kb: number): string {
  return kb >= 1024 ? `${(kb / 1024).toLocaleString(undefined, { maximumFractionDigits: 1 })} MB` : `${kb} KB`;
}

/**
 * Compress an image to fit within `targetBytes`, entirely on a canvas in the
 * browser. For lossy formats (JPEG/WebP) we binary-search quality; if the
 * lowest quality still overshoots we progressively downscale. PNG is lossless,
 * so we only downscale. Keeps the largest/highest-quality result that fits.
 */
async function compressToTarget(file: File, targetBytes: number, fmt: Fmt): Promise<Blob> {
  const mime = MIME[fmt];
  const lossy = fmt !== "png";
  const img = await loadImageFromFile(file);
  let smallest: Blob | null = null;
  let scale = 1;

  for (let attempt = 0; attempt < 12; attempt++) {
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));
    const canvas = drawToCanvas(img, w, h, fmt === "jpg" ? "#ffffff" : undefined);

    if (lossy) {
      let lo = 0.05;
      let hi = 0.95;
      let bestAtScale: Blob | null = null;
      for (let i = 0; i < 7; i++) {
        const mid = (lo + hi) / 2;
        const blob = await canvasToBlob(canvas, mime, mid);
        if (!smallest || blob.size < smallest.size) smallest = blob;
        if (blob.size <= targetBytes) {
          bestAtScale = blob;
          lo = mid;
        } else {
          hi = mid;
        }
      }
      if (bestAtScale) return bestAtScale;
    } else {
      const blob = await canvasToBlob(canvas, mime);
      if (!smallest || blob.size < smallest.size) smallest = blob;
      if (blob.size <= targetBytes) return blob;
    }

    scale *= 0.82; // shrink dimensions and try again
  }

  return smallest!;
}

export default function ImageCompressTarget({
  format,
  targetBytes,
}: {
  format: Fmt;
  targetBytes: number;
  targetDisplay?: string;
}) {
  const [kb, setKb] = React.useState(Math.round(targetBytes / 1024));
  const ext = format === "jpg" ? "jpg" : format;
  const targetNow = Math.max(1, kb) * 1024;
  const display = displaySize(Math.max(1, kb));

  return (
    <FileTool
      accept="image/*"
      cta={`Compress to ${display}`}
      hint="Runs entirely in your browser — nothing is uploaded."
      controls={
        <Field
          label="Target size (KB)"
          hint="Pre-filled for this page — change it to compress to any size."
        >
          <Input
            type="number"
            min={1}
            value={kb}
            onChange={(e) => setKb(Math.max(1, Number(e.target.value) || 1))}
            className="w-32"
            aria-label="Target size in KB"
          />
        </Field>
      }
      process={async (files) => {
        const file = files[0];
        const base = file.name.replace(/\.[^.]+$/, "");
        if (file.size <= targetNow && file.type === MIME[format]) {
          return { blob: file, filename: file.name };
        }
        const blob = await compressToTarget(file, targetNow, format);
        if (blob.size > targetNow) {
          throw new Error(
            `This image couldn't be reduced all the way to ${display} while staying usable — the smallest version is ${formatBytes(
              blob.size
            )}. Try a larger target or crop the image first.`
          );
        }
        return { blob, filename: `${base}-${formatBytes(blob.size, 0).replace(/\s+/g, "")}.${ext}` };
      }}
    />
  );
}
