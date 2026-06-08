"use client";

import * as React from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolPanel, Field } from "@/components/tools/panel";
import { Dropzone } from "@/components/tools/dropzone";
import { loadImageFromFile, canvasToBlob } from "@/lib/image";
import { downloadBlob } from "@/lib/utils";

const POSITIONS = ["bottom-right", "bottom-left", "top-right", "top-left", "center"] as const;

export default function ImageWatermark() {
  const [file, setFile] = React.useState<File | null>(null);
  const [text, setText] = React.useState("© ConvertFlow");
  const [position, setPosition] = React.useState<(typeof POSITIONS)[number]>("bottom-right");
  const [opacity, setOpacity] = React.useState(0.6);
  const [busy, setBusy] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true);
    try {
      const img = await loadImageFromFile(file);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      const size = Math.max(16, Math.round(canvas.width * 0.04));
      ctx.font = `bold ${size}px sans-serif`;
      ctx.globalAlpha = opacity;
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "rgba(0,0,0,0.5)";
      ctx.lineWidth = Math.max(1, size / 16);
      const metrics = ctx.measureText(text);
      const pad = size;
      const [v, h] = position === "center" ? ["center", "center"] : position.split("-");
      const x = h === "left" ? pad : h === "center" ? (canvas.width - metrics.width) / 2 : canvas.width - metrics.width - pad;
      const y = v === "top" ? pad + size : v === "center" ? canvas.height / 2 : canvas.height - pad;
      ctx.strokeText(text, x, y);
      ctx.fillText(text, x, y);

      const blob = await canvasToBlob(canvas, file.type || "image/png");
      setResult(URL.createObjectURL(blob));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <Dropzone file={file} onFile={(f) => { setFile(f); setResult(null); }} />
      {file && (
        <>
          <ToolPanel className="space-y-4">
            <Field label="Watermark text"><Input value={text} onChange={(e) => setText(e.target.value)} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Position">
                <select value={position} onChange={(e) => setPosition(e.target.value as (typeof POSITIONS)[number])} className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm">
                  {POSITIONS.map((p) => <option key={p} value={p}>{p.replace("-", " ")}</option>)}
                </select>
              </Field>
              <Field label={`Opacity: ${Math.round(opacity * 100)}%`}>
                <input type="range" min={0.1} max={1} step={0.05} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full accent-[var(--color-primary)]" />
              </Field>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={run} disabled={busy}>{busy ? <Loader2 className="animate-spin" /> : null} Apply watermark</Button>
              {result && (
                <Button variant="outline" className="ml-auto" onClick={() => fetch(result).then((r) => r.blob()).then((b) => downloadBlob(b, "watermarked.png"))}>
                  <Download /> Download
                </Button>
              )}
            </div>
          </ToolPanel>
          {result && (
            <ToolPanel>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result} alt="Watermarked preview" className="mx-auto max-h-80 rounded-lg border border-border" />
            </ToolPanel>
          )}
        </>
      )}
    </div>
  );
}
