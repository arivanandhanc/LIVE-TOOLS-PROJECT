"use client";

import { Transformer } from "@/components/tools/transformer";
import { parseDelimited } from "@/lib/csv";

const sample = "name,role,active\nAda,Engineer,true\nGrace,Admiral,true";

export default function CsvToJson() {
  return (
    <Transformer
      inputLabel="CSV"
      outputLabel="JSON"
      inputPlaceholder="name,age\nAda,36"
      downloadName="data.json"
      downloadMime="application/json"
      sampleInput={sample}
      actions={[
        {
          label: "Convert to JSON",
          run: (input) => {
            const rows = parseDelimited(input.trim());
            if (rows.length < 1) throw new Error("No rows found.");
            const [header, ...body] = rows;
            const records = body
              .filter((r) => r.some((c) => c !== ""))
              .map((r) =>
                Object.fromEntries(header.map((key, i) => [key, coerce(r[i] ?? "")]))
              );
            return JSON.stringify(records, null, 2);
          },
        },
      ]}
    />
  );
}

function coerce(value: string): unknown {
  if (value === "true") return true;
  if (value === "false") return false;
  if (value !== "" && !Number.isNaN(Number(value))) return Number(value);
  return value;
}
