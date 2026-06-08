"use client";

import * as React from "react";
import { PDFDocument } from "pdf-lib";
import { Download, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolPanel, Field } from "@/components/tools/panel";
import { FileInput } from "@/components/tools/file-input";
import { downloadBlob } from "@/lib/utils";

type Pos = "bottom-right" | "bottom-left" | "bottom-center";

export default function SignPdf() {
  const [pdfFile, setPdfFile] = React.useState<File | null>(null);
  const [sigFile, setSigFile] = React.useState<File | null>(null);
  const [pos, setPos] = React.useState<Pos>("bottom-right");
  const [allPages, setAllPages] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [out, setOut] = React.useState<{ name: string; blob: Blob } | null>(null);

  async function run() {
    if (!pdfFile || !sigFile) return;
    setBusy(true);
    setError(null);
    setOut(null);
    try {
      const pdf = await PDFDocument.load(await pdfFile.arrayBuffer(), { ignoreEncryption: true });
      const sigBytes = await sigFile.arrayBuffer();
      const img = sigFile.type.includes("png") ? await pdf.embedPng(sigBytes) : await pdf.embedJpg(sigBytes);
      const targetW = 150;
      const scale = targetW / img.width;
      const w = targetW;
      const h = img.height * scale;
      const pages = pdf.getPages();
      const targets = allPages ? pages : [pages[pages.length - 1]];
      const margin = 36;
      for (const page of targets) {
        const { width } = page.getSize();
        const x = pos === "bottom-left" ? margin : pos === "bottom-center" ? (width - w) / 2 : width - w - margin;
        page.drawImage(img, { x, y: margin, width: w, height: h });
      }
      const bytes = await pdf.save();
      setOut({ name: pdfFile.name.replace(/\.pdf$/i, "") + "-signed.pdf", blob: new Blob([bytes as BlobPart], { type: "application/pdf" }) });
    } catch {
      setError("Couldn't sign this PDF. Use a PNG/JPG signature and an unprotected PDF.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolPanel className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="PDF document"><FileInput accept="application/pdf" fileName={pdfFile?.name} onFile={setPdfFile} hint="Choose a PDF" /></Field>
        <Field label="Signature image (PNG/JPG)"><FileInput accept="image/png,image/jpeg" fileName={sigFile?.name} onFile={setSigFile} hint="Choose a signature" /></Field>
      </div>
      <Field label="Position">
        <div className="flex flex-wrap gap-2">
          {(["bottom-left", "bottom-center", "bottom-right"] as Pos[]).map((p) => (
            <Button key={p} type="button" variant={pos === p ? "default" : "outline"} size="sm" onClick={() => setPos(p)}>
              {p.replace("-", " ")}
            </Button>
          ))}
        </div>
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={allPages} onChange={(e) => setAllPages(e.target.checked)} /> Place on every page (default: last page only)
      </label>
      <Button onClick={run} disabled={!pdfFile || !sigFile || busy} className="w-full">
        {busy ? <Loader2 className="animate-spin" /> : null} Sign PDF
      </Button>
      {error && <p className="flex items-start gap-2 text-sm text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}</p>}
      {out && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-success/40 bg-success/5 p-4">
          <span className="text-sm">{out.name}</span>
          <Button size="sm" onClick={() => downloadBlob(out.blob, out.name)}><Download /> Download</Button>
        </div>
      )}
      <p className="text-xs text-muted-foreground">Runs in your browser — nothing is uploaded.</p>
    </ToolPanel>
  );
}
