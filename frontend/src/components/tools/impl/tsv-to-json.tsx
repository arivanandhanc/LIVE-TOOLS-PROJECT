"use client";

import { Transformer } from "@/components/tools/transformer";

const run = (s: string) => {
  const lines = s.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (lines.length < 2) throw new Error("Need a header row and at least one data row.");
  const headers = lines[0].split("\t").map((h) => h.trim());
  const rows = lines.slice(1).map((line) => {
    const cells = line.split("\t");
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => (obj[h] = (cells[i] ?? "").trim()));
    return obj;
  });
  return JSON.stringify(rows, null, 2);
};

export default function TsvToJson() {
  return (
    <Transformer
      inputLabel="TSV (tab-separated)"
      outputLabel="JSON"
      inputPlaceholder={"name\trole\nAda\tEngineer\nGrace\tAdmiral"}
      live
      downloadName="data.json"
      downloadMime="application/json"
      actions={[{ label: "Convert to JSON", run }]}
    />
  );
}
