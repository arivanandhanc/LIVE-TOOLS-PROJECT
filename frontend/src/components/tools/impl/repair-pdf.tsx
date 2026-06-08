"use client";

import * as React from "react";
import { PDFDocument } from "pdf-lib";
import { Download, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolPanel, Field } from "@/components/tools/panel";
import { FileInput } from "@/components/tools/file-input";
import { downloadBlob } from "@/lib/utils";

export default function RepairPdf() {
  const [file, setFile] = React.useState<File | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [out, setOut] = React.useState<{ name: string; blob: Blob; pages: number } | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setOut(null);
    try {
      // Re-parse and re-serialize: rebuilds the xref table and object streams,
      // which fixes many "damaged"/unreadable PDFs.
      const pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true, throwOnInvalidObject: false });
      const bytes = await pdf.save({ useObjectStreams: true });
      setOut({
        name: file.name.replace(/\.pdf$/i, "") + "-repaired.pdf",
        blob: new Blob([bytes as BlobPart], { type: "application/pdf" }),
        pages: pdf.getPageCount(),
      });
    } catch {
      setError("This PDF is too damaged to recover automatically, or it's password-protected.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolPanel className="space-y-4">
      <Field label="Damaged PDF"><FileInput accept="application/pdf" fileName={file?.name} onFile={setFile} hint="Choose a PDF to repair" /></Field>
      <Button onClick={run} disabled={!file || busy} className="w-full">
        {busy ? <Loader2 className="animate-spin" /> : null} Repair PDF
      </Button>
      {error && <p className="flex items-start gap-2 text-sm text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}</p>}
      {out && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-success/40 bg-success/5 p-4">
          <span className="flex items-center gap-2 text-sm"><CheckCircle2 className="size-4 text-success" /> Rebuilt {out.pages} page(s)</span>
          <Button size="sm" onClick={() => downloadBlob(out.blob, out.name)}><Download /> Download</Button>
        </div>
      )}
      <p className="text-xs text-muted-foreground">Rebuilds the PDF structure in your browser. Heavily corrupted or encrypted files may not be recoverable.</p>
    </ToolPanel>
  );
}
