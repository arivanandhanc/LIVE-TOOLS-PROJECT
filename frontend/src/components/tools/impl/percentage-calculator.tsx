"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { ToolPanel } from "@/components/tools/panel";

const num = (v: string) => (v.trim() === "" ? NaN : Number(v));
const fmt = (n: number) =>
  Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: 4 }) : "—";

function Row({ children, result }: { children: React.ReactNode; result: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-background p-4 sm:flex-row sm:items-center">
      <div className="flex flex-1 flex-wrap items-center gap-2 text-sm">{children}</div>
      <div className="text-lg font-bold tabular-nums text-primary">= {result}</div>
    </div>
  );
}

export default function PercentageCalculator() {
  const [a1, setA1] = React.useState("15");
  const [b1, setB1] = React.useState("200");
  const [a2, setA2] = React.useState("30");
  const [b2, setB2] = React.useState("150");
  const [a3, setA3] = React.useState("100");
  const [b3, setB3] = React.useState("125");

  const w = "w-24";

  return (
    <ToolPanel className="space-y-4">
      <Row result={fmt((num(a1) / 100) * num(b1))}>
        What is <Input className={w} value={a1} onChange={(e) => setA1(e.target.value)} />% of
        <Input className={w} value={b1} onChange={(e) => setB1(e.target.value)} />?
      </Row>
      <Row result={`${fmt((num(a2) / num(b2)) * 100)}%`}>
        <Input className={w} value={a2} onChange={(e) => setA2(e.target.value)} /> is what % of
        <Input className={w} value={b2} onChange={(e) => setB2(e.target.value)} />?
      </Row>
      <Row result={`${fmt(((num(b3) - num(a3)) / num(a3)) * 100)}%`}>
        % change from <Input className={w} value={a3} onChange={(e) => setA3(e.target.value)} /> to
        <Input className={w} value={b3} onChange={(e) => setB3(e.target.value)} />
      </Row>
      <p className="text-xs text-muted-foreground">Calculated live in your browser.</p>
    </ToolPanel>
  );
}
