"use client";

import { UnitConverter, linear } from "@/components/tools/unit-converter";

const factors: Record<string, number> = {
  Pascals: 1, Kilopascals: 1000, Bars: 100000, PSI: 6894.757293,
  Atmospheres: 101325, "Torr (mmHg)": 133.322368, Millibars: 100,
};

export default function PressureConverter() {
  return (
    <UnitConverter
      units={Object.keys(factors)}
      convert={linear(factors)}
      defaultFrom="Bars"
      defaultTo="PSI"
    />
  );
}
