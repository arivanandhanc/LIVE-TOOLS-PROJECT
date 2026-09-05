"use client";

import * as React from "react";
import { FileTool } from "@/components/tools/file-tool";
import { Field } from "@/components/tools/panel";
import { Input } from "@/components/ui/input";
import { loadImageFromFile } from "@/lib/image";
import { PDFDocument, toPdfBlob } from "@/lib/pdf";
import { formatBytes } from "@/lib/utils";

function displaySize(kb: number): string {
  return kb >= 1024
    ? `${(kb / 1024).toLocaleString(undefined, { maximumFractionDigits: 1 })} MB`
    : `${kb} KB`;
}

function toBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Could not encode image."))),
      "image/jpeg",
      quality
    )
  );
}

/** Draw one image at `scale`, then JPEG-encode it at `quality`. */
async function encode(
  img: HTMLImageElement,
  scale: number,
  quality: number
): Promise<{ bytes: ArrayBuffer; width: number; height: number }> {
  const width = Math.max(1, Math.round(img.naturalWidth * scale));
  const height = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is unavailable in this browser.");
  // JPEG has no alpha — paint white first so transparent PNGs don't go black.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
  const blob = await toBlob(canvas, quality);
  return { bytes: await blob.arrayBuffer(), width, height };
}

async function buildPdf(
  images: HTMLImageElement[],
  scale: number,
  quality: number
): Promise<Blob> {
  const out = await PDFDocument.create();
  for (const img of images) {
    const { bytes, width, height } = await encode(img, scale, quality);
    const embedded = await out.embedJpg(bytes);
    const page = out.addPage([width, height]);
    page.drawImage(embedded, { x: 0, y: 0, width, height });
  }
  return toPdfBlob(out);
}

/**
 * Convert images to a PDF that fits within `targetBytes`.
 *
 * Same shape as the compress-PDF target search: walk scales high to low and
 * binary search JPEG quality at each, taking the first (highest-resolution)
 * result that fits. Photos from a phone are far larger than the 100-300 KB
 * ceilings these pages target, so the scale ladder does most of the work and
 * the quality search recovers whatever headroom is left.
 */
async function convertToTarget(files: File[], targetBytes: number): Promise<Blob> {
  const images = await Promise.all(files.map(loadImageFromFile));
  const scales = [1.0, 0.85, 0.7, 0.55, 0.45, 0.35, 0.25];
  let smallest: Blob | null = null;

  for (const scale of scales) {
    let lo = 0.3;
    let hi = 0.92;
    let bestAtScale: Blob | null = null;

    for (let i = 0; i < 6; i++) {
      const mid = (lo + hi) / 2;
      const blob = await buildPdf(images, scale, mid);
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

export default function ImagesToPdfTarget({
  targetBytes,
  accept = "image/jpeg,image/jpg,image/png,image/webp",
}: {
  targetBytes: number;
  targetDisplay?: string;
  accept?: string;
}) {
  const [kb, setKb] = React.useState(Math.round(targetBytes / 1024));
  const targetNow = Math.max(1, kb) * 1024;
  const display = displaySize(Math.max(1, kb));

  return (
    <FileTool
      accept={accept}
      multiple
      cta={`Convert to PDF under ${display}`}
      hint="Runs entirely in your browser — nothing is uploaded. Add several images to build a multi-page PDF."
      controls={
        <Field
          label="Target size (KB)"
          hint="Pre-filled for this page — change it to hit any size."
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
        const blob = await convertToTarget(files, targetNow);
        const base = files[0].name.replace(/\.[^.]+$/, "");
        const filename = `${base}-${formatBytes(blob.size, 0).replace(/\s+/g, "")}.pdf`;

        if (blob.size > targetNow) {
          throw new Error(
            `These images couldn't be fitted into ${display} while staying readable — the smallest readable PDF is ${formatBytes(
              blob.size
            )}. Try fewer images, or raise the target.`
          );
        }

        return { blob, filename };
      }}
    />
  );
}
