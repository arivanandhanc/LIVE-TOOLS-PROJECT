"use client";

import { UnitConverter, linear } from "@/components/tools/unit-converter";

const factors: Record<string, number> = {
  Joules: 1, Kilojoules: 1000, Calories: 4.184, Kilocalories: 4184,
  "Watt-hours": 3600, "Kilowatt-hours": 3.6e6, BTU: 1055.05585,
  Electronvolts: 1.602176634e-19,
};

export default function EnergyConverter() {
  return (
    <UnitConverter
      units={Object.keys(factors)}
      convert={linear(factors)}
      defaultFrom="Kilocalories"
      defaultTo="Kilojoules"
    />
  );
}
