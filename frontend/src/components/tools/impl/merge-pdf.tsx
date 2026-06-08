"use client";

import { FileTool } from "@/components/tools/file-tool";
import { PDFDocument, toPdfBlob } from "@/lib/pdf";

export default function MergePdf() {
  return (
    <FileTool
      accept="application/pdf"
      multiple
      reorder
      minFiles={2}
      cta="Merge PDFs"
      hint="Add two or more PDFs — drag to set the order."
      process={async (files) => {
        const out = await PDFDocument.create();
        for (const file of files) {
          const src = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
          const pages = await out.copyPages(src, src.getPageIndices());
          pages.forEach((p) => out.addPage(p));
        }
        return { blob: await toPdfBlob(out), filename: "merged.pdf" };
      }}
    />
  );
}
