"use client";

import { Transformer } from "@/components/tools/transformer";

const L: Record<string, string> = {
  a: "4", b: "8", e: "3", g: "6", i: "1", l: "1", o: "0", s: "5", t: "7", z: "2",
};

const toLeet = (s: string) =>
  s.replace(/[abegilostz]/gi, (c) => {
    const lower = c.toLowerCase();
    const sub = L[lower] ?? c;
    return c === lower ? sub : sub;
  });

export default function Leetspeak() {
  return (
    <Transformer
      inputLabel="Text"
      outputLabel="Leetspeak"
      inputPlaceholder="Convert text to 1337 5p34k…"
      live
      actions={[{ label: "Convert to leet", run: toLeet }]}
    />
  );
}
