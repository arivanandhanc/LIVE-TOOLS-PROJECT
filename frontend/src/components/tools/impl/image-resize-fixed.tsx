"use client";

import * as React from "react";
import { FileTool } from "@/components/tools/file-tool";
import { Field } from "@/components/tools/panel";
import { Input } from "@/components/ui/input";
import { loadImageFromFile, drawToCanvas, canvasToBlob } from "@/lib/image";

/**
 * Resize an image to exact pixel dimensions on a canvas, in the browser. The
 * width/height boxes are pre-filled with this page's target size but are fully
 * editable, so the page doubles as a free-form resizer.
 */
export default function ImageResizeFixed({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  const [w, setW] = React.useState(width);
  const [h, setH] = React.useState(height);

  return (
    <FileTool
      accept="image/*"
      cta={`Resize to ${w}×${h}`}
      hint="Runs entirely in your browser — nothing is uploaded."
      controls={
        <Field
          label="Size (px)"
          hint="Pre-filled with this page's size — change either box to resize to any dimensions."
        >
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={1}
              value={w}
              onChange={(e) => setW(Math.max(1, Number(e.target.value) || 1))}
              className="w-28"
              aria-label="Width in pixels"
            />
            <span className="text-muted-foreground">×</span>
            <Input
              type="number"
              min={1}
              value={h}
              onChange={(e) => setH(Math.max(1, Number(e.target.value) || 1))}
              className="w-28"
              aria-label="Height in pixels"
            />
          </div>
        </Field>
      }
      process={async (files) => {
        const file = files[0];
        const img = await loadImageFromFile(file);
        const isJpeg = file.type === "image/jpeg";
        const canvas = drawToCanvas(img, w, h, isJpeg ? "#ffffff" : undefined);
        const mime = isJpeg ? "image/jpeg" : "image/png";
        const blob = await canvasToBlob(canvas, mime, isJpeg ? 0.92 : undefined);
        const base = file.name.replace(/\.[^.]+$/, "");
        const ext = isJpeg ? "jpg" : "png";
        return { blob, filename: `${base}-${w}x${h}.${ext}` };
      }}
    />
  );
}
