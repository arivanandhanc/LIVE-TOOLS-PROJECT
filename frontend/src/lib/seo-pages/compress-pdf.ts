// ─────────────────────────────────────────────────────────────────────────
// Programmatic-SEO data for the "Compress PDF to <target size>" cluster.
//
// Each entry produces one statically-prerendered landing page at
// `/compress-pdf-to-<label>` with unique title, H1, intro, FAQ and schema —
// plus a *real* target-size compressor (binary-searches render scale + JPEG
// quality until the output fits the target). This is genuine utility, not a
// doorway page: most competitors only offer light/medium/strong presets and
// can't hit an exact KB target, which is exactly what exam / government /
// admission portals demand.
// ─────────────────────────────────────────────────────────────────────────

export interface CompressTarget {
  /** URL/keyword label, e.g. "100kb" or "1mb". */
  label: string;
  /** Human display, e.g. "100 KB" or "1 MB". */
  display: string;
  /** Hard byte budget the output must fit within. */
  bytes: number;
  /** Full page slug, e.g. "compress-pdf-to-100kb". */
  slug: string;
}

const KB = 1024;
const MB = 1024 * 1024;

/** High-intent KB / MB size targets people actually search for. */
// Stepped finest at the low end, where the "portal rejected my upload" queries
// concentrate, and coarser above 500 KB where searches thin out.
const KB_SIZES: number[] = [];
for (let kb = 10; kb <= 200; kb += 5) KB_SIZES.push(kb);
for (let kb = 210; kb <= 500; kb += 10) KB_SIZES.push(kb);
for (let kb = 525; kb <= 1000; kb += 25) KB_SIZES.push(kb);

const MB_SIZES = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10, 12, 15, 16, 20, 25, 30, 40, 50];

const RAW: Array<{ label: string; display: string; bytes: number }> = [
  ...KB_SIZES.map((kb) => ({ label: `${kb}kb`, display: `${kb} KB`, bytes: kb * KB })),
  ...MB_SIZES.map((mb) => ({
    label: `${String(mb).replace('.', '-')}mb`,
    display: `${mb} MB`,
    bytes: Math.round(mb * MB),
  })),
];

export const compressTargets: CompressTarget[] = RAW.map((r) => ({
  ...r,
  slug: `compress-pdf-to-${r.label}`,
}));

export function getCompressTarget(slug: string): CompressTarget | undefined {
  return compressTargets.find((t) => t.slug === slug);
}

/**
 * A real-world use-case sentence tailored to the size band, so no two pages
 * read the same and each speaks to genuine searcher intent.
 */
export function scenarioFor(t: CompressTarget): string {
  if (t.bytes <= 30 * KB) {
    return `A ${t.display} limit is one of the strictest you will meet online — it is the cap used by many Indian government job portals (SSC, UPSC, state PSCs), online exam application forms (NEET, JEE, GATE) and visa or passport document uploads. This tool squeezes a scanned PDF down to ${t.display} so a rejected "file too large" upload finally goes through.`;
  }
  if (t.bytes <= 100 * KB) {
    return `${t.display} is the most common upload ceiling on university admission portals, scholarship applications, KYC and bank document forms, and online job applications. Compress your PDF to ${t.display} here and attach it without the form bouncing it back.`;
  }
  if (t.bytes <= 500 * KB) {
    return `Many e-filing systems, tender portals and web forms cap attachments at ${t.display}. Reducing your PDF to ${t.display} keeps every page readable while staying comfortably under the limit so the upload succeeds the first time.`;
  }
  return `A ${t.display} target is ideal for email attachments, shared scanned documents and multi-page reports that are too heavy to send or upload. Compress your PDF to ${t.display} to send it faster without splitting it into pieces.`;
}

/**
 * Facts computed from this page's own byte budget.
 *
 * WHY THIS EXISTS
 * Every other string in this file is one template with the size substituted
 * in, which made sibling pages measure 91-92% textually identical. The
 * comment at the top of tools/content.ts records what that costs: pages
 * "46-66% textually identical" were enough to get the domain demoted once
 * already, and Google's helpful-content system reads a cluster of near-copies
 * as one thin page repeated, not as 140 answers.
 *
 * Swapping synonyms around would not fix that — it would just be the same
 * page wearing different words. What makes these pages genuinely distinct is
 * that they answer a different question each: what actually fits in *this*
 * budget. The numbers below are arithmetic on t.bytes, so no two pages in the
 * cluster can produce the same sentence, and each one is information the
 * visitor came for.
 *
 * The per-page byte figures are measured from our own compressor's output —
 * it re-renders each page to a JPEG, so an A4 page costs roughly 70 KB at
 * 150 DPI, 35 KB at 100 DPI and 18 KB at 72 DPI.
 */
const KB_PER_PAGE = { dpi150: 70, dpi100: 35, dpi72: 18 } as const;

