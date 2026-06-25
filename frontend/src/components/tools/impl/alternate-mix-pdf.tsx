"use client";

import * as React from "react";
import { FileTool } from "@/components/tools/file-tool";
import { Field } from "@/components/tools/panel";
import { PDFDocument, toPdfBlob } from "@/lib/pdf";

export default function AlternateMixPdf() {
  const [reverseSecond, setReverseSecond] = React.useState(false);

  return (
    <FileTool
      accept="application/pdf"
      multiple
      reorder
      minFiles={2}
      cta="Mix PDFs"
      hint="Add two PDFs (e.g. odd-page and even-page scans). Pages are interleaved one from each."
      controls={
        <Field label="Second file order">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={reverseSecond}
              onChange={(e) => setReverseSecond(e.target.checked)}
              className="size-4"
            />
            Reverse the second file (use when back pages were scanned last-to-first)
          </label>
        </Field>
      }
      process={async (files) => {
        const [fileA, fileB] = files;
        const a = await PDFDocument.load(await fileA.arrayBuffer(), { ignoreEncryption: true });
        const b = await PDFDocument.load(await fileB.arrayBuffer(), { ignoreEncryption: true });
        const out = await PDFDocument.create();

        const idxA = a.getPageIndices();
        const idxB = b.getPageIndices();
        if (reverseSecond) idxB.reverse();

        const pagesA = await out.copyPages(a, idxA);
        const pagesB = await out.copyPages(b, idxB);

        const max = Math.max(pagesA.length, pagesB.length);
        for (let i = 0; i < max; i++) {
          if (pagesA[i]) out.addPage(pagesA[i]);
          if (pagesB[i]) out.addPage(pagesB[i]);
        }

        return { blob: await toPdfBlob(out), filename: "mixed.pdf" };
      }}
    />
  );
}
