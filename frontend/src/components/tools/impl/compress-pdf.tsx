"use client";

import * as React from "react";
import { FileTool } from "@/components/tools/file-tool";
import { Field } from "@/components/tools/panel";
import { renderPdfPages, canvasToBlob } from "@/lib/pdf-render";
import { PDFDocument, toPdfBlob } from "@/lib/pdf";

export default function CompressPdf() {
  const [level, setLevel] = React.useState("medium");

  return (
    <FileTool
      accept="application/pdf"
      cta="Compress PDF"
      hint="Best for scanned or image-heavy PDFs. Pages are re-rendered, so text becomes part of the image."
      controls={
        <Field label="Compression" hint="Stronger compression = smaller file, lower image quality.">
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
          >
            <option value="light">Light — keep quality</option>
            <option value="medium">Medium — balanced</option>
            <option value="strong">Strong — smallest size</option>
          </select>
        </Field>
      }
      process={async (files) => {
        const file = files[0];
        const settings = {
          light: { scale: 2, quality: 0.82 },
          medium: { scale: 1.5, quality: 0.65 },
          strong: { scale: 1.1, quality: 0.5 },
        }[level]!;

        const pages = await renderPdfPages(file, settings.scale);
        const out = await PDFDocument.create();
        for (const { canvas } of pages) {
          const blob = await canvasToBlob(canvas, "image/jpeg", settings.quality);
          const img = await out.embedJpg(await blob.arrayBuffer());
          const page = out.addPage([img.width, img.height]);
          page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        }
        const blob = await toPdfBlob(out);
        const base = file.name.replace(/\.pdf$/i, "");
        if (blob.size >= file.size) {
          throw new Error("This PDF is already well-optimized — compressing further would not reduce its size.");
        }
        return { blob, filename: `${base}-compressed.pdf` };
      }}
    />
  );
}
