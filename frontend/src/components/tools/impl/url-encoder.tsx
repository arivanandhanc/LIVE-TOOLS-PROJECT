"use client";

import { Transformer } from "@/components/tools/transformer";

export default function UrlEncoder() {
  return (
    <Transformer
      inputLabel="Text"
      outputLabel="Encoded"
      inputPlaceholder="https://example.com/search?q=hello world"
      live
      actions={[
        { label: "Encode component", run: (i) => encodeURIComponent(i) },
        { label: "Encode URI", variant: "secondary", run: (i) => encodeURI(i) },
      ]}
    />
  );
}
