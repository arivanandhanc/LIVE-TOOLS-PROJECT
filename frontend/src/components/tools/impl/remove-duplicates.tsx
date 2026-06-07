"use client";

import { Transformer } from "@/components/tools/transformer";

export default function RemoveDuplicates() {
  return (
    <Transformer
      inputLabel="Lines"
      outputLabel="Unique lines"
      inputPlaceholder={"apple\nbanana\napple\ncherry"}
      actions={[
        {
          label: "Remove duplicates",
          run: (s) => [...new Set(s.split(/\n/))].join("\n"),
        },
        {
          label: "Case-insensitive",
          variant: "secondary",
          run: (s) => {
            const seen = new Set<string>();
            return s
              .split(/\n/)
              .filter((line) => {
                const k = line.toLowerCase();
                if (seen.has(k)) return false;
                seen.add(k);
                return true;
              })
              .join("\n");
          },
        },
        {
          label: "Keep only duplicates",
          variant: "outline",
          run: (s) => {
            const counts = new Map<string, number>();
            const lines = s.split(/\n/);
            lines.forEach((l) => counts.set(l, (counts.get(l) ?? 0) + 1));
            return [...new Set(lines.filter((l) => (counts.get(l) ?? 0) > 1))].join("\n");
          },
        },
      ]}
    />
  );
}
