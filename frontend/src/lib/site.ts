export const siteConfig = {
  name: "ConvertFlow",
  tagline: "Every file tool you need. Faster, cleaner, free.",
  description:
    "ConvertFlow is a fast, secure, privacy-first platform with 100+ tools to convert, compress, merge, edit and transform PDF, image, CSV and text files online.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://tools.arivanandhan.in",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
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
