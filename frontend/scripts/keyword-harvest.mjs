#!/usr/bin/env node
/**
 * Keyword harvester — builds a ranked list of the queries people actually type,
 * from Google's public autocomplete endpoint.
 *
 * Why this and not a keyword tool: Keyword Planner needs an Ads account and
 * Ahrefs/Semrush need a paid key, but autocomplete is free, unauthenticated,
 * and its suggestions are ordered by real search popularity. That ordering is
 * the signal we mine — it is a *relative* popularity proxy, not a volume
 * number, so treat the output as a ranking, never as "N searches/month".
 *
 * Method:
 *   1. Seed with our own tool vocabulary (registry names + category terms).
 *   2. Expand each seed with a-z, 0-9 and intent prefixes/suffixes.
 *   3. Feed strong results back as seeds (breadth-first, bounded depth).
 *   4. Score each unique query by the best rank it ever appeared at, then by
 *      how many different expansions surfaced it.
 *
 * Usage:  node scripts/keyword-harvest.mjs [--target 5000] [--depth 2] [--gl in]
 * Output: scripts/data/keywords.json  (ranked)  +  keywords.csv
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dir, "data");

const arg = (flag, def) => {
  const i = process.argv.indexOf(flag);
  return i > -1 ? process.argv[i + 1] : def;
};
const TARGET = Number(arg("--target", 5000));
const MAX_DEPTH = Number(arg("--depth", 2));
const GL = arg("--gl", "in"); // market: India is the dominant audience for KB-limit queries
const HL = arg("--hl", "en");

// Politeness: autocomplete tolerates far more than /search, but not abuse.
const DELAY_MS = 120;
const MAX_RETRIES = 3;

const ALPHA = "abcdefghijklmnopqrstuvwxyz".split("");
const DIGITS = "0123456789".split("");

/** Seeds: the head terms our tools compete for. */
const SEEDS = [
  // PDF
  "compress pdf", "merge pdf", "split pdf", "pdf to word", "word to pdf",
  "pdf to jpg", "jpg to pdf", "pdf to excel", "excel to pdf", "pdf to ppt",
  "rotate pdf", "watermark pdf", "ocr pdf", "sign pdf", "crop pdf",
  "unlock pdf", "protect pdf", "edit pdf", "resize pdf", "png to pdf",
  "pdf compressor", "pdf converter", "reduce pdf size", "pdf editor",
  // Image
  "compress image", "resize image", "image compressor", "image resizer",
  "crop image", "convert image", "jpg to png", "png to jpg", "webp to jpg",
  "heic to jpg", "svg to png", "image to text", "remove background",
  "reduce image size", "photo compressor", "photo resizer", "image converter",
  // ID / photo
  "passport photo", "passport size photo", "visa photo", "id photo",
  // Data / dev / text
  "csv to json", "json to csv", "csv to excel", "excel to csv",
  "json formatter", "base64 encode", "qr code generator", "word counter",
  "case converter", "text to speech", "url encode", "hash generator",
  "unit converter", "percentage calculator", "age calculator",
  // Generic intent
  "online tools", "free online tools", "file converter",
];

/** A query is only kept if it is plausibly about what we do. */
const RELEVANT = /\b(pdf|image|images|img|photo|photos|picture|jpg|jpeg|png|webp|heic|svg|gif|bmp|tiff|file|files|document|doc|docx|word|excel|xls|xlsx|ppt|csv|json|xml|tsv|text|convert|converter|compress|compressor|resize|resizer|reduce|crop|merge|split|rotate|watermark|ocr|sign|encode|decode|base64|qr|hash|calculator|counter|generator|editor|tool|tools|passport|visa|scan|scanner|kb|mb|dpi|pixel|pixels)\b/i;

