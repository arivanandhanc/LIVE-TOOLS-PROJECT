"use client";

import { marked } from "marked";
import { Transformer } from "@/components/tools/transformer";

export default function MarkdownToHtml() {
  return (
    <Transformer
      inputLabel="Markdown"
      outputLabel="HTML"
      inputPlaceholder="# Hello\n\nSome **bold** text and a [link](https://example.com)."
      downloadName="output.html"
      downloadMime="text/html"
      sampleInput={"# ConvertFlow\n\nA **fast**, private toolbox.\n\n- Runs in your browser\n- No uploads\n\n[Learn more](https://tools.arivanandhan.in)"}
      actions={[
        {
          label: "Convert to HTML",
          run: (input) => marked.parse(input, { async: false }) as string,
        },
      ]}
    />
  );
}
