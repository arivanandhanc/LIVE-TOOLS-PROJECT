import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { serviceCategories, getServiceCount, SERVICE_COUNT } from "@/lib/resources/services";

export const metadata: Metadata = {
  title: "Resources — Recommended Tools & Services",
  description: `A curated directory of ${SERVICE_COUNT}+ recommended tools and services across AI, design, development, marketing and more.`,
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  return (
    <div className="container-page py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Resources</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          A hand-picked directory of {SERVICE_COUNT}+ tools and services we recommend — the
          best apps for AI, design, development, marketing, productivity and more. Browse a
          category to find the right tool for the job.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {serviceCategories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/resources/${cat.slug}`}
            className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{cat.name}</h2>
              <span className="text-xs text-muted-foreground">{getServiceCount(cat.slug)}</span>
            </div>
            <p className="line-clamp-2 text-sm text-muted-foreground">{cat.description}</p>
            <span className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
              Browse <ArrowRight className="size-3.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
