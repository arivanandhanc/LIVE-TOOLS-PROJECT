"use client";

import { Transformer } from "@/components/tools/transformer";

const run = (s: string) => s.replace(/[\p{P}\p{S}]/gu, "").replace(/[ \t]{2,}/g, " ");

export default function RemovePunctuation() {
  return (
    <Transformer
      inputLabel="Text"
      outputLabel="No punctuation"
      inputPlaceholder="Hello, world! How's it going?"
      live
      actions={[{ label: "Remove punctuation", run }]}
    />
  );
}
