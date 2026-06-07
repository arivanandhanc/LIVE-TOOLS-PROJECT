"use client";

import { Transformer } from "@/components/tools/transformer";

export default function TextCleaner() {
  return (
    <Transformer
      inputLabel="Text"
      outputLabel="Cleaned"
      inputPlaceholder="Paste messy text…"
      actions={[
        {
          label: "Trim & collapse spaces",
          run: (s) => s.replace(/[ \t]+/g, " ").replace(/ *\n */g, "\n").trim(),
        },
        {
          label: "Remove blank lines",
          variant: "secondary",
          run: (s) => s.split(/\n/).filter((l) => l.trim()).join("\n"),
        },
        {
          label: "Remove line breaks",
          variant: "outline",
          run: (s) => s.replace(/\s*\n\s*/g, " ").trim(),
        },
        {
          label: "Strip non-ASCII",
          variant: "outline",
          // eslint-disable-next-line no-control-regex
          run: (s) => s.replace(/[^\x00-\x7F]/g, ""),
        },
        {
          label: "Strip HTML tags",
          variant: "outline",
          run: (s) => s.replace(/<[^>]*>/g, ""),
        },
      ]}
    />
  );
}
