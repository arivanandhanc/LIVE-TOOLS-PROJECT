"use client";

import { Transformer } from "@/components/tools/transformer";

const escape = (s: string) => {
  const json = JSON.stringify(s);
  return json.slice(1, -1);
};

const unescape = (s: string) => {
  try {
    return JSON.parse(`"${s.replace(/(^|[^\\])"/g, '$1\\"')}"`);
  } catch (err) {
    throw new Error(`Could not unescape: ${(err as Error).message}`);
  }
};

export default function StringEscape() {
  return (
    <Transformer
      inputLabel="String"
      outputLabel="Result"
      inputPlaceholder={'Line with "quotes"\tand a tab'}
      actions={[
        { label: "Escape", run: escape },
        { label: "Unescape", run: unescape, variant: "outline" },
      ]}
    />
  );
}
