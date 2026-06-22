"use client";

import * as React from "react";
import { FileTool } from "@/components/tools/file-tool";
import { renderPdfPages, canvasToBlob, type RenderedPage } from "@/lib/pdf-render";
import { PDFDocument, toPdfBlob } from "@/lib/pdf";
import { formatBytes } from "@/lib/utils";

/** Re-encode already-rendered pages as a JPEG-backed PDF at a given quality. */
async function buildPdf(pages: RenderedPage[], quality: number): Promise<Blob> {
  const out = await PDFDocument.create();
  for (const { canvas } of pages) {
    const blob = await canvasToBlob(canvas, "image/jpeg", quality);
    const img = await out.embedJpg(await blob.arrayBuffer());
    const page = out.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  }
  return toPdfBlob(out);
}

/**
 * Compress a PDF to fit within `targetBytes`, keeping the highest quality that
 * still fits. We try render scales from high to low; at each scale we binary
 * search JPEG quality. The first (highest-resolution) scale that can fit the
 * target wins, so we never throw away more detail than necessary.
 */
async function compressToTarget(file: File, targetBytes: number): Promise<Blob> {
  const scales = [2.0, 1.5, 1.25, 1.0, 0.85, 0.7, 0.55, 0.45];
  let smallest: Blob | null = null;

  for (const scale of scales) {
    const pages = await renderPdfPages(file, scale);

    let lo = 0.3;
    let hi = 0.92;
    let bestAtScale: Blob | null = null;

    for (let i = 0; i < 6; i++) {
      const mid = (lo + hi) / 2;
      const blob = await buildPdf(pages, mid);
      if (!smallest || blob.size < smallest.size) smallest = blob;
      if (blob.size <= targetBytes) {
        bestAtScale = blob; // fits — try to raise quality
        lo = mid;
      } else {
        hi = mid; // too big — lower quality
      }
    }

    // Highest scale that can hit the target gives the best-looking result.
    if (bestAtScale) return bestAtScale;
  }

  // Couldn't reach the target on any setting — return the smallest we produced.
  return smallest!;
}

export default function CompressPdfTarget({
  targetBytes,
  targetDisplay,
}: {
  targetBytes: number;
  targetDisplay: string;
}) {
  return (
    <FileTool
      accept="application/pdf"
      cta={`Compress to ${targetDisplay}`}
      hint={`Automatically reduces your PDF to fit within ${targetDisplay}. Runs entirely in your browser — nothing is uploaded.`}
      process={async (files) => {
        const file = files[0];
        const base = file.name.replace(/\.pdf$/i, "");

        if (file.size <= targetBytes) {
          // Already small enough — don't degrade it needlessly.
          return { blob: file, filename: file.name };
        }

        const blob = await compressToTarget(file, targetBytes);
        const filename = `${base}-${formatBytes(blob.size, 0).replace(/\s+/g, "")}.pdf`;

        if (blob.size > targetBytes) {
          // Best effort still over target — surface the achieved size honestly.
          throw new Error(
            `This PDF couldn't be reduced all the way to ${targetDisplay} while staying readable — the smallest readable version is ${formatBytes(
              blob.size
            )}. Try removing pages or splitting it, then compress again.`
          );
        }

        return { blob, filename };
      }}
    />
  );
}
