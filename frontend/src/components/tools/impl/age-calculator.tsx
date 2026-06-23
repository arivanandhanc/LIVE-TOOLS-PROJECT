"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { ToolPanel, Field, Stat } from "@/components/tools/panel";

function diff(from: Date, to: Date) {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();
  if (days < 0) {
    months -= 1;
    days += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  const totalDays = Math.floor((to.getTime() - from.getTime()) / 86400000);
  return { years, months, days, totalDays };
}

export default function AgeCalculator() {
  const [birth, setBirth] = React.useState("2000-01-01");

  const result = React.useMemo(() => {
    const d = new Date(birth);
    if (isNaN(d.getTime())) return null;
    const now = new Date();
    if (d > now) return null;
    return diff(d, now);
  }, [birth]);

  return (
    <ToolPanel className="space-y-5">
      <Field label="Date of birth">
        <Input type="date" value={birth} onChange={(e) => setBirth(e.target.value)} className="w-52" />
      </Field>
      {result ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="Years" value={result.years} />
            <Stat label="Months" value={result.months} />
            <Stat label="Days" value={result.days} />
          </div>
          <p className="text-sm text-muted-foreground">
            That is <strong>{result.totalDays.toLocaleString()}</strong> total days,{" "}
            <strong>{Math.floor(result.totalDays / 7).toLocaleString()}</strong> weeks.
          </p>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">Enter a valid past date of birth.</p>
      )}
    </ToolPanel>
  );
}
