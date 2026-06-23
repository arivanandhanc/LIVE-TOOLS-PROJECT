import type { GenSpec } from "./types";

const X = (slug: string, name: string, description: string, keywords: string[], run: (s: string) => string, live = true): GenSpec =>
  ({ slug, name, description, keywords, category: "developer", kind: "transform", live, run });
const Dl = (slug: string, name: string, description: string, keywords: string[], aLabel: string, aRun: (s: string) => string, bLabel: string, bRun: (s: string) => string): GenSpec =>
  ({ slug, name, description, keywords, category: "developer", kind: "dual", aLabel, aRun, bLabel, bRun });

const lines = (s: string) => s.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
const luhn = (num: string) => { const d = num.replace(/\D/g, ""); if (d.length < 12) return false; let sum = 0; for (let i = 0; i < d.length; i++) { let n = +d[d.length - 1 - i]; if (i % 2) { n *= 2; if (n > 9) n -= 9; } sum += n; } return sum % 10 === 0; };
const validate = (re: RegExp | ((x: string) => boolean)) => (s: string) => lines(s).map((l) => `${(re instanceof RegExp ? re.test(l) : re(l)) ? "✓ valid" : "✗ invalid"}  ${l}`).join("\n");

export const dev2Tools: GenSpec[] = [
  X("uuid-validator", "UUID Validator", "Check whether strings are valid UUIDs.", ["uuid", "validate"], validate(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)),
  X("email-validator", "Email Validator", "Check whether lines are valid emails.", ["email", "validate"], validate(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)),
  X("url-validator", "URL Validator", "Check whether lines are valid URLs.", ["url", "validate"], validate((l) => { try { new URL(l); return true; } catch { return false; } })),
  X("credit-card-validator", "Credit Card Validator", "Validate card numbers with the Luhn check.", ["credit card", "luhn", "validate"], validate(luhn)),
  X("ipv4-validator", "IPv4 Validator", "Check whether lines are valid IPv4 addresses.", ["ip", "ipv4", "validate"], validate((l) => /^(\d{1,3}\.){3}\d{1,3}$/.test(l) && l.split(".").every((o) => +o <= 255))),
  X("hex-color-validator", "Hex Color Validator", "Check whether lines are valid hex colors.", ["hex", "color", "validate"], validate(/^#?([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i)),
  X("mac-validator", "MAC Address Validator", "Check whether lines are valid MAC addresses.", ["mac", "validate"], validate(/^([0-9a-f]{2}[:-]){5}[0-9a-f]{2}$/i)),
  X("password-strength", "Password Strength Checker", "Rate how strong a password is.", ["password", "strength"], (s) => { const p = s.trim(); let sc = 0; if (p.length >= 8) sc++; if (p.length >= 12) sc++; if (/[a-z]/.test(p) && /[A-Z]/.test(p)) sc++; if (/\d/.test(p)) sc++; if (/[^a-zA-Z0-9]/.test(p)) sc++; return `${["Very weak", "Weak", "Fair", "Good", "Strong", "Very strong"][sc]} (${sc}/5)`; }),
  X("slug-to-title", "Slug to Title", "Turn a-url-slug into a Title.", ["slug", "title", "humanize"], (s) => s.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, (c) => c.toUpperCase())),
  X("kebab-to-camel", "kebab → camelCase", "Convert kebab-case to camelCase.", ["kebab", "camel", "case"], (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())),
  X("snake-to-camel", "snake → camelCase", "Convert snake_case to camelCase.", ["snake", "camel", "case"], (s) => s.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase())),
  X("camel-to-snake", "camelCase → snake_case", "Convert camelCase to snake_case.", ["camel", "snake", "case"], (s) => s.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase()),
  X("url-parser", "URL Parser", "Break a URL into its parts.", ["url", "parse", "parts"], (s) => { let u: URL; try { u = new URL(s.trim()); } catch { throw new Error("Enter a full URL including https://"); } return `Protocol: ${u.protocol}\nHost: ${u.host}\nPath: ${u.pathname}\nQuery: ${u.search || "(none)"}\nHash: ${u.hash || "(none)"}`; }),
  X("sql-in-clause", "SQL IN Clause Builder", "Turn a list into a SQL IN (…) clause.", ["sql", "in", "clause"], (s) => `(${lines(s).map((i) => `'${i.replace(/'/g, "''")}'`).join(", ")})`),
  X("list-to-sql-values", "List to SQL VALUES", "Turn a list into SQL VALUES rows.", ["sql", "values", "insert"], (s) => lines(s).map((i) => `('${i.replace(/'/g, "''")}')`).join(",\n")),
  X("csv-column-counter", "CSV Column Counter", "Count columns and rows in CSV.", ["csv", "columns", "count"], (s) => { const l = lines(s); if (!l.length) throw new Error("No CSV data."); return `Columns: ${l[0].split(",").length}\nRows: ${l.length}`; }),
  X("csv-quote-fields", "CSV Field Quoter", "Wrap every CSV field in double quotes.", ["csv", "quote", "fields"], (s) => s.split(/\r?\n/).map((l) => l.split(",").map((f) => `"${f.trim().replace(/"/g, '""')}"`).join(",")).join("\n")),
  X("count-code-lines", "Lines of Code Counter", "Count code, blank and comment lines.", ["loc", "code", "lines"], (s) => { const all = s.split(/\r?\n/); const blank = all.filter((l) => !l.trim()).length; const comment = all.filter((l) => /^\s*(\/\/|#|\/\*|\*)/.test(l)).length; return `Total: ${all.length}\nCode: ${all.length - blank - comment}\nComments: ${comment}\nBlank: ${blank}`; }),
  X("json-array-length", "JSON Array Length", "Count items in a JSON array or object.", ["json", "length", "count"], (s) => { let o; try { o = JSON.parse(s); } catch (e) { throw new Error("Invalid JSON: " + (e as Error).message); } if (Array.isArray(o)) return `${o.length} items`; if (o && typeof o === "object") return `${Object.keys(o).length} keys`; throw new Error("Not an array or object."); }),
  Dl("list-to-json-array", "List ⇄ JSON Array", "Convert a line list to a JSON array and back.", ["list", "json", "array"], "List → JSON", (s) => JSON.stringify(lines(s), null, 2), "JSON → List", (s) => { const a = JSON.parse(s); if (!Array.isArray(a)) throw new Error("Input must be a JSON array."); return a.map(String).join("\n"); }),
  Dl("env-to-json", "ENV ⇄ JSON", "Convert .env files to JSON and back.", ["env", "json", "dotenv"], "ENV → JSON", (s) => { const o: Record<string, string> = {}; for (const l of s.split(/\r?\n/)) { const m = l.match(/^\s*([\w.]+)\s*=\s*(.*)$/); if (m) o[m[1]] = m[2].replace(/^["']|["']$/g, ""); } return JSON.stringify(o, null, 2); }, "JSON → ENV", (s) => Object.entries(JSON.parse(s)).map(([k, v]) => `${k}=${v}`).join("\n")),
  Dl("codepoint-converter", "Text ⇄ Code Points", "Convert text to U+ code points and back.", ["unicode", "codepoint", "convert"], "Text → U+", (s) => [...s].map((c) => "U+" + c.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")).join(" "), "U+ → Text", (s) => s.trim().split(/\s+/).map((t) => String.fromCodePoint(parseInt(t.replace(/^U\+/i, ""), 16))).join("")),
  Dl("octal-converter", "Decimal ⇄ Octal", "Convert decimal numbers to octal and back.", ["octal", "decimal", "convert"], "Decimal → Octal", (s) => s.trim().split(/\s+/).map((n) => parseInt(n, 10).toString(8)).join(" "), "Octal → Decimal", (s) => s.trim().split(/\s+/).map((n) => parseInt(n, 8)).join(" ")),
  Dl("hex-binary", "Hex ⇄ Binary", "Convert hexadecimal numbers to binary and back.", ["hex", "binary", "convert"], "Hex → Binary", (s) => s.trim().split(/\s+/).map((n) => parseInt(n, 16).toString(2)).join(" "), "Binary → Hex", (s) => s.trim().split(/\s+/).map((n) => parseInt(n, 2).toString(16)).join(" ")),
];
