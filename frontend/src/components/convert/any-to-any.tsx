"use client";

import * as React from "react";
import { Loader2, Download, X, ArrowRight, Laptop, Cloud, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { detectFormat, getFormat, FORMATS, INPUT_ACCEPT } from "@/lib/convert/formats";
import { targetsFrom } from "@/lib/convert/graph";
import { describe, runConversion, prewarmServer, ConversionError } from "@/lib/convert/run";
import { downloadBlob, formatBytes, cn } from "@/lib/utils";

/**
 * The universal converter, as it appears on the home page.
 *
 * Deliberately one file in, one target out. The existing per-tool pages already
 * do batches and options well; what this adds is the question people actually
 * arrive with — "I have this thing, can you make it that thing?" — answered
 * without them having to know which of 157 tools to look for first.
 *
 * Every target is labelled with where the work happens before it is clicked.
 * That is the honest ordering: whether a file leaves your device is something
 * to be told beforehand, not disclosed in a receipt afterwards.
 */

interface Result {
  blob: Blob;
  filename: string;
  where: "device" | "server";
  ms: number;
  sourceSize: number;
}

export function AnyToAny() {
  const [file, setFile] = React.useState<File | null>(null);
  const [target, setTarget] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [result, setResult] = React.useState<Result | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const source = file ? detectFormat(file) : null;

  /**
   * Targets are computed from the routing graph, then filtered to the ones
   * actually implemented. Offering a route the executor would refuse turns a
   * confident click into an error message, which is worse than a shorter list.
   */
  const options = React.useMemo(() => {
    if (!source) return [];
    return targetsFrom(source.id)
      .map((id) => ({ id, format: getFormat(id)!, info: describe(source.id, id) }))
      .filter((o) => o.info?.implemented)
      .sort((a, b) => {
        // On-device first: faster, private, and free.
        if (a.info!.where !== b.info!.where) return a.info!.where === "device" ? -1 : 1;
        return a.format.label.localeCompare(b.format.label);
      });
  }, [source]);

  /**
   * Start waking the server as soon as we know a server route is even possible,
   * rather than when one is chosen. The user spends a few seconds reading the
   * options; the cold start can happen inside those seconds instead of after
   * them.
   */
  React.useEffect(() => {
    if (options.some((o) => o.info!.where === "server")) prewarmServer();
  }, [options]);

  function accept(list: FileList | null) {
    const next = list?.[0];
    if (!next) return;
    setFile(next);
    setResult(null);
    setError(null);
    const detected = detectFormat(next);
    setTarget(detected ? null : null);
    if (!detected) {
      setError(`We can't read .${next.name.split(".").pop()} files yet.`);
    }
  }

  async function convert(targetId: string) {
    if (!file) return;
    setTarget(targetId);
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const out = await runConversion(file, targetId);
      setResult({ ...out, sourceSize: file.size });
    } catch (err) {
      setError(
        err instanceof ConversionError ? err.message : "Something went wrong converting that file."
      );
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setFile(null);
    setTarget(null);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      {!file ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            accept(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-10 text-center transition-colors",
            dragging
              ? "border-primary bg-accent/60"
              : "border-border hover:border-primary/50 hover:bg-accent/40"
          )}
        >
          <p className="text-lg font-medium">Drop any file here</p>
          <p className="text-sm text-muted-foreground">
            We&apos;ll work out what it is and show you everything it can become
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            PDF, Word, Excel, PowerPoint, images, CSV, Markdown and more
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={INPUT_ACCEPT}
            className="hidden"
            onChange={(e) => accept(e.target.files)}
          />
        </div>
      ) : (
        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          {/* What we found */}
          <div className="flex items-center gap-3">
            <span className="rounded bg-muted px-2 py-0.5 text-xs font-semibold uppercase">
              {source?.label ?? "unknown"}
            </span>
            <span className="flex-1 truncate text-sm font-medium">{file.name}</span>
            <span className="text-xs text-muted-foreground">{formatBytes(file.size)}</span>
            <Button variant="ghost" size="icon" className="size-7" onClick={reset} aria-label="Remove file">
              <X className="size-4" />
            </Button>
          </div>

          {source && !result && (
            <>
              <p className="text-sm text-muted-foreground">
                Convert to{options.length ? ` — ${options.length} options` : ""}:
              </p>
              <div className="flex flex-wrap gap-2">
                {options.map(({ id, format, info }) => (
                  <button
                    key={id}
                    type="button"
                    disabled={busy}
                    onClick={() => convert(id)}
                    className={cn(
                      "group flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm transition-colors",
                      "hover:border-primary hover:bg-accent disabled:opacity-50",
                      busy && target === id && "border-primary bg-accent"
                    )}
                  >
                    {busy && target === id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : info!.where === "device" ? (
                      <Laptop className="size-3.5 text-muted-foreground" />
                    ) : (
                      <Cloud className="size-3.5 text-muted-foreground" />
                    )}
                    <span className="font-medium">{format.label}</span>
                  </button>
                ))}
              </div>

              {/* The tag, explained once rather than repeated on every button. */}
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Laptop className="size-3" /> On your device — nothing is uploaded
                </span>
                <span className="flex items-center gap-1.5">
                  <Cloud className="size-3" /> On our server — file is uploaded, then deleted
                </span>
              </div>
            </>
          )}

          {busy && (
            <p className="text-sm text-muted-foreground">
              Converting… the first server conversion can take ~25 seconds while it wakes up.
            </p>
          )}

          {result && (
            <div className="space-y-3 rounded-lg border border-border bg-background p-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">{source?.label}</span>
                <ArrowRight className="size-4 text-muted-foreground" />
                <span className="font-medium">{getFormat(target!)?.label}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {result.where === "device" ? "on your device" : "on our server"} ·{" "}
                  {(result.ms / 1000).toFixed(1)}s
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex-1 truncate text-sm">{result.filename}</span>
                <span className="text-xs text-muted-foreground">{formatBytes(result.blob.size)}</span>
                <Button size="sm" onClick={() => downloadBlob(result.blob, result.filename)}>
                  <Download className="mr-1.5 size-4" />
                  Download
                </Button>
              </div>
              <Button variant="ghost" size="sm" onClick={reset}>
                Convert another file
              </Button>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}

      <p className="mt-3 text-center text-xs text-muted-foreground">
        {FORMATS.length} formats supported
      </p>
    </div>
  );
}
