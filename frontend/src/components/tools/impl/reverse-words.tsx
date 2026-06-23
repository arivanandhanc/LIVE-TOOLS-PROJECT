"use client";

import { Transformer } from "@/components/tools/transformer";

const run = (s: string) =>
  s
    .split(/\r?\n/)
    .map((line) => line.trim().split(/\s+/).filter(Boolean).reverse().join(" "))
    .join("\n");

export default function ReverseWords() {
  return (
    <Transformer
      inputLabel="Text"
      outputLabel="Reversed word order"
      inputPlaceholder="The quick brown fox"
      live
      actions={[{ label: "Reverse word order", run }]}
    />
  );
}
