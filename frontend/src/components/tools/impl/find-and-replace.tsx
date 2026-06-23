"use client";

import * as React from "react";
import { AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/ui/copy-button";
import { ToolPanel, Field } from "@/components/tools/panel";
import { downloadBlob } from "@/lib/utils";

export default function FindAndReplace() {
  const [text, setText] = React.useState("");
  const [find, setFind] = React.useState("");
  const [replace, setReplace] = React.useState("");
  const [caseInsensitive, setCaseInsensitive] = React.useState(false);
  const [useRegex, setUseRegex] = React.useState(false);

  const { output, error } = React.useMemo(() => {
    if (!find) return { output: text, error: null as string | null };
    try {
      const flags = `g${caseInsensitive ? "i" : ""}`;
      const pattern = useRegex
        ? find
        : find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(pattern, flags);
      return { output: text.replace(re, replace), error: null };
    } catch (err) {
      return { output: "", error: (err as Error).message };
    }
  }, [text, find, replace, caseInsensitive, useRegex]);

  return (
    <ToolPanel className="space-y-4">
      <Field label="Text">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the text you want to search…"
          className="min-h-32"
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Find">
          <Input value={find} onChange={(e) => setFind(e.target.value)} placeholder="search for…" />
        </Field>
        <Field label="Replace with">
          <Input value={replace} onChange={(e) => setReplace(e.target.value)} placeholder="replace with…" />
        </Field>
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={caseInsensitive} onChange={(e) => setCaseInsensitive(e.target.checked)} />
          Case insensitive
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={useRegex} onChange={(e) => setUseRegex(e.target.checked)} />
          Use regex
        </label>
        <div className="ml-auto flex gap-2">
          <CopyButton value={output} label="Copy" />
          <Button variant="outline" size="sm" disabled={!output} onClick={() => downloadBlob(output, "replaced.txt")}>
            <Download /> Download
          </Button>
        </div>
      </div>
      <Textarea readOnly value={output} className="min-h-40" aria-label="Result" />
      {error && (
        <p className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" /> Invalid regex: {error}
        </p>
      )}
    </ToolPanel>
  );
}
