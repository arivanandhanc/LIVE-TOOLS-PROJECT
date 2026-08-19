"use client";

import * as React from "react";
import JSZip from "jszip";
import { Download, Loader2, X, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolPanel, Field } from "@/components/tools/panel";
import { loadImageFromFile, drawToCanvas, canvasToBlob } from "@/lib/image";
import {
  OUTPUT_FORMATS,
  INPUT_ACCEPT,
  supportedOutputMimes,
  describeSource,
  type ImageFormat,
} from "@/lib/image-formats";
import { downloadBlob, formatBytes, cn } from "@/lib/utils";

interface Converted {
  name: string;
  blob: Blob;
  sourceSize: number;
  sourceFormat: string;
}

/**
 * Universal image converter — any decodable format to any encodable one,
 * in batch, entirely in the browser.
 *
 * Everything runs on a canvas locally, so the images are never uploaded. That
 * matters more than it sounds: the files people convert are frequently ID
 * photos, signatures and screenshots of private documents.
 */
export default function ImageConverter() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [targetId, setTargetId] = React.useState("webp");
  const [quality, setQuality] = React.useState(0.9);
  const [background, setBackground] = React.useState("#ffffff");
  const [available, setAvailable] = React.useState<Set<string> | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [results, setResults] = React.useState<Converted[]>([]);
  const [errors, setErrors] = React.useState<string[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Probe encoder support once — it varies by browser and version.
  React.useEffect(() => {
    let alive = true;
    supportedOutputMimes().then((set) => {
      if (!alive) return;
      setAvailable(set);
      // If the default target isn't encodable here, fall back to something that is.
      setTargetId((current) => {
        const format = OUTPUT_FORMATS.find((f) => f.id === current);
        return format && set.has(format.mime) ? current : "png";
      });
    });
    return () => {
      alive = false;
    };
  }, []);

  const target: ImageFormat =
    OUTPUT_FORMATS.find((f) => f.id === targetId) ?? OUTPUT_FORMATS[0];
  const usable = OUTPUT_FORMATS.filter((f) => !available || available.has(f.mime));

  function addFiles(list: FileList | null) {
    if (!list?.length) return;
    setFiles((prev) => [...prev, ...Array.from(list)]);
    setResults([]);
    setErrors([]);
  }

  async function convertAll() {
    if (!files.length) return;
    setBusy(true);
    setResults([]);
    setErrors([]);

    const out: Converted[] = [];
    const failed: string[] = [];

    for (const file of files) {
      try {
        const img = await loadImageFromFile(file);
        const canvas = drawToCanvas(
          img,
          img.naturalWidth,
          img.naturalHeight,
          // Formats without alpha would otherwise render transparency as black.
          target.opaque ? background : undefined
        );
        const blob = await canvasToBlob(
          canvas,
          target.mime,
          target.lossy ? quality : undefined
        );
        out.push({
          name: `${file.name.replace(/\.[^.]+$/, "")}.${target.extension}`,
          blob,
          sourceSize: file.size,
          sourceFormat: describeSource(file),
        });
      } catch {
        failed.push(file.name);
      }
      // Yield to the event loop so the UI stays responsive on large batches.
      await new Promise((r) => setTimeout(r, 0));
    }

    setResults(out);
    setErrors(failed);
    setBusy(false);
  }

  async function downloadAll() {
    if (results.length === 1) {
      downloadBlob(results[0].blob, results[0].name);
      return;
    }
    const zip = new JSZip();
    results.forEach((r) => zip.file(r.name, r.blob));
    const blob = await zip.generateAsync({ type: "blob" });
    downloadBlob(blob, `converted-${target.extension}.zip`);
  }

  const totalIn = results.reduce((sum, r) => sum + r.sourceSize, 0);
  const totalOut = results.reduce((sum, r) => sum + r.blob.size, 0);
  const delta = totalIn > 0 ? Math.round((1 - totalOut / totalIn) * 100) : 0;

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-10 text-center transition-colors hover:border-primary/50 hover:bg-accent/40"
      >
        <p className="font-medium">Drop images here or click to browse</p>
        <p className="text-sm text-muted-foreground">
          JPG, PNG, WebP, AVIF, GIF, BMP, SVG, ICO — convert as many as you like at once
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={INPUT_ACCEPT}
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <ToolPanel className="space-y-4">
          <div className="space-y-2">
            {files.map((file, i) => (
              <div
                key={`${file.name}-${i}`}
                className="flex items-center gap-3 rounded-lg border border-border bg-background p-2.5"
              >
                <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium">
                  {describeSource(file)}
                </span>
                <span className="flex-1 truncate text-sm">{file.name}</span>
                <span className="text-xs text-muted-foreground">{formatBytes(file.size)}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
          </div>

          <Field label="Convert to">
            <div className="flex flex-wrap gap-2">
              {usable.map((format) => (
                <button
                  key={format.id}
                  type="button"
                  onClick={() => setTargetId(format.id)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                    targetId === format.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:bg-accent"
                  )}
                >
                  {format.label}
                </button>
              ))}
            </div>
          </Field>
          {target.note && <p className="text-xs text-muted-foreground">{target.note}</p>}

          {target.lossy && (
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

          {target.opaque && (
            <Field
              label="Background for transparent areas"
              hint={`${target.label} has no alpha channel, so transparency must be filled with a colour.`}
            >
              <input
                type="color"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                className="h-10 w-20 cursor-pointer rounded border border-input bg-background"
              />
            </Field>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={convertAll} disabled={busy} size="lg">
              {busy ? <Loader2 className="animate-spin" /> : null}
              Convert {files.length > 1 ? `${files.length} images` : "image"} to {target.label}
            </Button>
            {results.length > 0 && (
              <Button variant="outline" size="lg" onClick={downloadAll}>
                <Download />
                {results.length > 1 ? `Download all (.zip)` : "Download"}
              </Button>
            )}
          </div>
        </ToolPanel>
      )}

      {results.length > 0 && (
        <ToolPanel className="space-y-2">
          <p className="text-sm">
            Converted {results.length} {results.length === 1 ? "image" : "images"} —{" "}
            {formatBytes(totalIn)} <ArrowRight className="inline size-3" /> {formatBytes(totalOut)}{" "}
            <span className={delta > 0 ? "text-success" : "text-muted-foreground"}>
              ({delta > 0 ? `${delta}% smaller` : `${Math.abs(delta)}% larger`})
            </span>
          </p>
          {results.map((r) => (
            <div
              key={r.name}
              className="flex items-center gap-3 rounded-lg border border-border bg-background p-2.5"
            >
              <span className="flex-1 truncate text-sm">{r.name}</span>
              <span className="text-xs text-muted-foreground">
                {formatBytes(r.sourceSize)} → {formatBytes(r.blob.size)}
              </span>
              <Button variant="ghost" size="sm" onClick={() => downloadBlob(r.blob, r.name)}>
                <Download className="size-4" />
              </Button>
            </div>
          ))}
        </ToolPanel>
      )}

      {errors.length > 0 && (
        <p className="flex items-start gap-2 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>
            Could not convert: {errors.join(", ")}. The browser may not be able to decode these
            formats — HEIC from iPhones and multi-page TIFF are the usual culprits.
          </span>
        </p>
      )}
    </div>
  );
}
