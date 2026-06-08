"use client";

import * as React from "react";
import { FileTool } from "@/components/tools/file-tool";
import { Field } from "@/components/tools/panel";
import { Input } from "@/components/ui/input";
import { PDFDocument, parsePageRanges, toPdfBlob } from "@/lib/pdf";

export default function RemovePages() {
  const [pages, setPages] = React.useState("");

  return (
    <FileTool
      accept="application/pdf"
      cta="Remove pages"
      hint="Delete unwanted pages and keep the rest."
      controls={
        <Field label="Pages to remove" hint="e.g. 1,3,5">
          <Input value={pages} onChange={(e) => setPages(e.target.value)} placeholder="1,3,5" />
        </Field>
      }
      process={async (files) => {
        const file = files[0];
        const src = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
        const total = src.getPageCount();
        if (!pages.trim()) throw new Error("Enter the pages you want to remove.");
        const remove = new Set(parsePageRanges(pages, total));
        const keep = src.getPageIndices().filter((i) => !remove.has(i));
        if (keep.length === 0) throw new Error("That would remove every page.");
        const out = await PDFDocument.create();
        const copied = await out.copyPages(src, keep);
        copied.forEach((p) => out.addPage(p));
        const base = file.name.replace(/\.pdf$/i, "");
        return { blob: await toPdfBlob(out), filename: `${base}-trimmed.pdf` };
      }}
    />
  );
}
