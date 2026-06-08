"use client";

import * as React from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolPanel, Field } from "@/components/tools/panel";
import { Dropzone } from "@/components/tools/dropzone";
import { loadImageFromFile, canvasToBlob } from "@/lib/image";
import { downloadBlob } from "@/lib/utils";

export default function CropImage() {
  const [file, setFile] = React.useState<File | null>(null);
  const [img, setImg] = React.useState<HTMLImageElement | null>(null);
  const [crop, setCrop] = React.useState({ x: 0, y: 0, w: 0, h: 0 });
  const [busy, setBusy] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);

  async function onFile(f: File) {
    setFile(f);
    setResult(null);
    const image = await loadImageFromFile(f);
    setImg(image);
    setCrop({ x: 0, y: 0, w: image.naturalWidth, h: image.naturalHeight });
  }

  async function run() {
    if (!img) return;
    setBusy(true);
    try {
      const w = Math.min(crop.w, img.naturalWidth - crop.x);
      const h = Math.min(crop.h, img.naturalHeight - crop.y);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, crop.x, crop.y, w, h, 0, 0, w, h);
      const blob = await canvasToBlob(canvas, file?.type || "image/png");
      setResult(URL.createObjectURL(blob));
    } finally {
      setBusy(false);
    }
  }

  const num = (key: keyof typeof crop) => (
    <Field label={key.toUpperCase()}>
      <input
        type="number"
        min={0}
        value={crop[key]}
        onChange={(e) => setCrop((c) => ({ ...c, [key]: Math.max(0, Number(e.target.value)) }))}
        className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
      />
    </Field>
  );

  return (
    <div className="space-y-4">
      <Dropzone file={file} onFile={onFile} />
      {img && (
        <>
          <ToolPanel className="space-y-4">
            <p className="text-sm text-muted-foreground">Source: {img.naturalWidth} × {img.naturalHeight}px. Set the crop region (pixels):</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {num("x")}{num("y")}{num("w")}{num("h")}
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={run} disabled={busy}>{busy ? <Loader2 className="animate-spin" /> : null} Crop</Button>
              {result && (
                <Button variant="outline" className="ml-auto" onClick={() => fetch(result).then((r) => r.blob()).then((b) => downloadBlob(b, "cropped.png"))}>
                  <Download /> Download
                </Button>
              )}
            </div>
          </ToolPanel>
          {result && (
            <ToolPanel>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result} alt="Cropped preview" className="mx-auto max-h-80 rounded-lg border border-border" />
            </ToolPanel>
          )}
        </>
      )}
    </div>
  );
}
