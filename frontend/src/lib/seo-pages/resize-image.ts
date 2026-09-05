// Programmatic "Resize image to W×H" landing pages — 100% client-side (canvas).

import type { SeoPage, SeoFaq } from "./types";

interface Dim {
  w: number;
  h: number;
  /** What this size is commonly used for (drives unique copy). */
  use: string;
}

const DIMS: Dim[] = [
  // Squares — avatars, product shots, icons
  { w: 100, h: 100, use: "favicons, tiny avatars and form thumbnails" },
  { w: 150, h: 150, use: "small avatars and thumbnail grids" },
  { w: 200, h: 200, use: "profile thumbnails and form photo boxes" },
  { w: 250, h: 250, use: "compact avatars and catalog thumbnails" },
  { w: 300, h: 300, use: "form photo boxes and small product images" },
  { w: 350, h: 350, use: "profile photos and catalog thumbnails" },
  { w: 400, h: 400, use: "social profile pictures and avatars" },
  { w: 500, h: 500, use: "compact profile photos and icons" },
  { w: 512, h: 512, use: "app icons and AI image inputs" },
  { w: 600, h: 600, use: "square thumbnails and avatars" },
  { w: 700, h: 700, use: "medium square images" },
  { w: 800, h: 800, use: "e-commerce product photos" },
  { w: 900, h: 900, use: "large square images" },
  { w: 1000, h: 1000, use: "marketplace and e-commerce product photos" },
  { w: 1080, h: 1080, use: "Instagram posts and square profile pictures" },
  { w: 1200, h: 1200, use: "high-res square product photos" },
  { w: 1500, h: 1500, use: "print-ready square images" },
  { w: 2000, h: 2000, use: "large square print and design assets" },
  // Standard landscape resolutions
  { w: 640, h: 480, use: "classic VGA web images" },
  { w: 800, h: 600, use: "classic 4:3 web images and email banners" },
  { w: 1024, h: 768, use: "presentation slides and tablet wallpapers" },
  { w: 1280, h: 720, use: "HD video thumbnails and presentation images" },
  { w: 1280, h: 800, use: "widescreen laptop wallpapers" },
  { w: 1280, h: 1024, use: "5:4 monitor wallpapers" },
  { w: 1366, h: 768, use: "common laptop screen wallpapers" },
  { w: 1440, h: 900, use: "widescreen desktop wallpapers" },
  { w: 1600, h: 900, use: "HD+ widescreen images" },
  { w: 1600, h: 1200, use: "4:3 high-resolution photos" },
  { w: 1920, h: 1080, use: "full-HD wallpapers, thumbnails and slide backgrounds" },
  { w: 1920, h: 1200, use: "16:10 desktop wallpapers" },
  { w: 2048, h: 1152, use: "high-res 16:9 banners" },
  { w: 2560, h: 1440, use: "QHD wallpapers and channel art" },
  { w: 3840, h: 2160, use: "4K UHD wallpapers and displays" },
  // Portrait
  { w: 768, h: 1024, use: "portrait tablet images and posters" },
  { w: 1080, h: 1350, use: "Instagram portrait posts" },
  { w: 1080, h: 1920, use: "stories, reels and TikTok videos" },
  { w: 1200, h: 1600, use: "portrait product and poster images" },
  { w: 1500, h: 2000, use: "portrait print photos" },
  // Web / share
  { w: 1200, h: 630, use: "Open Graph / social-share preview images for links" },
  { w: 1280, h: 640, use: "wide blog headers and banners" },
  // Photo print sizes (px @ 300 DPI)
  { w: 1050, h: 1500, use: "3.5×5 inch photo prints" },
  { w: 1200, h: 1800, use: "4×6 inch photo prints" },
  { w: 1500, h: 2100, use: "5×7 inch photo prints" },
  { w: 2400, h: 3000, use: "8×10 inch photo prints" },
  { w: 2480, h: 3508, use: "A4 documents and posters at 300 DPI" },
];

