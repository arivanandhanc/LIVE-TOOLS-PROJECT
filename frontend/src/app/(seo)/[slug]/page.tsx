import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Minimize2 } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { getTool, getToolsByCategory } from "@/lib/tools/registry";
import { ToolCard } from "@/components/tool-card";
import { CompressTargetRunner } from "@/components/tools/compress-target-runner";
import {
  compressTargets,
  getCompressTarget,
  titleFor,
  descriptionFor,
  h1For,
  introFor,
  howToFor,
  faqsFor,
} from "@/lib/seo-pages/compress-pdf";

// Only the slugs we generate below are valid; every other root path 404s
// exactly as before (no shadowing of other routes).
export const dynamicParams = false;

export function generateStaticParams() {
  return compressTargets.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata(
  props: PageProps<"/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const target = getCompressTarget(slug);
  if (!target) return {};
  const title = titleFor(target);
  const description = descriptionFor(target);
  const canonical = `/${target.slug}`;
  return {
    title,
    description,
    keywords: [
      `compress pdf to ${target.display.toLowerCase()}`,
      `reduce pdf to ${target.display.toLowerCase()}`,
      `pdf to ${target.display.toLowerCase()}`,
      `compress pdf to ${target.display.toLowerCase()} online`,
      `make pdf smaller than ${target.display.toLowerCase()}`,
    ],
    alternates: { canonical },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${siteConfig.url}${canonical}`,
      siteName: siteConfig.name,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: h1For(target) }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
  };
}

export default async function CompressToSizePage(props: PageProps<"/[slug]">) {
  const { slug } = await props.params;
  const target = getCompressTarget(slug);
  if (!target) notFound();

  const url = `${siteConfig.url}/${target.slug}`;
  const steps = howToFor(target);
  const faqs = faqsFor(target);

  const canonicalTool = getTool("compress-pdf");
  const related = getToolsByCategory("pdf")
    .filter((tcur) => tcur.slug !== "compress-pdf" && tcur.status === "live")
    .slice(0, 4);
  const siblings = compressTargets.filter((s) => s.slug !== target.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: h1For(target),
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any (web)",
        browserRequirements: "Requires a modern web browser (JavaScript enabled).",
        description: descriptionFor(target),
        url,
        image: `${siteConfig.url}/og.png`,
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Tools", item: `${siteConfig.url}/tools` },
          { "@type": "ListItem", position: 2, name: "PDF Tools", item: `${siteConfig.url}/tools/pdf` },
          { "@type": "ListItem", position: 3, name: "Compress PDF", item: `${siteConfig.url}/tools/pdf/compress-pdf` },
          { "@type": "ListItem", position: 4, name: h1For(target), item: url },
        ],
      },
      {
        "@type": "HowTo",
        name: `How to compress a PDF to ${target.display}`,
        step: steps.map((text, i) => ({ "@type": "HowToStep", position: i + 1, text })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
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
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <ChevronRight className="size-4" />
        <Link href="/tools/pdf" className="hover:text-foreground">PDF Tools</Link>
        <ChevronRight className="size-4" />
        <Link href="/tools/pdf/compress-pdf" className="hover:text-foreground">Compress PDF</Link>
        <ChevronRight className="size-4" />
        <span className="text-foreground">to {target.display}</span>
      </nav>

      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start">
        <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Minimize2 className="size-7" />
        </span>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{h1For(target)}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Reduce any PDF to {target.display} or less, free and private — no sign-up, no watermark.
          </p>
        </div>
      </header>

      <CompressTargetRunner
        slug={target.slug}
        targetBytes={target.bytes}
        targetDisplay={target.display}
      />

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-card/50 p-4 text-sm text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-success" />
        <p>
          This tool runs entirely in your browser. Your PDF never leaves your device — nothing
          is uploaded to our servers, so confidential documents stay private.
        </p>
      </div>

      {/* Unique indexable intro */}
      <section className="mt-14 max-w-3xl">
        <h2 className="mb-4 text-xl font-bold tracking-tight">
          Compress PDF to {target.display} online — free and exact
        </h2>
        <p className="text-muted-foreground leading-relaxed">{introFor(target)}</p>
      </section>

      {/* How it works + FAQ */}
      <section className="mt-14 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-bold tracking-tight">
            How to compress a PDF to {target.display}
          </h2>
          <ol className="space-y-4">
            {steps.map((step, i) => (
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
            {faqs.map((faq) => (
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

      {/* Sibling sizes — dense internal linking across the cluster */}
      <section className="mt-14">
        <h2 className="mb-4 text-xl font-bold tracking-tight">Compress PDF to other sizes</h2>
        <div className="flex flex-wrap gap-2">
          {siblings.map((s) => (
            <Link
              key={s.slug}
              href={`/${s.slug}`}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              to {s.display}
            </Link>
          ))}
          {canonicalTool && (
            <Link
              href="/tools/pdf/compress-pdf"
              className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
            >
              Standard Compress PDF →
            </Link>
          )}
        </div>
      </section>

      {/* Related PDF tools */}
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 text-xl font-bold tracking-tight">Related PDF tools</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((tcur) => (
              <ToolCard key={tcur.slug} tool={tcur} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
