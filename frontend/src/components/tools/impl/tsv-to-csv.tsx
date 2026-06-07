"use client";

import { Transformer } from "@/components/tools/transformer";
import { parseDelimited, toDelimited } from "@/lib/csv";

export default function TsvToCsv() {
  return (
    <Transformer
      inputLabel="TSV"
      outputLabel="CSV"
      inputPlaceholder={"a\tb\tc"}
      downloadName="data.csv"
      downloadMime="text/csv"
      live
      actions={[{ label: "Convert", run: (i) => toDelimited(parseDelimited(i, "\t"), ",") }]}
    />
  );
}
