"use client";

import { Transformer } from "@/components/tools/transformer";

const encode = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export default function HtmlEntityEncoder() {
  return (
    <Transformer
      inputLabel="Text / HTML"
      outputLabel="Encoded entities"
      inputPlaceholder={'<a href="x">Tom & Jerry</a>'}
      live
      actions={[{ label: "Encode entities", run: encode }]}
    />
  );
}
