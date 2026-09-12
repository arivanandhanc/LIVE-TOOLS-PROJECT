/**
 * Which programmatic pages have actually earned a visitor.
 *
 * WHY THIS LIST EXISTS
 * The clusters generate ~540 pages that measure 86-96% textually identical to
 * one another. Google's helpful-content system reads that as one thin page
 * repeated, not as 540 answers, and the site has already been demoted once for
 * exactly this shape — tools/content.ts records the previous round at a milder
 * 46-66%. The same shape is the likeliest reason the AdSense review has sat in
 * "Getting ready" since 20 Aug, with the sibling domain already flagged "Low
 * value content".
 *
 * WHY NOT JUST DELETE THEM
 * Because Google is not the audience that matters here. Bing and Yahoo send
 * roughly six times Google's traffic, they index these pages happily, and
 * deleting them would spend the traffic that currently keeps the site alive to
 * fix a problem only Google has. So the pages stay live, stay linked, and stay
 * in Bing — they are hidden from Google alone, via a googleBot-specific
 * directive rather than a blanket one.
 *
 * HOW THIS LIST WAS BUILT
 * From Vercel Web Analytics, 12 Aug - 12 Sep 2026: every programmatic page
 * that drew three or more visitors in the month. That threshold keeps 43 pages
 * and hides about 500, which together drew roughly four visitors a day.
 *
 * Regenerate when the traffic mix changes — this is a snapshot of demand, not
 * a permanent judgement, and a page that starts earning should be let back in.
 */
export const EARNING_SLUGS: ReadonlySet<string> = new Set([
  // ── compress-pdf: 30 pages, the cluster carrying the site ──
  "compress-pdf-to-450kb", "compress-pdf-to-45kb", "compress-pdf-to-75kb",
  "compress-pdf-to-130kb", "compress-pdf-to-80kb", "compress-pdf-to-20kb",
  "compress-pdf-to-350kb", "compress-pdf-to-175kb", "compress-pdf-to-125kb",
  "compress-pdf-to-90kb", "compress-pdf-to-800kb", "compress-pdf-to-85kb",
  "compress-pdf-to-700kb", "compress-pdf-to-110kb", "compress-pdf-to-70kb",
  "compress-pdf-to-120kb", "compress-pdf-to-250kb", "compress-pdf-to-25kb",
  "compress-pdf-to-65kb", "compress-pdf-to-95kb", "compress-pdf-to-500kb",
  "compress-pdf-to-600kb", "compress-pdf-to-100kb", "compress-pdf-to-150kb",
  "compress-pdf-to-200kb", "compress-pdf-to-400kb", "compress-pdf-to-40kb",
  "compress-pdf-to-35kb", "compress-pdf-to-55kb", "compress-pdf-to-30kb",

  // ── compress-image ──
  "compress-jpg-to-80kb", "compress-jpg-to-20kb", "compress-jpg-to-70kb",

  // ── resize-image ──
  "resize-image-to-2048x1152", "resize-image-to-250x250",
  "resize-image-to-1400x1400", "resize-image-to-1025x1025",
  "resize-image-to-200x200", "resize-image-to-1050x1050",
  "resize-image-to-1900x1900", "resize-image-to-300x300",
  "resize-image-to-75x75",

  // ── photo-id ──
  "singapore-passport-photo",
]);

/**
 * Whether Google should index this page.
 *
 * Bing is unaffected either way — see the note above. The point is to present
 * Google with the pages that answer a real query and none of the near-copies
 * standing behind them.
 */
export function isGoogleIndexable(slug: string): boolean {
  return EARNING_SLUGS.has(slug);
}
