"use client";

import cronstrue from "cronstrue";
import { Transformer } from "@/components/tools/transformer";

export default function CronParser() {
  return (
    <Transformer
      inputLabel="Cron expression"
      outputLabel="Plain English"
      inputPlaceholder="*/5 * * * *"
      downloadName="cron.txt"
      live
      sampleInput="*/5 * * * *"
      actions={[{ label: "Explain", run: (s) => cronstrue.toString(s.trim(), { verbose: true }) }]}
    />
  );
}
