"use client";

import { Transformer } from "@/components/tools/transformer";

export default function ReverseText() {
  return (
    <Transformer
      inputLabel="Text"
      outputLabel="Reversed"
      inputPlaceholder="Type something…"
      actions={[
        { label: "Reverse characters", run: (s) => [...s].reverse().join("") },
        {
          label: "Reverse words",
          variant: "secondary",
          run: (s) => s.split(/\s+/).reverse().join(" "),
        },
        {
          label: "Reverse lines",
          variant: "outline",
          run: (s) => s.split(/\n/).reverse().join("\n"),
        },
      ]}
    />
  );
}
