export const siteConfig = {
  name: "Scrab Tools",
  tagline: "Mini tools for PDFs and every digital asset.",
  description:
    "Scrab Tools is a collection of 100+ free mini tools for PDFs, images, CSV data, text and developer formats — convert, compress, merge and edit in seconds. Most run entirely in your browser, so your files never leave your device.",
  // `||` (not `??`) so an empty-string env var also falls back. These are
  // public values; the fallbacks keep production working even if the Vercel
  // env var is missing/blank. Local dev overrides apiUrl via .env.local.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.scrabtools.site",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "https://tools-live.onrender.com",
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
