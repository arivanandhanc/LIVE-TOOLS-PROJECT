"use client";

import { FileTool } from "@/components/tools/file-tool";
import { PDFDocument, toPdfBlob } from "@/lib/pdf";

export default function JpgToPdf() {
  return (
    <FileTool
      accept="image/jpeg,image/png"
      multiple
      reorder
      cta="Create PDF"
      hint="Add JPG or PNG images — drag to set page order."
      process={async (files) => {
        const doc = await PDFDocument.create();
        for (const file of files) {
          const bytes = await file.arrayBuffer();
          const isPng = file.type === "image/png" || /\.png$/i.test(file.name);
          const img = isPng ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
          const page = doc.addPage([img.width, img.height]);
          page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        }
        return { blob: await toPdfBlob(doc), filename: "images.pdf" };
      }}
    />
  );
}
