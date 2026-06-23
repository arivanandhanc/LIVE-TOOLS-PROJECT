"use client";

import * as React from "react";
import { ArrowLeftRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ToolPanel, Field } from "@/components/tools/panel";

const UNITS = ["B", "KB", "MB", "GB", "TB", "PB"] as const;
type Unit = (typeof UNITS)[number];
const FACTOR: Record<Unit, number> = {
  B: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3, TB: 1024 ** 4, PB: 1024 ** 5,
};

function Select({ value, onChange }: { value: Unit; onChange: (u: Unit) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Unit)}
      className="h-9 rounded-md border border-input bg-background px-3 text-sm"
    >
      {UNITS.map((u) => (
        <option key={u} value={u}>{u}</option>
      ))}
    </select>
  );
}

export default function DataSizeConverter() {
  const [value, setValue] = React.useState("1");
  const [from, setFrom] = React.useState<Unit>("GB");
  const [to, setTo] = React.useState<Unit>("MB");

  const result = React.useMemo(() => {
    const v = Number(value);
    if (!Number.isFinite(v)) return "—";
    const bytes = v * FACTOR[from];
    const out = bytes / FACTOR[to];
    return out.toLocaleString(undefined, { maximumFractionDigits: 6 });
  }, [value, from, to]);

  return (
    <ToolPanel className="space-y-5">
      <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <Field label="From">
          <div className="flex gap-2">
            <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} />
            <Select value={from} onChange={setFrom} />
          </div>
        </Field>
        <button
          onClick={() => { setFrom(to); setTo(from); }}
          className="mb-1 grid size-9 place-items-center rounded-md border border-border hover:border-primary/50"
          aria-label="Swap units"
        >
          <ArrowLeftRight className="size-4" />
        </button>
        <Field label="To">
          <div className="flex gap-2">
            <Input readOnly value={result} className="font-bold tabular-nums" />
            <Select value={to} onChange={setTo} />
          </div>
        </Field>
      </div>
      <p className="text-xs text-muted-foreground">Uses binary units (1 KB = 1024 bytes).</p>
    </ToolPanel>
  );
}
