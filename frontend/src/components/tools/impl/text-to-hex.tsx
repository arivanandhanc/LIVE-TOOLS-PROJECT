"use client";

import { Transformer } from "@/components/tools/transformer";

const toHex = (s: string) =>
  [...new TextEncoder().encode(s)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(" ");

const fromHex = (s: string) => {
  const cleaned = s.replace(/0x/gi, "").replace(/[^0-9a-f]/gi, "");
  if (cleaned.length % 2 !== 0) throw new Error("Hex input must have an even number of digits.");
  const bytes = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleaned.slice(i * 2, i * 2 + 2), 16);
  }
  return new TextDecoder().decode(bytes);
};

export default function TextToHex() {
  return (
    <Transformer
      inputLabel="Text or Hex"
      outputLabel="Result"
      inputPlaceholder="Type text to encode, or paste hex bytes to decode…"
      actions={[
        { label: "Text → Hex", run: toHex },
        { label: "Hex → Text", run: fromHex, variant: "outline" },
      ]}
    />
  );
}
