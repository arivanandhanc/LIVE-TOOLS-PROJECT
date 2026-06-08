"use client";

import * as React from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { Download, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolPanel, Field } from "@/components/tools/panel";
import { FileInput } from "@/components/tools/file-input";
import { downloadBlob } from "@/lib/utils";

export default function AddHeaderFooter() {
  const [file, setFile] = React.useState<File | null>(null);
  const [header, setHeader] = React.useState("");
  const [footer, setFooter] = React.useState("");
  const [pageNumbers, setPageNumbers] = React.useState(true);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [out, setOut] = React.useState<{ name: string; blob: Blob } | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setOut(null);
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();
      pages.forEach((page, i) => {
        const { width, height } = page.getSize();
        const draw = (text: string, y: number) => {
          if (!text) return;
          const size = 10;
          const w = font.widthOfTextAtSize(text, size);
          page.drawText(text, { x: (width - w) / 2, y, size, font, color: rgb(0.3, 0.3, 0.3) });
        };
        draw(header, height - 28);
        draw(footer, 18);
        if (pageNumbers) {
          const label = `${i + 1} / ${pages.length}`;
          const w = font.widthOfTextAtSize(label, 9);
          page.drawText(label, { x: width - w - 24, y: 18, size: 9, font, color: rgb(0.4, 0.4, 0.4) });
        }
      });
      const bytes = await pdf.save();
      setOut({ name: file.name.replace(/\.pdf$/i, "") + "-labeled.pdf", blob: new Blob([bytes as BlobPart], { type: "application/pdf" }) });
    } catch {
      setError("Couldn't process this PDF. It may be corrupted or password-protected.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolPanel className="space-y-4">
      <Field label="PDF file"><FileInput accept="application/pdf" fileName={file?.name} onFile={setFile} hint="Choose a PDF" /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Header text (optional)"><Input value={header} onChange={(e) => setHeader(e.target.value)} placeholder="Confidential" /></Field>
        <Field label="Footer text (optional)"><Input value={footer} onChange={(e) => setFooter(e.target.value)} placeholder="© 2026 My Company" /></Field>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={pageNumbers} onChange={(e) => setPageNumbers(e.target.checked)} /> Add page numbers
      </label>
      <Button onClick={run} disabled={!file || busy} className="w-full">
        {busy ? <Loader2 className="animate-spin" /> : null} Apply
      </Button>
      {error && <p className="flex items-start gap-2 text-sm text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}</p>}
      {out && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-success/40 bg-success/5 p-4">
          <span className="text-sm">{out.name}</span>
          <Button size="sm" onClick={() => downloadBlob(out.blob, out.name)}><Download /> Download</Button>
        </div>
      )}
      <p className="text-xs text-muted-foreground">Runs in your browser — your PDF is never uploaded.</p>
    </ToolPanel>
  );
}
