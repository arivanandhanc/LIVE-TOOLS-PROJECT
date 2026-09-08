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
 * The live sitemap is not a sufficient baseline on its own. Once a page has
 * already 404'd it is no longer in the sitemap, so comparing against it makes
 * the damage invisible the moment it ships — which is why the same budget cut
 * also dropped /compress-png-to-75kb and /compress-webp-to-75kb and they stayed
 * broken while the resize squares were being restored. So the check runs against
 * the union of the live sitemap and docs/published-urls.txt, an append-only
 * record of everything ever shipped, minus docs/retired-urls.txt for paths
 * removed on purpose.
 *
 * Usage:  node scripts/url-regression.mjs [--host www.scrabtools.site] [--allow 0]
 * Exits non-zero when known URLs are missing from the new sitemap.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";

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

// The append-only record and the deliberate-removal list. Blank lines and
// `#` comments are ignored so both files can explain themselves.
const PUBLISHED = "../docs/published-urls.txt";
const RETIRED = "../docs/retired-urls.txt";
const readPaths = (file) =>
  existsSync(file)
    ? readFileSync(file, "utf8")
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith("#"))
        .map((l) => l.replace(/^https?:\/\/[^/]+/, "").replace(/\/$/, "") || "/")
    : [];

const published = readPaths(PUBLISHED);
const retired = new Set(readPaths(RETIRED));

let liveXml;
try {
  const res = await fetch(`https://${HOST}/sitemap.xml`, {
    headers: { "User-Agent": "scrabtools-url-regression" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  liveXml = await res.text();
} catch (err) {
  // Not fatal: a first deploy, or the site being down, shouldn't block a build.
  // The recorded baseline still gives us something to check against.
  console.warn(`WARN  could not fetch the live sitemap (${err.message}) — using the record only.`);
  liveXml = "";
}

const live = locs(liveXml);
// What Google may already know about: what is up now, plus what we have ever
// shipped, less what we chose to retire.
const known = [...new Set([...live, ...published])].filter((u) => !retired.has(u));
const missing = known.filter((u) => !built.has(u));

console.log(
  `live: ${live.length} URLs · recorded: ${published.length} · known: ${known.length} · build: ${built.size}`
);

if (missing.length > ALLOWED) {
  const groups = new Map();
  for (const u of missing) {
    const shape = u.replace(/\d+(-\d+)?(kb|mb)$/i, "<size>").replace(/\d+x\d+$/i, "<WxH>");
    groups.set(shape, (groups.get(shape) ?? 0) + 1);
  }
  console.error(`\nFAIL  ${missing.length} known URLs are missing from this build:`);
  for (const [shape, n] of [...groups].sort((a, b) => b[1] - a[1]).slice(0, 20)) {
    console.error(`  ${String(n).padStart(4)}  ${shape}`);
  }
  console.error(`\nShipping this turns them into 404s. Either keep the pages, or retire`);
  console.error(`them on purpose: add a redirect in next.config.ts and list the paths in`);
  console.error(`docs/retired-urls.txt.`);
  process.exit(1);
}

// Record the pages this build adds, so the next run protects them too. Only on
// a pass — recording during a failure would bake the loss into the baseline.
// Union with what was already recorded, not with `known` — `known` has the
// retired paths subtracted, and the record is history, which does not shrink.
const record = [...new Set([...published, ...live, ...built])].sort();
if (record.length !== published.length) {
  const header = existsSync(PUBLISHED)
    ? readFileSync(PUBLISHED, "utf8").split(/\r?\n/).filter((l) => l.startsWith("#") || !l.trim())
    : [];
  const head = header.length ? header.join("\n").replace(/\n+$/, "") + "\n\n" : "";
  writeFileSync(PUBLISHED, head + record.join("\n") + "\n");
  console.log(`recorded ${record.length - published.length} new URL(s) in docs/published-urls.txt`);
}

console.log(`\nPASS  no known URL is dropped by this build.`);
