"use client";

import { Transformer } from "@/components/tools/transformer";

function csvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

function xmlToCsv(xml: string): string {
  const doc = new DOMParser().parseFromString(xml.trim(), "application/xml");
  if (doc.querySelector("parsererror")) throw new Error("Invalid XML.");
  // Treat the repeated children of the root as rows.
  const records = Array.from(doc.documentElement.children);
  if (records.length === 0) throw new Error("No records found under the root element.");

  const columns: string[] = [];
  const rows = records.map((rec) => {
    const row: Record<string, string> = {};
    for (const field of Array.from(rec.children)) {
      if (!columns.includes(field.tagName)) columns.push(field.tagName);
      row[field.tagName] = field.textContent?.trim() ?? "";
    }
    // Element with no children but text → single "value" column.
    if (rec.children.length === 0) {
      if (!columns.includes("value")) columns.push("value");
      row.value = rec.textContent?.trim() ?? "";
    }
    return row;
  });

  const header = columns.map(csvCell).join(",");
  const body = rows.map((r) => columns.map((c) => csvCell(r[c] ?? "")).join(",")).join("\n");
  return `${header}\n${body}`;
}

export default function XmlToCsv() {
  return (
    <Transformer
      inputLabel="XML"
      outputLabel="CSV"
      inputPlaceholder="<rows><row><id>1</id><name>Ada</name></row></rows>"
      downloadName="data.csv"
      downloadMime="text/csv"
      sampleInput={"<users><user><id>1</id><name>Ada</name></user><user><id>2</id><name>Linus</name></user></users>"}
      actions={[{ label: "Convert to CSV", run: xmlToCsv }]}
    />
  );
}
