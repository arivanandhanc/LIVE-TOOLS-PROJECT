"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { categories, tools, liveFirst } from "@/lib/tools/registry";
import { ToolCard } from "@/components/tool-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ToolsExplorer() {
  const [query, setQuery] = React.useState("");
  const [activeCat, setActiveCat] = React.useState<string>("all");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return liveFirst(
      tools.filter((tool) => {
        const matchesCat = activeCat === "all" || tool.category === activeCat;
        if (!matchesCat) return false;
        if (!q) return true;
        const haystack = [tool.name, tool.description, ...tool.keywords].join(" ").toLowerCase();
        return haystack.includes(q);
      })
    );
  }, [query, activeCat]);

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-1 bg-background/80 px-1 py-4 backdrop-blur">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 100+ tools…"
            className="h-12 pl-10 pr-10 text-base"
            aria-label="Search tools"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 size-9 -translate-y-1/2"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <X />
            </Button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <CatChip active={activeCat === "all"} onClick={() => setActiveCat("all")}>
            All
          </CatChip>
          {categories.map((c) => (
            <CatChip key={c.id} active={activeCat === c.id} onClick={() => setActiveCat(c.id)}>
              {c.name}
            </CatChip>
          ))}
        </div>
      </div>

      <p className="mb-4 mt-2 text-sm text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "tool" : "tools"}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
          No tools match “{query}”.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}

function CatChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}
