"use client";

import * as React from "react";
import { ArrowLeftRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ToolPanel, Field } from "@/components/tools/panel";

/** Build a convert fn for simple linear units expressed as factors-to-base. */
export function linear(factors: Record<string, number>) {
  return (value: number, from: string, to: string) => (value * factors[from]) / factors[to];
}

function UnitSelect({
  value,
  units,
  onChange,
}: {
  value: string;
  units: string[];
  onChange: (u: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 rounded-md border border-input bg-background px-3 text-sm"
    >
      {units.map((u) => (
        <option key={u} value={u}>{u}</option>
      ))}
    </select>
  );
}

export function UnitConverter({
  units,
  convert,
  note,
  defaultFrom,
  defaultTo,
  defaultValue = "1",
}: {
  units: string[];
  convert: (value: number, from: string, to: string) => number;
  note?: string;
  defaultFrom?: string;
  defaultTo?: string;
  defaultValue?: string;
}) {
  const [value, setValue] = React.useState(defaultValue);
  const [from, setFrom] = React.useState(defaultFrom ?? units[0]);
  const [to, setTo] = React.useState(defaultTo ?? units[1] ?? units[0]);

  const result = React.useMemo(() => {
    const v = Number(value);
    if (!Number.isFinite(v)) return "—";
    const out = convert(v, from, to);
    return Number.isFinite(out)
      ? out.toLocaleString(undefined, { maximumFractionDigits: 6 })
      : "—";
  }, [value, from, to, convert]);

  return (
    <ToolPanel className="space-y-5">
      <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <Field label="From">
          <div className="flex gap-2">
            <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} />
            <UnitSelect value={from} units={units} onChange={setFrom} />
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
            <UnitSelect value={to} units={units} onChange={setTo} />
          </div>
        </Field>
      </div>
      {note && <p className="text-xs text-muted-foreground">{note}</p>}
    </ToolPanel>
  );
}