function faqs(d: Dim): SeoFaq[] {
  const dim = `${d.w}×${d.h}`;
  return [
    {
      question: `How do I resize an image to ${dim} pixels?`,
      answer: `Upload your image above and click "Resize to ${dim}". The tool redraws it at exactly ${d.w} pixels wide by ${d.h} pixels tall and offers it for download — entirely in your browser, nothing uploaded.`,
    },
    {
      question: `Is resizing to ${dim} free?`,
      answer: `Yes — completely free, no watermark, no sign-up and no limit on how many images you resize.`,
    },
    {
      question: `Will resizing to ${dim} stretch my image?`,
      answer: `This tool resizes to the exact ${dim} dimensions. If your image has a different aspect ratio it will be scaled to fit ${dim}; for best results start from an image with a similar ratio, or crop it first.`,
    },
    {
      question: `Is it private to resize photos to ${dim} here?`,
      answer: `Yes. The image is processed on a canvas in your browser and never leaves your device — nothing is uploaded to any server.`,
    },
    {
      question: `What format will the resized ${dim} image be?`,
      answer: `JPG images stay JPG and everything else is saved as PNG, so transparency is preserved where it exists.`,
    },
  ];
}

function makePage(d: Dim): SeoPage {
  const dim = `${d.w}×${d.h}`;
  const dimLower = `${d.w}x${d.h}`;
  const slug = `resize-image-to-${dimLower}`;
  return {
    slug,
    cluster: "resize-image",
    clusterLabel: "Resize image to other dimensions",
    chip: `to ${dim}`,
    title: `Resize Image to ${dim} Online — Free Pixel-Perfect Resizer`,
    description: `Free online tool to resize any image to exactly ${dim} pixels — ideal for ${d.use}. No sign-up, no watermark, 100% private in your browser.`,
    h1: `Resize Image to ${dim}`,
    subhead: `Resize any image to exactly ${d.w}×${d.h} pixels, free and private — no sign-up, no watermark.`,
    keywords: [
      `resize image to ${dimLower}`,
      `resize photo to ${dimLower}`,
      `${dimLower} image resizer`,
      `resize image to ${dim} online`,
      `make image ${dimLower}`,
    ],
    intro: `Need an image at exactly ${dim} pixels? This free tool resizes any photo to ${d.w}×${d.h} in your browser and lets you download it instantly. ${dim} is the go-to size for ${d.use}, so you get a correctly-sized image without opening heavy editing software.`,
    howTo: [
      `Drop your image into the box above (or click to browse). It is processed entirely in your browser — nothing is uploaded.`,
      `Press "Resize to ${dim}". The tool redraws your image at ${d.w}×${d.h} pixels.`,
      `Download the resized image straight away.`,
      `Use it for ${d.use}.`,
    ],
    faqs: faqs(d),
    breadcrumb: [
      { name: "Tools", href: "/tools" },
      { name: "Image Tools", href: "/tools/image" },
      { name: "Resize Image", href: "/tools/image/resize-image" },
    ],
    relatedCategory: "image",
    tool: { kind: "resize-image", width: d.w, height: d.h },
  };
}

// ─────────────────────────────────────────────────────────────────────────
// Combinatorial keyword fill.
//
// Every "resize image to W×H" is its own query, and the long tail of them is
// where this site actually wins: /resize-image-to-1075x1075 sits at #1 in
// Google precisely because nobody else has a page for it, while the head terms
// ("resize image") are held by iLovePDF/Adobe and are not winnable. So the
// strategy is to own the tail exhaustively — each page is a working resizer,
// not a doorway, since the tool takes W and H as parameters.
//
// Tiers are appended in descending order of search intent and the total is
// capped, so raising or lowering RESIZE_PAGE_BUDGET always keeps the most
// valuable pages and drops the least valuable ones.
// ─────────────────────────────────────────────────────────────────────────

export const RESIZE_PAGE_BUDGET = 4200;

/** Copy varies by size band and shape so no two pages share an intro. */
function useFor(w: number, h: number): string {
  const r = w / h;
  const max = Math.max(w, h);
  if (Math.abs(r - 1) < 0.02) {
    if (max <= 300) return "thumbnails, avatars and form photo boxes";
    if (max <= 800) return "profile photos and product images";
    if (max <= 1500) return "e-commerce listings and social profile pictures";
    return "high-resolution square images and prints";
  }
  if (r > 1) {
    if (Math.abs(r - 16 / 9) < 0.03) return "video thumbnails, slide backgrounds and widescreen banners";
    if (Math.abs(r - 4 / 3) < 0.03) return "presentation slides and classic 4:3 photos";
    if (Math.abs(r - 3 / 2) < 0.03) return "DSLR-ratio photos and print layouts";
    if (Math.abs(r - 16 / 10) < 0.03) return "desktop wallpapers and wide displays";
    if (r >= 2.2) return "ultra-wide headers, cover images and banner strips";
    return max <= 800 ? "email banners and inline web images" : "landscape headers and hero images";
  }
  if (Math.abs(r - 9 / 16) < 0.03) return "stories, reels and vertical video covers";
  if (Math.abs(r - 3 / 4) < 0.03) return "portrait posts and photo prints";
  if (Math.abs(r - 2 / 3) < 0.03) return "portrait photo prints and posters";
  if (r <= 0.45) return "tall banners, bookmarks and vertical skyscraper images";
  return max <= 800 ? "portrait thumbnails and form photos" : "portrait posters and print photos";
}

