import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { getToolsByCategory } from "@/lib/tools/registry";
import { ToolCard } from "@/components/tool-card";
import { SeoToolRunner } from "@/components/tools/seo-tool-runner";
import { allSeoPages, getSeoPage, siblingPages } from "@/lib/seo-pages";

// Only generated slugs resolve; every other root path 404s as before.
export const dynamicParams = false;

export function generateStaticParams() {
  return allSeoPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const page = getSeoPage(slug);
  if (!page) return {};
  const canonical = `/${page.slug}`;
  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: page.title,
      description: page.description,
      url: `${siteConfig.url}${canonical}`,
      siteName: siteConfig.name,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: page.h1 }],
    },
    twitter: { card: "summary_large_image", title: page.title, description: page.description, images: ["/og.png"] },
  };
}

export default async function SeoLandingPage(props: PageProps<"/[slug]">) {
  const { slug } = await props.params;
  const page = getSeoPage(slug);
  if (!page) notFound();

  const url = `${siteConfig.url}/${page.slug}`;
  const siblings = siblingPages(page);
  const parent = page.breadcrumb[page.breadcrumb.length - 1];
  const related = getToolsByCategory(page.relatedCategory)
    .filter((t) => t.status === "live")
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: page.h1,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any (web)",
        browserRequirements: "Requires a modern web browser (JavaScript enabled).",
        description: page.description,
        url,
        image: `${siteConfig.url}/og.png`,
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          ...page.breadcrumb.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            item: `${siteConfig.url}${c.href}`,
          })),
          {
            "@type": "ListItem",
            position: page.breadcrumb.length + 1,
            name: page.h1,
            item: url,
          },
        ],
      },
      {
        "@type": "HowTo",
        name: `How to ${page.h1.toLowerCase()}`,
        step: page.howTo.map((text, i) => ({ "@type": "HowToStep", position: i + 1, text })),
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };

  return (
    <article className="container-page py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground" aria-label="Breadcrumb">
        {page.breadcrumb.map((c) => (
          <span key={c.href} className="flex items-center gap-1">
            <Link href={c.href} className="hover:text-foreground">{c.name}</Link>
            <ChevronRight className="size-4" />
          </span>
        ))}
        <span className="text-foreground">{page.chip}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{page.h1}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{page.subhead}</p>
      </header>

      <SeoToolRunner tool={page.tool} />

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-card/50 p-4 text-sm text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-success" />
        <p>
          This tool runs entirely in your browser. Your file never leaves your device — nothing
          is uploaded to our servers, so confidential documents and photos stay private.
        </p>
      </div>

      {/* Unique indexable intro */}
      <section className="mt-14 max-w-3xl">
        <h2 className="mb-4 text-xl font-bold tracking-tight">{page.h1} online — free and exact</h2>
        <p className="text-muted-foreground leading-relaxed">{page.intro}</p>
      </section>

      {/* How it works + FAQ */}
      <section className="mt-14 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-bold tracking-tight">How to {page.h1.toLowerCase()}</h2>
          <ol className="space-y-4">
            {page.howTo.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {i + 1}
                </span>
                <p className="text-sm text-muted-foreground">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-bold tracking-tight">Frequently asked questions</h2>
          <div className="space-y-3">
            {page.faqs.map((faq) => (
              <details key={faq.question} className="group rounded-lg border border-border bg-card p-4">
                <summary className="cursor-pointer list-none font-medium marker:hidden">
                  <span className="flex items-center justify-between gap-2">
                    {faq.question}
                    <span className="text-muted-foreground transition-transform group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Sibling pages — dense internal linking across the cluster */}
      {siblings.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 text-xl font-bold tracking-tight">{page.clusterLabel}</h2>
          <div className="flex flex-wrap gap-2">
            {siblings.map((s) => (
              <Link
                key={s.slug}
                href={`/${s.slug}`}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                {s.chip}
              </Link>
            ))}
            {parent && (
              <Link
                href={parent.href}
                className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
              >
                {parent.name} →
              </Link>
            )}
          </div>
        </section>
      )}

      {/* Related live tools */}
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 text-xl font-bold tracking-tight">Related tools</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
