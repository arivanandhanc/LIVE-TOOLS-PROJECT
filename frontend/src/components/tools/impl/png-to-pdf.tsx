"use client";

import { FileTool } from "@/components/tools/file-tool";
import { PDFDocument, toPdfBlob } from "@/lib/pdf";

export default function PngToPdf() {
  return (
    <FileTool
      accept="image/png"
      multiple
      reorder
      cta="Create PDF"
      hint="Add PNG images — drag to set page order. Transparency is placed on a white page."
      process={async (files) => {
        const doc = await PDFDocument.create();
        for (const file of files) {
          const bytes = await file.arrayBuffer();
          const img = await doc.embedPng(bytes);
          const page = doc.addPage([img.width, img.height]);
          page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        }
        return { blob: await toPdfBlob(doc), filename: "images.pdf" };
      }}
    />
  );
}
