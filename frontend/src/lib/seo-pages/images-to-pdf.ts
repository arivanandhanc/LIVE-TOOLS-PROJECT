// Programmatic "JPG/PNG to PDF under <size>" landing pages.
//
// This cluster exists because the keyword harvest (scripts/data/keywords.csv)
// found 384 queries that combine a conversion with a hard size ceiling —
// "jpg to pdf 200kb" peaks at rank #37 — and jpg→pdf is the largest pair in
// that set at 128 keywords. It is a genuine gap: the plain jpg-to-pdf tool
// can't hit a KB target, and the compress-pdf tool won't take images.

import type { SeoPage, SeoFaq } from "./types";

const KB = 1024;

type Src = "jpg" | "png" | "image";

const SRC_DISPLAY: Record<Src, string> = { jpg: "JPG", png: "PNG", image: "Image" };
const SRC_ACCEPT: Record<Src, string> = {
  jpg: "image/jpeg,image/jpg",
  png: "image/png",
  image: "image/jpeg,image/jpg,image/png,image/webp",
};

/** KB ceilings that actually appear in the harvested queries. */
const KB_SIZES = [
  20, 30, 40, 50, 60, 70, 80, 90, 100, 120, 150, 200, 250, 300, 350, 400, 450,
  500, 600, 700, 800, 900,
];
const MB_SIZES = [1, 1.5, 2, 3, 5];

interface Target {
  label: string;
  display: string;
  bytes: number;
}

const TARGETS: Target[] = [
  ...KB_SIZES.map((kb) => ({ label: `${kb}kb`, display: `${kb} KB`, bytes: kb * KB })),
  ...MB_SIZES.map((mb) => ({
    label: `${String(mb).replace(".", "-")}mb`,
    display: `${mb} MB`,
    bytes: Math.round(mb * KB * KB),
  })),
];

function scenario(src: Src, t: Target): string {
  const s = SRC_DISPLAY[src];
  const kb = t.bytes / KB;
  if (kb <= 100) {
    return `A ${t.display} ceiling is the kind of hard limit exam boards, government job portals and admission forms put on document uploads. Scanned pages photographed on a phone land at 2–5 MB each, so a straight ${s}-to-PDF conversion is rejected immediately. This page converts and compresses in one step so the PDF lands under ${t.display}.`;
  }
  if (kb <= 500) {
    return `${t.display} is a common ceiling for KYC uploads, scholarship applications and job-portal attachments. Converting your ${s} files here produces a PDF that fits ${t.display} without a second trip through a separate compressor.`;
  }
  return `Keeping a converted PDF under ${t.display} makes it easy to email, attach to a form, or upload to a portal that caps file size — while staying sharp enough to read comfortably.`;
}

function faqs(src: Src, t: Target): SeoFaq[] {
  const s = SRC_DISPLAY[src];
  return [
    {
      question: `How do I convert ${s} to PDF under ${t.display}?`,
      answer: `Add your ${s} files above and press "Convert to PDF under ${t.display}". The tool builds the PDF and automatically lowers the resolution and JPEG quality just enough to fit ${t.display}, then offers it for download.`,
    },
    {
      question: `Can I combine several images into one PDF?`,
      answer: `Yes. Add as many images as you like — each becomes one page, in the order you added them, and the whole document is compressed to fit ${t.display}.`,
    },
    {
      question: `Is converting ${s} to PDF at ${t.display} free?`,
      answer: `Yes — completely free, no watermark, no sign-up and no daily limit.`,
    },
    {
      question: `Will the PDF still be readable at ${t.display}?`,
      answer: `The tool always keeps the highest-quality version that still fits ${t.display}. It tries full resolution first and only scales down when it has to, so text in scanned documents stays legible. If ${t.display} is genuinely too small for the number of pages, it tells you the smallest readable size instead of returning something unusable.`,
    },
    {
      question: `Are my documents uploaded anywhere?`,
      answer: `No. The conversion runs entirely in your browser — your ${s} files and the finished PDF never leave your device, so ID documents and certificates stay private.`,
    },
  ];
}

function makePage(src: Src, t: Target): SeoPage {
  const s = SRC_DISPLAY[src];
  const slug = `${src}-to-pdf-${t.label}`;
  return {
    slug,
    cluster: `${src}-to-pdf-size`,
    clusterLabel: `${s} to PDF at other sizes`,
    chip: `under ${t.display}`,
    title: `${s} to PDF Under ${t.display} — Free Converter & Compressor`,
    description: `Convert ${s} to PDF and keep it under ${t.display} in one step. Free, no watermark, no sign-up — runs entirely in your browser.`,
    h1: `${s} to PDF Under ${t.display}`,
    subhead: `Convert ${s} images to a PDF that fits within ${t.display} — free, private, no sign-up.`,
    keywords: [
      `${src} to pdf ${t.label}`,
      `${src} to pdf under ${t.display.toLowerCase()}`,
      `${src} to pdf ${t.display.toLowerCase()}`,
      `convert ${src} to pdf ${t.display.toLowerCase()}`,
      `${src} to pdf less than ${t.display.toLowerCase()}`,
    ],
    intro: scenario(src, t),
    howTo: [
      `Add your ${s} file (or several, for a multi-page PDF) in the box above. Everything is processed in your browser — nothing is uploaded.`,
      `Press "Convert to PDF under ${t.display}".`,
      `The tool builds the PDF, then reduces resolution and quality only as far as needed to fit ${t.display}.`,
      `Download the finished PDF and upload it wherever the ${t.display} limit applies.`,
    ],
    faqs: faqs(src, t),
    breadcrumb: [
      { name: "Tools", href: "/tools" },
      { name: "PDF Tools", href: "/tools/pdf" },
      { name: "JPG to PDF", href: "/tools/pdf/jpg-to-pdf" },
    ],
    relatedCategory: "pdf",
    tool: {
      kind: "images-to-pdf",
      targetBytes: t.bytes,
      targetDisplay: t.display,
      accept: SRC_ACCEPT[src],
    },
  };
}

export const imagesToPdfPages: SeoPage[] = (["jpg", "png", "image"] as Src[]).flatMap((src) =>
  TARGETS.map((t) => makePage(src, t))
);
