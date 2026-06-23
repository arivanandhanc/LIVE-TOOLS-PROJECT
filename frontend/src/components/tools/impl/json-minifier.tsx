"use client";

import { Transformer } from "@/components/tools/transformer";

const minify = (s: string) => {
  try {
    return JSON.stringify(JSON.parse(s));
  } catch (err) {
    throw new Error(`Invalid JSON: ${(err as Error).message}`);
  }
};

const prettify = (s: string) => {
  try {
    return JSON.stringify(JSON.parse(s), null, 2);
  } catch (err) {
    throw new Error(`Invalid JSON: ${(err as Error).message}`);
  }
};

export default function JsonMinifier() {
  return (
    <Transformer
      inputLabel="JSON"
      outputLabel="Minified"
      inputPlaceholder='{\n  "hello": "world"\n}'
      downloadName="minified.json"
      downloadMime="application/json"
      actions={[
        { label: "Minify", run: minify },
        { label: "Beautify", run: prettify, variant: "outline" },
      ]}
    />
  );
}
