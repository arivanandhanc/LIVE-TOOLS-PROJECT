import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Server, Sparkles } from "lucide-react";
import {
  tools, getTool, getCategory, getToolsByCategory,
} from "@/lib/tools/registry";
import { getHowToSteps, getFaqs, getLongDescription, getIntro, getBenefits } from "@/lib/tools/seo";
import { getServerToolConfig } from "@/lib/tools/server-tools";
import { ToolRunner } from "@/components/tools/runner";
import { ServerToolForm } from "@/components/tools/server-tool-form";
import { AiTool } from "@/components/tools/ai-tool";
import { ToolCard } from "@/components/tool-card";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return tools.map((tool) => ({ category: tool.category, slug: tool.slug }));
}

export async function generateMetadata(
  props: PageProps<"/tools/[category]/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const tool = getTool(slug);
  if (!tool) return {};
  const cat = getCategory(tool.category);
  const title = `${tool.name} — Free Online ${cat?.name ?? "File"} Tool`;
  const description = getLongDescription(tool);
  const canonical = `/tools/${tool.category}/${tool.slug}`;
  const keywords = Array.from(
    new Set([
      ...(tool.keywords ?? []),
      tool.name.toLowerCase(),
      `${tool.name.toLowerCase()} online`,
      `free ${tool.name.toLowerCase()}`,
      `${tool.name.toLowerCase()} no sign up`,
    ])
  );
  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${siteConfig.url}${canonical}`,
      siteName: siteConfig.name,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: tool.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  };
}

export default async function ToolPage(props: PageProps<"/tools/[category]/[slug]">) {
  const { category, slug } = await props.params;
  const tool = getTool(slug);
  if (!tool || tool.category !== category) notFound();

  const cat = getCategory(tool.category)!;
  const Icon = tool.icon;
  const related = getToolsByCategory(tool.category)
    .filter((current) => current.slug !== tool.slug)
    .slice(0, 4);

  const steps = getHowToSteps(tool);
  const faqs = getFaqs(tool);
  const intro = getIntro(tool);
  const benefits = getBenefits(tool);
  const url = `${siteConfig.url}/tools/${tool.category}/${tool.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: tool.name,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any (web)",
        browserRequirements: "Requires a modern web browser (JavaScript enabled).",
        description: getLongDescription(tool),
        url,
        image: `${siteConfig.url}/og.png`,
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: benefits,
        publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Tools", item: `${siteConfig.url}/tools` },
          { "@type": "ListItem", position: 2, name: cat.name, item: `${siteConfig.url}/tools/${cat.slug}` },
          { "@type": "ListItem", position: 3, name: tool.name, item: url },
        ],
      },
      {
        "@type": "HowTo",
        name: `How to ${tool.name.toLowerCase()}`,
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

  const isServer = tool.mode === "server";
  const serverConfig = isServer ? getServerToolConfig(tool.slug) : undefined;

  return (
    <article className="container-page py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <ChevronRight className="size-4" />
        <Link href={`/tools/${cat.slug}`} className="hover:text-foreground">{cat.name}</Link>
        <ChevronRight className="size-4" />
        <span className="text-foreground">{tool.name}</span>
      </nav>

      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start">
        <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-7" />
        </span>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{tool.name}</h1>
            {tool.status === "soon" && <Badge variant="muted">Coming soon</Badge>}
            <Badge variant="outline" className="gap-1">
              {isServer ? <Server className="size-3" /> : <ShieldCheck className="size-3" />}
              {isServer ? "Secure server processing" : "Runs in your browser"}
            </Badge>
          </div>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {tool.longDescription ?? tool.description}
          </p>
        </div>
      </header>

      {/* Working surface */}
      {tool.category === "ai" && tool.status === "live" ? (
        <AiTool slug={tool.slug} />
      ) : serverConfig ? (
        <ServerToolForm slug={tool.slug} />
      ) : isServer || tool.status === "soon" ? (
        <ServerToolNotice toolName={tool.name} isAi={tool.category === "ai"} />
      ) : (
        <ToolRunner slug={tool.slug} />
      )}

      {/* Privacy note */}
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-card/50 p-4 text-sm text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-success" />
        <p>
          {isServer
            ? "Your file is transferred over an encrypted connection, processed in an isolated worker, and automatically deleted (within 1 hour for guests, 24 hours for registered users)."
            : "This tool runs entirely in your browser. Your data never leaves your device — nothing is uploaded to our servers."}
        </p>
      </div>

      {/* About / unique intro — original indexable prose */}
      <section className="mt-14 max-w-3xl">
        <h2 className="mb-4 text-xl font-bold tracking-tight">
          {tool.name}: free online {cat.name.toLowerCase()} tool
        </h2>
        <p className="text-muted-foreground leading-relaxed">{intro}</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* How it works */}
      <section className="mt-14 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-bold tracking-tight">How to {tool.name.toLowerCase()}</h2>
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

        {/* FAQ */}
        <div>
          <h2 className="mb-4 text-xl font-bold tracking-tight">Frequently asked questions</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-lg border border-border bg-card p-4"
              >
                <summary className="cursor-pointer list-none font-medium marker:hidden">
                  <span className="flex items-center justify-between gap-2">
                    {faq.question}
                    <span className="text-muted-foreground transition-transform group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 text-xl font-bold tracking-tight">Related {cat.name.toLowerCase()}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((current) => (
              <ToolCard key={current.slug} tool={current} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function ServerToolNotice({ toolName, isAi }: { toolName: string; isAi: boolean }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
        {isAi ? <Sparkles className="size-6" /> : <Server className="size-6" />}
      </span>
      <h2 className="mt-4 text-lg font-semibold">{toolName} is almost ready</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        This tool runs on our secure processing backend with a job queue, virus scanning and
        auto-deletion. The interface is live — server processing is being connected now.
      </p>
    </div>
  );
}
