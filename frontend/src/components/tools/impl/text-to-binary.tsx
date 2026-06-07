"use client";

import { Transformer } from "@/components/tools/transformer";

export default function TextToBinary() {
  return (
    <Transformer
      inputLabel="Input"
      outputLabel="Output"
      inputPlaceholder="Type text, or paste binary to decode…"
      actions={[
        {
          label: "Text → Binary",
          run: (s) =>
            [...new TextEncoder().encode(s)]
              .map((b) => b.toString(2).padStart(8, "0"))
              .join(" "),
        },
        {
          label: "Binary → Text",
          variant: "secondary",
          run: (s) => {
            const bits = s.trim().split(/\s+/);
            if (bits.some((b) => !/^[01]{1,8}$/.test(b)))
              throw new Error("Expected space-separated groups of 0s and 1s.");
            return new TextDecoder().decode(Uint8Array.from(bits, (b) => parseInt(b, 2)));
          },
        },
      ]}
    />
  );
}
