"use client";

import { Transformer } from "@/components/tools/transformer";

const rot13 = (s: string) =>
  s.replace(/[a-z]/gi, (c) => {
    const base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });

export default function Rot13() {
  return (
    <Transformer
      inputLabel="Text"
      outputLabel="ROT13"
      inputPlaceholder="Hello, world!"
      live
      actions={[{ label: "Apply ROT13", run: rot13 }]}
    />
  );
}
