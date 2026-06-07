"use client";

import { Transformer } from "@/components/tools/transformer";

const toBase64 = (str: string) =>
  btoa(String.fromCharCode(...new TextEncoder().encode(str)));

export default function Base64Encoder() {
  return (
    <Transformer
      inputLabel="Text"
      outputLabel="Base64"
      inputPlaceholder="Text to encode…"
      downloadName="encoded.txt"
      live
      actions={[{ label: "Encode", run: toBase64 }]}
    />
  );
}
