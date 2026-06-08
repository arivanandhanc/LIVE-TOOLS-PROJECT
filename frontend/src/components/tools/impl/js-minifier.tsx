"use client";

import { Transformer } from "@/components/tools/transformer";
import { minifyJs } from "@/lib/format";

export default function JsMinifier() {
  return (
    <Transformer
      inputLabel="JavaScript"
      outputLabel="Minified"
      inputPlaceholder="function add(a, b) { return a + b; }"
      downloadName="script.min.js"
      downloadMime="text/javascript"
      sampleInput={"// adds two numbers\nfunction add(a, b) {\n  return a + b;\n}\n\nconst total = add(2, 3);"}
      actions={[{ label: "Minify JavaScript", run: minifyJs }]}
    />
  );
}
