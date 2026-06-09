"use client";

import { Transformer } from "@/components/tools/transformer";
import { formatXml, minifyXml } from "@/lib/format";

export default function XmlFormatter() {
  return (
    <Transformer
      inputLabel="XML"
      outputLabel="Formatted"
      inputPlaceholder="<root><item>value</item></root>"
      downloadName="formatted.xml"
      downloadMime="application/xml"
      sampleInput={'<catalog><book id="1"><title>Scrab Tools</title></book></catalog>'}
      actions={[
        { label: "Beautify", run: formatXml },
        { label: "Minify", variant: "secondary", run: minifyXml },
      ]}
    />
  );
}
