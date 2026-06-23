"use client";

import { Transformer } from "@/components/tools/transformer";

const extractEmails = (s: string) => {
  const matches = s.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) ?? [];
  const unique = [...new Set(matches.map((m) => m.toLowerCase()))];
  if (!unique.length) throw new Error("No email addresses found in the text.");
  return unique.join("\n");
};

export default function ExtractEmails() {
  return (
    <Transformer
      inputLabel="Text or HTML"
      outputLabel="Email addresses"
      inputPlaceholder="Paste any text, list or HTML containing email addresses…"
      live
      downloadName="emails.txt"
      actions={[{ label: "Extract emails", run: extractEmails }]}
    />
  );
}
