"use client";

import * as React from "react";
import { FileTool } from "@/components/tools/file-tool";
import { Field } from "@/components/tools/panel";
import { Input } from "@/components/ui/input";
import { PDFDocument, parsePageRanges, degrees, toPdfBlob } from "@/lib/pdf";

export default function RotatePdf() {
  const [angle, setAngle] = React.useState("90");
  const [pages, setPages] = React.useState("");

  return (
    <FileTool
      accept="application/pdf"
      cta="Rotate PDF"
      hint="Rotate all pages, or just the ones you list."
      controls={
        <>
          <Field label="Rotation">
            <select
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
            >
              <option value="90">90° clockwise</option>
              <option value="180">180°</option>
              <option value="270">90° counter-clockwise</option>
            </select>
          </Field>
          <Field label="Pages" hint="Blank = all pages. e.g. 1,3-5">
            <Input value={pages} onChange={(e) => setPages(e.target.value)} placeholder="all pages" />
          </Field>
        </>
      }
      process={async (files) => {
        const file = files[0];
        const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
        const targets = new Set(parsePageRanges(pages, doc.getPageCount()));
        const delta = parseInt(angle, 10);
        doc.getPages().forEach((page, i) => {
          if (!targets.has(i)) return;
          const current = page.getRotation().angle;
          page.setRotation(degrees((current + delta) % 360));
        });
        const base = file.name.replace(/\.pdf$/i, "");
        return { blob: await toPdfBlob(doc), filename: `${base}-rotated.pdf` };
      }}
    />
  );
}
