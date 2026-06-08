"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/ui/copy-button";
import { ToolPanel, Field } from "@/components/tools/panel";

const BASES: { label: string; base: number }[] = [
  { label: "Binary (2)", base: 2 },
  { label: "Octal (8)", base: 8 },
  { label: "Decimal (10)", base: 10 },
  { label: "Hexadecimal (16)", base: 16 },
];

export default function NumberBaseConverter() {
  const [input, setInput] = React.useState("255");
  const [fromBase, setFromBase] = React.useState(10);

  const value = React.useMemo(() => {
    const clean = input.trim().toLowerCase().replace(/^0x|^0b|^0o/, "");
    if (!clean) return null;
    const n = parseInt(clean, fromBase);
    return Number.isNaN(n) ? null : n;
  }, [input, fromBase]);

  return (
    <div className="space-y-4">
      <ToolPanel className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <Field label="Number">
          <Input value={input} onChange={(e) => setInput(e.target.value)} className="font-mono" />
        </Field>
        <Field label="Input base">
          <select
            value={fromBase}
            onChange={(e) => setFromBase(Number(e.target.value))}
            className="h-10 rounded-md border border-border bg-background px-3 text-sm"
          >
            {BASES.map((b) => <option key={b.base} value={b.base}>{b.label}</option>)}
          </select>
        </Field>
      </ToolPanel>

      {value !== null ? (
        <ToolPanel className="grid gap-2">
          {BASES.map((b) => (
            <div key={b.base} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">{b.label}</span>
              <span className="flex items-center gap-2">
                <code className="text-sm">{value.toString(b.base).toUpperCase()}</code>
                <CopyButton value={value.toString(b.base)} />
              </span>
            </div>
          ))}
        </ToolPanel>
      ) : (
        <p className="text-sm text-muted-foreground">Enter a valid number for the chosen base.</p>
      )}
    </div>
  );
}
