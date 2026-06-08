"use client";

import * as React from "react";
import JSZip from "jszip";
import { Download, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolPanel, Field } from "@/components/tools/panel";
import { FileInput } from "@/components/tools/file-input";
import { downloadBlob } from "@/lib/utils";
import { pdfjsLib } from "@/lib/pdfjs";

export default function PdfToJpg() {
  const [file, setFile] = React.useState<File | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [out, setOut] = React.useState<{ name: string; blob: Blob; count: number } | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setOut(null);
    try {
      const data = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data }).promise;
      const base = file.name.replace(/\.pdf$/i, "");
      const images: { name: string; blob: Blob }[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress(`Rendering page ${i} of ${pdf.numPages}…`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvas, canvasContext: ctx, viewport }).promise;
        const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), "image/jpeg", 0.92));
        images.push({ name: `${base}-page-${i}.jpg`, blob });
      }

      if (images.length === 1) {
        setOut({ name: images[0].name, blob: images[0].blob, count: 1 });
      } else {
        setProgress("Zipping…");
        const zip = new JSZip();
        images.forEach((im) => zip.file(im.name, im.blob));
        const zipBlob = await zip.generateAsync({ type: "blob" });
        setOut({ name: `${base}-images.zip`, blob: zipBlob, count: images.length });
      }
    } catch {
      setError("Couldn't render this PDF. It may be corrupted or password-protected.");
    } finally {
      setBusy(false);
      setProgress("");
    }
  }

  return (
    <ToolPanel className="space-y-4">
      <Field label="PDF file"><FileInput accept="application/pdf" fileName={file?.name} onFile={setFile} hint="Choose a PDF" /></Field>
      <Button onClick={run} disabled={!file || busy} className="w-full">
        {busy ? <Loader2 className="animate-spin" /> : null} {busy ? progress || "Working…" : "Convert to JPG"}
      </Button>
      {error && <p className="flex items-start gap-2 text-sm text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}</p>}
      {out && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-success/40 bg-success/5 p-4">
          <span className="text-sm">{out.count > 1 ? `${out.count} images (zip)` : out.name}</span>
          <Button size="sm" onClick={() => downloadBlob(out.blob, out.name)}><Download /> Download</Button>
        </div>
      )}
      <p className="text-xs text-muted-foreground">Each page becomes a JPG. Runs in your browser — nothing is uploaded.</p>
    </ToolPanel>
  );
}
