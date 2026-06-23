"use client";

import { UnitConverter } from "@/components/tools/unit-converter";

const units = ["Celsius", "Fahrenheit", "Kelvin"];

function toCelsius(v: number, from: string): number {
  if (from === "Fahrenheit") return (v - 32) * (5 / 9);
  if (from === "Kelvin") return v - 273.15;
  return v;
}
function fromCelsius(c: number, to: string): number {
  if (to === "Fahrenheit") return c * (9 / 5) + 32;
  if (to === "Kelvin") return c + 273.15;
  return c;
}

const convert = (v: number, from: string, to: string) => fromCelsius(toCelsius(v, from), to);

export default function TemperatureConverter() {
  return (
    <UnitConverter
      units={units}
      convert={convert}
      defaultFrom="Celsius"
      defaultTo="Fahrenheit"
      defaultValue="20"
    />
  );
}
