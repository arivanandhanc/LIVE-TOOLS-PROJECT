// Programmatic "<document> photo size" landing pages — 100% client-side resize.
// High-intent, low-competition long-tail the big PDF/image brands don't target
// with dedicated pages. Specs are the well-documented DIGITAL UPLOAD dimensions
// (pixels) used by each official portal; each page tells users to verify on the
// official site, and to crop to the right framing first (the tool sets the exact
// pixel size — the core thing online validators check).

import type { SeoPage, SeoFaq } from "./types";

interface PhotoSpec {
  slug: string;
  /** Document/photo name for titles & headings. */
  name: string;
  /** Exact digital pixel dimensions required for upload. */
  px: { w: number; h: number };
  /** Print size for context. */
  print: string;
  /** Required background. */
  background: string;
  /** Optional max file-size note. */
  fileSize?: string;
  /** Short, page-specific context sentence. */
  note: string;
}

const SPECS: PhotoSpec[] = [
  {
    slug: "passport-size-photo-india",
    name: "Indian passport size photo",
    px: { w: 630, h: 810 },
    print: "35 × 45 mm (3.5 × 4.5 cm)",
    background: "plain white",
    fileSize: "under 250 KB, JPEG",
    note: "This is the Passport Seva digital upload size. Since 1 September 2025 India follows the ICAO Doc 9303 standard, with the face filling about 80–85% of the frame.",
  },
  {
    slug: "us-passport-photo-2x2",
    name: "US passport & visa photo",
    px: { w: 600, h: 600 },
    print: "2 × 2 inches (51 × 51 mm)",
    background: "white or off-white",
    fileSize: "square, JPEG",
    note: "The US Department of State requires a square 2×2 inch photo; online (DS-160 visa / passport) the digital image must be 600×600 px (up to 1200×1200), with the head 1–1⅜ inches from chin to crown.",
  },
  {
    slug: "schengen-visa-photo",
    name: "Schengen visa photo",
    px: { w: 413, h: 531 },
    print: "35 × 45 mm",
    background: "light grey or white",
    fileSize: "JPEG",
    note: "Schengen (EU) visa photos are 35×45 mm — about 413×531 px at 300 DPI — taken against a light, plain background with a neutral expression.",
  },
  {
    slug: "uk-passport-photo",
    name: "UK passport photo",
    px: { w: 600, h: 750 },
    print: "35 × 45 mm",
    background: "plain cream or light grey",
    fileSize: "at least 600×750 px, JPEG",
    note: "The UK online passport service needs a digital photo of at least 600×750 px against a plain light background, with nothing covering the face.",
  },
  {
    slug: "australia-passport-photo",
    name: "Australia passport photo",
    px: { w: 413, h: 531 },
    print: "35 × 45 mm",
    background: "plain white or light grey",
    fileSize: "JPEG",
    note: "Australian passport photos are 35×45 mm (about 413×531 px) with a plain, light-coloured background and the face 32–36 mm from chin to crown.",
  },
  {
    slug: "japan-passport-photo",
    name: "Japan passport photo",
    px: { w: 413, h: 531 },
    print: "35 × 45 mm",
    background: "plain white",
    fileSize: "JPEG",
    note: "Japanese passport photos are 35×45 mm (about 413×531 px) on a plain white background, with the head measuring 34±2 mm.",
  },
  {
    slug: "china-visa-photo",
    name: "China visa photo",
    px: { w: 354, h: 472 },
    print: "33 × 48 mm",
    background: "plain white",
    fileSize: "JPEG, typically 40–120 KB",
    note: "Chinese visa photos are 33×48 mm (354×472 px) on a plain white background, with the head 28–33 mm tall.",
  },
  {
    slug: "singapore-passport-photo",
    name: "Singapore passport photo",
    px: { w: 400, h: 514 },
    print: "35 × 45 mm",
    background: "plain white",
    fileSize: "JPEG, under ~60 KB",
    note: "Singapore (ICA) passport photos are 35×45 mm — 400×514 px — on a plain white background, taken within the last 3 months.",
  },
  {
    slug: "germany-passport-photo",
    name: "Germany passport photo",
    px: { w: 413, h: 531 },
    print: "35 × 45 mm",
    background: "light grey",
    fileSize: "JPEG",
    note: "German passport photos are 35×45 mm (about 413×531 px) with a neutral expression on a light grey background, following the biometric (ICAO) standard.",
  },
  {
    slug: "new-zealand-passport-photo",
    name: "New Zealand passport photo",
    px: { w: 413, h: 531 },
    print: "35 × 45 mm",
    background: "plain light grey or white",
    fileSize: "JPEG",
    note: "New Zealand passport photos are 35×45 mm (about 413×531 px) on a plain light background with a neutral expression.",
  },
];

