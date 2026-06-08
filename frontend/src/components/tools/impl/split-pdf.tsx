"use client";

import * as React from "react";
import JSZip from "jszip";
import { FileTool } from "@/components/tools/file-tool";
import { Field } from "@/components/tools/panel";
import { Input } from "@/components/ui/input";
import { PDFDocument, parsePageRanges, toPdfBlob } from "@/lib/pdf";

export default function SplitPdf() {
  const [pages, setPages] = React.useState("");

  return (
    <FileTool
      accept="application/pdf"
      cta="Split PDF"
      hint="Leave blank to split every page into its own file (delivered as a .zip)."
      controls={
        <Field label="Pages to extract" hint="e.g. 1-3,5,8-10. Blank = one file per page.">
          <Input value={pages} onChange={(e) => setPages(e.target.value)} placeholder="1-3,5,8-10" />
        </Field>
      }
      process={async (files) => {
        const file = files[0];
        const src = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
        const total = src.getPageCount();
        const base = file.name.replace(/\.pdf$/i, "");

        if (pages.trim()) {
          const indices = parsePageRanges(pages, total);
          const out = await PDFDocument.create();
          const copied = await out.copyPages(src, indices);
          copied.forEach((p) => out.addPage(p));
          return { blob: await toPdfBlob(out), filename: `${base}-pages.pdf` };
        }

        const zip = new JSZip();
        for (let i = 0; i < total; i++) {
          const out = await PDFDocument.create();
          const [page] = await out.copyPages(src, [i]);
          out.addPage(page);
          const bytes = await out.save();
          zip.file(`${base}-page-${i + 1}.pdf`, bytes);
        }
        const blob = await zip.generateAsync({ type: "blob" });
        return { blob, filename: `${base}-split.zip` };
      }}
    />
  );
}
