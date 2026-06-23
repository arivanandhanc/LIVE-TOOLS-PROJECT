"use client";

import { UnitConverter, linear } from "@/components/tools/unit-converter";

const factors: Record<string, number> = {
  "Square meters": 1, "Square kilometers": 1e6, "Square centimeters": 1e-4,
  "Square miles": 2589988.110336, "Square yards": 0.83612736,
  "Square feet": 0.09290304, Acres: 4046.8564224, Hectares: 10000,
};

export default function AreaConverter() {
  return (
    <UnitConverter
      units={Object.keys(factors)}
      convert={linear(factors)}
      defaultFrom="Square meters"
      defaultTo="Square feet"
    />
  );
}
