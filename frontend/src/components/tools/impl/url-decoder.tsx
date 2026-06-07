"use client";

import { Transformer } from "@/components/tools/transformer";

export default function UrlDecoder() {
  return (
    <Transformer
      inputLabel="Encoded"
      outputLabel="Decoded"
      inputPlaceholder="https%3A%2F%2Fexample.com"
      live
      actions={[
        {
          label: "Decode",
          run: (i) => {
            try {
              return decodeURIComponent(i.replace(/\+/g, " "));
            } catch {
              throw new Error("Invalid percent-encoding.");
            }
          },
        },
      ]}
    />
  );
}
