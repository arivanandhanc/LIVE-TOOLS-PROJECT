// Single registry of every programmatic SEO landing page. All pages render via
// the generic `app/(seo)/[slug]` route and mount a 100%-client-side tool — no
// server or DB calls — so each page is fully static and lightweight.

import type { SeoPage } from "./types";
import {
  compressTargets,
  titleFor,
  descriptionFor,
  h1For,
  introFor,
  howToFor,
  faqsFor,
} from "./compress-pdf";
import { imageCompressPages } from "./compress-image";
import { imageResizePages } from "./resize-image";

export type { SeoPage } from "./types";

const pdfPages: SeoPage[] = compressTargets.map((t) => ({
  slug: t.slug,
  cluster: "compress-pdf",
  clusterLabel: "Compress PDF to other sizes",
  chip: `to ${t.display}`,
  title: titleFor(t),
  description: descriptionFor(t),
  h1: h1For(t),
  subhead: `Reduce any PDF to ${t.display} or less, free and private — no sign-up, no watermark.`,
  keywords: [
    `compress pdf to ${t.display.toLowerCase()}`,
    `reduce pdf to ${t.display.toLowerCase()}`,
    `pdf to ${t.display.toLowerCase()}`,
    `compress pdf to ${t.display.toLowerCase()} online`,
    `make pdf smaller than ${t.display.toLowerCase()}`,
  ],
  intro: introFor(t),
  howTo: howToFor(t),
  faqs: faqsFor(t),
  breadcrumb: [
    { name: "Tools", href: "/tools" },
    { name: "PDF Tools", href: "/tools/pdf" },
    { name: "Compress PDF", href: "/tools/pdf/compress-pdf" },
  ],
  relatedCategory: "pdf",
  tool: { kind: "compress-pdf", targetBytes: t.bytes, targetDisplay: t.display },
}));

export const allSeoPages: SeoPage[] = [
  ...pdfPages,
  ...imageCompressPages,
  ...imageResizePages,
];

const bySlug = new Map(allSeoPages.map((p) => [p.slug, p]));

export function getSeoPage(slug: string): SeoPage | undefined {
  return bySlug.get(slug);
}

/** Sibling pages in the same cluster, for dense cross-linking. */
export function siblingPages(page: SeoPage): SeoPage[] {
  return allSeoPages.filter((p) => p.cluster === page.cluster && p.slug !== page.slug);
}

/** Landing pages to surface from a canonical tool page (internal-link block). */
export function clusterPagesForTool(toolSlug: string): SeoPage[] {
  switch (toolSlug) {
    case "compress-pdf":
      return pdfPages;
    case "compress-image":
      return imageCompressPages;
    case "resize-image":
      return imageResizePages;
    default:
      return [];
  }
}
