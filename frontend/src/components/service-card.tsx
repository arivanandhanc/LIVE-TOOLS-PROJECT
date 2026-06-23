import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/lib/resources/types";

const pricingLabel: Record<string, string> = {
  free: "Free",
  freemium: "Freemium",
  paid: "Paid",
};

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/resources/${service.category}/${service.slug}`}
      className="group relative flex flex-col gap-2 rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold leading-tight">{service.name}</h3>
        {service.pricing && (
          <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
            {pricingLabel[service.pricing]}
          </span>
        )}
      </div>
      <p className="line-clamp-2 text-sm text-muted-foreground">{service.description}</p>
      <span className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
        View details <ArrowUpRight className="size-3.5" />
      </span>
    </Link>
  );
}
