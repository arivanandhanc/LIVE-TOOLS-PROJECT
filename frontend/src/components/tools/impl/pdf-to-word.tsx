"use client";

import * as React from "react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { Download, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolPanel, Field } from "@/components/tools/panel";
import { FileInput } from "@/components/tools/file-input";
import { downloadBlob } from "@/lib/utils";
import { pdfjsLib } from "@/lib/pdfjs";

interface TextItem { str: string; hasEOL?: boolean }

export default function PdfToWord() {
  const [file, setFile] = React.useState<File | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [out, setOut] = React.useState<{ name: string; blob: Blob } | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setOut(null);
    try {
      const data = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data }).promise;
      const paragraphs: Paragraph[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress(`Extracting page ${i} of ${pdf.numPages}…`);
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        let line = "";
        for (const raw of content.items as TextItem[]) {
          if (typeof raw.str !== "string") continue;
          line += raw.str;
          if (raw.hasEOL) {
            paragraphs.push(new Paragraph({ children: [new TextRun(line)] }));
            line = "";
          }
        }
        if (line.trim()) paragraphs.push(new Paragraph({ children: [new TextRun(line)] }));
        if (i < pdf.numPages) paragraphs.push(new Paragraph({ children: [new TextRun("")], pageBreakBefore: true }));
      }

      if (!paragraphs.length) throw new Error("no text");
      const doc = new Document({ sections: [{ children: paragraphs }] });
      const blob = await Packer.toBlob(doc);
      setOut({ name: file.name.replace(/\.pdf$/i, "") + ".docx", blob });
    } catch {
      setError("Couldn't extract text. Scanned/image-only PDFs have no selectable text — try the OCR tool instead.");
    } finally {
      setBusy(false);
      setProgress("");
    }
  }

  return (
    <ToolPanel className="space-y-4">
      <Field label="PDF file"><FileInput accept="application/pdf" fileName={file?.name} onFile={setFile} hint="Choose a PDF" /></Field>
      <Button onClick={run} disabled={!file || busy} className="w-full">
        {busy ? <Loader2 className="animate-spin" /> : null} {busy ? progress || "Working…" : "Convert to Word"}
      </Button>
      {error && <p className="flex items-start gap-2 text-sm text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}</p>}
      {out && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-success/40 bg-success/5 p-4">
          <span className="text-sm">{out.name}</span>
          <Button size="sm" onClick={() => downloadBlob(out.blob, out.name)}><Download /> Download .docx</Button>
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Extracts the text into an editable Word document (layout is simplified). Runs in your browser — nothing is uploaded.
      </p>
    </ToolPanel>
  );
}
