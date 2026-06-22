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

// Fill in common square sizes (every 25 px) people search for — each "resize to
// N×N" is a distinct query. Deduped against the curated DIMS above.
const SQUARES: Dim[] = [];
for (let s = 50; s <= 2000; s += 25) {
  if (DIMS.some((d) => d.w === s && d.h === s)) continue;
  SQUARES.push({
    w: s,
    h: s,
    use:
      s <= 300
        ? "thumbnails, avatars and form photo boxes"
        : s <= 800
          ? "profile photos and product images"
          : "high-resolution square images and prints",
  });
}

export const imageResizePages: SeoPage[] = [...DIMS, ...SQUARES].map(makePage);
