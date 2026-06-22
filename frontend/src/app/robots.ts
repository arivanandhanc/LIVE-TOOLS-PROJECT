import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

// Serve from the CDN edge (no cold start) — Google fetches robots before the
// sitemap, so a slow robots response can stall sitemap discovery too.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/dashboard"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
