"use client";

import { Transformer } from "@/components/tools/transformer";
import { toDelimited } from "@/lib/csv";

export default function JsonToCsv() {
  return (
    <Transformer
      inputLabel="JSON (array of objects)"
      outputLabel="CSV"
      inputPlaceholder='[{"name":"Ada","age":36}]'
      downloadName="data.csv"
      downloadMime="text/csv"
      sampleInput='[{"name":"Ada","role":"Engineer"},{"name":"Grace","role":"Admiral"}]'
      actions={[
        {
          label: "Convert to CSV",
          run: (input) => {
            const data = JSON.parse(input);
            if (!Array.isArray(data)) throw new Error("Expected a JSON array of objects.");
            if (data.length === 0) return "";
            const keys = [...new Set(data.flatMap((o) => Object.keys(o ?? {})))];
            const rows = [
              keys,
              ...data.map((obj) =>
                keys.map((k) => {
                  const v = obj?.[k];
                  return v == null ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
                })
              ),
            ];
            return toDelimited(rows);
          },
        },
      ]}
    />
  );
}
