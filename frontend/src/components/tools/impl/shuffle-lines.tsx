"use client";

import { Transformer } from "@/components/tools/transformer";

const run = (s: string) => {
  const lines = s.split(/\r?\n/);
  for (let i = lines.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lines[i], lines[j]] = [lines[j], lines[i]];
  }
  return lines.join("\n");
};

export default function ShuffleLines() {
  return (
    <Transformer
      inputLabel="Text"
      outputLabel="Shuffled"
      inputPlaceholder={"Line one\nLine two\nLine three"}
      actions={[{ label: "Shuffle lines", run }]}
    />
  );
}
