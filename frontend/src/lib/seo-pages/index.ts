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
import { photoIdPages } from "./photo-id";
import { socialMediaPages } from "./social-media";
import { imagesToPdfPages } from "./images-to-pdf";

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
  ...photoIdPages,
  ...socialMediaPages,
  ...imagesToPdfPages,
];

const bySlug = new Map(allSeoPages.map((p) => [p.slug, p]));

export function getSeoPage(slug: string): SeoPage | undefined {
  return bySlug.get(slug);
}

/** Sibling pages in the same cluster, for dense cross-linking. */
export function siblingPages(page: SeoPage): SeoPage[] {
  return allSeoPages.filter((p) => p.cluster === page.cluster && p.slug !== page.slug);
}

/**
 * Landing pages to surface from a canonical tool page (internal-link block).
 *
 * This is the only path by which most landing pages are reachable, so every
 * cluster must appear under some tool here. A cluster missing from this switch
 * is orphaned: it ships in the sitemap, Google crawls it once, finds nothing
 * linking to it, and files it under "Discovered - currently not indexed".
 * scripts/link-audit.mjs fails the build-time check if that happens again.
 */
export function clusterPagesForTool(toolSlug: string): SeoPage[] {
  switch (toolSlug) {
    case "compress-pdf":
      return pdfPages;
    case "compress-image":
      return imageCompressPages;
    case "jpg-to-pdf":
      // Also carries the generic "image to PDF" targets — there is no
      // image-to-pdf tool page of its own to hang them from.
      return imagesToPdfPages.filter(
        (p) => p.cluster === "jpg-to-pdf-size" || p.cluster === "image-to-pdf-size"
      );
    case "png-to-pdf":
      return imagesToPdfPages.filter((p) => p.cluster === "png-to-pdf-size");
    case "resize-image":
      // Social/ID sizing pages are resize pages by another name, and this is
      // the only tool page that can reasonably link them.
      return [...imageResizePages, ...socialMediaPages, ...photoIdPages];
    default:
      return [];
  }
}
