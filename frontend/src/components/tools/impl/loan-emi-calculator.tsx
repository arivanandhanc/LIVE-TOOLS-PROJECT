"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { ToolPanel, Field, Stat } from "@/components/tools/panel";

const money = (n: number) =>
  Number.isFinite(n) ? n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—";

export default function LoanEmiCalculator() {
  const [amount, setAmount] = React.useState("100000");
  const [rate, setRate] = React.useState("8");
  const [years, setYears] = React.useState("5");

  const p = Number(amount) || 0;
  const r = (Number(rate) || 0) / 100 / 12;
  const n = (Number(years) || 0) * 12;

  const emi = r === 0 ? (n ? p / n : 0) : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const total = emi * n;
  const interest = total - p;

  return (
    <ToolPanel className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Loan amount">
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </Field>
        <Field label="Annual rate (%)">
          <Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field label="Term (years)">
          <Input type="number" value={years} onChange={(e) => setYears(e.target.value)} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Monthly EMI" value={money(emi)} />
        <Stat label="Total interest" value={money(interest)} />
        <Stat label="Total payment" value={money(total)} />
      </div>
    </ToolPanel>
  );
}
