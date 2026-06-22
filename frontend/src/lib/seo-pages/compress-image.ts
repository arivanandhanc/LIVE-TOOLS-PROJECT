// Programmatic "Compress <format> to <size>" landing pages — 100% client-side
// (HTML canvas), no server or DB. High-intent: photo/ID/form uploads with hard
// KB limits, which preset-only competitors can't target exactly.

import type { SeoPage, SeoFaq } from "./types";

const KB = 1024;

type Fmt = "jpg" | "png" | "webp";

const FMT_DISPLAY: Record<Fmt, string> = { jpg: "JPG", png: "PNG", webp: "WebP" };

// Each format gets a curated, realistic set of KB targets people search for.
const SIZES: Record<Fmt, number[]> = {
  jpg: [10, 20, 30, 50, 100, 150, 200, 300, 500],
  png: [50, 100, 200, 300, 500],
  webp: [20, 50, 100, 200],
};

function display(kb: number): string {
  return `${kb} KB`;
}

function scenario(fmt: Fmt, kb: number): string {
  const f = FMT_DISPLAY[fmt];
  if (kb <= 30) {
    return `A ${kb} KB cap is the kind of strict limit you hit on government job portals, online exam application forms (SSC, UPSC, NEET, JEE) and passport or visa photo uploads. This tool shrinks your ${f} photo to ${kb} KB so a rejected "image too large" upload finally goes through.`;
  }
  if (kb <= 100) {
    return `${kb} KB is a common ceiling for profile photos, KYC document images, scholarship forms and admission portals. Compress your ${f} to ${kb} KB here and upload it without the form bouncing it back.`;
  }
  return `Reducing a ${f} to ${kb} KB keeps it sharp while making it light enough for fast web pages, email attachments and listing/marketplace uploads that cap image size at ${kb} KB.`;
}

function faqs(fmt: Fmt, kb: number): SeoFaq[] {
  const f = FMT_DISPLAY[fmt];
  const d = display(kb);
  const lossy = fmt !== "png";
  return [
    {
      question: `How do I compress a ${f} to ${d}?`,
      answer: `Upload your image above and click "Compress to ${d}". The tool automatically ${
        lossy ? "lowers the quality and, if needed, the dimensions" : "reduces the dimensions"
      } of your ${f} until it fits within ${d}, then offers it for download — all in your browser, nothing uploaded.`,
    },
    {
      question: `Is compressing ${f} to ${d} free?`,
      answer: `Yes — completely free, no watermark, no sign-up and no daily limit.`,
    },
    {
      question: `Will the image quality drop at ${d}?`,
      answer: lossy
        ? `To reach ${d} the tool reduces quality only as much as needed and always keeps the best version that still fits ${d}, so the image stays clear enough for photo and form uploads.`
        : `PNG is lossless, so to reach ${d} the tool reduces the pixel dimensions rather than adding artefacts. The image stays crisp at its new size. For smaller files at full resolution, try the JPG or WebP version of this tool.`,
    },
    {
      question: `Is it safe to compress private photos to ${d} here?`,
      answer: `Yes. Everything runs in your browser — your ${f} never leaves your device and is never sent to any server, so ID and passport photos stay private.`,
    },
    {
      question: `What if my ${f} can't reach ${d}?`,
      answer: `Very large or detailed images may not reach ${d} while staying usable. The tool then produces the smallest usable version and shows the achieved size — crop the image or pick a slightly larger target to get under ${d}.`,
    },
  ];
}

function makePage(fmt: Fmt, kb: number): SeoPage {
  const f = FMT_DISPLAY[fmt];
  const d = display(kb);
  const slug = `compress-${fmt}-to-${kb}kb`;
  return {
    slug,
    cluster: `compress-${fmt}`,
    clusterLabel: `Compress ${f} to other sizes`,
    chip: `to ${d}`,
    title: `Compress ${f} to ${d} Online — Free & Exact Size`,
    description: `Free online tool to compress a ${f} image to ${d} or less. Hits the exact ${d} target for passport, exam and form photo uploads — no sign-up, no watermark, 100% private in your browser.`,
    h1: `Compress ${f} to ${d}`,
    subhead: `Reduce any ${f} image to ${d} or less, free and private — no sign-up, no watermark.`,
    keywords: [
      `compress ${fmt} to ${kb}kb`,
      `reduce ${fmt} to ${kb}kb`,
      `${fmt} to ${kb}kb`,
      `compress ${fmt} to ${kb}kb online`,
      `resize ${fmt} to ${kb}kb`,
    ],
    intro: `Need a ${f} image under ${d}? This free tool automatically reduces your ${f} until it fits within ${d}, then lets you download it — tuning quality and dimensions in your browser to give you the sharpest image that still meets your ${d} target. ${scenario(
      fmt,
      kb
    )}`,
    howTo: [
      `Drop your ${f} into the box above (or click to browse). It is processed entirely in your browser — nothing is uploaded.`,
      `Press "Compress to ${d}". The tool tunes quality and size automatically to fit within ${d}.`,
      `Check the achieved size shown once compression finishes.`,
      `Download your compressed ${f} and upload it to your form, profile or listing.`,
    ],
    faqs: faqs(fmt, kb),
    breadcrumb: [
      { name: "Tools", href: "/tools" },
      { name: "Image Tools", href: "/tools/image" },
      { name: "Compress Image", href: "/tools/image/compress-image" },
    ],
    relatedCategory: "image",
    tool: { kind: "compress-image", format: fmt, targetBytes: kb * KB, targetDisplay: d },
  };
}

export const imageCompressPages: SeoPage[] = (Object.keys(SIZES) as Fmt[]).flatMap((fmt) =>
  SIZES[fmt].map((kb) => makePage(fmt, kb))
);
