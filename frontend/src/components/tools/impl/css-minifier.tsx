"use client";

import { Transformer } from "@/components/tools/transformer";
import { minifyCss } from "@/lib/format";

export default function CssMinifier() {
  return (
    <Transformer
      inputLabel="CSS"
      outputLabel="Minified"
      inputPlaceholder=".btn { color: red; }"
      downloadName="styles.min.css"
      downloadMime="text/css"
      sampleInput={".card {\n  padding: 1rem;\n  /* comment */\n  color: #333;\n}"}
      actions={[{ label: "Minify CSS", run: minifyCss }]}
    />
  );
}
