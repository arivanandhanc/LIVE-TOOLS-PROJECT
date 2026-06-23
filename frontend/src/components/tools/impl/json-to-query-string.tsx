"use client";

import { Transformer } from "@/components/tools/transformer";

const run = (s: string) => {
  let obj: unknown;
  try {
    obj = JSON.parse(s);
  } catch (err) {
    throw new Error(`Invalid JSON: ${(err as Error).message}`);
  }
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    throw new Error("Provide a flat JSON object, e.g. {\"q\":\"tools\",\"page\":2}.");
  }
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (Array.isArray(value)) value.forEach((v) => params.append(key, String(v)));
    else params.append(key, String(value));
  }
  return params.toString();
};

export default function JsonToQueryString() {
  return (
    <Transformer
      inputLabel="JSON object"
      outputLabel="Query string"
      inputPlaceholder={'{ "q": "tools", "page": 2, "tag": ["a", "b"] }'}
      live
      actions={[{ label: "Build query string", run }]}
    />
  );
}
