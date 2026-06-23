"use client";

import { Transformer } from "@/components/tools/transformer";

const removeBreaks = (s: string) =>
  s.replace(/\r?\n+/g, " ").replace(/[ \t]{2,}/g, " ").trim();

export default function RemoveLineBreaks() {
  return (
    <Transformer
      inputLabel="Text with line breaks"
      outputLabel="Single line"
      inputPlaceholder={"Paste text that has\nlots of line\nbreaks here…"}
      live
      actions={[{ label: "Remove line breaks", run: removeBreaks }]}
    />
  );
}
