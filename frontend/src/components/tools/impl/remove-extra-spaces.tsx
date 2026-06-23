"use client";

import { Transformer } from "@/components/tools/transformer";

const run = (s: string) =>
  s
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

export default function RemoveExtraSpaces() {
  return (
    <Transformer
      inputLabel="Text"
      outputLabel="Cleaned"
      inputPlaceholder="Paste text   with   irregular    spacing…"
      live
      actions={[{ label: "Remove extra spaces", run }]}
    />
  );
}
