"use client";

import * as React from "react";
import { Download, Loader2, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolPanel, Field } from "@/components/tools/panel";
import { Dropzone } from "@/components/tools/dropzone";
import { loadImageFromFile, drawToCanvas, canvasToBlob } from "@/lib/image";
import { downloadBlob, formatBytes } from "@/lib/utils";

export default function ResizeImage() {
  const [file, setFile] = React.useState<File | null>(null);
  const [img, setImg] = React.useState<HTMLImageElement | null>(null);
  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);
  const [lock, setLock] = React.useState(true);
  const [busy, setBusy] = React.useState(false);
  const [result, setResult] = React.useState<{ url: string; size: number } | null>(null);
  const ratio = React.useRef(1);

  async function onFile(f: File) {
    setFile(f);
    setResult(null);
    const image = await loadImageFromFile(f);
    ratio.current = image.naturalWidth / image.naturalHeight;
    setImg(image);
    setWidth(image.naturalWidth);
    setHeight(image.naturalHeight);
  }

  function changeWidth(w: number) {
    setWidth(w);
    if (lock) setHeight(Math.round(w / ratio.current));
  }
  function changeHeight(h: number) {
    setHeight(h);
    if (lock) setWidth(Math.round(h * ratio.current));
  }

  async function resize() {
    if (!img) return;
    setBusy(true);
    try {
      const canvas = drawToCanvas(img, Math.max(1, width), Math.max(1, height));
      const blob = await canvasToBlob(canvas, file?.type ?? "image/png");
      setResult({ url: URL.createObjectURL(blob), size: blob.size });
    } finally {
      setBusy(false);
    }
  }

  function download() {
    if (!result || !file) return;
    const base = file.name.replace(/\.[^.]+$/, "");
    fetch(result.url).then((r) => r.blob()).then((b) => downloadBlob(b, `${base}-${width}x${height}.${(file.type.split("/")[1] ?? "png")}`));
  }

  return (
    <div className="space-y-4">
      <Dropzone file={file} onFile={onFile} />
      {img && (
        <ToolPanel className="space-y-4">
          <div className="flex items-end gap-3">
            <Field label="Width (px)">
              <Input type="number" value={width} onChange={(e) => changeWidth(Number(e.target.value))} className="w-28" />
            </Field>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setLock((v) => !v)}
              aria-label={lock ? "Unlock aspect ratio" : "Lock aspect ratio"}
              title={lock ? "Aspect ratio locked" : "Aspect ratio unlocked"}
            >
              {lock ? <Lock /> : <Unlock />}
            </Button>
            <Field label="Height (px)">
              <Input type="number" value={height} onChange={(e) => changeHeight(Number(e.target.value))} className="w-28" />
            </Field>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={resize} disabled={busy}>
              {busy ? <Loader2 className="animate-spin" /> : null} Resize
            </Button>
            {result && (
              <>
                <span className="text-sm text-muted-foreground">{formatBytes(result.size)}</span>
                <Button variant="outline" onClick={download} className="ml-auto">
                  <Download /> Download
                </Button>
              </>
            )}
          </div>
          {result && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={result.url} alt="Resized" className="max-h-80 rounded-lg border border-border" />
          )}
        </ToolPanel>
      )}
    </div>
  );
}
