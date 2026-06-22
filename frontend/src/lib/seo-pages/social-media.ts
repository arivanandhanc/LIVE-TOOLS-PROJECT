// Programmatic "<platform> <asset> size" landing pages — 100% client-side resize.
// Each is a distinct, high-demand query with its own exact pixel dimensions.
// Grouped per platform so sibling cross-links stay tight and relevant.

import type { SeoPage, SeoFaq } from "./types";

interface Preset {
  platform: string;
  /** Asset name, e.g. "post", "story", "cover photo". */
  asset: string;
  w: number;
  h: number;
}

const PRESETS: Preset[] = [
  // Instagram
  { platform: "Instagram", asset: "post", w: 1080, h: 1080 },
  { platform: "Instagram", asset: "portrait post", w: 1080, h: 1350 },
  { platform: "Instagram", asset: "landscape post", w: 1080, h: 566 },
  { platform: "Instagram", asset: "story", w: 1080, h: 1920 },
  { platform: "Instagram", asset: "profile picture", w: 320, h: 320 },
  // Facebook
  { platform: "Facebook", asset: "cover photo", w: 851, h: 315 },
  { platform: "Facebook", asset: "post", w: 1200, h: 630 },
  { platform: "Facebook", asset: "profile picture", w: 170, h: 170 },
  { platform: "Facebook", asset: "story", w: 1080, h: 1920 },
  { platform: "Facebook", asset: "event cover", w: 1920, h: 1005 },
  { platform: "Facebook", asset: "group cover", w: 1640, h: 856 },
  { platform: "Facebook", asset: "ad", w: 1080, h: 1080 },
  // X / Twitter
  { platform: "X (Twitter)", asset: "header", w: 1500, h: 500 },
  { platform: "X (Twitter)", asset: "post image", w: 1200, h: 675 },
  { platform: "X (Twitter)", asset: "profile picture", w: 400, h: 400 },
  { platform: "X (Twitter)", asset: "card image", w: 1200, h: 628 },
  // LinkedIn
  { platform: "LinkedIn", asset: "banner", w: 1584, h: 396 },
  { platform: "LinkedIn", asset: "post image", w: 1200, h: 627 },
  { platform: "LinkedIn", asset: "profile picture", w: 400, h: 400 },
  { platform: "LinkedIn", asset: "company cover", w: 1128, h: 191 },
  { platform: "LinkedIn", asset: "company logo", w: 300, h: 300 },
  // YouTube
  { platform: "YouTube", asset: "thumbnail", w: 1280, h: 720 },
  { platform: "YouTube", asset: "channel banner", w: 2560, h: 1440 },
  { platform: "YouTube", asset: "profile picture", w: 800, h: 800 },
  { platform: "YouTube", asset: "shorts cover", w: 1080, h: 1920 },
  // Pinterest
  { platform: "Pinterest", asset: "pin", w: 1000, h: 1500 },
  { platform: "Pinterest", asset: "square pin", w: 1000, h: 1000 },
  { platform: "Pinterest", asset: "profile picture", w: 165, h: 165 },
  { platform: "Pinterest", asset: "board cover", w: 222, h: 150 },
  // TikTok
  { platform: "TikTok", asset: "video", w: 1080, h: 1920 },
  { platform: "TikTok", asset: "profile picture", w: 200, h: 200 },
  // WhatsApp
  { platform: "WhatsApp", asset: "profile picture", w: 500, h: 500 },
  { platform: "WhatsApp", asset: "status", w: 1080, h: 1920 },
  // Snapchat
  { platform: "Snapchat", asset: "ad", w: 1080, h: 1920 },
  { platform: "Snapchat", asset: "geofilter", w: 1080, h: 2340 },
  // Twitch
  { platform: "Twitch", asset: "banner", w: 1200, h: 480 },
  { platform: "Twitch", asset: "profile picture", w: 800, h: 800 },
  { platform: "Twitch", asset: "panel", w: 320, h: 100 },
  { platform: "Twitch", asset: "offline banner", w: 1920, h: 1080 },
  // Discord
  { platform: "Discord", asset: "profile picture", w: 128, h: 128 },
  { platform: "Discord", asset: "banner", w: 600, h: 240 },
  { platform: "Discord", asset: "server icon", w: 512, h: 512 },
  // Telegram
  { platform: "Telegram", asset: "profile picture", w: 512, h: 512 },
  // Reddit
  { platform: "Reddit", asset: "banner", w: 1920, h: 384 },
  { platform: "Reddit", asset: "profile picture", w: 256, h: 256 },
  { platform: "Reddit", asset: "post image", w: 1200, h: 900 },
  // Spotify
  { platform: "Spotify", asset: "playlist cover", w: 300, h: 300 },
  { platform: "Spotify", asset: "artist header", w: 2660, h: 1140 },
  // Tumblr
  { platform: "Tumblr", asset: "post", w: 1280, h: 1920 },
  { platform: "Tumblr", asset: "banner", w: 3000, h: 1055 },
  // Behance / Dribbble / Medium
  { platform: "Behance", asset: "project cover", w: 1400, h: 900 },
  { platform: "Dribbble", asset: "shot", w: 1600, h: 1200 },
  { platform: "Medium", asset: "header", w: 1500, h: 750 },
  // Etsy / Shopify / e-commerce
  { platform: "Etsy", asset: "shop banner", w: 1200, h: 300 },
  { platform: "Etsy", asset: "listing photo", w: 2000, h: 2000 },
  { platform: "Shopify", asset: "product photo", w: 2048, h: 2048 },
  { platform: "Amazon", asset: "product photo", w: 2000, h: 2000 },
  // Email / blog
  { platform: "Email", asset: "header banner", w: 600, h: 200 },
  { platform: "WordPress", asset: "featured image", w: 1200, h: 628 },
];

