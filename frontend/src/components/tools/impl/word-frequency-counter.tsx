"use client";

import { Transformer } from "@/components/tools/transformer";

const run = (s: string) => {
  const words = s.toLowerCase().match(/[\p{L}\p{N}']+/gu) ?? [];
  if (!words.length) throw new Error("No words found in the text.");
  const map = new Map<string, number>();
  for (const w of words) map.set(w, (map.get(w) ?? 0) + 1);
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([w, c]) => `${c}\t${w}`)
    .join("\n");
};

export default function WordFrequencyCounter() {
  return (
    <Transformer
      inputLabel="Text"
      outputLabel="Frequency (count → word)"
      inputPlaceholder="Paste text to count word frequencies…"
      live
      downloadName="word-frequency.tsv"
      downloadMime="text/tab-separated-values"
      actions={[{ label: "Count words", run }]}
    />
  );
}
