// Programmatic "Resize image to W×H" landing pages — 100% client-side (canvas).

import type { SeoPage, SeoFaq } from "./types";

interface Dim {
  w: number;
  h: number;
  /** What this size is commonly used for (drives unique copy). */
  use: string;
}

const DIMS: Dim[] = [
  { w: 1080, h: 1080, use: "Instagram posts and square profile pictures" },
  { w: 1080, h: 1920, use: "Instagram, Facebook and WhatsApp stories and reels" },
  { w: 1920, h: 1080, use: "full-HD wallpapers, YouTube thumbnails and slide backgrounds" },
  { w: 1280, h: 720, use: "HD video thumbnails and presentation images" },
  { w: 1200, h: 630, use: "Open Graph / social-share preview images for links" },
  { w: 1000, h: 1000, use: "marketplace and e-commerce product photos" },
  { w: 800, h: 600, use: "classic 4:3 web images and email banners" },
  { w: 600, h: 600, use: "small square thumbnails and avatars" },
  { w: 500, h: 500, use: "compact profile photos and icons" },
  { w: 300, h: 300, use: "tiny thumbnails and form photo boxes" },
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

export const imageResizePages: SeoPage[] = DIMS.map(makePage);
