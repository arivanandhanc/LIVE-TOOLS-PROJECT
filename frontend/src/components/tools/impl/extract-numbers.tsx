"use client";

import { Transformer } from "@/components/tools/transformer";

const run = (s: string) => {
  const matches = s.match(/-?\d[\d,]*\.?\d*/g) ?? [];
  if (!matches.length) throw new Error("No numbers found in the text.");
  return matches.join("\n");
};

export default function ExtractNumbers() {
  return (
    <Transformer
      inputLabel="Text"
      outputLabel="Numbers"
      inputPlaceholder="Order #1024 shipped on 2026-06-23 for $49.99…"
      live
      downloadName="numbers.txt"
      actions={[{ label: "Extract numbers", run }]}
    />
  );
}
