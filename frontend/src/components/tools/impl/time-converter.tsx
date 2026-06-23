"use client";

import { UnitConverter, linear } from "@/components/tools/unit-converter";

const factors: Record<string, number> = {
  Seconds: 1, Milliseconds: 0.001, Minutes: 60, Hours: 3600, Days: 86400,
  Weeks: 604800, Months: 2629800, Years: 31557600,
};

export default function TimeConverter() {
  return (
    <UnitConverter
      units={Object.keys(factors)}
      convert={linear(factors)}
      defaultFrom="Hours"
      defaultTo="Minutes"
      note="Months use a 30.44-day average; years use 365.25 days."
    />
  );
}
