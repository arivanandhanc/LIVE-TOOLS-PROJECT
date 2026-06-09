#!/usr/bin/env node
/**
 * IndexNow submitter — instantly tells Bing/Yahoo (and Yandex, Seznam) to crawl
 * every URL in the live sitemap. No account/login needed: ownership is proven by
 * the key file served at https://<host>/<key>.txt.
 *
 * Usage:  node scripts/indexnow.mjs
 * Run it after each deploy (or wire into CI) to push fresh content for crawling.
 */

const HOST = "tools.arivanandhan.in";
const KEY = "c119c0c0e75c5f8cf0914227a4f32259";
const SITEMAP = `https://${HOST}/sitemap.xml`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

async function main() {
  const res = await fetch(SITEMAP, { headers: { "User-Agent": "indexnow-submitter" } });
  if (!res.ok) throw new Error(`Failed to fetch sitemap: ${res.status}`);
  const xml = await res.text();
  const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (urlList.length === 0) throw new Error("No URLs found in sitemap.");

  console.log(`Submitting ${urlList.length} URLs to IndexNow…`);
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList,
  };

  const submit = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  // IndexNow returns 200 (accepted) or 202 (accepted, pending). Both are success.
  console.log(`IndexNow responded: ${submit.status} ${submit.statusText}`);
  if (submit.status === 200 || submit.status === 202) {
    console.log("✓ Submitted. Bing/Yahoo will crawl these URLs shortly.");
  } else {
    const body = await submit.text().catch(() => "");
    console.error("✗ Submission may have failed:", body);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
