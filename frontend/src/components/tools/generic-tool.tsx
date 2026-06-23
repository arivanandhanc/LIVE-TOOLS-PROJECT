"use client";

import * as React from "react";
import { RefreshCw, Download } from "lucide-react";
import { Transformer } from "@/components/tools/transformer";
import { UnitConverter } from "@/components/tools/unit-converter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/ui/copy-button";
import { ToolPanel } from "@/components/tools/panel";
import { downloadBlob } from "@/lib/utils";
import { genToolMap } from "@/lib/tools/generated";

function GenerateBox({ generate, label }: { generate: () => string; label: string }) {
  const [out, setOut] = React.useState("");
  const run = React.useCallback(() => setOut(generate()), [generate]);
  React.useEffect(() => { run(); }, [run]);
  return (
    <ToolPanel className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={run}><RefreshCw /> {label}</Button>
        <div className="ml-auto flex gap-2">
          <CopyButton value={out} label="Copy" />
          <Button variant="outline" size="sm" disabled={!out} onClick={() => downloadBlob(out, "output.txt")}>
            <Download /> Download
          </Button>
        </div>
      </div>
      <Textarea readOnly value={out} className="min-h-64" aria-label="Generated output" />
    </ToolPanel>
  );
}

export default function GenericTool({ slug }: { slug: string }) {
  const spec = genToolMap[slug];
  if (!spec) return null;

  if (spec.kind === "convert" && spec.units && spec.convert) {
    return (
      <UnitConverter
        units={spec.units}
        convert={spec.convert}
        defaultFrom={spec.convFrom}
        defaultTo={spec.convTo}
        defaultValue={spec.convValue}
        note={spec.convNote}
      />
    );
  }

  if (spec.kind === "generate" && spec.generate) {
    return <GenerateBox generate={spec.generate} label={spec.generateLabel ?? "Generate"} />;
  }

  if (spec.kind === "dual" && spec.aRun && spec.bRun) {
    return (
      <Transformer
        inputLabel={spec.inputLabel ?? "Input"}
        outputLabel={spec.outputLabel ?? "Output"}
        inputPlaceholder={spec.placeholder}
        actions={[
          { label: spec.aLabel ?? "Convert", run: spec.aRun },
          { label: spec.bLabel ?? "Reverse", run: spec.bRun, variant: "outline" },
        ]}
      />
    );
  }

  // default: transform
  return (
    <Transformer
      inputLabel={spec.inputLabel ?? "Input"}
      outputLabel={spec.outputLabel ?? "Output"}
      inputPlaceholder={spec.placeholder}
      live={spec.live}
      actions={[{ label: spec.name, run: spec.run ?? ((s) => s) }]}
    />
  );
}
