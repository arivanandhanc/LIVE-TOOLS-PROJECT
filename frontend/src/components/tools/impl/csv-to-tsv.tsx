"use client";

import { Transformer } from "@/components/tools/transformer";
import { parseDelimited, toDelimited } from "@/lib/csv";

export default function CsvToTsv() {
  return (
    <Transformer
      inputLabel="CSV"
      outputLabel="TSV"
      inputPlaceholder="a,b,c"
      downloadName="data.tsv"
      downloadMime="text/tab-separated-values"
      live
      actions={[{ label: "Convert", run: (i) => toDelimited(parseDelimited(i, ","), "\t") }]}
    />
  );
}
