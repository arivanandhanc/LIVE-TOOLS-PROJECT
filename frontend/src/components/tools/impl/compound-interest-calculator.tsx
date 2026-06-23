"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { ToolPanel, Field, Stat } from "@/components/tools/panel";

const money = (n: number) =>
  Number.isFinite(n) ? n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—";

const FREQ: Record<string, number> = {
  Annually: 1, "Semi-annually": 2, Quarterly: 4, Monthly: 12, Daily: 365,
};

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = React.useState("1000");
  const [rate, setRate] = React.useState("5");
  const [years, setYears] = React.useState("10");
  const [freq, setFreq] = React.useState("Monthly");

  const p = Number(principal) || 0;
  const r = (Number(rate) || 0) / 100;
  const t = Number(years) || 0;
  const n = FREQ[freq];
  const amount = p * Math.pow(1 + r / n, n * t);
  const interest = amount - p;

  return (
    <ToolPanel className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Principal">
          <Input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
        </Field>
        <Field label="Annual interest rate (%)">
          <Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field label="Years">
          <Input type="number" value={years} onChange={(e) => setYears(e.target.value)} />
        </Field>
        <Field label="Compounding">
          <select
            value={freq}
            onChange={(e) => setFreq(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {Object.keys(FREQ).map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Stat label="Final balance" value={money(amount)} />
        <Stat label="Total interest" value={money(interest)} />
      </div>
    </ToolPanel>
  );
}
