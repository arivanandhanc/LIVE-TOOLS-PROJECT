import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Backend origin allowed for fetch/XHR (BullMQ job API, auth, uploads).
const apiOrigin = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// Google reCAPTCHA + Google Fonts endpoints that must be allowlisted.
const recaptcha = "https://www.google.com https://www.gstatic.com";

/**
 * Content-Security-Policy.
 * We deliberately avoid nonces so pages stay statically prerendered (fast,
 * CDN-cacheable, Lighthouse-friendly). For routes that need a per-request
 * nonce, a proxy-based strict CSP can be layered on later.
 */
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' ${recaptcha}${isDev ? " 'unsafe-eval'" : ""}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' blob: data: ${recaptcha}`,
  `font-src 'self' data:`,
  `connect-src 'self' blob: ${apiOrigin} ${recaptcha} https://www.google-analytics.com`,
  `frame-src https://www.google.com`,
  `worker-src 'self' blob:`,
  `media-src 'self' blob:`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
  `manifest-src 'self'`,
  ...(isDev ? [] : [`upgrade-insecure-requests`]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(self), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  // Self-contained server bundle for Docker/Render; ignored by Vercel.
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
