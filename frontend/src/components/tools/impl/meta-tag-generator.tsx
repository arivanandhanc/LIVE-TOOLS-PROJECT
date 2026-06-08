"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/ui/copy-button";
import { ToolPanel, Field } from "@/components/tools/panel";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

export default function MetaTagGenerator() {
  const [title, setTitle] = React.useState("ConvertFlow — Free Online File Tools");
  const [description, setDescription] = React.useState("Fast, private PDF, image, CSV and developer tools that run in your browser.");
  const [url, setUrl] = React.useState("https://tools.arivanandhan.in");
  const [image, setImage] = React.useState("https://tools.arivanandhan.in/og.png");

  const output = React.useMemo(() => [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    "",
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    "",
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${esc(image)}" />`,
  ].join("\n"), [title, description, url, image]);

  return (
    <div className="space-y-4">
      <ToolPanel className="grid gap-4 sm:grid-cols-2">
        <Field label="Page title"><Input value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
        <Field label="Canonical URL"><Input value={url} onChange={(e) => setUrl(e.target.value)} /></Field>
        <Field label="Description"><Input value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
        <Field label="Preview image URL"><Input value={image} onChange={(e) => setImage(e.target.value)} /></Field>
      </ToolPanel>

      <ToolPanel className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Meta tags</span>
          <CopyButton value={output} />
        </div>
        <Textarea value={output} readOnly className="min-h-56 font-mono text-xs" />
      </ToolPanel>
    </div>
  );
}
