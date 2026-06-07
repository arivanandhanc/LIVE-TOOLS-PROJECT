"use client";

import { Transformer } from "@/components/tools/transformer";
import { parseDelimited, toDelimited } from "@/lib/csv";

export default function DuplicateRemover() {
  return (
    <Transformer
      inputLabel="CSV"
      outputLabel="De-duplicated CSV"
      inputPlaceholder="paste CSV with duplicate rows…"
      downloadName="unique.csv"
      downloadMime="text/csv"
      actions={[
        {
          label: "Remove duplicate rows",
          run: (input) => {
            const rows = parseDelimited(input);
            const seen = new Set<string>();
            const unique = rows.filter((r) => {
              const key = JSON.stringify(r);
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            });
            return toDelimited(unique);
          },
        },
        {
          label: "Keep header, dedupe body",
          variant: "secondary",
          run: (input) => {
            const rows = parseDelimited(input);
            if (rows.length === 0) return "";
            const [header, ...body] = rows;
            const seen = new Set<string>();
            const unique = body.filter((r) => {
              const key = JSON.stringify(r);
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            });
            return toDelimited([header, ...unique]);
          },
        },
      ]}
    />
  );
}
