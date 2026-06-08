"use client";

import TurndownService from "turndown";
import { Transformer } from "@/components/tools/transformer";

const turndown = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced", bulletListMarker: "-" });

export default function HtmlToMarkdown() {
  return (
    <Transformer
      inputLabel="HTML"
      outputLabel="Markdown"
      inputPlaceholder="<h1>Hello</h1><p>Some <strong>HTML</strong>…</p>"
      downloadName="output.md"
      downloadMime="text/markdown"
      live
      sampleInput="<h1>Title</h1><p>A paragraph with <a href='https://example.com'>a link</a> and <strong>bold</strong> text.</p><ul><li>One</li><li>Two</li></ul>"
      actions={[{ label: "Convert", run: (s) => turndown.turndown(s) }]}
    />
  );
}
