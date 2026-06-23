import type { GenSpec } from "./types";

const nums = (s: string) => {
  const a = (s.match(/-?\d+\.?\d*/g) || []).map(Number);
  if (!a.length) throw new Error("No numbers found.");
  return a;
};
const two = (s: string): [number, number] => { const a = nums(s); if (a.length < 2) throw new Error("Enter two numbers."); return [a[0], a[1]]; };
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toLocaleString(undefined, { maximumFractionDigits: 6 }));

const C = (slug: string, name: string, description: string, keywords: string[], run: (s: string) => string, placeholder?: string): GenSpec =>
  ({ slug, name, description, keywords, category: "convert", kind: "transform", live: true, run, placeholder });

export const convert3Tools: GenSpec[] = [
  C("ratio-simplifier", "Ratio Simplifier", "Reduce a ratio to its simplest form.", ["ratio", "simplify"], (s) => { const [a, b] = two(s).map(Math.round); const g = gcd(a, b) || 1; return `${a / g} : ${b / g}`; }, "e.g. 8 12"),
  C("aspect-ratio-calculator", "Aspect Ratio Calculator", "Find the aspect ratio of width × height.", ["aspect ratio", "resolution"], (s) => { const [w, h] = two(s).map(Math.round); const g = gcd(w, h) || 1; return `${w / g}:${h / g}`; }, "e.g. 1920 1080"),
  C("percentage-difference", "Percentage Difference", "Percent difference between two numbers.", ["percentage", "difference"], (s) => { const [a, b] = two(s); return (Math.abs(a - b) / ((a + b) / 2) * 100).toFixed(2) + "%"; }, "e.g. 40 50"),
  C("percentage-of-number", "Percentage of a Number", "Find X% of a number.", ["percentage", "of"], (s) => { const [p, n] = two(s); return fmt((p / 100) * n); }, "e.g. 20 150  → 20% of 150"),
  C("unit-price-calculator", "Unit Price Calculator", "Price per unit from total price and quantity.", ["unit price", "value"], (s) => { const [price, qty] = two(s); if (!qty) throw new Error("Quantity cannot be zero."); return fmt(price / qty) + " per unit"; }, "e.g. 12.99 6"),
  C("markup-calculator", "Markup Calculator", "Markup % from cost and selling price.", ["markup", "margin"], (s) => { const [cost, price] = two(s); if (!cost) throw new Error("Cost cannot be zero."); return ((price - cost) / cost * 100).toFixed(2) + "% markup"; }, "e.g. 40 60  (cost price)"),
  C("fraction-to-decimal", "Fraction to Decimal", "Convert a fraction like 3/4 to a decimal.", ["fraction", "decimal"], (s) => { const m = s.match(/(-?\d+)\s*\/\s*(\d+)/); if (!m) throw new Error("Enter a fraction like 3/4."); if (+m[2] === 0) throw new Error("Denominator cannot be zero."); return fmt(+m[1] / +m[2]); }, "e.g. 3/4"),
  C("fraction-simplifier", "Fraction Simplifier", "Reduce a fraction to lowest terms.", ["fraction", "simplify"], (s) => { const m = s.match(/(-?\d+)\s*\/\s*(\d+)/); if (!m) throw new Error("Enter a fraction like 8/12."); const g = gcd(+m[1], +m[2]) || 1; return `${+m[1] / g}/${+m[2] / g}`; }, "e.g. 8/12"),
  C("decimal-to-fraction", "Decimal to Fraction", "Convert a decimal to its closest fraction.", ["decimal", "fraction"], (s) => { const x = nums(s)[0]; let best = [0, 1], err = Infinity; for (let den = 1; den <= 10000; den++) { const num = Math.round(x * den); const e = Math.abs(x - num / den); if (e < err) { err = e; best = [num, den]; if (e < 1e-9) break; } } const g = gcd(best[0], best[1]) || 1; return `${best[0] / g}/${best[1] / g}`; }, "e.g. 0.75"),
  C("hours-to-decimal", "Time to Decimal Hours", "Convert h:mm to decimal hours.", ["time", "decimal", "hours"], (s) => { const m = s.match(/(\d+):(\d{1,2})/); if (!m) throw new Error("Enter time as h:mm."); return fmt(+m[1] + +m[2] / 60) + " hours"; }, "e.g. 2:30"),
  C("decimal-to-hms", "Decimal Hours to h:m", "Convert decimal hours to hours and minutes.", ["decimal", "time", "hours"], (s) => { const x = nums(s)[0]; const h = Math.floor(x); const mn = Math.round((x - h) * 60); return `${h}h ${mn}m`; }, "e.g. 2.5"),
  C("speed-calculator", "Speed Calculator", "Speed from distance and time.", ["speed", "distance", "time"], (s) => { const [d, t] = two(s); if (!t) throw new Error("Time cannot be zero."); return fmt(d / t) + " per unit time"; }, "distance time, e.g. 100 2"),
  C("proportion-solver", "Proportion Solver", "Solve a:b = c:? for the missing value.", ["proportion", "rule of three"], (s) => { const a = nums(s); if (a.length < 3) throw new Error("Enter three numbers a b c."); if (!a[0]) throw new Error("First value cannot be zero."); return fmt((a[1] * a[2]) / a[0]); }, "a b c, e.g. 2 4 10"),
  C("midpoint-calculator", "Midpoint / Average of Two", "Find the midpoint of two numbers.", ["midpoint", "average"], (s) => { const [a, b] = two(s); return fmt((a + b) / 2); }, "e.g. 10 20"),
  C("dog-years-calculator", "Dog Years Calculator", "Convert human years to dog years.", ["dog years", "pet"], (s) => fmt(nums(s)[0] * 7) + " dog years", "e.g. 4"),
  C("cat-years-calculator", "Cat Years Calculator", "Convert cat age to human-equivalent years.", ["cat years", "pet"], (s) => { const y = nums(s)[0]; const h = y <= 0 ? 0 : y === 1 ? 15 : y === 2 ? 24 : 24 + (y - 2) * 4; return fmt(h) + " human years"; }, "e.g. 3"),
  C("square-root", "Square Root", "Find the square root of numbers.", ["square root", "sqrt"], (s) => nums(s).map((n) => fmt(Math.sqrt(n))).join("\n"), "e.g. 144"),
  C("cube-root", "Cube Root", "Find the cube root of numbers.", ["cube root", "cbrt"], (s) => nums(s).map((n) => fmt(Math.cbrt(n))).join("\n"), "e.g. 27"),
  C("reciprocal-calculator", "Reciprocal Calculator", "Find 1/x for each number.", ["reciprocal", "inverse"], (s) => nums(s).map((n) => (n === 0 ? "∞" : fmt(1 / n))).join("\n"), "e.g. 4"),
  C("negate-numbers", "Negate Numbers", "Flip the sign of each number.", ["negate", "sign"], (s) => nums(s).map((n) => fmt(-n)).join("\n")),
  C("number-comparison", "Number Comparison", "Compare two numbers.", ["compare", "numbers"], (s) => { const [a, b] = two(s); if (a === b) return `${fmt(a)} = ${fmt(b)}`; return `${fmt(Math.max(a, b))} is larger by ${fmt(Math.abs(a - b))}`; }, "e.g. 17 42"),
  C("power-of-two-checker", "Power of Two Checker", "Check if numbers are powers of two.", ["power of two", "binary"], (s) => nums(s).map((n) => { const r = Math.round(n); return `${r}: ${r > 0 && (r & (r - 1)) === 0 ? "yes" : "no"}`; }).join("\n"), "e.g. 64"),
];
