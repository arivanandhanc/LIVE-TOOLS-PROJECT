"use client";

import { FileTool } from "@/components/tools/file-tool";
import { PDFDocument, toPdfBlob } from "@/lib/pdf";

export default function FlattenPdf() {
  return (
    <FileTool
      accept="application/pdf"
      cta="Flatten PDF"
      hint="Bake form fields and their values into the page so they can no longer be edited."
      process={async (files) => {
        const file = files[0];
        const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });

        const form = doc.getForm();
        const fieldCount = form.getFields().length;
        if (fieldCount === 0) {
          throw new Error("This PDF has no fillable form fields to flatten.");
        }
        // Flatten draws each field's current appearance onto the page and removes
        // the interactive widget, making the values permanent.
        form.flatten();

        const base = file.name.replace(/\.pdf$/i, "");
        return { blob: await toPdfBlob(doc), filename: `${base}-flattened.pdf` };
      }}
    />
  );
}
