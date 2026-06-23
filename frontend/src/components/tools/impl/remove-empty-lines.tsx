"use client";

import { Transformer } from "@/components/tools/transformer";

const removeEmpty = (s: string) =>
  s.split(/\r?\n/).filter((l) => l.trim() !== "").join("\n");

export default function RemoveEmptyLines() {
  return (
    <Transformer
      inputLabel="Text"
      outputLabel="No blank lines"
      inputPlaceholder={"Line one\n\n\nLine two\n\nLine three"}
      live
      actions={[{ label: "Remove empty lines", run: removeEmpty }]}
    />
  );
}
