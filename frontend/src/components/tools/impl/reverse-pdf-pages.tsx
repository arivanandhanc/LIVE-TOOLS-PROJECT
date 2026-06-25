"use client";

import { FileTool } from "@/components/tools/file-tool";
import { PDFDocument, toPdfBlob } from "@/lib/pdf";

export default function ReversePdfPages() {
  return (
    <FileTool
      accept="application/pdf"
      cta="Reverse pages"
      hint="Flip the page order so the last page becomes the first."
      process={async (files) => {
        const file = files[0];
        const src = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
        const out = await PDFDocument.create();

        const reversed = src.getPageIndices().reverse();
        const pages = await out.copyPages(src, reversed);
        pages.forEach((p) => out.addPage(p));

        const base = file.name.replace(/\.pdf$/i, "");
        return { blob: await toPdfBlob(out), filename: `${base}-reversed.pdf` };
      }}
    />
  );
}
