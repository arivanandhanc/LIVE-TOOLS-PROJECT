import type { GenSpec } from "./types";

const nums = (s: string) => {
  const a = (s.match(/-?\d+\.?\d*/g) || []).map(Number);
  if (!a.length) throw new Error("No numbers found.");
  return a;
};
const gcd2 = (a: number, b: number): number => (b ? gcd2(b, a % b) : Math.abs(a));

const N = (slug: string, name: string, description: string, keywords: string[], run: (s: string) => string): GenSpec =>
  ({ slug, name, description, keywords, category: "convert", kind: "transform", live: true, run });

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toLocaleString(undefined, { maximumFractionDigits: 6 }));

export const numberTools: GenSpec[] = [
  N("sum-numbers", "Sum Numbers", "Add up a list of numbers.", ["sum", "add", "total"], (s) => fmt(nums(s).reduce((a, b) => a + b, 0))),
  N("average-numbers", "Average Calculator", "Find the mean of a list of numbers.", ["average", "mean"], (s) => { const a = nums(s); return fmt(a.reduce((x, y) => x + y, 0) / a.length); }),
  N("median-calculator", "Median Calculator", "Find the median of a list of numbers.", ["median", "middle"], (s) => { const a = nums(s).sort((x, y) => x - y); const m = Math.floor(a.length / 2); return fmt(a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2); }),
  N("min-max-finder", "Min & Max Finder", "Find the smallest and largest numbers.", ["min", "max", "range"], (s) => { const a = nums(s); return `Min: ${fmt(Math.min(...a))}\nMax: ${fmt(Math.max(...a))}\nRange: ${fmt(Math.max(...a) - Math.min(...a))}`; }),
  N("product-numbers", "Multiply Numbers", "Multiply a list of numbers together.", ["product", "multiply"], (s) => fmt(nums(s).reduce((a, b) => a * b, 1))),
  N("sort-numbers", "Sort Numbers", "Sort numbers in ascending order.", ["sort", "numbers"], (s) => nums(s).sort((a, b) => a - b).map(fmt).join("\n")),
  N("count-numbers", "Count Numbers", "Count how many numbers are in the text.", ["count", "numbers"], (s) => String(nums(s).length)),
  N("round-numbers", "Round Numbers", "Round each number to the nearest integer.", ["round", "numbers"], (s) => nums(s).map((n) => Math.round(n)).join("\n")),
  N("absolute-values", "Absolute Values", "Convert each number to its absolute value.", ["absolute", "abs"], (s) => nums(s).map((n) => fmt(Math.abs(n))).join("\n")),
  N("cumulative-sum", "Cumulative Sum", "Running total of a list of numbers.", ["cumulative", "running", "sum"], (s) => { let t = 0; return nums(s).map((n) => fmt((t += n))).join("\n"); }),
  N("digit-sum", "Digit Sum", "Add together all digits in the input.", ["digit", "sum"], (s) => { const d = s.match(/\d/g); if (!d) throw new Error("No digits found."); return String(d.reduce((a, x) => a + +x, 0)); }),
  N("reverse-digits", "Reverse Number Digits", "Reverse the digits of a number.", ["reverse", "digits"], (s) => { const n = nums(s)[0]; return [...String(Math.abs(n))].reverse().join("").replace(/^0+(?=\d)/, ""); }),
  N("square-numbers", "Square Numbers", "Square each number in the list.", ["square", "power"], (s) => nums(s).map((n) => fmt(n * n)).join("\n")),
  N("percent-of-total", "Percent of Total", "Show each number as a % of the total.", ["percent", "share", "total"], (s) => { const a = nums(s); const t = a.reduce((x, y) => x + y, 0); return a.map((n) => ((n / t) * 100).toFixed(2) + "%").join("\n"); }),
  N("ordinal-converter", "Ordinal Number Converter", "Turn numbers into 1st, 2nd, 3rd…", ["ordinal", "rank"], (s) => nums(s).map((n) => { const v = Math.abs(Math.round(n)) % 100; const suf = v >= 11 && v <= 13 ? "th" : ["th", "st", "nd", "rd"][v % 10] || "th"; return Math.round(n) + suf; }).join("\n")),
  N("factorial-calculator", "Factorial Calculator", "Compute n! for a whole number.", ["factorial", "math"], (s) => { const n = Math.round(nums(s)[0]); if (n < 0 || n > 170) throw new Error("Enter a whole number from 0 to 170."); let r = 1; for (let i = 2; i <= n; i++) r *= i; return r.toLocaleString(undefined, { maximumFractionDigits: 0 }); }),
  N("prime-checker", "Prime Number Checker", "Check whether a number is prime.", ["prime", "checker"], (s) => { const n = Math.round(nums(s)[0]); if (n < 2) return `${n} is not prime`; for (let i = 2; i * i <= n; i++) if (n % i === 0) return `${n} is not prime (divisible by ${i})`; return `${n} is prime`; }),
  N("prime-factors", "Prime Factorization", "Break a number into its prime factors.", ["prime", "factors", "factorize"], (s) => { let n = Math.round(Math.abs(nums(s)[0])); if (n < 2) throw new Error("Enter a number greater than 1."); const f: number[] = []; for (let i = 2; i * i <= n; i++) while (n % i === 0) { f.push(i); n /= i; } if (n > 1) f.push(n); return f.join(" × "); }),
  N("gcd-calculator", "GCD Calculator", "Greatest common divisor of numbers.", ["gcd", "hcf", "divisor"], (s) => { const a = nums(s).map((x) => Math.round(x)); return String(a.reduce((x, y) => gcd2(x, y))); }),
  N("lcm-calculator", "LCM Calculator", "Least common multiple of numbers.", ["lcm", "multiple"], (s) => { const a = nums(s).map((x) => Math.round(x)); return String(a.reduce((x, y) => Math.abs(x * y) / gcd2(x, y))); }),
  N("fibonacci-generator", "Fibonacci Generator", "Generate the first n Fibonacci numbers.", ["fibonacci", "sequence"], (s) => { const n = Math.min(Math.max(Math.round(nums(s)[0]), 1), 1000); const out = [0, 1]; for (let i = 2; i < n; i++) out.push(out[i - 1] + out[i - 2]); return out.slice(0, n).join(", "); }),
];