const suggestUrl = (q) =>
  `https://suggestqueries.google.com/complete/search?client=firefox&hl=${HL}&gl=${GL}&q=${encodeURIComponent(q)}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let requests = 0;
let blocked = 0;

async function suggest(q) {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      requests++;
      const res = await fetch(suggestUrl(q), {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; scrabtools-keyword-research)" },
      });
      if (res.status === 429 || res.status >= 500) {
        blocked++;
        // Back off hard — a throttled endpoint returns junk, not fewer results.
        await sleep(2000 * (attempt + 1));
        continue;
      }
      if (!res.ok) return [];
      const body = await res.json();
      return Array.isArray(body?.[1]) ? body[1] : [];
    } catch {
      await sleep(500 * (attempt + 1));
    }
  }
  return [];
}

/**
 * Score model. `best` is the strongest signal: appearing at position 0 for any
 * expansion means Google ranks it top for that prefix. `hits` breaks ties —
 * a query surfaced by many different expansions is broadly popular rather than
 * an artefact of one narrow prefix.
 */
const found = new Map(); // keyword -> { best, hits, seed }

function record(keyword, index, seed) {
  const k = keyword.trim().toLowerCase();
  if (k.length < 4 || k.length > 90) return;
  if (!RELEVANT.test(k)) return;
  const prev = found.get(k);
  if (prev) {
    prev.hits++;
    if (index < prev.best) prev.best = index;
  } else {
    found.set(k, { best: index, hits: 1, seed });
  }
}

/** Expansions applied to every seed, cheapest/highest-yield first. */
function expansions(seed) {
  const out = [seed, `${seed} `];
  for (const c of ALPHA) out.push(`${seed} ${c}`);
  for (const d of DIGITS) out.push(`${seed} ${d}`);
  for (const p of ["how to ", "best ", "free ", "online "]) out.push(`${p}${seed}`);
  for (const s of [" to ", " online", " free", " without", " app", " in "]) out.push(`${seed}${s}`);
  return out;
}

async function main() {
  console.log(`Harvesting to ${TARGET} keywords (gl=${GL}, depth=${MAX_DEPTH})…`);

  let frontier = [...SEEDS];
  const seenSeed = new Set(frontier);

  for (let depth = 0; depth < MAX_DEPTH && found.size < TARGET; depth++) {
    const next = [];
    for (const seed of frontier) {
      if (found.size >= TARGET) break;
      for (const q of expansions(seed)) {
        if (found.size >= TARGET) break;
        const results = await suggest(q);
        results.forEach((r, i) => record(r, i, seed));
        // Promote the top suggestions of this prefix to next-round seeds.
        for (const r of results.slice(0, 3)) {
          const k = r.trim().toLowerCase();
          if (!seenSeed.has(k) && RELEVANT.test(k) && k.split(" ").length <= 6) {
            seenSeed.add(k);
            next.push(k);
          }
        }
        await sleep(DELAY_MS);
      }
      process.stdout.write(`\r  depth ${depth + 1} · ${found.size} keywords · ${requests} requests   `);
    }
    frontier = next;
    if (frontier.length === 0) break;
  }

  const ranked = [...found.entries()]
    .map(([keyword, m]) => ({ keyword, best: m.best, hits: m.hits, seed: m.seed }))
    .sort((a, b) => a.best - b.best || b.hits - a.hits || a.keyword.localeCompare(b.keyword))
    .slice(0, TARGET)
    .map((r, i) => ({ rank: i + 1, ...r }));

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, "keywords.json"), JSON.stringify(ranked, null, 2));
  writeFileSync(
    join(OUT_DIR, "keywords.csv"),
    ["rank,keyword,best_position,hits,seed", ...ranked.map((r) =>
      `${r.rank},"${r.keyword.replace(/"/g, '""')}",${r.best},${r.hits},"${r.seed}"`)].join("\n")
  );

  console.log(`\n\nDone. ${ranked.length} keywords · ${requests} requests · ${blocked} throttled`);
  console.log(`  ${join(OUT_DIR, "keywords.json")}`);
  console.log("\nTop 25:");
  ranked.slice(0, 25).forEach((r) => console.log(`  ${String(r.rank).padStart(4)}. ${r.keyword}  (best #${r.best}, ${r.hits} hits)`));
}

main().catch((e) => { console.error(e); process.exit(1); });
