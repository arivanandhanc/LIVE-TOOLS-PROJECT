"use client";

import { Transformer } from "@/components/tools/transformer";
import { jsonToXml } from "@/lib/format";

export default function JsonToXml() {
  return (
    <Transformer
      inputLabel="JSON"
      outputLabel="XML"
      inputPlaceholder='{"name":"value"}'
      downloadName="output.xml"
      downloadMime="application/xml"
      sampleInput={'{"book":{"title":"Scrab Tools","tags":["pdf","csv"]}}'}
      actions={[{ label: "Convert to XML", run: jsonToXml }]}
    />
  );
}
