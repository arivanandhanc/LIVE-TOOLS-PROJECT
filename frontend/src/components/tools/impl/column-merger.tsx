"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { ToolPanel, Field } from "@/components/tools/panel";
import { AlertCircle } from "lucide-react";

export default function ColumnMerger() {
  const [input, setInput] = React.useState("first,last,city\nAda,Lovelace,London\nLinus,Torvalds,Helsinki");
  const [columns, setColumns] = React.useState("1,2");
  const [joiner, setJoiner] = React.useState(" ");
  const [name, setName] = React.useState("full_name");
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  function run() {
    try {
      const rows = input.trim().split("\n").map((r) => r.split(","));
      const idxs = columns.split(",").map((s) => parseInt(s.trim(), 10) - 1);
      if (idxs.some((i) => Number.isNaN(i) || i < 0 || i >= rows[0].length)) {
        throw new Error("One or more column numbers are out of range.");
      }
      const out = rows.map((r, ri) => {
        const merged = ri === 0 ? name : idxs.map((i) => r[i] ?? "").join(joiner);
        const rest = r.filter((_, i) => !idxs.includes(i));
        return [merged, ...rest].join(",");
      });
      setOutput(out.join("\n"));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not merge.");
      setOutput("");
    }
  }

  return (
    <div className="space-y-4">
      <ToolPanel className="flex flex-col gap-3">
        <span className="text-sm font-medium">CSV input</span>
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-40 font-mono text-sm" />
      </ToolPanel>
      <ToolPanel className="grid gap-4 sm:grid-cols-3 sm:items-end">
        <Field label="Columns to merge" hint="1-based, comma-separated"><Input value={columns} onChange={(e) => setColumns(e.target.value)} placeholder="1,2" /></Field>
        <Field label="Join with"><Input value={joiner} onChange={(e) => setJoiner(e.target.value)} placeholder="space, - , …" /></Field>
        <Field label="New column name"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Button onClick={run} className="sm:col-span-3 sm:w-fit">Merge columns</Button>
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
