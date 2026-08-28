#!/usr/bin/env node
/**
 * Site health checkup — the automatable half of the regular growth review.
 *
 * Checks the things that silently break and quietly cost traffic: the live
 * analytics tags actually being served, the sitemap resolving, and pages
 * staying indexable. It deliberately does NOT try to read visitor counts:
 * Vercel Web Analytics has no public API and no CLI command, so those numbers
 * come from the dashboard by hand. What this catches is the failure mode that
 * makes those numbers meaningless — a tag that stopped shipping.
 *
 * Usage:  node scripts/site-checkup.mjs [--sample N]
 * Exits non-zero if any check fails, so CI or a scheduled run can alert.
 */

const HOST = "www.scrabtools.site";
const ORIGIN = `https://${HOST}`;
const UA = "scrabtools-checkup";
// How many sitemap URLs to spot-check for status/indexability. The full sitemap
// is 300+ URLs; fetching all of them on every run is rude to our own CDN and
// tells us nothing a sample doesn't.
const SAMPLE_DEFAULT = 12;

const sampleFlag = process.argv.indexOf("--sample");
const SAMPLE = sampleFlag > -1 ? Number(process.argv[sampleFlag + 1]) : SAMPLE_DEFAULT;

const results = [];
function record(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

async function get(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
  return { status: res.status, ok: res.ok, body: await res.text() };
}

async function main() {
  // ── Homepage + the tags that must be present in the served HTML ──
  const home = await get(ORIGIN);
  record("homepage responds", home.ok, `HTTP ${home.status}`);

  const hasAdsense = home.body.includes("adsbygoogle.js");
  record("AdSense loader present", hasAdsense);

  // Consent Mode defaults are server-rendered, so unlike gtag.js they must be
  // visible in the raw HTML. If this fails, Google tags are running ungated.
  const hasConsentDefaults = home.body.includes('gtag("consent","default"') ||
    home.body.includes("gtag('consent','default'");
  record("Consent Mode v2 defaults inlined", hasConsentDefaults);

  const gaId = (home.body.match(/G-[A-Z0-9]{6,}/) || [])[0];
  record("GA4 tag present", Boolean(gaId), gaId || "no measurement id found in HTML");

  // Regression guard. A bare <script async src=...> for a Google tag gets
  // hoisted by React to the very top of <head> — ahead of even explicit <head>
  // children — which would put it in front of the Consent Mode defaults and let
  // it start under Google's own (granted) defaults. Both loaders must therefore
  // go through next/script, which injects after hydration. `preload` hints are
  // fine: they fetch but never execute.
  const consentIdx = home.body.search(/gtag\(["']consent["'],\s*["']default["']/);
  const eagerGoogleTag = [...home.body.matchAll(
    /<script[^>]+src=["'][^"']*(?:adsbygoogle\.js|googletagmanager\.com\/gtag)[^"']*["'][^>]*>/g
  )].find((m) => m.index < consentIdx || consentIdx === -1);
  record(
    "no Google tag executes before consent defaults",
    !eagerGoogleTag,
    eagerGoogleTag ? `hoisted tag at index ${eagerGoogleTag.index}, consent at ${consentIdx}` : ""
  );

  // ── Vercel analytics endpoints. A 404 here means the feature was switched
  //    off in the dashboard and data collection has silently stopped. ──
  for (const path of ["/_vercel/insights/script.js", "/_vercel/speed-insights/script.js"]) {
    const r = await get(ORIGIN + path);
    record(`vercel ${path}`, r.ok, `HTTP ${r.status}, ${r.body.length} bytes`);
  }

  // ── robots + sitemap ──
  const robots = await get(`${ORIGIN}/robots.txt`);
  record("robots.txt references sitemap", robots.ok && robots.body.includes("sitemap.xml"));

  const sitemap = await get(`${ORIGIN}/sitemap.xml`);
  const urls = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  record("sitemap parses", urls.length > 0, `${urls.length} URLs`);

  // ── Spot-check indexability. Evenly spaced rather than random so successive
  //    runs are comparable instead of noisy. ──
  const step = Math.max(1, Math.floor(urls.length / SAMPLE));
  const sample = urls.filter((_, i) => i % step === 0).slice(0, SAMPLE);
  let bad = 0;
  for (const url of sample) {
    const page = await get(url);
    const noindex = /<meta[^>]+name=["']robots["'][^>]+noindex/i.test(page.body);
    const title = (page.body.match(/<title>([^<]*)<\/title>/) || [])[1];
    if (!page.ok || noindex || !title) {
      bad++;
      console.log(`      ↳ ${url}  HTTP ${page.status}${noindex ? " NOINDEX" : ""}${title ? "" : " NO-TITLE"}`);
    }
  }
  record(`sampled ${sample.length} pages indexable`, bad === 0, bad ? `${bad} problem page(s)` : "all clean");

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
  if (failed.length) {
    console.log("Failed: " + failed.map((f) => f.name).join(", "));
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
