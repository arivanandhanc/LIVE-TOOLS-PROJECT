"use client";

import yaml from "js-yaml";
import { Transformer } from "@/components/tools/transformer";

export default function YamlConverter() {
  return (
    <Transformer
      inputLabel="Input"
      outputLabel="Output"
      inputPlaceholder="Paste YAML or JSON…"
      downloadName="converted.txt"
      sampleInput={'name: ConvertFlow\ntools:\n  - pdf\n  - csv\nlive: true'}
      actions={[
        {
          label: "YAML → JSON",
          run: (input) => JSON.stringify(yaml.load(input), null, 2),
        },
        {
          label: "JSON → YAML",
          variant: "secondary",
          run: (input) => yaml.dump(JSON.parse(input)),
        },
      ]}
    />
  );
}