function slugFor(p: Preset): string {
  const plat = p.platform.toLowerCase().replace(/\s*\(.*\)/, "").replace(/[^a-z0-9]+/g, "-");
  const asset = p.asset.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return `${plat}-${asset}-size`;
}

function clusterFor(p: Preset): string {
  return `social-${p.platform.toLowerCase().replace(/\s*\(.*\)/, "").replace(/[^a-z0-9]+/g, "-")}`;
}

function faqs(p: Preset, dim: string): SeoFaq[] {
  const label = `${p.platform} ${p.asset}`;
  return [
    {
      question: `What is the ${label} size?`,
      answer: `The recommended ${label} size is ${dim} pixels. Upload your image above and the tool resizes it to exactly ${dim} px in your browser.`,
    },
    {
      question: `How do I resize an image for a ${label} for free?`,
      answer: `Drop your image above and click "Resize to ${dim}". It is redrawn at ${dim} px and ready to download — no upload, no sign-up, no watermark.`,
    },
    {
      question: `Is this ${label} resizer private?`,
      answer: `Yes. The image is processed on a canvas in your browser and never leaves your device.`,
    },
    {
      question: `What format will the resized ${label} be?`,
      answer: `JPG images stay JPG; everything else is saved as PNG so transparency is preserved.`,
    },
    {
      question: `Will my image be stretched to fit ${dim}?`,
      answer: `It is resized to exactly ${dim} px. For the best look, start from an image with a similar aspect ratio or crop it first.`,
    },
  ];
}

function makePage(p: Preset): SeoPage {
  const dim = `${p.w}×${p.h}`;
  const dimLower = `${p.w}x${p.h}`;
  const label = `${p.platform} ${p.asset}`;
  const titleLabel = label.replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    slug: slugFor(p),
    cluster: clusterFor(p),
    clusterLabel: `Other ${p.platform} image sizes`,
    chip: `${p.asset} (${dim})`,
    title: `${titleLabel} Size (${dim}) — Free Online Resizer`,
    description: `Resize any image to the exact ${label} size — ${dim} pixels. Free, private and instant in your browser. No sign-up, no watermark.`,
    h1: `${titleLabel} Size (${dim})`,
    subhead: `Resize your image to the exact ${label} size — ${dim} pixels, free and private.`,
    keywords: [
      `${label} size`,
      `${label} dimensions`,
      `${label} size in pixels`,
      `resize image for ${p.platform.toLowerCase()} ${p.asset.toLowerCase()}`,
      `${label} ${dimLower}`,
    ],
    intro: `The correct ${label} size is ${dim} pixels. This free tool resizes any photo to exactly ${dim} px right in your browser, so your ${p.platform} ${p.asset} looks crisp and correctly proportioned without cropping surprises or quality loss from re-uploads. No account, no watermark — just drop, resize and download.`,
    howTo: [
      `Drop your image into the box above (or click to browse) — processed entirely in your browser.`,
      `Press "Resize to ${dim}" to set the exact ${p.platform} ${p.asset} dimensions.`,
      `Download the resized image.`,
      `Upload it to ${p.platform} as your ${p.asset}.`,
    ],
    faqs: faqs(p, dim),
    breadcrumb: [
      { name: "Tools", href: "/tools" },
      { name: "Image Tools", href: "/tools/image" },
      { name: "Resize Image", href: "/tools/image/resize-image" },
    ],
    relatedCategory: "image",
    tool: { kind: "resize-image", width: p.w, height: p.h },
  };
}

export const socialMediaPages: SeoPage[] = PRESETS.map(makePage);
