"use client";

import * as React from "react";
import * as XLSX from "xlsx";
import { Upload, Download, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolPanel, Field } from "@/components/tools/panel";
import { downloadBlob } from "@/lib/utils";

export default function CsvToExcel() {
  const [error, setError] = React.useState<string | null>(null);
  const [ready, setReady] = React.useState<{ name: string; blob: Blob } | null>(null);

  async function onFile(file: File) {
    setError(null);
    setReady(null);
    try {
      const text = await file.text();
      const wb = XLSX.read(text, { type: "string" });
      const out = XLSX.write(wb, { type: "array", bookType: "xlsx" }) as ArrayBuffer;
      const blob = new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      setReady({ name: file.name.replace(/\.csv$/i, "") + ".xlsx", blob });
    } catch {
      setError("Couldn't read that CSV. Make sure it's a valid .csv file.");
    }
  }

  return (
    <ToolPanel className="space-y-4">
      <Field label="CSV file">
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background p-8 text-center transition-colors hover:border-primary">
          <Upload className="size-6 text-muted-foreground" />
          <span className="text-sm">Click to choose a .csv file</span>
          <input
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
          />
        </label>
      </Field>

      {error && (
        <p className="flex items-start gap-2 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}
        </p>
      )}

      {ready && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-success/40 bg-success/5 p-4">
          <span className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="size-4 text-success" /> {ready.name} is ready
          </span>
          <Button size="sm" onClick={() => downloadBlob(ready.blob, ready.name)}>
            <Download /> Download Excel
          </Button>
        </div>
      )}
      <p className="text-xs text-muted-foreground">Runs entirely in your browser — your file is never uploaded.</p>
    </ToolPanel>
  );
}
