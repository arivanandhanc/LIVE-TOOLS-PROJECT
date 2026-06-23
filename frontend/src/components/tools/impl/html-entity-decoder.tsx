"use client";

import { Transformer } from "@/components/tools/transformer";

const decode = (s: string) => {
  if (typeof window === "undefined") return s;
  const doc = new DOMParser().parseFromString(s, "text/html");
  return doc.documentElement.textContent ?? "";
};

export default function HtmlEntityDecoder() {
  return (
    <Transformer
      inputLabel="Encoded HTML"
      outputLabel="Decoded text"
      inputPlaceholder="&lt;a href=&quot;x&quot;&gt;Tom &amp; Jerry&lt;/a&gt;"
      live
      actions={[{ label: "Decode entities", run: decode }]}
    />
  );
}
