import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { categories, getCategory, getToolsByCategory } from "@/lib/tools/registry";
import { ToolCard } from "@/components/tool-card";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata(
  props: PageProps<"/tools/[category]">
): Promise<Metadata> {
  const { category } = await props.params;
  const cat = getCategory(category);
  if (!cat) return {};
  return {
    title: cat.name,
    description: cat.description,
    alternates: { canonical: `/tools/${cat.slug}` },
  };
}

export default async function CategoryPage(props: PageProps<"/tools/[category]">) {
  const { category } = await props.params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const categoryTools = getToolsByCategory(cat.id);
  const Icon = cat.icon;

  return (
    <div className="container-page py-10">
      <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <ChevronRight className="size-4" />
        <span className="text-foreground">{cat.name}</span>
      </nav>

      <header className="mb-8 flex items-start gap-4">
        <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-7" />
        </span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{cat.name}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">{cat.description}</p>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categoryTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
