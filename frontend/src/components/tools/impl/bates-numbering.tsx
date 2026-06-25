"use client";

import * as React from "react";
import { FileTool } from "@/components/tools/file-tool";
import { Field } from "@/components/tools/panel";
import { Input } from "@/components/ui/input";
import { PDFDocument, StandardFonts, rgb, toPdfBlob } from "@/lib/pdf";

const POSITIONS = ["bottom-right", "bottom-left", "bottom-center", "top-right", "top-left"] as const;

export default function BatesNumbering() {
  const [prefix, setPrefix] = React.useState("");
  const [suffix, setSuffix] = React.useState("");
  const [startAt, setStartAt] = React.useState("1");
  const [digits, setDigits] = React.useState("6");
  const [position, setPosition] = React.useState<(typeof POSITIONS)[number]>("bottom-right");

  return (
    <FileTool
      accept="application/pdf"
      cta="Apply Bates numbers"
      hint="Stamp sequential Bates numbers (e.g. ABC000001) on every page — standard for legal discovery."
      controls={
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Field label="Prefix">
              <Input value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="ABC" />
            </Field>
            <Field label="Suffix">
              <Input value={suffix} onChange={(e) => setSuffix(e.target.value)} placeholder="" />
            </Field>
            <Field label="Start at">
              <Input type="number" min={0} value={startAt} onChange={(e) => setStartAt(e.target.value)} />
            </Field>
            <Field label="Digits">
              <Input type="number" min={1} max={12} value={digits} onChange={(e) => setDigits(e.target.value)} />
            </Field>
          </div>
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
        </>
      }
      process={async (files) => {
        const file = files[0];
        const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
        const font = await doc.embedFont(StandardFonts.Helvetica);
        const start = parseInt(startAt, 10) || 0;
        const pad = Math.min(12, Math.max(1, parseInt(digits, 10) || 1));
        const size = 10;
        const margin = 22;
        const [vert, horiz] = position.split("-");

        doc.getPages().forEach((page, i) => {
          const label = `${prefix}${String(start + i).padStart(pad, "0")}${suffix}`;
          const { width, height } = page.getSize();
          const textWidth = font.widthOfTextAtSize(label, size);
          const x = horiz === "left" ? margin : horiz === "right" ? width - margin - textWidth : (width - textWidth) / 2;
          const y = vert === "top" ? height - margin : margin;
          page.drawText(label, { x, y, size, font, color: rgb(0, 0, 0) });
        });

        const base = file.name.replace(/\.pdf$/i, "");
        return { blob: await toPdfBlob(doc), filename: `${base}-bates.pdf` };
      }}
    />
  );
}
