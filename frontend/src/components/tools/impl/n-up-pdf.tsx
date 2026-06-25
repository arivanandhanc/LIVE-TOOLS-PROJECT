"use client";

import * as React from "react";
import { FileTool } from "@/components/tools/file-tool";
import { Field } from "@/components/tools/panel";
import { PDFDocument, toPdfBlob } from "@/lib/pdf";

const A4: [number, number] = [595.28, 841.89];

// Grid layout per "pages per sheet" option: columns × rows, and whether the
// output sheet is landscape (2-up reads better side-by-side on landscape A4).
const LAYOUTS: Record<string, { cols: number; rows: number; landscape: boolean }> = {
  "2": { cols: 2, rows: 1, landscape: true },
  "4": { cols: 2, rows: 2, landscape: false },
  "6": { cols: 2, rows: 3, landscape: false },
  "9": { cols: 3, rows: 3, landscape: false },
};

export default function NUpPdf() {
  const [perSheet, setPerSheet] = React.useState("2");

  return (
    <FileTool
      accept="application/pdf"
      cta="Combine pages"
      hint="Place several pages on each A4 sheet to save paper when printing."
      controls={
        <Field label="Pages per sheet">
          <select
            value={perSheet}
            onChange={(e) => setPerSheet(e.target.value)}
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
          >
            {Object.keys(LAYOUTS).map((n) => (
              <option key={n} value={n}>{n} per sheet</option>
            ))}
          </select>
        </Field>
      }
      process={async (files) => {
        const file = files[0];
        const src = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
        const out = await PDFDocument.create();

        const { cols, rows, landscape } = LAYOUTS[perSheet];
        const perPage = cols * rows;
        const [sw, sh] = landscape ? [A4[1], A4[0]] : A4;
        const gap = 12;
        const cellW = (sw - gap * (cols + 1)) / cols;
        const cellH = (sh - gap * (rows + 1)) / rows;

        const indices = src.getPageIndices();
        for (let i = 0; i < indices.length; i += perPage) {
          const sheet = out.addPage([sw, sh]);
          const chunk = indices.slice(i, i + perPage);
          for (let j = 0; j < chunk.length; j++) {
            const embedded = await out.embedPage(src.getPage(chunk[j]));
            const col = j % cols;
            const row = Math.floor(j / cols);
            const scale = Math.min(cellW / embedded.width, cellH / embedded.height);
            const w = embedded.width * scale;
            const h = embedded.height * scale;
            // Cells fill left-to-right, top-to-bottom; y is measured from the bottom.
            const cellX = gap + col * (cellW + gap);
            const cellY = sh - (row + 1) * (cellH + gap) + gap;
            sheet.drawPage(embedded, {
              x: cellX + (cellW - w) / 2,
              y: cellY + (cellH - h) / 2,
              xScale: scale,
              yScale: scale,
            });
          }
        }

        const base = file.name.replace(/\.pdf$/i, "");
        return { blob: await toPdfBlob(out), filename: `${base}-${perSheet}up.pdf` };
      }}
    />
  );
}
