#!/usr/bin/env node
/**
 * URL regression check — fails if a URL that is live today is missing from the
 * build we are about to ship.
 *
 * This exists because of a real incident: tightening the programmatic page
 * budget silently dropped twelve already-indexed URLs, including
 * /resize-image-to-1075x1075, which was the site's only #1 ranking. They went
 * straight to 404 on deploy. A build that passes every other check can still
 * quietly delete pages Google has indexed, and nothing else here catches it.
 *
 * Deleting a page is sometimes right — but it should be a decision, with a
 * redirect, not a side effect of changing a step size in a loop.
 *
 * Usage:  node scripts/url-regression.mjs [--host www.scrabtools.site] [--allow 0]
 * Exits non-zero when live URLs are missing from the new sitemap.
 */

import { readFileSync, existsSync } from "node:fs";

const arg = (f, d) => { const i = process.argv.indexOf(f); return i > -1 ? process.argv[i + 1] : d; };
const HOST = arg("--host", "www.scrabtools.site");
const ALLOWED = Number(arg("--allow", 0));

const BUILT = ".next/server/app/sitemap.xml.body";
if (!existsSync(BUILT)) {
  console.error(`No build output at ${BUILT} — run \`npm run build\` first.`);
  process.exit(1);
}

const locs = (xml) =>
  [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) =>
    m[1].trim().replace(/^https?:\/\/[^/]+/, "").replace(/\/$/, "") || "/"
  );

const built = new Set(locs(readFileSync(BUILT, "utf8")));

let liveXml;
try {
  const res = await fetch(`https://${HOST}/sitemap.xml`, {
    headers: { "User-Agent": "scrabtools-url-regression" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  liveXml = await res.text();
} catch (err) {
  // Not fatal: a first deploy, or the site being down, shouldn't block a build.
  console.warn(`WARN  could not fetch the live sitemap (${err.message}) — skipping.`);
  process.exit(0);
}

const live = locs(liveXml);
const missing = live.filter((u) => !built.has(u));

console.log(`live: ${live.length} URLs · build: ${built.size} URLs`);

if (missing.length > ALLOWED) {
  const groups = new Map();
  for (const u of missing) {
    const shape = u.replace(/\d+(-\d+)?(kb|mb)$/i, "<size>").replace(/\d+x\d+$/i, "<WxH>");
    groups.set(shape, (groups.get(shape) ?? 0) + 1);
  }
  console.error(`\nFAIL  ${missing.length} live URLs are missing from this build:`);
  for (const [shape, n] of [...groups].sort((a, b) => b[1] - a[1]).slice(0, 20)) {
    console.error(`  ${String(n).padStart(4)}  ${shape}`);
  }
  console.error(`\nShipping this turns them into 404s. Either keep the pages, or add`);
  console.error(`redirects in next.config.ts and re-run with --allow ${missing.length}.`);
  process.exit(1);
}

console.log(`\nPASS  no live URL is dropped by this build.`);
