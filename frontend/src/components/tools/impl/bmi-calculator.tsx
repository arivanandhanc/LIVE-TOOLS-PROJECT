"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { ToolPanel, Field, Stat } from "@/components/tools/panel";

function category(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

export default function BmiCalculator() {
  const [metric, setMetric] = React.useState(true);
  const [weight, setWeight] = React.useState("70");
  const [height, setHeight] = React.useState("175");

  const bmi = React.useMemo(() => {
    const w = Number(weight);
    const h = Number(height);
    if (!w || !h) return NaN;
    return metric ? w / (h / 100) ** 2 : (703 * w) / h ** 2;
  }, [weight, height, metric]);

  return (
    <ToolPanel className="space-y-5">
      <div className="inline-flex rounded-lg border border-border p-1 text-sm">
        <button
          className={`rounded-md px-3 py-1 ${metric ? "bg-primary text-primary-foreground" : ""}`}
          onClick={() => setMetric(true)}
        >
          Metric
        </button>
        <button
          className={`rounded-md px-3 py-1 ${!metric ? "bg-primary text-primary-foreground" : ""}`}
          onClick={() => setMetric(false)}
        >
          Imperial
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={metric ? "Weight (kg)" : "Weight (lb)"}>
          <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
        </Field>
        <Field label={metric ? "Height (cm)" : "Height (in)"}>
          <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Stat label="BMI" value={Number.isFinite(bmi) ? bmi.toFixed(1) : "—"} />
        <Stat label="Category" value={Number.isFinite(bmi) ? category(bmi) : "—"} />
      </div>
      <p className="text-xs text-muted-foreground">
        BMI is a general indicator and does not account for muscle mass or body composition.
      </p>
    </ToolPanel>
  );
}
