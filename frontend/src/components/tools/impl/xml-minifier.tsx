"use client";

import { Transformer } from "@/components/tools/transformer";

const run = (s: string) =>
  s
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .trim();

export default function XmlMinifier() {
  return (
    <Transformer
      inputLabel="XML"
      outputLabel="Minified"
      inputPlaceholder={"<root>\n  <item>value</item>\n</root>"}
      live
      downloadName="minified.xml"
      downloadMime="application/xml"
      actions={[{ label: "Minify XML", run }]}
    />
  );
}
