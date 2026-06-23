import type { GenSpec } from "./types";

const nums = (s: string) => {
  const a = (s.match(/-?\d+\.?\d*/g) || []).map(Number);
  if (!a.length) throw new Error("No numbers found.");
  return a;
};
const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toLocaleString(undefined, { maximumFractionDigits: 6 }));
const N = (slug: string, name: string, description: string, keywords: string[], run: (s: string) => string): GenSpec =>
  ({ slug, name, description, keywords, category: "convert", kind: "transform", live: true, run });

export const numbers2Tools: GenSpec[] = [
  N("mode-finder", "Mode Finder", "Find the most common number(s).", ["mode", "frequency"], (s) => { const a = nums(s); const m = new Map<number, number>(); for (const n of a) m.set(n, (m.get(n) ?? 0) + 1); const max = Math.max(...m.values()); return [...m.entries()].filter(([, c]) => c === max).map(([n]) => fmt(n)).join(", ") + ` (×${max})`; }),
  N("sum-of-squares", "Sum of Squares", "Add up the squares of numbers.", ["sum", "squares"], (s) => fmt(nums(s).reduce((a, b) => a + b * b, 0))),
  N("reverse-number-list", "Reverse Number List", "Reverse the order of a number list.", ["reverse", "numbers"], (s) => nums(s).reverse().map(fmt).join("\n")),
  N("even-numbers-filter", "Even Numbers Filter", "Keep only the even numbers.", ["even", "filter"], (s) => nums(s).filter((n) => n % 2 === 0).map(fmt).join("\n")),
  N("odd-numbers-filter", "Odd Numbers Filter", "Keep only the odd numbers.", ["odd", "filter"], (s) => nums(s).filter((n) => Math.abs(n % 2) === 1).map(fmt).join("\n")),
  N("positive-numbers-filter", "Positive Numbers Filter", "Keep only positive numbers.", ["positive", "filter"], (s) => nums(s).filter((n) => n > 0).map(fmt).join("\n")),
  N("negative-numbers-filter", "Negative Numbers Filter", "Keep only negative numbers.", ["negative", "filter"], (s) => nums(s).filter((n) => n < 0).map(fmt).join("\n")),
  N("dedupe-numbers", "Deduplicate Numbers", "Remove repeated numbers.", ["dedupe", "unique", "numbers"], (s) => [...new Set(nums(s))].map(fmt).join("\n")),
  N("normalize-numbers", "Normalize Numbers (0–1)", "Scale numbers to a 0–1 range.", ["normalize", "scale"], (s) => { const a = nums(s); const lo = Math.min(...a), hi = Math.max(...a); if (lo === hi) throw new Error("Need varied numbers."); return a.map((n) => ((n - lo) / (hi - lo)).toFixed(4)).join("\n"); }),
  N("number-to-percentage", "Number to Percentage", "Multiply numbers by 100 and add %.", ["percentage", "convert"], (s) => nums(s).map((n) => (n * 100).toLocaleString(undefined, { maximumFractionDigits: 4 }) + "%").join("\n")),
  N("percentage-to-decimal", "Percentage to Decimal", "Convert percentages to decimals.", ["percentage", "decimal"], (s) => nums(s).map((n) => fmt(n / 100)).join("\n")),
  N("scientific-notation", "Scientific Notation", "Convert numbers to scientific notation.", ["scientific", "exponential"], (s) => nums(s).map((n) => n.toExponential()).join("\n")),
  N("round-2-decimals", "Round to 2 Decimals", "Round each number to two decimals.", ["round", "decimals"], (s) => nums(s).map((n) => n.toFixed(2)).join("\n")),
  N("floor-numbers", "Floor Numbers", "Round each number down to an integer.", ["floor", "round down"], (s) => nums(s).map((n) => String(Math.floor(n))).join("\n")),
  N("ceil-numbers", "Ceiling Numbers", "Round each number up to an integer.", ["ceiling", "round up"], (s) => nums(s).map((n) => String(Math.ceil(n))).join("\n")),
  N("double-numbers", "Double Numbers", "Multiply each number by two.", ["double", "multiply"], (s) => nums(s).map((n) => fmt(n * 2)).join("\n")),
  N("halve-numbers", "Halve Numbers", "Divide each number by two.", ["halve", "divide"], (s) => nums(s).map((n) => fmt(n / 2)).join("\n")),
  N("even-odd-summary", "Even/Odd Summary", "Count even and odd numbers.", ["even", "odd", "count"], (s) => { const a = nums(s).map((n) => Math.round(n)); const e = a.filter((n) => n % 2 === 0).length; return `Even: ${e}\nOdd: ${a.length - e}`; }),
  N("standard-deviation", "Standard Deviation", "Population standard deviation of numbers.", ["standard deviation", "stats"], (s) => { const a = nums(s); const m = a.reduce((x, y) => x + y, 0) / a.length; const v = a.reduce((x, y) => x + (y - m) ** 2, 0) / a.length; return v ** 0.5 < 1e-12 ? "0" : (v ** 0.5).toLocaleString(undefined, { maximumFractionDigits: 6 }); }),
  N("variance-calculator", "Variance Calculator", "Population variance of numbers.", ["variance", "stats"], (s) => { const a = nums(s); const m = a.reduce((x, y) => x + y, 0) / a.length; return fmt(a.reduce((x, y) => x + (y - m) ** 2, 0) / a.length); }),
];
