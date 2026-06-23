"use client";

import { Transformer } from "@/components/tools/transformer";

const VALUES: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
  [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

const toRoman = (s: string) => {
  const n = Number(s.trim());
  if (!Number.isInteger(n) || n < 1 || n > 3999) {
    throw new Error("Enter a whole number between 1 and 3999.");
  }
  let remaining = n;
  let out = "";
  for (const [value, symbol] of VALUES) {
    while (remaining >= value) {
      out += symbol;
      remaining -= value;
    }
  }
  return out;
};

const fromRoman = (s: string) => {
  const roman = s.trim().toUpperCase();
  if (!/^[MDCLXVI]+$/.test(roman)) throw new Error("Enter a valid Roman numeral (M D C L X V I).");
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < roman.length; i++) {
    const cur = map[roman[i]];
    const next = map[roman[i + 1]] ?? 0;
    total += cur < next ? -cur : cur;
  }
  if (toRoman(String(total)) !== roman) throw new Error("That is not a valid Roman numeral.");
  return String(total);
};

export default function RomanNumeralConverter() {
  return (
    <Transformer
      inputLabel="Number or Roman numeral"
      outputLabel="Result"
      inputPlaceholder="Type 2026 to convert, or MMXXVI to decode…"
      actions={[
        { label: "Number → Roman", run: toRoman },
        { label: "Roman → Number", run: fromRoman, variant: "outline" },
      ]}
    />
  );
}
