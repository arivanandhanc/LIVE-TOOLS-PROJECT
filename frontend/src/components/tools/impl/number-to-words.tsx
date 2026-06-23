"use client";

import { Transformer } from "@/components/tools/transformer";

const ONES = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
  "seventeen", "eighteen", "nineteen",
];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const SCALES = ["", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion"];

function chunkToWords(n: number): string {
  let out = "";
  if (n >= 100) {
    out += ONES[Math.floor(n / 100)] + " hundred";
    n %= 100;
    if (n) out += " ";
  }
  if (n >= 20) {
    out += TENS[Math.floor(n / 10)];
    if (n % 10) out += "-" + ONES[n % 10];
  } else if (n > 0) {
    out += ONES[n];
  }
  return out;
}

const run = (s: string) => {
  const trimmed = s.trim().replace(/,/g, "");
  if (!/^-?\d+$/.test(trimmed)) throw new Error("Enter a whole number.");
  const negative = trimmed.startsWith("-");
  let digits = trimmed.replace("-", "").replace(/^0+(?=\d)/, "");
  if (digits.length > 21) throw new Error("Number is too large (max 21 digits).");
  if (digits === "0") return "zero";
  // Split into 3-digit groups from the right, least-significant first.
  const chunks: number[] = [];
  while (digits.length > 0) {
    const end = digits.length;
    const start = Math.max(0, end - 3);
    chunks.push(Number(digits.slice(start, end)));
    digits = digits.slice(0, start);
  }
  const parts: string[] = [];
  for (let i = chunks.length - 1; i >= 0; i--) {
    if (chunks[i] === 0) continue;
    parts.push(chunkToWords(chunks[i]) + (SCALES[i] ? " " + SCALES[i] : ""));
  }
  return (negative ? "negative " : "") + parts.join(" ");
};

export default function NumberToWords() {
  return (
    <Transformer
      inputLabel="Number"
      outputLabel="In words"
      inputPlaceholder="1234567"
      live
      actions={[{ label: "Convert to words", run }]}
    />
  );
}
