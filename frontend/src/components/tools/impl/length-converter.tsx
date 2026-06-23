"use client";

import { UnitConverter, linear } from "@/components/tools/unit-converter";

const factors: Record<string, number> = {
  Meters: 1, Kilometers: 1000, Centimeters: 0.01, Millimeters: 0.001,
  Micrometers: 1e-6, Miles: 1609.344, Yards: 0.9144, Feet: 0.3048,
  Inches: 0.0254, "Nautical miles": 1852,
};

export default function LengthConverter() {
  return (
    <UnitConverter
      units={Object.keys(factors)}
      convert={linear(factors)}
      defaultFrom="Meters"
      defaultTo="Feet"
    />
  );
}
