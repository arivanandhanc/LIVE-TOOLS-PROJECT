import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";
import {
  services,
  getService,
  getServiceCategory,
  getServicesByCategory,
} from "@/lib/resources/services";
import { ServiceCard } from "@/components/service-card";
import { siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return services.map((svc) => ({ category: svc.category, slug: svc.slug }));
}

export async function generateMetadata(
  props: PageProps<"/resources/[category]/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const service = getService(slug);
  if (!service) return {};
  const cat = getServiceCategory(service.category);
  const title = `${service.name} — Review & Link (${cat?.name ?? "Resource"})`;
  return {
    title,
    description: `${service.name}: ${service.description} See what it does and visit the official site.`,
    alternates: { canonical: `/resources/${service.category}/${service.slug}` },
    // These are thin, near-identical "describe + outbound link" pages. On a
    // young domain, indexing 500+ of them dilutes crawl budget and drags the
    // whole site's quality signal. noindex (but follow, so link equity still
    // flows out) keeps them usable while Google focuses on our real tools.
    // Category hubs at /resources/[category] stay indexable.
    robots: { index: false, follow: true },
  };
}

export default async function ServicePage(
  props: PageProps<"/resources/[category]/[slug]">
) {
  const { category, slug } = await props.params;
  const service = getService(slug);
  if (!service || service.category !== category) notFound();

  const cat = getServiceCategory(service.category)!;
  const related = getServicesByCategory(service.category)
    .filter((s) => s.slug !== service.slug)
    .slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: service.name,
    description: service.description,
    url: `${siteConfig.url}/resources/${service.category}/${service.slug}`,
    about: { "@type": "SoftwareApplication", name: service.name, url: service.url },
  };

  return (
    <article className="container-page py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/resources" className="hover:text-foreground">Resources</Link>
        <ChevronRight className="size-4" />
        <Link href={`/resources/${cat.slug}`} className="hover:text-foreground">{cat.name}</Link>
        <ChevronRight className="size-4" />
        <span className="text-foreground">{service.name}</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{service.name}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{service.description}</p>
      </header>

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Category</p>
          <Link href={`/resources/${cat.slug}`} className="font-medium hover:text-primary">
            {cat.name}
          </Link>
        </div>
        <a
          href={service.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Visit {service.name} <ExternalLink className="size-4" />
        </a>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        {service.name} is a third-party service. The link above opens its official website
        ({new URL(service.url).hostname}). We are not affiliated unless stated.
      </p>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 text-xl font-bold tracking-tight">More {cat.name.toLowerCase()}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
