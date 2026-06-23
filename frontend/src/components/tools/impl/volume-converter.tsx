"use client";

import { UnitConverter, linear } from "@/components/tools/unit-converter";

const factors: Record<string, number> = {
  Liters: 1, Milliliters: 0.001, "Cubic meters": 1000,
  "Gallons (US)": 3.785411784, "Quarts (US)": 0.946352946,
  "Pints (US)": 0.473176473, "Cups (US)": 0.2365882365,
  "Fluid ounces (US)": 0.0295735295625, Tablespoons: 0.01478676478125,
  Teaspoons: 0.00492892159375,
};

export default function VolumeConverter() {
  return (
    <UnitConverter
      units={Object.keys(factors)}
      convert={linear(factors)}
      defaultFrom="Liters"
      defaultTo="Gallons (US)"
    />
  );
}
