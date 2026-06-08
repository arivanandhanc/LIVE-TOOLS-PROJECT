"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { ToolPanel, Field } from "@/components/tools/panel";
import { AlertCircle } from "lucide-react";

export default function ColumnSplitter() {
  const [input, setInput] = React.useState("name,location\nAda Lovelace,London UK\nLinus Torvalds,Helsinki FI");
  const [column, setColumn] = React.useState(2);
  const [delimiter, setDelimiter] = React.useState(" ");
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  function run() {
    try {
      const rows = input.trim().split("\n").map((r) => r.split(","));
      const idx = column - 1;
      const header = rows[0];
      if (idx < 0 || idx >= header.length) throw new Error(`Column ${column} is out of range.`);
      const maxParts = Math.max(...rows.slice(1).map((r) => (r[idx] ?? "").split(delimiter).length));
      const out = rows.map((r, ri) => {
        const cell = r[idx] ?? "";
        const parts = ri === 0
          ? Array.from({ length: maxParts }, (_, i) => `${header[idx]}_${i + 1}`)
          : cell.split(delimiter);
        while (parts.length < maxParts) parts.push("");
        return [...r.slice(0, idx), ...parts, ...r.slice(idx + 1)].join(",");
      });
      setOutput(out.join("\n"));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not split.");
      setOutput("");
    }
  }

  return (
    <div className="space-y-4">
      <ToolPanel className="flex flex-col gap-3">
        <span className="text-sm font-medium">CSV input</span>
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-40 font-mono text-sm" />
      </ToolPanel>
      <ToolPanel className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <Field label="Column to split (1-based)">
          <Input type="number" min={1} value={column} onChange={(e) => setColumn(Math.max(1, Number(e.target.value)))} />
        </Field>
        <Field label="Split on">
          <Input value={delimiter} onChange={(e) => setDelimiter(e.target.value)} placeholder="space, - , / …" />
        </Field>
        <Button onClick={run}>Split column</Button>
      </ToolPanel>
      {error && <p className="flex items-center gap-2 text-sm text-destructive"><AlertCircle className="size-4" /> {error}</p>}
      {output && (
        <ToolPanel className="flex flex-col gap-3">
          <div className="flex items-center justify-between"><span className="text-sm font-medium">Result</span><CopyButton value={output} /></div>
          <Textarea value={output} readOnly className="min-h-40 font-mono text-sm" />
        </ToolPanel>
      )}
    </div>
  );
}
