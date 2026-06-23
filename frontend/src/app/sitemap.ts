import type { MetadataRoute } from "next";
import { tools, categories } from "@/lib/tools/registry";
import { posts } from "@/lib/blog";
import { allSeoPages } from "@/lib/seo-pages";
import { services, serviceCategories } from "@/lib/resources/services";
import { siteConfig } from "@/lib/site";

// Prerender as a static file served from the CDN edge (no serverless cold
// start). A slow/cold sitemap response is a common cause of GSC "couldn't
// fetch"; static delivery makes it return instantly for Google's fetcher.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  // Date-only lastmod (YYYY-MM-DD) — the most universally-accepted W3C-datetime
  // form; avoids fractional seconds that a few strict sitemap parsers reject.
  const now = new Date().toISOString().slice(0, 10);

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/tools`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/resources`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/security`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/about/founder`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/legal/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/legal/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/legal/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${base}/tools/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${base}/tools/${tool.category}/${tool.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: tool.featured ? 0.9 : 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.updated).toISOString().slice(0, 10),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Programmatic SEO landing pages (compress-to-size, resize-to-dimensions, …).
  const seoPages: MetadataRoute.Sitemap = allSeoPages.map((page) => ({
    url: `${base}/${page.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const resourceCategoryPages: MetadataRoute.Sitemap = serviceCategories.map((c) => ({
    url: `${base}/resources/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const servicePages: MetadataRoute.Sitemap = services.map((svc) => ({
    url: `${base}/resources/${svc.category}/${svc.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...categoryPages,
    ...toolPages,
    ...blogPages,
    ...seoPages,
    ...resourceCategoryPages,
    ...servicePages,
  ];
}
