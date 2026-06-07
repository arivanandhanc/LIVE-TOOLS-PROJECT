"use client";

import * as React from "react";
import { Download, Loader2, RotateCw, RotateCcw, FlipHorizontal, FlipVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolPanel } from "@/components/tools/panel";
import { Dropzone } from "@/components/tools/dropzone";
import { loadImageFromFile, canvasToBlob } from "@/lib/image";
import { downloadBlob } from "@/lib/utils";

export default function RotateImage() {
  const [file, setFile] = React.useState<File | null>(null);
  const [img, setImg] = React.useState<HTMLImageElement | null>(null);
  const [angle, setAngle] = React.useState(0);
  const [flipH, setFlipH] = React.useState(false);
  const [flipV, setFlipV] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  async function onFile(f: File) {
    setFile(f);
    setAngle(0);
    setFlipH(false);
    setFlipV(false);
    setImg(await loadImageFromFile(f));
  }

  function render(): HTMLCanvasElement | null {
    if (!img) return null;
    const rad = (angle * Math.PI) / 180;
    const swap = angle % 180 !== 0;
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const canvas = document.createElement("canvas");
    canvas.width = swap ? h : w;
    canvas.height = swap ? w : h;
    const ctx = canvas.getContext("2d")!;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rad);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(img, -w / 2, -h / 2);
    return canvas;
  }

  async function download() {
    const canvas = render();
    if (!canvas || !file) return;
    setBusy(true);
    try {
      const blob = await canvasToBlob(canvas, file.type || "image/png");
      const base = file.name.replace(/\.[^.]+$/, "");
      downloadBlob(blob, `${base}-rotated.${file.type.split("/")[1] ?? "png"}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <Dropzone file={file} onFile={onFile} />
      {img && (
        <ToolPanel className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setAngle((a) => (a + 270) % 360)}>
              <RotateCcw /> Left
            </Button>
            <Button variant="outline" onClick={() => setAngle((a) => (a + 90) % 360)}>
              <RotateCw /> Right
            </Button>
            <Button variant={flipH ? "default" : "outline"} onClick={() => setFlipH((v) => !v)}>
              <FlipHorizontal /> Flip H
            </Button>
            <Button variant={flipV ? "default" : "outline"} onClick={() => setFlipV((v) => !v)}>
              <FlipVertical /> Flip V
            </Button>
            <Button onClick={download} disabled={busy} className="ml-auto">
              {busy ? <Loader2 className="animate-spin" /> : <Download />} Download
            </Button>
          </div>
          <div className="grid place-items-center rounded-lg border border-border bg-background p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt="Preview"
              className="max-h-72 transition-transform"
              style={{
                transform: `rotate(${angle}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
              }}
            />
          </div>
        </ToolPanel>
      )}
    </div>
  );
}
