"use client";

import { Transformer } from "@/components/tools/transformer";
import { xmlToJson } from "@/lib/format";

export default function XmlToJson() {
  return (
    <Transformer
      inputLabel="XML"
      outputLabel="JSON"
      inputPlaceholder="<root><item>value</item></root>"
      downloadName="output.json"
      downloadMime="application/json"
      sampleInput={"<book><title>Scrab Tools</title><tag>pdf</tag><tag>csv</tag></book>"}
      actions={[{ label: "Convert to JSON", run: xmlToJson }]}
    />
  );
}
