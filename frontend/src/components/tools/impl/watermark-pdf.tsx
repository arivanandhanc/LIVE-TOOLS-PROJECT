"use client";

import * as React from "react";
import { FileTool } from "@/components/tools/file-tool";
import { Field } from "@/components/tools/panel";
import { Input } from "@/components/ui/input";
import { PDFDocument, StandardFonts, rgb, degrees, toPdfBlob } from "@/lib/pdf";

export default function WatermarkPdf() {
  const [text, setText] = React.useState("CONFIDENTIAL");
  const [opacity, setOpacity] = React.useState(0.2);

  return (
    <FileTool
      accept="application/pdf"
      cta="Add watermark"
      controls={
        <>
          <Field label="Watermark text">
            <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="CONFIDENTIAL" />
          </Field>
          <Field label={`Opacity: ${Math.round(opacity * 100)}%`}>
            <input
              type="range"
              min={0.05}
              max={0.6}
              step={0.05}
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full accent-[var(--color-primary)]"
            />
          </Field>
        </>
      }
      process={async (files) => {
        if (!text.trim()) throw new Error("Enter the watermark text.");
        const file = files[0];
        const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
        const font = await doc.embedFont(StandardFonts.HelveticaBold);
        const size = 48;
        doc.getPages().forEach((page) => {
          const { width, height } = page.getSize();
          const textWidth = font.widthOfTextAtSize(text, size);
          page.drawText(text, {
            x: width / 2 - textWidth / 2,
            y: height / 2,
            size,
            font,
            color: rgb(0.4, 0.4, 0.4),
            opacity,
            rotate: degrees(45),
          });
        });
        const base = file.name.replace(/\.pdf$/i, "");
        return { blob: await toPdfBlob(doc), filename: `${base}-watermarked.pdf` };
      }}
    />
  );
}
