"use client";

import * as React from "react";
import * as XLSX from "xlsx";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { Download, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolPanel, Field } from "@/components/tools/panel";
import { FileInput } from "@/components/tools/file-input";
import { downloadBlob } from "@/lib/utils";

export default function ExcelToPdf() {
  const [file, setFile] = React.useState<File | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [out, setOut] = React.useState<{ name: string; blob: Blob } | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setOut(null);
    try {
      const wb = XLSX.read(await file.arrayBuffer(), { type: "array" });
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
      const size = 9;
      const pageW = 842, pageH = 595, margin = 32, lineH = 14; // A4 landscape

      for (const sheetName of wb.SheetNames) {
        const rows = XLSX.utils.sheet_to_json<string[]>(wb.Sheets[sheetName], { header: 1, blankrows: false, defval: "" });
        if (!rows.length) continue;
        const colCount = Math.max(...rows.map((r) => r.length));
        const colW = (pageW - margin * 2) / Math.max(colCount, 1);
        let page = pdf.addPage([pageW, pageH]);
        let y = pageH - margin;
        page.drawText(sheetName, { x: margin, y, size: 12, font: bold });
        y -= lineH * 1.6;

        rows.forEach((row, ri) => {
          if (y < margin) { page = pdf.addPage([pageW, pageH]); y = pageH - margin; }
          const f = ri === 0 ? bold : font;
          for (let c = 0; c < colCount; c++) {
            let text = String(row[c] ?? "");
            const maxChars = Math.max(1, Math.floor(colW / (size * 0.5)));
            if (text.length > maxChars) text = text.slice(0, maxChars - 1) + "…";
            page.drawText(text, { x: margin + c * colW + 2, y, size, font: f, color: rgb(0.1, 0.1, 0.1) });
          }
          y -= lineH;
        });
      }
      if (pdf.getPageCount() === 0) throw new Error("empty");
      const bytes = await pdf.save();
      setOut({ name: file.name.replace(/\.(xlsx|xls)$/i, "") + ".pdf", blob: new Blob([bytes as BlobPart], { type: "application/pdf" }) });
    } catch {
      setError("Couldn't convert this spreadsheet. Supported: .xlsx, .xls with tabular data.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolPanel className="space-y-4">
      <Field label="Excel file"><FileInput accept=".xlsx,.xls" fileName={file?.name} onFile={setFile} hint="Choose an .xlsx / .xls file" /></Field>
      <Button onClick={run} disabled={!file || busy} className="w-full">
        {busy ? <Loader2 className="animate-spin" /> : null} Convert to PDF
      </Button>
      {error && <p className="flex items-start gap-2 text-sm text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}</p>}
      {out && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-success/40 bg-success/5 p-4">
          <span className="text-sm">{out.name}</span>
          <Button size="sm" onClick={() => downloadBlob(out.blob, out.name)}><Download /> Download PDF</Button>
        </div>
      )}
      <p className="text-xs text-muted-foreground">Renders each sheet as a table. Runs in your browser — nothing is uploaded.</p>
    </ToolPanel>
  );
}
