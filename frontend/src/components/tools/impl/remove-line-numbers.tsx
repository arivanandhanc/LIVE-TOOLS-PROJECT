"use client";

import { Transformer } from "@/components/tools/transformer";

const run = (s: string) =>
  s.split(/\r?\n/).map((l) => l.replace(/^\s*\d+\s*[.)\]:\t]?\s*/, "")).join("\n");

export default function RemoveLineNumbers() {
  return (
    <Transformer
      inputLabel="Numbered text"
      outputLabel="Clean text"
      inputPlaceholder={"1. First line\n2. Second line\n3. Third line"}
      live
      actions={[{ label: "Remove line numbers", run }]}
    />
  );
}
