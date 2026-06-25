"use client";

import * as React from "react";
import { FileTool } from "@/components/tools/file-tool";
import { Field } from "@/components/tools/panel";
import { Input } from "@/components/ui/input";
import { PDFDocument, toPdfBlob } from "@/lib/pdf";

export default function EditPdfMetadata() {
  const [title, setTitle] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [keywords, setKeywords] = React.useState("");

  return (
    <FileTool
      accept="application/pdf"
      cta="Update metadata"
      hint="Edit the document's title, author, subject and keywords. Blank fields are left unchanged."
      controls={
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Document title" />
          </Field>
          <Field label="Author">
            <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author name" />
          </Field>
          <Field label="Subject">
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
          </Field>
          <Field label="Keywords" hint="Comma-separated">
            <Input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="invoice, 2026, finance" />
          </Field>
        </div>
      }
      process={async (files) => {
        const file = files[0];
        const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });

        if (title.trim()) doc.setTitle(title.trim());
        if (author.trim()) doc.setAuthor(author.trim());
        if (subject.trim()) doc.setSubject(subject.trim());
        if (keywords.trim()) {
          doc.setKeywords(keywords.split(",").map((k) => k.trim()).filter(Boolean));
        }
        doc.setModificationDate(new Date());

        const base = file.name.replace(/\.pdf$/i, "");
        return { blob: await toPdfBlob(doc), filename: `${base}-metadata.pdf` };
      }}
    />
  );
}
