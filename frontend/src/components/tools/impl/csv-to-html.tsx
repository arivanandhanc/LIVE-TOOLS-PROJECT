"use client";

import { Transformer } from "@/components/tools/transformer";

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

const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const run = (s: string) => {
  const rows = parseCsv(s);
  if (!rows.length) throw new Error("No CSV rows found.");
  const [header, ...body] = rows;
  const head = `  <thead>\n    <tr>${header.map((c) => `<th>${esc(c.trim())}</th>`).join("")}</tr>\n  </thead>`;
  const tbody = `  <tbody>\n${body
    .map((r) => `    <tr>${r.map((c) => `<td>${esc(c.trim())}</td>`).join("")}</tr>`)
    .join("\n")}\n  </tbody>`;
  return `<table>\n${head}\n${tbody}\n</table>`;
};

export default function CsvToHtml() {
  return (
    <Transformer
      inputLabel="CSV"
      outputLabel="HTML table"
      inputPlaceholder={"name,role\nAda,Engineer\nGrace,Admiral"}
      live
      downloadName="table.html"
      downloadMime="text/html"
      actions={[{ label: "Convert to HTML", run }]}
    />
  );
}
