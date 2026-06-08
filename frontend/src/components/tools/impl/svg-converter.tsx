"use client";

import * as React from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolPanel, Field } from "@/components/tools/panel";
import { Dropzone } from "@/components/tools/dropzone";
import { canvasToBlob } from "@/lib/image";
import { downloadBlob } from "@/lib/utils";

export default function SvgConverter() {
  const [file, setFile] = React.useState<File | null>(null);
  const [scale, setScale] = React.useState(2);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<string | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const svgText = await file.text();
      const blob = new Blob([svgText], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = () => reject(new Error("Could not read this SVG."));
        i.src = url;
      });
      // Fall back to viewBox dims when width/height are not set on the element.
      const vb = /viewBox=["']\s*[\d.]+\s+[\d.]+\s+([\d.]+)\s+([\d.]+)/.exec(svgText);
      const baseW = img.width || (vb ? Number(vb[1]) : 512);
      const baseH = img.height || (vb ? Number(vb[2]) : 512);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(baseW * scale);
      canvas.height = Math.round(baseH * scale);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const png = await canvasToBlob(canvas, "image/png");
      setResult(URL.createObjectURL(png));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <Dropzone accept="image/svg+xml,.svg" file={file} onFile={(f) => { setFile(f); setResult(null); }} hint="SVG files only" />
      {file && (
        <>
          <ToolPanel className="space-y-4">
            <Field label={`Resolution: ${scale}×`} hint="Higher = sharper, larger PNG.">
              <input type="range" min={1} max={6} step={1} value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-full accent-[var(--color-primary)]" />
            </Field>
            <div className="flex items-center gap-3">
              <Button onClick={run} disabled={busy}>{busy ? <Loader2 className="animate-spin" /> : null} Convert to PNG</Button>
              {result && (
                <Button variant="outline" className="ml-auto" onClick={() => fetch(result!).then((r) => r.blob()).then((b) => downloadBlob(b, file.name.replace(/\.svg$/i, "") + ".png"))}>
                  <Download /> Download
                </Button>
              )}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </ToolPanel>
          {result && (
            <ToolPanel>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result} alt="PNG preview" className="mx-auto max-h-80 rounded-lg border border-border bg-[repeating-conic-gradient(#0001_0_25%,transparent_0_50%)] bg-[length:20px_20px]" />
            </ToolPanel>
          )}
        </>
      )}
    </div>
  );
}
