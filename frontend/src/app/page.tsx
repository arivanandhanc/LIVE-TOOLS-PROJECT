import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, ShieldCheck, Zap, Lock, Trash2, Cpu, Globe2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/category-card";
import { ToolCard } from "@/components/tool-card";
import {
  categories, getFeaturedTools, TOOL_COUNT, LIVE_TOOL_COUNT,
} from "@/lib/tools/registry";
import { siteConfig } from "@/lib/site";

const trust = [
  { icon: Zap, title: "Blazing fast", body: "Most tools run instantly in your browser — no upload, no waiting." },
  { icon: Lock, title: "Private by design", body: "Client-side tools never send your files anywhere. What stays local, stays local." },
  { icon: Trash2, title: "Auto-deletion", body: "Server-processed files are encrypted and auto-deleted within hours." },
  { icon: ShieldCheck, title: "Enterprise security", body: "GDPR & CCPA aligned, OWASP-hardened, with full audit logging." },
  { icon: Cpu, title: "No sign-up needed", body: "Use every tool as a guest. Sign in only to save your history." },
  { icon: Globe2, title: "Works everywhere", body: "Responsive, accessible and installable as a PWA on any device." },
];

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const featured = getFeaturedTools();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 bg-grid opacity-40" aria-hidden />
        <div
          className="absolute -top-40 left-1/2 -z-10 size-[600px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
          aria-hidden
        />
        <div className="container-page flex flex-col items-center py-20 text-center sm:py-28">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium shadow-sm">
            <span className="size-2 rounded-full bg-success" />
            {TOOL_COUNT}+ tools · {LIVE_TOOL_COUNT} live and free
          </span>
          <h1 className="max-w-4xl text-balance text-4xl font-extrabold tracking-tight sm:text-6xl">
            Every file tool you need,{" "}
            <span className="text-gradient-brand">in one fast workspace</span>
          </h1>
          <p className="mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
            {siteConfig.description}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/tools">
                Explore all tools <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/tools/pdf">PDF tools</Link>
            </Button>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            No account required · No watermarks · No file size traps
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Browse by category</h2>
            <p className="mt-1 text-muted-foreground">Pick a category to see every tool inside.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Trust / security */}
      <section className="container-page py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Built for speed, security and privacy
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            ConvertFlow is engineered to feel faster and safer than the tools you know.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trust.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <span className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-20">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/15 via-card to-card p-10 text-center shadow-sm sm:p-16">
          <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">
            Start converting in seconds
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Jump straight into any tool — no installs, no sign-up. Create an account only when
            you want your history and favorites saved.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/tools">
                Get started free <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/signup">Create account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured tools — moved to the bottom, on its own separated section */}
      <section className="border-t border-border bg-card/40">
        <div className="container-page py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Popular tools</h2>
              <p className="mt-1 text-muted-foreground">The tools people reach for most.</p>
            </div>
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href="/tools">
                View all <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