/** Round pixel values people actually type into a resizer. */
const COMMON_PX = [
  50, 64, 72, 80, 90, 100, 110, 120, 125, 128, 144, 150, 160, 175, 180, 192, 200,
  210, 220, 225, 240, 250, 256, 270, 280, 288, 300, 320, 340, 350, 360, 375, 384,
  400, 420, 432, 440, 450, 460, 480, 500, 512, 540, 560, 576, 600, 620, 640, 660,
  680, 700, 720, 750, 768, 800, 820, 840, 850, 864, 900, 920, 960, 1000, 1024,
  1050, 1080, 1100, 1120, 1152, 1200, 1240, 1280, 1300, 1350, 1366, 1400, 1440,
  1500, 1536, 1600, 1680, 1700, 1728, 1800, 1900, 1920, 2000, 2048, 2160, 2400,
  2560, 3000, 3200, 3840,
];

/** Aspect ratios worth a dedicated family of pages. */
const RATIOS: Array<[number, number]> = [
  [16, 9], [9, 16], [4, 3], [3, 4], [3, 2], [2, 3], [16, 10], [10, 16],
  [5, 4], [4, 5], [21, 9], [2, 1], [1, 2], [5, 3], [7, 5], [8, 5],
];

const seen = new Set<string>(DIMS.map((d) => `${d.w}x${d.h}`));
const tiers: Dim[][] = [];

function collect(pairs: Array<[number, number]>): Dim[] {
  const out: Dim[] = [];
  for (const [w, h] of pairs) {
    const key = `${w}x${h}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ w, h, use: useFor(w, h) });
  }
  return out;
}

// Tier 1 — squares. "Resize image to N×N" is the single most-searched shape,
// stepped finer at the small end where the queries concentrate.
const squares: Array<[number, number]> = [];
for (let s = 50; s <= 600; s += 5) squares.push([s, s]);
for (let s = 610; s <= 1200; s += 10) squares.push([s, s]);
for (let s = 1225; s <= 2000; s += 25) squares.push([s, s]);
for (let s = 2050; s <= 4000; s += 50) squares.push([s, s]);
tiers.push(collect(squares));

// Tier 2 — named aspect-ratio families at every common width.
const ratioPairs: Array<[number, number]> = [];
for (const [rw, rh] of RATIOS) {
  for (const base of COMMON_PX) {
    const w = base;
    const h = Math.round((base * rh) / rw);
    if (h < 40 || h > 4320) continue;
    ratioPairs.push([w, h]);
  }
}
tiers.push(collect(ratioPairs));

// Tier 3 — the remaining W×H grid, held to sane shapes (between 1:3 and 3:1)
// so we never publish a page for a dimension nobody would ask for. Ordered by
// how close the pair is to a familiar ratio, so the budget cuts the odd ones.
const gridPairs: Array<[number, number]> = [];
for (const w of COMMON_PX) {
  for (const h of COMMON_PX) {
    const r = w / h;
    if (r < 1 / 3 || r > 3) continue;
    gridPairs.push([w, h]);
  }
}
gridPairs.sort((a, b) => {
  const dist = ([w, h]: [number, number]) =>
    Math.min(...RATIOS.map(([rw, rh]) => Math.abs(w / h - rw / rh)));
  return dist(a) - dist(b) || a[0] - b[0] || a[1] - b[1];
});
tiers.push(collect(gridPairs));

const filled: Dim[] = [];
for (const tier of tiers) {
  for (const d of tier) {
    if (DIMS.length + filled.length >= RESIZE_PAGE_BUDGET) break;
    filled.push(d);
  }
}

export const imageResizePages: SeoPage[] = [...DIMS, ...filled].map(makePage);
