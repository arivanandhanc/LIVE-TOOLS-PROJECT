"use client";

import * as React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getGeo } from "@/lib/api";

type Currency = "INR" | "USD";

const PRICE: Record<Currency, { symbol: string; pro: string }> = {
  INR: { symbol: "₹", pro: "10" },
  USD: { symbol: "$", pro: "10" },
};

/** Synchronous best-guess so there's no price flash before the API responds. */
function guessCurrency(): Currency {
  if (typeof Intl !== "undefined") {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (tz === "Asia/Kolkata" || tz === "Asia/Calcutta") return "INR";
    } catch {
      /* ignore */
    }
  }
  return "USD";
}

export function PricingPlans() {
  const [currency, setCurrency] = React.useState<Currency>("USD");

  React.useEffect(() => {
    setCurrency(guessCurrency());
    // Confirm with server-side geo (CDN country header), which is authoritative.
    getGeo()
      .then((g) => setCurrency(g.currency))
      .catch(() => undefined);
  }, []);

  const p = PRICE[currency];

  const tiers = [
    {
      name: "Basic",
      price: `${p.symbol}0`,
      period: "forever",
      description: "Everything you need for everyday file tasks — free, forever.",
      features: [
        "100+ browser tools",
        "No watermarks, no limits on free tools",
        "Files auto-deleted for privacy",
        "No sign-up required",
        "Optional account: history & favorites",
      ],
      cta: "Get started",
      href: "/tools",
      current: true,
      highlight: false,
    },
    {
      name: "Pro",
      price: `${p.symbol}${p.pro}`,
      period: "/month",
      description: "Unlock AI tools and high-resource server processing.",
      features: [
        "Everything in Basic",
        "AI tools: summary, OCR, content & image analysis",
        "High-resource server conversions (larger files)",
        "Priority processing queue",
        "30-day file history & saved files",
        "Batch operations",
      ],
      cta: "Upgrade to Pro",
      href: "/signup?plan=pro",
      current: false,
      highlight: true,
    },
  ];

  return (
    <>
      <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={cn(
              "flex flex-col rounded-2xl border bg-card p-6 shadow-sm",
              tier.highlight ? "border-primary ring-1 ring-primary" : "border-border"
            )}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{tier.name}</h2>
              {tier.current && <Badge>Current</Badge>}
              {tier.highlight && <Badge>Most popular</Badge>}
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold">{tier.price}</span>
              {tier.period && <span className="text-sm text-muted-foreground">{tier.period}</span>}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>
            <ul className="mt-6 flex-1 space-y-2.5">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" /> {f}
                </li>
              ))}
            </ul>
            <Button
              asChild
              variant={tier.highlight ? "default" : "outline"}
              className="mt-6 w-full"
            >
              <Link href={tier.href}>{tier.cta}</Link>
            </Button>
          </div>
        ))}
      </div>
      <p className="mt-10 text-center text-sm text-muted-foreground">
        Prices shown in {currency === "INR" ? "Indian Rupees (₹)" : "US Dollars ($)"} based on your
        region. Secure checkout is being connected — Pro features unlock as soon as billing goes live.
      </p>
    </>
  );
}
