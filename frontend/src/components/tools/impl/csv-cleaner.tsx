"use client";

import { Transformer } from "@/components/tools/transformer";
import { parseDelimited, toDelimited } from "@/lib/csv";

export default function CsvCleaner() {
  return (
    <Transformer
      inputLabel="CSV"
      outputLabel="Cleaned CSV"
      inputPlaceholder="paste CSV…"
      downloadName="cleaned.csv"
      downloadMime="text/csv"
      actions={[
        {
          label: "Clean",
          run: (input) => {
            const rows = parseDelimited(input)
              .map((r) => r.map((c) => c.trim()))
              .filter((r) => r.some((c) => c !== ""));
            return toDelimited(rows);
          },
        },
        {
          label: "Remove duplicate rows",
          variant: "secondary",
          run: (input) => {
            const seen = new Set<string>();
            const rows = parseDelimited(input).filter((r) => {
              const key = r.join("");
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            });
            return toDelimited(rows);
          },
        },
      ]}
    />
  );
}
