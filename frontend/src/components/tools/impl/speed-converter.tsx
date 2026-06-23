"use client";

import { UnitConverter, linear } from "@/components/tools/unit-converter";

const factors: Record<string, number> = {
  "Meters/second": 1, "Kilometers/hour": 0.27777777778, "Miles/hour": 0.44704,
  Knots: 0.51444444444, "Feet/second": 0.3048,
};

export default function SpeedConverter() {
  return (
    <UnitConverter
      units={Object.keys(factors)}
      convert={linear(factors)}
      defaultFrom="Kilometers/hour"
      defaultTo="Miles/hour"
    />
  );
}
