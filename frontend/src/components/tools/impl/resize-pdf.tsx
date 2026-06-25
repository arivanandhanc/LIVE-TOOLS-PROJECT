"use client";

import * as React from "react";
import { FileTool } from "@/components/tools/file-tool";
import { Field } from "@/components/tools/panel";
import { PDFDocument, toPdfBlob } from "@/lib/pdf";

// Standard page sizes in PDF points (portrait), width × height.
const SIZES: Record<string, [number, number]> = {
  A3: [841.89, 1190.55],
  A4: [595.28, 841.89],
  A5: [419.53, 595.28],
  Letter: [612, 792],
  Legal: [612, 1008],
};

export default function ResizePdf() {
  const [size, setSize] = React.useState("A4");
  const [orientation, setOrientation] = React.useState<"portrait" | "landscape">("portrait");

  return (
    <FileTool
      accept="application/pdf"
      cta="Resize PDF"
      hint="Scale every page to a standard paper size, keeping the aspect ratio."
      controls={
        <div className="grid grid-cols-2 gap-4">
          <Field label="Page size">
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
            >
              {Object.keys(SIZES).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Orientation">
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value as "portrait" | "landscape")}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </Field>
        </div>
      }
      process={async (files) => {
        const file = files[0];
        const src = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
        const out = await PDFDocument.create();

        let [tw, th] = SIZES[size];
        if (orientation === "landscape") [tw, th] = [th, tw];

        const indices = src.getPageIndices();
        for (const i of indices) {
          const embedded = await out.embedPage(src.getPage(i));
          const page = out.addPage([tw, th]);
          // Fit the original page inside the new size, preserving aspect ratio.
          const scale = Math.min(tw / embedded.width, th / embedded.height);
          page.drawPage(embedded, {
            x: (tw - embedded.width * scale) / 2,
            y: (th - embedded.height * scale) / 2,
            xScale: scale,
            yScale: scale,
          });
        }

        const base = file.name.replace(/\.pdf$/i, "");
        return { blob: await toPdfBlob(out), filename: `${base}-${size.toLowerCase()}.pdf` };
      }}
    />
  );
}
