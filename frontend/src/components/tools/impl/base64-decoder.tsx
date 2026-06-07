"use client";

import { Transformer } from "@/components/tools/transformer";

const fromBase64 = (str: string) => {
  const binary = atob(str.trim());
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

export default function Base64Decoder() {
  return (
    <Transformer
      inputLabel="Base64"
      outputLabel="Text"
      inputPlaceholder="Base64 to decode…"
      downloadName="decoded.txt"
      live
      actions={[
        {
          label: "Decode",
          run: (input) => {
            try {
              return fromBase64(input);
            } catch {
              throw new Error("Invalid Base64 input.");
            }
          },
        },
      ]}
    />
  );
}
