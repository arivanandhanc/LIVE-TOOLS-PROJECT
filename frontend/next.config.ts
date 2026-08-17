import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Backend origin allowed for fetch/XHR (BullMQ job API, auth, uploads).
// In the browser the app calls the API same-origin (/api/*) and Next proxies
// to this origin via rewrites() — that keeps the auth refresh cookie first-party.
const apiOrigin =
  process.env.NEXT_PUBLIC_API_URL || (isDev ? "http://localhost:4000" : "https://tools-live.onrender.com");

// Google reCAPTCHA endpoints that must be allowlisted. Covers both the classic
// (api.js) and Enterprise (enterprise.js) loaders plus the challenge iframes,
// which can be served from recaptcha.net in regions where google.com is blocked.
const recaptcha =
  "https://www.google.com https://www.gstatic.com https://recaptcha.google.com https://www.recaptcha.net";

// Google AdSense. The loader pulls in ad tags, creatives and the Privacy
// Sandbox / ad-traffic-quality beacons, each on its own host — miss one and the
// slot silently renders blank, so keep these grouped and complete.
const adsScripts =
  "https://pagead2.googlesyndication.com https://tpc.googlesyndication.com " +
  "https://googleads.g.doubleclick.net https://adservice.google.com " +
  "https://partner.googleadservices.com https://www.googletagservices.com " +
  "https://fundingchoicesmessages.google.com";
const adsFrames =
  "https://googleads.g.doubleclick.net https://tpc.googlesyndication.com " +
  "https://www.google.com https://pagead2.googlesyndication.com";
const adsConnect =
  "https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net " +
  "https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google " +
  "https://csi.gstatic.com https://fundingchoicesmessages.google.com";
// Creatives are served from arbitrary Google CDNs plus advertiser domains.
const adsImages = `${adsScripts} https://www.googletagmanager.com https://*.g.doubleclick.net https://*.googleusercontent.com`;

/**
 * Content-Security-Policy.
 * We deliberately avoid nonces so pages stay statically prerendered (fast,
 * CDN-cacheable, Lighthouse-friendly). For routes that need a per-request
 * nonce, a proxy-based strict CSP can be layered on later.
 */
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' ${recaptcha} ${adsScripts}${isDev ? " 'unsafe-eval'" : ""}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' blob: data: ${recaptcha} ${adsImages}`,
  `font-src 'self' data:`,
  `connect-src 'self' blob: ${apiOrigin} ${recaptcha} ${adsConnect} https://www.google-analytics.com`,
  `frame-src ${recaptcha} ${adsFrames}`,
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
  async rewrites() {
    // Proxy API calls under our own origin so the httpOnly refresh cookie is
    // first-party (third-party cookies are blocked by modern browsers, which
    // otherwise breaks "stay signed in" across page loads).
    return [{ source: "/api/:path*", destination: `${apiOrigin}/api/:path*` }];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    // Pricing removed — everything is free. Send any old/bookmarked links home.
    return [{ source: "/pricing", destination: "/", permanent: true }];
  },
};

export default nextConfig;
