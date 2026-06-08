"use client";

import * as React from "react";
import { FileTool } from "@/components/tools/file-tool";
import { Field } from "@/components/tools/panel";
import { Input } from "@/components/ui/input";
import { PDFDocument, parsePageRanges, toPdfBlob } from "@/lib/pdf";

export default function ExtractPages() {
  const [pages, setPages] = React.useState("");

  return (
    <FileTool
      accept="application/pdf"
      cta="Extract pages"
      hint="Pull the pages you need into a fresh PDF."
      controls={
        <Field label="Pages to extract" hint="e.g. 2,4,6-8">
          <Input value={pages} onChange={(e) => setPages(e.target.value)} placeholder="2,4,6-8" />
        </Field>
      }
      process={async (files) => {
        const file = files[0];
        const src = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
        const indices = parsePageRanges(pages, src.getPageCount());
        if (!pages.trim()) throw new Error("Enter the pages you want to extract.");
        const out = await PDFDocument.create();
        const copied = await out.copyPages(src, indices);
        copied.forEach((p) => out.addPage(p));
        const base = file.name.replace(/\.pdf$/i, "");
        return { blob: await toPdfBlob(out), filename: `${base}-extracted.pdf` };
      }}
    />
  );
}
