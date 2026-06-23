"use client";

import { Transformer } from "@/components/tools/transformer";

const run = (s: string) =>
  s
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

export default function RemoveHtmlTags() {
  return (
    <Transformer
      inputLabel="HTML"
      outputLabel="Plain text"
      inputPlaceholder="<p>Paste <b>HTML</b> here to strip the tags.</p>"
      live
      actions={[{ label: "Strip HTML tags", run }]}
    />
  );
}
