"use client";

import { UnitConverter, linear } from "@/components/tools/unit-converter";

const factors: Record<string, number> = {
  Grams: 1, Kilograms: 1000, Milligrams: 0.001, "Metric tons": 1e6,
  Pounds: 453.59237, Ounces: 28.349523125, Stones: 6350.29318,
};

export default function WeightConverter() {
  return (
    <UnitConverter
      units={Object.keys(factors)}
      convert={linear(factors)}
      defaultFrom="Kilograms"
      defaultTo="Pounds"
    />
  );
}
