"use client";

import * as React from "react";
import { FileTool } from "@/components/tools/file-tool";
import { Field } from "@/components/tools/panel";
import { Input } from "@/components/ui/input";
import { PDFDocument, toPdfBlob } from "@/lib/pdf";

// 1 mm ≈ 2.83465 PDF points.
const MM = 2.83465;

export default function CropPdf() {
  const [top, setTop] = React.useState("0");
  const [right, setRight] = React.useState("0");
  const [bottom, setBottom] = React.useState("0");
  const [left, setLeft] = React.useState("0");

  const num = (v: string) => Math.max(0, parseFloat(v) || 0);

  return (
    <FileTool
      accept="application/pdf"
      cta="Crop PDF"
      hint="Trim a margin (in millimetres) from each side of every page."
      controls={
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field label="Top (mm)">
            <Input type="number" min={0} value={top} onChange={(e) => setTop(e.target.value)} />
          </Field>
          <Field label="Right (mm)">
            <Input type="number" min={0} value={right} onChange={(e) => setRight(e.target.value)} />
          </Field>
          <Field label="Bottom (mm)">
            <Input type="number" min={0} value={bottom} onChange={(e) => setBottom(e.target.value)} />
          </Field>
          <Field label="Left (mm)">
            <Input type="number" min={0} value={left} onChange={(e) => setLeft(e.target.value)} />
          </Field>
        </div>
      }
      process={async (files) => {
        const file = files[0];
        const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
        const [t, r, b, l] = [num(top) * MM, num(right) * MM, num(bottom) * MM, num(left) * MM];

        doc.getPages().forEach((page) => {
          const { x, y, width, height } = page.getCropBox();
          const newWidth = width - l - r;
          const newHeight = height - t - b;
          if (newWidth <= 0 || newHeight <= 0) {
            throw new Error("Crop margins are larger than the page — reduce them and try again.");
          }
          // Crop box origin is measured from the bottom-left, so the left/bottom
          // margins shift the origin and the top/right margins shrink the size.
          page.setCropBox(x + l, y + b, newWidth, newHeight);
        });

        const base = file.name.replace(/\.pdf$/i, "");
        return { blob: await toPdfBlob(doc), filename: `${base}-cropped.pdf` };
      }}
    />
  );
}
