"use client";

import { Transformer } from "@/components/tools/transformer";

/** Minimal quote-aware CSV row parser. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field); field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

const run = (s: string) => {
  const rows = parseCsv(s);
  if (rows.length < 1) throw new Error("No CSV rows found.");
  const cols = Math.max(...rows.map((r) => r.length));
  const pad = (r: string[]) =>
    Array.from({ length: cols }, (_, i) => (r[i] ?? "").replace(/\|/g, "\\|").trim());
  const [header, ...body] = rows;
  const lines = [
    `| ${pad(header).join(" | ")} |`,
    `| ${Array(cols).fill("---").join(" | ")} |`,
    ...body.map((r) => `| ${pad(r).join(" | ")} |`),
  ];
  return lines.join("\n");
};

export default function CsvToMarkdown() {
  return (
    <Transformer
      inputLabel="CSV"
      outputLabel="Markdown table"
      inputPlaceholder={"name,role\nAda,Engineer\nGrace,Admiral"}
      live
      downloadName="table.md"
      downloadMime="text/markdown"
      actions={[{ label: "Convert to Markdown", run }]}
    />
  );
}
