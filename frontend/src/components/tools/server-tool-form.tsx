"use client";

import * as React from "react";
import { UploadCloud, X, Loader2, Download, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolPanel, Field } from "@/components/tools/panel";
import { getServerToolConfig } from "@/lib/tools/server-tools";
import { siteConfig } from "@/lib/site";
import { cn, formatBytes } from "@/lib/utils";

interface ResultState {
  filename: string;
  size: number;
  downloadUrl: string;
}

export function ServerToolForm({ slug }: { slug: string }) {
  const config = getServerToolConfig(slug);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [files, setFiles] = React.useState<File[]>([]);
  const [params, setParams] = React.useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    config?.params.forEach((p) => p.defaultValue && (init[p.name] = p.defaultValue));
    return init;
  });
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<ResultState | null>(null);
  const [dragging, setDragging] = React.useState(false);

  if (!config) return null;

  function addFiles(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list);
    setFiles((prev) => (config!.multiple ? [...prev, ...incoming] : incoming.slice(0, 1)));
    setResult(null);
    setError(null);
  }

  async function submit() {
    if (files.length < config!.minFiles) {
      setError(`Please add at least ${config!.minFiles} file${config!.minFiles > 1 ? "s" : ""}.`);
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append("files", f));
      if (Object.keys(params).length) fd.append("params", JSON.stringify(params));

      const res = await fetch(`${siteConfig.apiUrl}/api/tools/${slug}`, {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Processing failed.");
      setResult(data.file);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message === "Failed to fetch"
            ? "Couldn't reach the processing server. Is the backend running?"
            : err.message
          : "Something went wrong."
      );
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
        <p className="font-medium">
          {config.multiple ? "Drop files here or click to add" : "Drop a file here or click to browse"}
        </p>
        <p className="text-sm text-muted-foreground">
          {config.accept.includes("pdf") ? "PDF" : "JPG / PNG"} · up to 50 MB each
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={config.accept}
          multiple={config.multiple}
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <ToolPanel className="space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-background p-2.5">
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
        </ToolPanel>
      )}

      {config.params.length > 0 && files.length > 0 && (
        <ToolPanel className="grid gap-4 sm:grid-cols-2">
          {config.params.map((p) => (
            <Field key={p.name} label={p.label} hint={p.hint}>
              {p.type === "select" ? (
                <select
                  value={params[p.name] ?? p.defaultValue ?? ""}
                  onChange={(e) => setParams((s) => ({ ...s, [p.name]: e.target.value }))}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                >
                  {p.options?.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ) : (
                <Input
                  value={params[p.name] ?? ""}
                  placeholder={p.placeholder}
                  onChange={(e) => setParams((s) => ({ ...s, [p.name]: e.target.value }))}
                />
              )}
            </Field>
          ))}
        </ToolPanel>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={submit} disabled={busy || files.length === 0} size="lg">
          {busy ? <Loader2 className="animate-spin" /> : null}
          {config.cta}
        </Button>
        {result && (
          <Button asChild variant="outline" size="lg">
            <a href={result.downloadUrl} download>
              <Download /> Download {result.filename}
            </a>
          </Button>
        )}
      </div>

      {result && (
        <p className="flex items-center gap-2 text-sm text-success">
          <CheckCircle2 className="size-4" /> Done — {formatBytes(result.size)}. Your file is ready and will
          auto-delete after the retention window.
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
