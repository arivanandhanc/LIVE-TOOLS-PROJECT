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

/** Curated, high-intent size targets people actually search for. */
const RAW: Array<{ label: string; display: string; bytes: number }> = [
  { label: "10kb", display: "10 KB", bytes: 10 * KB },
  { label: "15kb", display: "15 KB", bytes: 15 * KB },
  { label: "20kb", display: "20 KB", bytes: 20 * KB },
  { label: "25kb", display: "25 KB", bytes: 25 * KB },
  { label: "30kb", display: "30 KB", bytes: 30 * KB },
  { label: "40kb", display: "40 KB", bytes: 40 * KB },
  { label: "50kb", display: "50 KB", bytes: 50 * KB },
  { label: "75kb", display: "75 KB", bytes: 75 * KB },
  { label: "100kb", display: "100 KB", bytes: 100 * KB },
  { label: "150kb", display: "150 KB", bytes: 150 * KB },
  { label: "200kb", display: "200 KB", bytes: 200 * KB },
  { label: "300kb", display: "300 KB", bytes: 300 * KB },
  { label: "500kb", display: "500 KB", bytes: 500 * KB },
  { label: "1mb", display: "1 MB", bytes: 1 * MB },
  { label: "2mb", display: "2 MB", bytes: 2 * MB },
  { label: "5mb", display: "5 MB", bytes: 5 * MB },
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
  return `Need a PDF under ${t.display}? This free tool automatically reduces your PDF until it fits within ${t.display}, then lets you download it. It works by intelligently re-rendering each page and tuning quality and resolution in your browser until the smallest readable file that meets your ${t.display} target is reached — so you get the exact size limit you need without trial and error. ${scenarioFor(t)}`;
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
      question: `Will the quality drop when I compress to ${t.display}?`,
      answer: `To reach a small target like ${t.display}, pages are re-rendered as optimised images, so very fine detail softens. The tool always keeps the highest quality that still fits ${t.display}, so text stays clearly legible for form and portal uploads. If you don't need an exact size, use the standard Compress PDF tool for lighter, higher-quality compression.`,
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
