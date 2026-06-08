"use client";

import { Transformer } from "@/components/tools/transformer";
import { formatHtml } from "@/lib/format";

export default function HtmlFormatter() {
  return (
    <Transformer
      inputLabel="HTML"
      outputLabel="Formatted"
      inputPlaceholder="<div><p>Hello</p></div>"
      downloadName="formatted.html"
      downloadMime="text/html"
      sampleInput={'<section><h1>Title</h1><p>A <a href="#">link</a> here.</p></section>'}
      actions={[{ label: "Beautify HTML", run: formatHtml }]}
    />
  );
}
