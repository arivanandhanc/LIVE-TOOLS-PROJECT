"use client";

import { Transformer } from "@/components/tools/transformer";

export default function SortLines() {
  return (
    <Transformer
      inputLabel="Lines"
      outputLabel="Sorted"
      inputPlaceholder={"banana\napple\ncherry"}
      actions={[
        {
          label: "A → Z",
          run: (s) => s.split(/\n/).sort((a, b) => a.localeCompare(b)).join("\n"),
        },
        {
          label: "Z → A",
          variant: "secondary",
          run: (s) => s.split(/\n/).sort((a, b) => b.localeCompare(a)).join("\n"),
        },
        {
          label: "Numeric",
          variant: "outline",
          run: (s) => s.split(/\n/).sort((a, b) => parseFloat(a) - parseFloat(b)).join("\n"),
        },
        {
          label: "Shuffle",
          variant: "outline",
          run: (s) => {
            const lines = s.split(/\n/);
            for (let i = lines.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [lines[i], lines[j]] = [lines[j], lines[i]];
            }
            return lines.join("\n");
          },
        },
      ]}
    />
  );
}
