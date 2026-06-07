export const siteConfig = {
  name: "ConvertFlow",
  tagline: "Every file tool you need. Faster, cleaner, free.",
  description:
    "ConvertFlow is a fast, secure, privacy-first platform with 100+ tools to convert, compress, merge, edit and transform PDF, image, CSV and text files online.",
  // `||` (not `??`) so an empty-string env var also falls back. These are
  // public values; the fallbacks keep production working even if the Vercel
  // env var is missing/blank. Local dev overrides apiUrl via .env.local.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://tools.arivanandhan.in",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "https://tools-live.onrender.com",
  ogImage: "/og.png",
  twitter: "@arivanandhan",
  keywords: [
    "PDF tools",
    "file converter",
    "online converter",
    "PDF editor",
    "CSV converter",
    "image compressor",
    "merge PDF",
    "compress PDF",
  ],
} as const;

export const mainNav = [
  { title: "All Tools", href: "/tools" },
  { title: "PDF", href: "/tools/pdf" },
  { title: "Image", href: "/tools/image" },
  { title: "CSV", href: "/tools/csv" },
  { title: "Developer", href: "/tools/developer" },
  { title: "Pricing", href: "/pricing" },
];
