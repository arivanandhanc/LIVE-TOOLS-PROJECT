"use client";

import * as React from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { RotateCw, Trash2, ChevronLeft, ChevronRight, Download, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolPanel, Field } from "@/components/tools/panel";
import { FileInput } from "@/components/tools/file-input";
import { downloadBlob } from "@/lib/utils";

interface PageItem {
  uid: number;
  srcIndex: number; // original 0-based page index
  rotation: number; // user-applied, 0/90/180/270
  thumb: string;
}

export default function OrganizePages() {
  const [name, setName] = React.useState("document.pdf");
  const [pages, setPages] = React.useState<PageItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const bytesRef = React.useRef<Uint8Array | null>(null);

  async function onFile(file: File) {
    setError(null);
    setPages([]);
    setLoading(true);
    setName(file.name);
    try {
      const buf = new Uint8Array(await file.arrayBuffer());
      bytesRef.current = buf;
      const { pdfjsLib } = await import("@/lib/pdfjs");
      const pdf = await pdfjsLib.getDocument({ data: buf.slice() }).promise;
      const items: PageItem[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.4 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvas, canvasContext: ctx, viewport }).promise;
        items.push({ uid: i, srcIndex: i - 1, rotation: 0, thumb: canvas.toDataURL("image/jpeg", 0.7) });
      }
      setPages(items);
    } catch {
      setError("Couldn't open this PDF. It may be corrupted or password-protected.");
    } finally {
      setLoading(false);
    }
  }

  const move = (idx: number, dir: -1 | 1) =>
    setPages((p) => {
      const j = idx + dir;
      if (j < 0 || j >= p.length) return p;
      const next = [...p];
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
  const rotate = (idx: number) => setPages((p) => p.map((it, i) => (i === idx ? { ...it, rotation: (it.rotation + 90) % 360 } : it)));
  const remove = (idx: number) => setPages((p) => p.filter((_, i) => i !== idx));

  async function exportPdf() {
    if (!bytesRef.current || !pages.length) return;
    setBusy(true);
    setError(null);
    try {
      const src = await PDFDocument.load(bytesRef.current, { ignoreEncryption: true });
      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, pages.map((p) => p.srcIndex));
      copied.forEach((page, i) => {
        const base = page.getRotation().angle;
        page.setRotation(degrees((base + pages[i].rotation) % 360));
        out.addPage(page);
      });
      const bytes = await out.save();
      downloadBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }), name.replace(/\.pdf$/i, "") + "-organized.pdf");
    } catch {
      setError("Couldn't export the PDF. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolPanel className="space-y-4">
      {pages.length === 0 ? (
        <Field label="PDF file"><FileInput accept="application/pdf" onFile={onFile} hint={loading ? "Loading pages…" : "Choose a PDF to organize"} /></Field>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{pages.length} page(s) — reorder, rotate or delete, then export.</p>
            <Button onClick={exportPdf} disabled={busy}>
              {busy ? <Loader2 className="animate-spin" /> : <Download />} Export PDF
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {pages.map((p, i) => (
              <div key={p.uid} className="flex flex-col gap-2 rounded-lg border border-border bg-background p-2">
                <div className="flex h-40 items-center justify-center overflow-hidden rounded bg-muted/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.thumb} alt={`Page ${i + 1}`} className="max-h-full max-w-full transition-transform" style={{ transform: `rotate(${p.rotation}deg)` }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">#{i + 1}</span>
                  <div className="flex gap-0.5">
                    <Button variant="ghost" size="icon" className="size-7" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move left"><ChevronLeft className="size-4" /></Button>
                    <Button variant="ghost" size="icon" className="size-7" onClick={() => move(i, 1)} disabled={i === pages.length - 1} aria-label="Move right"><ChevronRight className="size-4" /></Button>
                    <Button variant="ghost" size="icon" className="size-7" onClick={() => rotate(i)} aria-label="Rotate"><RotateCw className="size-4" /></Button>
                    <Button variant="ghost" size="icon" className="size-7 text-destructive" onClick={() => remove(i)} aria-label="Delete"><Trash2 className="size-4" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {error && <p className="flex items-start gap-2 text-sm text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}</p>}
      <p className="text-xs text-muted-foreground">Runs entirely in your browser — your PDF is never uploaded.</p>
    </ToolPanel>
  );
}
