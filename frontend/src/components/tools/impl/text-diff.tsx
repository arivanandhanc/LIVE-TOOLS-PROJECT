"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { ToolPanel } from "@/components/tools/panel";
import { cn } from "@/lib/utils";

/** Line-level LCS diff — enough to highlight added/removed lines. */
function diffLines(a: string[], b: string[]) {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--)
    for (let j = n - 1; j >= 0; j--)
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);

  const rows: { type: "same" | "add" | "del"; text: string }[] = [];
  let i = 0, j = 0;
  while (i < m && j < n) {
    if (a[i] === b[j]) { rows.push({ type: "same", text: a[i] }); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { rows.push({ type: "del", text: a[i] }); i++; }
    else { rows.push({ type: "add", text: b[j] }); j++; }
  }
  while (i < m) rows.push({ type: "del", text: a[i++] });
  while (j < n) rows.push({ type: "add", text: b[j++] });
  return rows;
}

export default function TextDiff() {
  const [left, setLeft] = React.useState("");
  const [right, setRight] = React.useState("");

  const rows = React.useMemo(
    () => (left || right ? diffLines(left.split("\n"), right.split("\n")) : []),
    [left, right]
  );
  const added = rows.filter((r) => r.type === "add").length;
  const removed = rows.filter((r) => r.type === "del").length;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolPanel className="flex flex-col gap-3">
          <span className="text-sm font-medium">Original</span>
          <Textarea value={left} onChange={(e) => setLeft(e.target.value)} placeholder="Paste the original text…" className="min-h-56" />
        </ToolPanel>
        <ToolPanel className="flex flex-col gap-3">
          <span className="text-sm font-medium">Changed</span>
          <Textarea value={right} onChange={(e) => setRight(e.target.value)} placeholder="Paste the changed text…" className="min-h-56" />
        </ToolPanel>
      </div>

      {rows.length > 0 && (
        <ToolPanel className="space-y-3">
          <div className="flex gap-4 text-sm">
            <span className="text-success">+{added} added</span>
            <span className="text-destructive">−{removed} removed</span>
          </div>
          <pre className="overflow-x-auto rounded-lg border border-border bg-background p-3 text-xs leading-relaxed">
            {rows.map((r, idx) => (
              <div
                key={idx}
                className={cn(
                  "whitespace-pre-wrap px-2",
                  r.type === "add" && "bg-success/10 text-success",
                  r.type === "del" && "bg-destructive/10 text-destructive line-through decoration-destructive/40",
                )}
              >
                {r.type === "add" ? "+ " : r.type === "del" ? "− " : "  "}
                {r.text || " "}
              </div>
            ))}
          </pre>
        </ToolPanel>
      )}
    </div>
  );
}
