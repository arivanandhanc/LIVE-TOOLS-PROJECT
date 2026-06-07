"use client";

import { Transformer } from "@/components/tools/transformer";

const words = (s: string) =>
  s
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_\-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

export default function CaseConverter() {
  return (
    <Transformer
      inputLabel="Text"
      outputLabel="Result"
      inputPlaceholder="Convert this text…"
      actions={[
        { label: "UPPERCASE", run: (s) => s.toUpperCase() },
        { label: "lowercase", variant: "secondary", run: (s) => s.toLowerCase() },
        {
          label: "Title Case",
          variant: "outline",
          run: (s) => s.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()),
        },
        {
          label: "Sentence case",
          variant: "outline",
          run: (s) =>
            s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
        },
        {
          label: "camelCase",
          variant: "outline",
          run: (s) =>
            words(s)
              .map((w, i) =>
                i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()
              )
              .join(""),
        },
        {
          label: "snake_case",
          variant: "outline",
          run: (s) => words(s).map((w) => w.toLowerCase()).join("_"),
        },
        {
          label: "kebab-case",
          variant: "outline",
          run: (s) => words(s).map((w) => w.toLowerCase()).join("-"),
        },
      ]}
    />
  );
}
