import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Tool } from "@/lib/tools/types";
import { getCategory } from "@/lib/tools/registry";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const accentClass: Record<string, string> = {
  "cat-pdf": "text-cat-pdf bg-cat-pdf/10",
  "cat-image": "text-cat-image bg-cat-image/10",
  "cat-csv": "text-cat-csv bg-cat-csv/10",
  "cat-text": "text-cat-text bg-cat-text/10",
  "cat-dev": "text-cat-dev bg-cat-dev/10",
  "cat-ai": "text-cat-ai bg-cat-ai/10",
};

export function ToolCard({ tool }: { tool: Tool }) {
  const category = getCategory(tool.category);
  const Icon = tool.icon;
  const accent = category ? accentClass[category.accent] : "text-primary bg-primary/10";

  return (
    <Link
      href={`/tools/${tool.category}/${tool.slug}`}
      className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between">
        <span className={cn("grid size-11 place-items-center rounded-lg", accent)}>
          <Icon className="size-5" />
        </span>
        {tool.status === "soon" && (
          <Badge variant="muted" className="text-[10px]">
            Soon
          </Badge>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold leading-tight">{tool.name}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{tool.description}</p>
      </div>
      <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
        Open tool <ArrowRight className="size-3.5" />
      </span>
    </Link>
  );
}
