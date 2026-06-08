"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/ui/copy-button";
import { ToolPanel, Field } from "@/components/tools/panel";

export default function GradientGenerator() {
  const [from, setFrom] = React.useState("#FBBF24");
  const [to, setTo] = React.useState("#F97316");
  const [angle, setAngle] = React.useState(135);

  const css = `linear-gradient(${angle}deg, ${from}, ${to})`;
  const full = `background: ${css};`;

  return (
    <div className="space-y-4">
      <div className="h-44 rounded-xl border border-border" style={{ background: css }} />

      <ToolPanel className="grid gap-4 sm:grid-cols-3">
        <Field label="From">
          <div className="flex items-center gap-2">
            <input type="color" value={from} onChange={(e) => setFrom(e.target.value)} className="size-10 shrink-0 cursor-pointer rounded border border-border bg-transparent" />
            <Input value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
        </Field>
        <Field label="To">
          <div className="flex items-center gap-2">
            <input type="color" value={to} onChange={(e) => setTo(e.target.value)} className="size-10 shrink-0 cursor-pointer rounded border border-border bg-transparent" />
            <Input value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </Field>
        <Field label={`Angle: ${angle}°`}>
          <input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full accent-[var(--color-primary)]" />
        </Field>
      </ToolPanel>

      <ToolPanel className="flex items-center justify-between gap-3">
        <code className="overflow-x-auto text-sm">{full}</code>
        <CopyButton value={full} />
      </ToolPanel>
    </div>
  );
}
