"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { ToolPanel, Field, Stat } from "@/components/tools/panel";

const money = (n: number) =>
  Number.isFinite(n) ? n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—";

export default function TipCalculator() {
  const [bill, setBill] = React.useState("50");
  const [tip, setTip] = React.useState("15");
  const [people, setPeople] = React.useState("1");

  const b = Number(bill) || 0;
  const t = Number(tip) || 0;
  const p = Math.max(Number(people) || 1, 1);
  const tipAmount = (b * t) / 100;
  const total = b + tipAmount;

  return (
    <ToolPanel className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Bill amount">
          <Input type="number" value={bill} onChange={(e) => setBill(e.target.value)} />
        </Field>
        <Field label="Tip %">
          <Input type="number" value={tip} onChange={(e) => setTip(e.target.value)} />
        </Field>
        <Field label="Split between">
          <Input type="number" min={1} value={people} onChange={(e) => setPeople(e.target.value)} />
        </Field>
      </div>
      <div className="flex flex-wrap gap-2">
        {[10, 15, 18, 20, 25].map((preset) => (
          <button
            key={preset}
            onClick={() => setTip(String(preset))}
            className="rounded-full border border-border px-3 py-1 text-sm hover:border-primary/50"
          >
            {preset}%
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Tip" value={money(tipAmount)} />
        <Stat label="Total" value={money(total)} />
        <Stat label="Per person" value={money(total / p)} />
      </div>
    </ToolPanel>
  );
}
