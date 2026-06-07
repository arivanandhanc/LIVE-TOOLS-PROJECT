"use client";

import * as React from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolPanel, Field } from "@/components/tools/panel";
import { Dropzone } from "@/components/tools/dropzone";
import { loadImageFromFile, drawToCanvas, canvasToBlob } from "@/lib/image";
import { downloadBlob, formatBytes } from "@/lib/utils";

interface ImageFormatToolProps {
  targetMime: string;
  extension: string;
  /** Whether the target format supports a quality setting (JPEG/WebP). */
  hasQuality?: boolean;
  /** Fill background for formats without alpha (e.g. JPEG). */
  flatten?: boolean;
  accept?: string;
}

export function ImageFormatTool({
  targetMime,
  extension,
  hasQuality = false,
  flatten = false,
  accept = "image/*",
}: ImageFormatToolProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [quality, setQuality] = React.useState(0.9);
  const [busy, setBusy] = React.useState(false);
  const [result, setResult] = React.useState<{ url: string; size: number } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    return () => {
      if (result) URL.revokeObjectURL(result.url);
    };
  }, [result]);

  async function convert() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const img = await loadImageFromFile(file);
      const canvas = drawToCanvas(img, img.naturalWidth, img.naturalHeight, flatten ? "#ffffff" : undefined);
      const blob = await canvasToBlob(canvas, targetMime, hasQuality ? quality : undefined);
      setResult({ url: URL.createObjectURL(blob), size: blob.size });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed.");
    } finally {
      setBusy(false);
    }
  }

  function download() {
    if (!result || !file) return;
    const base = file.name.replace(/\.[^.]+$/, "");
    fetch(result.url)
      .then((r) => r.blob())
      .then((b) => downloadBlob(b, `${base}.${extension}`));
  }

  return (
    <div className="space-y-4">
      <Dropzone accept={accept} file={file} onFile={(f) => { setFile(f); setResult(null); }} />

      {file && (
        <ToolPanel className="space-y-4">
          {hasQuality && (
            <Field label={`Quality: ${Math.round(quality * 100)}%`}>
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
          )}
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={convert} disabled={busy}>
              {busy ? <Loader2 className="animate-spin" /> : null}
              Convert to {extension.toUpperCase()}
            </Button>
            {result && (
              <>
                <span className="text-sm text-muted-foreground">
                  Output: {formatBytes(result.size)}
                </span>
                <Button variant="outline" onClick={download} className="ml-auto">
                  <Download /> Download
                </Button>
              </>
            )}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {result && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={result.url} alt="Converted result" className="max-h-80 rounded-lg border border-border" />
          )}
        </ToolPanel>
      )}
    </div>
  );
}
