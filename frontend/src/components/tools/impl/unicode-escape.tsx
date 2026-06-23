"use client";

import { Transformer } from "@/components/tools/transformer";

const escape = (s: string) =>
  [...s]
    .map((c) => {
      const code = c.charCodeAt(0);
      return code > 127 ? "\\u" + code.toString(16).padStart(4, "0") : c;
    })
    .join("");

const unescape = (s: string) =>
  s.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));

export default function UnicodeEscape() {
  return (
    <Transformer
      inputLabel="Text"
      outputLabel="Result"
      inputPlaceholder="Type text to escape, or paste \\uXXXX to unescape…"
      actions={[
        { label: "Escape", run: escape },
        { label: "Unescape", run: unescape, variant: "outline" },
      ]}
    />
  );
}
