"use client";

import * as React from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolPanel, Field, Stat } from "@/components/tools/panel";
import { Dropzone } from "@/components/tools/dropzone";
import { loadImageFromFile, drawToCanvas, canvasToBlob } from "@/lib/image";
import { downloadBlob, formatBytes } from "@/lib/utils";

export default function CompressImage() {
  const [file, setFile] = React.useState<File | null>(null);
  const [quality, setQuality] = React.useState(0.7);
  const [busy, setBusy] = React.useState(false);
  const [result, setResult] = React.useState<{ url: string; size: number } | null>(null);

  async function compress() {
    if (!file) return;
    setBusy(true);
    try {
      const img = await loadImageFromFile(file);
      const canvas = drawToCanvas(img, img.naturalWidth, img.naturalHeight, "#ffffff");
      const mime = file.type === "image/png" ? "image/jpeg" : file.type || "image/jpeg";
      const blob = await canvasToBlob(canvas, mime, quality);
      setResult({ url: URL.createObjectURL(blob), size: blob.size });
    } finally {
      setBusy(false);
    }
  }

  function download() {
    if (!result || !file) return;
    const base = file.name.replace(/\.[^.]+$/, "");
    fetch(result.url).then((r) => r.blob()).then((b) => downloadBlob(b, `${base}-compressed.jpg`));
  }

  const saved = result && file ? Math.max(0, Math.round((1 - result.size / file.size) * 100)) : 0;

  return (
    <div className="space-y-4">
      <Dropzone file={file} onFile={(f) => { setFile(f); setResult(null); }} />
      {file && (
        <ToolPanel className="space-y-4">
          <Field label={`Quality: ${Math.round(quality * 100)}%`} hint="Lower quality = smaller file.">
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-[var(--color-primary)]"
            />
          </Field>
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={compress} disabled={busy}>
              {busy ? <Loader2 className="animate-spin" /> : null} Compress
            </Button>
            {result && (
              <Button variant="outline" onClick={download} className="ml-auto">
                <Download /> Download
              </Button>
            )}
          </div>
          {result && (
            <div className="grid grid-cols-3 gap-3">
              <Stat label="Original" value={formatBytes(file.size)} />
              <Stat label="Compressed" value={formatBytes(result.size)} />
              <Stat label="Saved" value={`${saved}%`} />
            </div>
          )}
        </ToolPanel>
      )}
    </div>
  );
}
