"use client";

import * as React from "react";
import { UploadCloud, X, Loader2, Download, CheckCircle2, AlertCircle, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolPanel } from "@/components/tools/panel";
import { cn, downloadBlob, formatBytes } from "@/lib/utils";

export interface FileToolResult {
  blob: Blob;
  filename: string;
}

interface FileToolProps {
  accept: string;
  /** Allow selecting/queuing more than one file. */
  multiple?: boolean;
  /** Allow drag-to-reorder of the queued files (e.g. Merge PDF). */
  reorder?: boolean;
  minFiles?: number;
  cta: string;
  hint?: string;
  /** Extra controls rendered above the action button. */
  controls?: React.ReactNode;
  /** Runs entirely in the browser; return the output file to offer for download. */
  process: (files: File[]) => Promise<FileToolResult>;
}

export function FileTool({
  accept,
  multiple = false,
  reorder = false,
  minFiles = 1,
  cta,
  hint,
  controls,
  process,
}: FileToolProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [files, setFiles] = React.useState<File[]>([]);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<FileToolResult | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const dragIndex = React.useRef<number | null>(null);

  function addFiles(list: FileList | null) {
    if (!list?.length) return;
    const incoming = Array.from(list);
    setFiles((prev) => (multiple ? [...prev, ...incoming] : incoming.slice(0, 1)));
    setResult(null);
    setError(null);
  }

  function removeAt(i: number) {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    setResult(null);
  }

  function moveItem(from: number, to: number) {
    setFiles((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setResult(null);
  }

  async function run() {
    if (files.length < minFiles) {
      setError(`Please add at least ${minFiles} file${minFiles > 1 ? "s" : ""}.`);
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const out = await process(files);
      setResult(out);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not process the file.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition-colors",
          dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-accent/40"
        )}
      >
        <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
          <UploadCloud className="size-6" />
        </span>
        <div>
          <p className="font-medium">
            Drop {multiple ? "files" : "a file"} here or click to browse
          </p>
          {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
        />
      </div>

      {files.length > 0 && (
        <ToolPanel className="space-y-2">
          <ul className="space-y-2">
            {files.map((file, i) => (
              <li
                key={`${file.name}-${i}`}
                draggable={reorder}
                onDragStart={() => (dragIndex.current = i)}
                onDragOver={(e) => reorder && e.preventDefault()}
                onDrop={() => {
                  if (reorder && dragIndex.current !== null && dragIndex.current !== i) {
                    moveItem(dragIndex.current, i);
                  }
                  dragIndex.current = null;
                }}
                className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                {reorder && <GripVertical className="size-4 shrink-0 cursor-grab text-muted-foreground" />}
                <span className="min-w-0 flex-1 truncate">{file.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{formatBytes(file.size)}</span>
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="shrink-0 rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </ToolPanel>
      )}

      {files.length > 0 && controls && <ToolPanel className="space-y-4">{controls}</ToolPanel>}

      {files.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={run} disabled={busy}>
            {busy ? <Loader2 className="animate-spin" /> : null} {cta}
          </Button>
          {result && (
            <Button
              variant="outline"
              className="ml-auto"
              onClick={() => downloadBlob(result.blob, result.filename, result.blob.type)}
            >
              <Download /> Download
            </Button>
          )}
        </div>
      )}

      {result && (
        <p className="flex items-center gap-2 text-sm text-success">
          <CheckCircle2 className="size-4 shrink-0" />
          Ready — {result.filename} ({formatBytes(result.blob.size)}). Processed entirely in your browser.
        </p>
      )}
      {error && (
        <p className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}
