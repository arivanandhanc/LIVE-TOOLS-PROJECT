"use client";

import { Transformer } from "@/components/tools/transformer";

// Minimal CSV row parser that respects double-quoted fields.
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  const s = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function toCsv(rows: string[][]): string {
  return rows
    .map((r) => r.map((c) => (/[",\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(","))
    .join("\n");
}

function tidy(input: string): string {
  const rows = parseCsv(input)
    .map((r) => r.map((c) => c.trim().replace(/\s+/g, " ")))
    .filter((r) => r.some((c) => c !== ""));
  return toCsv(rows);
}

function titleCaseHeaders(input: string): string {
  const rows = parseCsv(input).filter((r) => r.some((c) => c !== ""));
  if (rows.length) {
    rows[0] = rows[0].map((h) =>
      h.trim().replace(/[_-]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())
    );
  }
  return toCsv(rows);
}

export default function DataFormatter() {
  return (
    <Transformer
      inputLabel="CSV data"
      outputLabel="Formatted CSV"
      inputPlaceholder={"name , AGE\n  Ada , 36 \n\n Alan,41"}
      downloadName="formatted.csv"
      downloadMime="text/csv"
      sampleInput={"first_name,last_name , age\n  Ada , Lovelace , 36 \n\nAlan , Turing,41 "}
      actions={[
        { label: "Trim & tidy", run: tidy },
        { label: "Title-case headers", run: titleCaseHeaders, variant: "outline" },
      ]}
    />
  );
}
