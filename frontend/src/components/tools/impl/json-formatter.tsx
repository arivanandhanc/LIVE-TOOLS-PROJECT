"use client";

import { Transformer } from "@/components/tools/transformer";

const sample = '{"name":"Scrab Tools","tools":108,"live":true,"tags":["pdf","csv","image"]}';

export default function JsonFormatter() {
  return (
    <Transformer
      inputLabel="JSON"
      outputLabel="Formatted"
      inputPlaceholder='{"hello":"world"}'
      downloadName="formatted.json"
      downloadMime="application/json"
      sampleInput={sample}
      actions={[
        {
          label: "Beautify",
          run: (input) => JSON.stringify(JSON.parse(input), null, 2),
        },
        {
          label: "Minify",
          variant: "secondary",
          run: (input) => JSON.stringify(JSON.parse(input)),
        },
        {
          label: "Validate",
          variant: "outline",
          run: (input) => {
            JSON.parse(input);
            return "✓ Valid JSON";
          },
        },
      ]}
    />
  );
}
