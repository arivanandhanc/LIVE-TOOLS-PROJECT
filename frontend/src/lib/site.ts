/**
 * Strip trailing slashes from a base URL.
 *
 * `siteConfig.url` is concatenated with absolute paths (`${url}/tools`) in the
 * sitemap, robots.txt and JSON-LD. A trailing slash on the env var therefore
 * produces `https://host//tools`, which search engines treat as a different URL
 * from the canonical `/tools` — that silently corrupted every URL in the
 * sitemap. Normalising here makes the app immune to how the value is typed into
 * the hosting dashboard, which is not somewhere we can enforce a convention.
 */
function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

export const siteConfig = {
  name: "Scrab Tools",
  // The old tagline was "Mini tools for PDFs and every digital asset", which
  // put "Tools" twice in the rendered title ("Scrab Tools — Mini tools …") and
  // spent the most valuable words in the document on a repetition. "Converter"
  // replaces it on the evidence of our own harvest: 653 of the 5,000 queries
  // contain that word, making it the most common noun after the format names,
  // and it appeared in no homepage title at all.
  tagline: "Free file converters for PDF, images and data",
  /**
   * Doubles as the hero paragraph, which is why it reads as a sentence rather
   * than a keyword list.
   *
   * Two constraints shape it. Seobility measured the previous one at 1405px
   * against a 1000px limit, so Google would have truncated it in results — it
   * is now roughly half the length. And it deliberately contains the words of
   * the H1 above it ("one fast workspace", "every file tool"), which were
   * absent from the page body entirely; a heading whose words appear nowhere
   * in the content it introduces is a mismatch signal.
   */
  description:
    "One fast workspace for every file tool you need — convert, compress and edit PDFs, images, CSV and text in your browser.",
  // `||` (not `??`) so an empty-string env var also falls back. These are
  // public values; the fallbacks keep production working even if the Vercel
  // env var is missing/blank. Local dev overrides apiUrl via .env.local.
  url: normalizeBaseUrl(process.env.NEXT_PUBLIC_SITE_URL || "https://www.scrabtools.site"),
  apiUrl: normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL || "https://tools-live.onrender.com"),
  ogImage: "/og.png",
  twitter: "@arivanandhan",
  keywords: [
    "mini tools",
    "PDF tools",
    "online tools",
    "file converter",
    "PDF editor",
    "CSV converter",
    "image compressor",
    "merge PDF",
    "compress PDF",
    "digital asset tools",
  ],
} as const;

export const mainNav = [
  { title: "All Tools", href: "/tools" },
  { title: "PDF", href: "/tools/pdf" },
  { title: "Image", href: "/tools/image" },
  { title: "CSV", href: "/tools/csv" },
  { title: "Developer", href: "/tools/developer" },
  { title: "Resources", href: "/resources" },
];
