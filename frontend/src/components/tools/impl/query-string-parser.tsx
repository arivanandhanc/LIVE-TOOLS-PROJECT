"use client";

import { Transformer } from "@/components/tools/transformer";

const run = (s: string) => {
  const trimmed = s.trim();
  const qs = trimmed.includes("?") ? trimmed.slice(trimmed.indexOf("?") + 1) : trimmed;
  const params = new URLSearchParams(qs.replace(/^[#?]/, ""));
  const out: Record<string, string | string[]> = {};
  for (const [key, value] of params) {
    if (key in out) {
      const existing = out[key];
      out[key] = Array.isArray(existing) ? [...existing, value] : [existing as string, value];
    } else {
      out[key] = value;
    }
  }
  if (!Object.keys(out).length) throw new Error("No query parameters found.");
  return JSON.stringify(out, null, 2);
};

export default function QueryStringParser() {
  return (
    <Transformer
      inputLabel="URL or query string"
      outputLabel="JSON"
      inputPlaceholder="https://example.com/?q=tools&page=2&tag=a&tag=b"
      live
      downloadName="query.json"
      downloadMime="application/json"
      actions={[{ label: "Parse query string", run }]}
    />
  );
}
