"use client";

import * as React from "react";
import { FileTool } from "@/components/tools/file-tool";
import { Field } from "@/components/tools/panel";
import { Input } from "@/components/ui/input";
import { renderPdfPages, canvasToBlob, type RenderedPage } from "@/lib/pdf-render";
import { PDFDocument, toPdfBlob } from "@/lib/pdf";
import { formatBytes } from "@/lib/utils";

function displaySize(kb: number): string {
  return kb >= 1024 ? `${(kb / 1024).toLocaleString(undefined, { maximumFractionDigits: 1 })} MB` : `${kb} KB`;
}

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
 * search JPEG quality. The first (highest-resolution) scale that fits wins.
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
        bestAtScale = blob;
        lo = mid;
      } else {
        hi = mid;
      }
    }
    if (bestAtScale) return bestAtScale;
  }

  return smallest!;
}

export default function CompressPdfTarget({
  targetBytes,
}: {
  targetBytes: number;
  targetDisplay?: string;
}) {
  const [kb, setKb] = React.useState(Math.round(targetBytes / 1024));
  const targetNow = Math.max(1, kb) * 1024;
  const display = displaySize(Math.max(1, kb));

  return (
    <FileTool
      accept="application/pdf"
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
        const base = file.name.replace(/\.pdf$/i, "");

        if (file.size <= targetNow) {
          return { blob: file, filename: file.name };
        }

        const blob = await compressToTarget(file, targetNow);
        const filename = `${base}-${formatBytes(blob.size, 0).replace(/\s+/g, "")}.pdf`;

        if (blob.size > targetNow) {
          throw new Error(
            `This PDF couldn't be reduced all the way to ${display} while staying readable — the smallest readable version is ${formatBytes(
              blob.size
            )}. Try removing pages or splitting it, then compress again.`
          );
        }

        return { blob, filename };
      }}
    />
  );
}