/** A typical phone-scanned A4 document, for the "how much smaller" framing. */
const TYPICAL_SCAN_KB = 2400;

export function budgetFactsFor(t: CompressTarget): string[] {
  const kb = Math.round(t.bytes / KB);
  const pages = (perPage: number) => Math.max(1, Math.floor(kb / perPage));
  const at150 = pages(KB_PER_PAGE.dpi150);
  const at100 = pages(KB_PER_PAGE.dpi100);
  const at72 = pages(KB_PER_PAGE.dpi72);
  const shrink = Math.max(2, Math.round(TYPICAL_SCAN_KB / kb));
  const plural = (n: number) => (n === 1 ? "page" : "pages");

  const facts = [
    `At print-sharp 150 DPI, ${t.display} holds about ${at150} ${plural(at150)}. Drop to 100 DPI — still clearly readable on screen — and roughly ${at100} ${plural(at100)} fit. At 72 DPI, enough for a form upload nobody prints, about ${at72}.`,
    `A phone-scanned A4 document averages around 2.4 MB per file, so reaching ${t.display} means shrinking it roughly ${shrink}×.`,
  ];

  // A one-page budget behaves differently enough from a multi-page one that
  // the advice genuinely changes, rather than the wording.
  if (at150 === 1) {
    facts.push(
      `${t.display} is a single-page budget at full quality. If your document runs to several pages, the tool will lower resolution across all of them rather than fail — expect screen-readable rather than print-sharp output.`
    );
  } else if (at72 > 20) {
    facts.push(
      `${t.display} is generous enough that most documents reach it with quality to spare — the compressor stops at the highest quality that fits, so a short file may come out well under ${t.display}.`
    );
  }

  return facts;
}

export function titleFor(t: CompressTarget): string {
  // The root layout's title template appends the site name, so don't repeat it.
  return `Compress PDF to ${t.display} Online — Free & Exact Size`;
}

export function descriptionFor(t: CompressTarget): string {
  return `Free online tool to compress a PDF to ${t.display} or less. Hits the exact ${t.display} target for exam, government and admission form uploads — no sign-up, no watermark, 100% private in your browser.`;
}

export function h1For(t: CompressTarget): string {
  return `Compress PDF to ${t.display}`;
}

export function introFor(t: CompressTarget): string {
  // The computed facts lead, because "what fits in this size" is the question
  // the visitor actually arrived with, and it is the part of the page that is
  // genuinely different from its 140 siblings.
  return `Need a PDF under ${t.display}? This free tool reduces your PDF until it fits, then lets you download it — re-rendering each page and tuning quality in your browser until the best-quality file that meets ${t.display} is reached. ${budgetFactsFor(t).join(" ")} ${scenarioFor(t)}`;
}

export function howToFor(t: CompressTarget): string[] {
  return [
    `Drop your PDF into the box above (or click to browse). It is processed entirely in your browser — nothing is uploaded.`,
    `Press "Compress to ${t.display}". The tool re-renders the pages and tunes quality automatically to fit within ${t.display}.`,
    `Watch the achieved size — it tells you the final file size once compression finishes.`,
    `Download your compressed PDF and upload it to your form, portal or email straight away.`,
  ];
}

export function faqsFor(t: CompressTarget): { question: string; answer: string }[] {
  return [
    {
      question: `How do I compress a PDF to ${t.display}?`,
      answer: `Upload your PDF above and click "Compress to ${t.display}". The tool automatically lowers the resolution and image quality of each page just enough to fit within ${t.display}, then offers the file for download. Everything happens in your browser, so your document is never uploaded.`,
    },
    {
      question: `Is compressing a PDF to ${t.display} free?`,
      answer: `Yes — completely free with no watermark, no sign-up and no daily limit. You only need an account if you want your history saved.`,
    },
    {
      // Answered with this budget's own arithmetic rather than a generic
      // reassurance, so the answer differs for every page in the cluster and
      // actually tells the reader what to expect at their size.
      question: `Will the quality drop when I compress to ${t.display}?`,
      answer: `That depends on how many pages you have. ${budgetFactsFor(t)[0]} The tool always keeps the highest quality that still fits ${t.display}, so a short document may barely change while a long one is re-rendered at lower resolution. If you don't need an exact size, the standard Compress PDF tool gives lighter, higher-quality compression.`,
    },
    {
      question: `Is it safe to compress confidential documents to ${t.display} here?`,
      answer: `Yes. This tool runs 100% in your browser — your PDF never leaves your device and is never sent to any server, so ID cards, certificates and bank statements stay private.`,
    },
    {
      question: `What if my PDF can't be compressed all the way to ${t.display}?`,
      answer: `Some PDFs with many pages or dense text can't physically reach ${t.display} while staying readable. In that case the tool produces the smallest readable file it can and shows you the achieved size — often you can then split the PDF or remove unneeded pages to get under ${t.display}.`,
    },
  ];
}
