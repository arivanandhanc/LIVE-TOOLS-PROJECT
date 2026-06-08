"use client";

import * as React from "react";
import * as XLSX from "xlsx";
import { Upload, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/ui/copy-button";
import { ToolPanel, Field } from "@/components/tools/panel";
import { downloadBlob } from "@/lib/utils";

export default function ExcelToCsv() {
  const [error, setError] = React.useState<string | null>(null);
  const [csv, setCsv] = React.useState("");
  const [name, setName] = React.useState("output.csv");
  const [sheets, setSheets] = React.useState<string[]>([]);
  const wbRef = React.useRef<XLSX.WorkBook | null>(null);

  async function onFile(file: File) {
    setError(null);
    setCsv("");
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      wbRef.current = wb;
      setSheets(wb.SheetNames);
      setName(file.name.replace(/\.(xlsx|xls)$/i, "") + ".csv");
      showSheet(wb.SheetNames[0]);
    } catch {
      setError("Couldn't read that spreadsheet. Supported: .xlsx, .xls.");
    }
  }

  function showSheet(sheetName: string) {
    const wb = wbRef.current;
    if (!wb) return;
    setCsv(XLSX.utils.sheet_to_csv(wb.Sheets[sheetName]));
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel className="space-y-4">
        <Field label="Excel file">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background p-8 text-center transition-colors hover:border-primary">
            <Upload className="size-6 text-muted-foreground" />
            <span className="text-sm">Click to choose a .xlsx / .xls file</span>
            <input
              type="file"
              accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
            />
          </label>
        </Field>
        {sheets.length > 1 && (
          <Field label="Sheet">
            <div className="flex flex-wrap gap-2">
              {sheets.map((s) => (
                <Button key={s} type="button" variant="outline" size="sm" onClick={() => showSheet(s)}>
                  {s}
                </Button>
              ))}
            </div>
          </Field>
        )}
        {error && (
          <p className="flex items-start gap-2 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}
          </p>
        )}
      </ToolPanel>

      <ToolPanel className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">CSV output</span>
          <div className="flex gap-2">
            <CopyButton value={csv} />
            <Button variant="outline" size="sm" disabled={!csv} onClick={() => downloadBlob(csv, name, "text/csv")}>
              <Download /> Download
            </Button>
          </div>
        </div>
        <Textarea readOnly value={csv} placeholder="CSV appears here…" className="min-h-64" />
      </ToolPanel>
    </div>
  );
}
