"use client";

import { UnitConverter, linear } from "@/components/tools/unit-converter";

const factors: Record<string, number> = {
  Degrees: 1, Radians: 57.29577951308232, Gradians: 0.9,
  Arcminutes: 1 / 60, Arcseconds: 1 / 3600, Turns: 360,
};

export default function AngleConverter() {
  return (
    <UnitConverter
      units={Object.keys(factors)}
      convert={linear(factors)}
      defaultFrom="Degrees"
      defaultTo="Radians"
    />
  );
}