function faqs(s: PhotoSpec): SeoFaq[] {
  const dim = `${s.px.w}×${s.px.h}`;
  return [
    {
      question: `What is the correct ${s.name} size?`,
      answer: `${s.note} For digital upload the image should be ${dim} pixels (${s.print}) on a ${s.background} background${
        s.fileSize ? `, ${s.fileSize}` : ""
      }.`,
    },
    {
      question: `How do I make a ${s.name} online for free?`,
      answer: `Upload your photo above and click "Resize to ${dim}". The tool redraws it to the exact ${dim} px upload size in your browser — nothing is uploaded to any server. For best results, crop the photo to roughly ${s.print} proportions first so the face isn't stretched.`,
    },
    {
      question: `Is this ${s.name} tool free and private?`,
      answer: `Yes — completely free, no watermark, no sign-up. The image is processed on a canvas in your browser and never leaves your device, so your ID photo stays private.`,
    },
    {
      question: `What background should a ${s.name} have?`,
      answer: `A ${s.background} background with even lighting and no shadows. Look straight at the camera with a neutral expression and both ears/edges of the face visible.`,
    },
    {
      question: `Will my ${s.name} be accepted by the official portal?`,
      answer: `This tool sets the exact ${dim} px dimensions that online portals validate, which is the most common rejection reason. Always confirm the latest rules on the official government site, since face-coverage and background details can change.`,
    },
  ];
}

function makePage(s: PhotoSpec): SeoPage {
  const dim = `${s.px.w}×${s.px.h}`;
  return {
    slug: s.slug,
    cluster: "photo-id",
    clusterLabel: "Other passport & ID photo sizes",
    chip: s.name.replace(" photo", "").replace(" size", ""),
    title: `${s.name.replace(/^./, (c) => c.toUpperCase())} Size — Free Online Maker (${dim} px)`,
    description: `Create a correct ${s.name} online for free: exact ${dim} px (${s.print}), ${s.background} background. Resizes in your browser — no sign-up, no watermark, 100% private.`,
    h1: s.name.replace(/^./, (c) => c.toUpperCase()),
    subhead: `Resize your photo to the exact ${dim} px (${s.print}) upload size — free, private, no watermark.`,
    keywords: [
      `${s.name}`,
      `${s.name} size`,
      `${s.name} dimensions`,
      `${s.name} ${s.px.w}x${s.px.h}`,
      `${s.name} online free`,
    ],
    intro: `Need a ${s.name}? This free tool resizes your photo to the exact ${dim} pixels (${s.print}) required for upload, right in your browser. ${s.note} Set the size here, then upload it to the official portal. Tip: crop your photo to roughly ${s.print} proportions first so the face keeps its natural shape.`,
    howTo: [
      `Crop your photo so the head and shoulders roughly match ${s.print} proportions on a ${s.background} background.`,
      `Drop it into the box above (or click to browse) — it is processed entirely in your browser.`,
      `Press "Resize to ${dim}". The tool sets the exact ${dim} px upload size.`,
      `Download the photo and upload it to the official application portal.`,
    ],
    faqs: faqs(s),
    breadcrumb: [
      { name: "Tools", href: "/tools" },
      { name: "Image Tools", href: "/tools/image" },
      { name: "Resize Image", href: "/tools/image/resize-image" },
    ],
    relatedCategory: "image",
    tool: { kind: "resize-image", width: s.px.w, height: s.px.h },
  };
}

export const photoIdPages: SeoPage[] = SPECS.map(makePage);
