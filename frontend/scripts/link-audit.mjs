#!/usr/bin/env node
/**
 * Internal-link audit — fails if any page we submit to Google is orphaned.
 *
 * An orphan is a URL that appears in the sitemap but that no other page links
 * to. Google treats "in the sitemap, linked from nowhere" as a weak signal: it
 * crawls the URL once, finds nothing pointing at it, and parks it under
 * "Discovered - currently not indexed". That bucket was 156 pages when this
 * script was written, and 102 pages were orphaned — including 54 that had just
 * been added.
 *
 * Also reports click depth, because pages more than 3 clicks from the homepage
 * get crawled less often even when they are linked.
 *
 * Run after `next build` — it reads the prerendered HTML, not the live site:
 *   node scripts/link-audit.mjs [--max-depth 4] [--allow N]
 * Exits non-zero if orphans exist, so CI catches a broken cluster wiring.
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = ".next/server/app";
const arg = (f, d) => { const i = process.argv.indexOf(f); return i > -1 ? process.argv[i + 1] : d; };
const MAX_DEPTH = Number(arg("--max-depth", 4));
const ALLOWED_ORPHANS = Number(arg("--allow", 0));

const sitemapPath = join(ROOT, "sitemap.xml.body");
if (!existsSync(sitemapPath)) {
  console.error(`No build output at ${sitemapPath} — run \`npm run build\` first.`);
  process.exit(1);
}

const norm = (u) => (u.replace(/\/$/, "") || "/");

const sitemap = readFileSync(sitemapPath, "utf8");
const all = new Set(
  [...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)]
    .map((m) => norm(m[1].replace(/^https?:\/\/[^/]+/, "")))
);

function htmlFor(url) {
  const p = url === "/" ? join(ROOT, "index.html") : join(ROOT, `${url.replace(/^\//, "")}.html`);
  return existsSync(p) ? readFileSync(p, "utf8") : null;
}

// Breadth-first from the homepage over internal links only.
const depth = new Map([["/", 0]]);
let frontier = ["/"];
for (let d = 1; d <= 8 && frontier.length; d++) {
  const next = [];
  for (const url of frontier) {
    const html = htmlFor(url);
    if (!html) continue;
    for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
      const link = norm(m[1]);
      if (all.has(link) && !depth.has(link)) {
        depth.set(link, d);
        next.push(link);
      }
    }
  }
  frontier = next;
}

const orphans = [...all].filter((u) => !depth.has(u));
const tooDeep = [...depth.entries()].filter(([, d]) => d > MAX_DEPTH);

const buckets = new Map();
for (const u of all) {
  const d = depth.has(u) ? depth.get(u) : "orphan";
  buckets.set(d, (buckets.get(d) ?? 0) + 1);
}

console.log(`Sitemap URLs: ${all.size}\n`);
console.log("clicks from homepage → pages");
for (const [d, n] of [...buckets].sort((a, b) =>
  a[0] === "orphan" ? 1 : b[0] === "orphan" ? -1 : a[0] - b[0]
)) {
  console.log(`  ${String(d).padStart(6)}: ${n}`);
}

if (tooDeep.length) {
  console.log(`\nWARN  ${tooDeep.length} pages deeper than ${MAX_DEPTH} clicks (crawled less often).`);
}

if (orphans.length > ALLOWED_ORPHANS) {
  // Group by shape so a whole broken cluster reads as one line, not 54.
  const groups = new Map();
  for (const o of orphans) {
    const shape = o
      .replace(/\d+(-\d+)?(kb|mb)$/i, "<size>")
      .replace(/\d+x\d+$/i, "<WxH>");
    groups.set(shape, (groups.get(shape) ?? 0) + 1);
  }
  console.error(`\nFAIL  ${orphans.length} orphaned pages (in the sitemap, linked from nowhere):`);
  for (const [shape, n] of [...groups].sort((a, b) => b[1] - a[1]).slice(0, 20)) {
    console.error(`  ${String(n).padStart(4)}  ${shape}`);
  }
  console.error(`\nWire the cluster into clusterPagesForTool() in lib/seo-pages/index.ts.`);
  process.exit(1);
}

console.log(`\nPASS  no orphaned pages.`);
