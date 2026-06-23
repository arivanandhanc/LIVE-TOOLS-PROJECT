"use client";

import { Transformer } from "@/components/tools/transformer";

const extractUrls = (s: string) => {
  const matches = s.match(/https?:\/\/[^\s<>"')\]]+/gi) ?? [];
  const unique = [...new Set(matches)];
  if (!unique.length) throw new Error("No URLs found in the text.");
  return unique.join("\n");
};

export default function ExtractUrls() {
  return (
    <Transformer
      inputLabel="Text or HTML"
      outputLabel="URLs"
      inputPlaceholder="Paste any text or HTML containing links…"
      live
      downloadName="urls.txt"
      actions={[{ label: "Extract URLs", run: extractUrls }]}
    />
  );
}
