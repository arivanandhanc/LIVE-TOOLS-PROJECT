"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/ui/copy-button";
import { ToolPanel, Field } from "@/components/tools/panel";
import { downloadBlob } from "@/lib/utils";

export default function TextRepeater() {
  const [text, setText] = React.useState("");
  const [count, setCount] = React.useState(5);
  const [newline, setNewline] = React.useState(true);

  const output = React.useMemo(() => {
    const n = Math.min(Math.max(count, 0), 100000);
    if (!text || n === 0) return "";
    return Array(n).fill(text).join(newline ? "\n" : "");
  }, [text, count, newline]);

  return (
    <ToolPanel className="space-y-4">
      <Field label="Text to repeat">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type the text you want to repeat…"
          className="min-h-32"
        />
      </Field>
      <div className="flex flex-wrap items-end gap-4">
        <Field label="Repeat count">
          <Input
            type="number"
            min={1}
            max={100000}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-32"
          />
        </Field>
        <label className="flex items-center gap-2 pb-2 text-sm">
          <input
            type="checkbox"
            checked={newline}
            onChange={(e) => setNewline(e.target.checked)}
          />
          New line between copies
        </label>
        <div className="ml-auto flex gap-2 pb-1">
          <CopyButton value={output} label="Copy" />
          <Button
            variant="outline"
            size="sm"
            disabled={!output}
            onClick={() => downloadBlob(output, "repeated.txt")}
          >
            <Download /> Download
          </Button>
        </div>
      </div>
      <Textarea readOnly value={output} className="min-h-48" aria-label="Repeated text" />
      <p className="text-xs text-muted-foreground">{output.length.toLocaleString()} characters generated locally.</p>
    </ToolPanel>
  );
}
