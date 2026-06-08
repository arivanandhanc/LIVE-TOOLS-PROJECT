"use client";

import * as React from "react";
import { FileTool } from "@/components/tools/file-tool";
import { Field } from "@/components/tools/panel";
import { PDFDocument, StandardFonts, rgb, toPdfBlob } from "@/lib/pdf";

const POSITIONS = ["bottom-center", "bottom-right", "bottom-left", "top-center", "top-right", "top-left"] as const;

export default function AddPageNumbers() {
  const [position, setPosition] = React.useState<(typeof POSITIONS)[number]>("bottom-center");
  const [startAt, setStartAt] = React.useState("1");

  return (
    <FileTool
      accept="application/pdf"
      cta="Add page numbers"
      controls={
        <>
          <Field label="Position">
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value as (typeof POSITIONS)[number])}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
            >
              {POSITIONS.map((p) => (
                <option key={p} value={p}>{p.replace("-", " ")}</option>
              ))}
            </select>
          </Field>
          <Field label="Start numbering at">
            <input
              type="number"
              min={0}
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
            />
          </Field>
        </>
      }
      process={async (files) => {
        const file = files[0];
        const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
        const font = await doc.embedFont(StandardFonts.Helvetica);
        const offset = parseInt(startAt, 10) || 0;
        const size = 11;
        const margin = 28;
        const [vert, horiz] = position.split("-");

        doc.getPages().forEach((page, i) => {
          const label = `${i + offset}`;
          const { width, height } = page.getSize();
          const textWidth = font.widthOfTextAtSize(label, size);
          const x = horiz === "left" ? margin : horiz === "right" ? width - margin - textWidth : (width - textWidth) / 2;
          const y = vert === "top" ? height - margin : margin;
          page.drawText(label, { x, y, size, font, color: rgb(0.2, 0.2, 0.2) });
        });

        const base = file.name.replace(/\.pdf$/i, "");
        return { blob: await toPdfBlob(doc), filename: `${base}-numbered.pdf` };
      }}
    />
  );
}
