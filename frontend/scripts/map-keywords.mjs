#!/usr/bin/env node
/**
 * Map harvested search queries onto tool pages, and emit them as a generated
 * module the metadata layer can read.
 *
 * Why this exists: every tool page's `keywords` were hand-guessed patterns
 * ("<name> online", "free <name>", "<name> no sign up"). The harvest in
 * scripts/data/keywords.json is what people actually type, so the meta should
 * be built from that instead of from guesses.
 *
 * The matching is direction-aware on purpose. Naive token overlap maps
 * "jpg to pdf converter" onto the pdf-to-jpg tool, because both mention jpg and
 * pdf — which would point the wrong page at the wrong demand. Any query that
 * names a conversion direction must match the tool's own direction exactly.
 *
 * Usage:  node scripts/map-keywords.mjs [--per-tool 12]
 * Writes: src/lib/tools/generated/search-terms.ts
 */

import { readFileSync, writeFileSync } from "node:fs";

const arg = (f, d) => { const i = process.argv.indexOf(f); return i > -1 ? process.argv[i + 1] : d; };
const PER_TOOL = Number(arg("--per-tool", 12));

const keywords = JSON.parse(readFileSync("scripts/data/keywords.json", "utf8"));
const registry = readFileSync("src/lib/tools/registry.ts", "utf8");

// ── Parse the registry ────────────────────────────────────────────────────
const tools = [];
const re = /slug:\s*"([a-z0-9-]+)"[\s\S]{0,400}?name:\s*"([^"]+)"/g;
let m;
while ((m = re.exec(registry))) tools.push({ slug: m[1], name: m[2] });

/** Format families that mean the same thing to a searcher. */
const ALIAS = {
  jpg: "jpg", jpeg: "jpg", jpe: "jpg", image: "jpg", images: "jpg", img: "jpg",
  photo: "jpg", photos: "jpg", picture: "jpg", pictures: "jpg", pic: "jpg",
  png: "png", webp: "webp", heic: "heic", svg: "svg", gif: "gif", bmp: "bmp", tiff: "tiff",
  pdf: "pdf",
  word: "word", doc: "word", docx: "word", documents: "word",
  excel: "excel", xls: "excel", xlsx: "excel", spreadsheet: "excel", sheets: "excel", sheet: "excel",
  ppt: "ppt", pptx: "ppt", powerpoint: "ppt", slides: "ppt", presentation: "ppt",
  csv: "csv", json: "json", xml: "xml", tsv: "tsv", txt: "text", text: "text",
  html: "html", markdown: "markdown", md: "markdown", yaml: "yaml",
};
const canon = (w) => ALIAS[w] ?? w;

/** Pull an ordered conversion pair out of "<a> to <b>", if there is one. */
function direction(str) {
  const words = str.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(" ");
  const at = words.indexOf("to");
  if (at <= 0 || at === words.length - 1) return null;
  const from = canon(words[at - 1]);
  const to = canon(words[at + 1]);
  if (!(from in ALIAS) && !Object.values(ALIAS).includes(from)) return null;
  if (!(to in ALIAS) && !Object.values(ALIAS).includes(to)) return null;
  return from === to ? null : `${from}>${to}`;
}

const STOP = new Set(["to", "the", "a", "for", "in", "of", "and", "online", "free", "app", "best", "how", "converter", "convert"]);
const tokens = (s) =>
  new Set(s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(" ")
    .filter((w) => w && !STOP.has(w)).map(canon));

const indexed = tools.map((t) => ({
  ...t,
  dir: direction(t.slug.replace(/-/g, " ")),
  toks: tokens(`${t.slug.replace(/-/g, " ")} ${t.name}`),
}));

// ── Assign each query to its best tool ────────────────────────────────────
const byTool = new Map();
let mapped = 0;
let ambiguous = 0;

for (const k of keywords) {
  const kdir = direction(k.keyword);
  const ktoks = tokens(k.keyword);

  let best = null;
  let bestScore = 0;
  for (const t of indexed) {
    // A directional query only ever belongs to the tool with that direction.
    if (kdir && t.dir && kdir !== t.dir) continue;
    if (kdir && !t.dir) continue;
    if (!kdir && t.dir) continue;

    let hit = 0;
    for (const w of t.toks) if (ktoks.has(w)) hit++;
    const score = hit / Math.max(1, t.toks.size);
    if (score > bestScore) { bestScore = score; best = t; }
  }

  if (best && bestScore >= 0.99) {
    if (!byTool.has(best.slug)) byTool.set(best.slug, []);
    byTool.get(best.slug).push(k);
    mapped++;
  } else if (bestScore > 0) {
    ambiguous++;
  }
}

// ── Emit ──────────────────────────────────────────────────────────────────
const BRAND = /\b(ilovepdf|i love pdf|smallpdf|small pdf|adobe|11zon|pi7|canva|docupub|sejda|pdf24|acrobat|foxit|nitro|soda|google|microsoft|youtube|reddit)\b/i;

const entries = [...byTool.entries()]
  .map(([slug, list]) => {
    // Drop competitor-brand queries: we cannot rank for someone else's name,
    // and putting it in our meta reads as keyword stuffing.
    const clean = list.filter((k) => !BRAND.test(k.keyword));
    const picked = clean.slice(0, PER_TOOL).map((k) => k.keyword);
    return [slug, picked, clean.length];
  })
  .filter(([, picked]) => picked.length > 0)
  .sort((a, b) => a[0].localeCompare(b[0]));

const body = entries
  .map(([slug, picked, total]) =>
    `  // ${total} matched quer${total === 1 ? "y" : "ies"}\n  ${JSON.stringify(slug)}: [\n` +
    picked.map((k) => `    ${JSON.stringify(k)},`).join("\n") +
    "\n  ],"
  )
  .join("\n");

const out = `// GENERATED by scripts/map-keywords.mjs — do not edit by hand.
//
// The queries people actually type for each tool, mined from Google
// autocomplete (see scripts/keyword-harvest.mjs) and mapped onto tools with
// direction-aware matching, so "jpg to pdf" never lands on the pdf-to-jpg page.
// Ordered by real popularity: index 0 is the most-searched phrasing.
//
// Competitor-brand queries are excluded — we cannot rank for someone else's
// product name, and listing it would read as keyword stuffing.
//
// Regenerate:  node scripts/map-keywords.mjs

export const searchTerms: Record<string, string[]> = {
${body}
};

/** Real queries for a tool, most-searched first. Empty if we have no data. */
export function termsFor(slug: string): string[] {
  return searchTerms[slug] ?? [];
}
`;

const dest = "src/lib/tools/generated/search-terms.ts";
writeFileSync(dest, out);

console.log(`mapped ${mapped}/${keywords.length} queries onto ${entries.length} tools (${ambiguous} ambiguous, skipped)`);
console.log(`wrote ${dest}`);
console.log("\nlargest clusters:");
for (const [slug, picked, total] of [...entries].sort((a, b) => b[2] - a[2]).slice(0, 12)) {
  console.log(`  ${slug.padEnd(20)} ${String(total).padStart(4)}  ${picked[0]}`);
}
