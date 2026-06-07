import Link from "next/link";
import type { ToolCategory } from "@/lib/tools/types";
import { getToolsByCategory } from "@/lib/tools/registry";
import { cn } from "@/lib/utils";

const accentClass: Record<string, string> = {
  "cat-pdf": "text-cat-pdf bg-cat-pdf/10",
  "cat-image": "text-cat-image bg-cat-image/10",
  "cat-csv": "text-cat-csv bg-cat-csv/10",
  "cat-text": "text-cat-text bg-cat-text/10",
  "cat-dev": "text-cat-dev bg-cat-dev/10",
  "cat-ai": "text-cat-ai bg-cat-ai/10",
};

export function CategoryCard({ category }: { category: ToolCategory }) {
  const Icon = category.icon;
  const count = getToolsByCategory(category.id).length;

  return (
    <Link
      href={`/tools/${category.slug}`}
      className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className={cn("grid size-12 shrink-0 place-items-center rounded-xl", accentClass[category.accent])}>
        <Icon className="size-6" />
      </span>
      <div className="min-w-0">
        <h3 className="font-semibold">{category.name}</h3>
        <p className="truncate text-sm text-muted-foreground">{count} tools</p>
      </div>
    </Link>
  );
}
