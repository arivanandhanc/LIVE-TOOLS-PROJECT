import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description: "ConvertFlow is free to use. Pro, Business and Enterprise plans are coming soon.",
  alternates: { canonical: "/pricing" },
};

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need for everyday file tasks.",
    features: ["100+ tools", "No watermarks", "Files auto-deleted", "No sign-up required", "Optional account for history"],
    cta: "Get started",
    href: "/tools",
    current: true,
  },
  {
    name: "Pro",
    price: "$6",
    period: "/month",
    description: "For power users who convert daily.",
    features: ["Everything in Free", "Larger file limits", "Priority processing", "Batch operations", "30-day file history"],
    cta: "Coming soon",
    href: "#",
    current: false,
  },
  {
    name: "Business",
    price: "$18",
    period: "/month",
    description: "For teams and growing businesses.",
    features: ["Everything in Pro", "Team workspaces", "API access", "Audit logs", "SSO (SAML)"],
    cta: "Coming soon",
    href: "#",
    current: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations with advanced needs.",
    features: ["Everything in Business", "On-prem / private cloud", "Custom retention & DPA", "SLA & dedicated support", "SOC2 / ISO docs"],
    cta: "Contact us",
    href: "/contact",
    current: false,
  },
];

export default function PricingPage() {
  return (
    <div className="container-page py-14">
      <header className="mx-auto mb-12 max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">Simple, honest pricing</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          ConvertFlow is <span className="font-semibold text-foreground">free</span> today. Paid plans are
          on the way — no surprises, no dark patterns.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-4">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={cn(
              "flex flex-col rounded-2xl border bg-card p-6 shadow-sm",
              tier.current ? "border-primary ring-1 ring-primary" : "border-border"
            )}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{tier.name}</h2>
              {tier.current && <Badge>Current</Badge>}
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
              asChild={tier.href !== "#"}
              disabled={tier.href === "#"}
              variant={tier.current ? "default" : "outline"}
              className="mt-6 w-full"
            >
              {tier.href === "#" ? <span>{tier.cta}</span> : <Link href={tier.href}>{tier.cta}</Link>}
            </Button>
          </div>
        ))}
      </div>
      <p className="mt-10 text-center text-sm text-muted-foreground">
        Payments are not yet enabled. The platform is Stripe-ready and will switch on billing when paid
        plans launch.
      </p>
    </div>
  );
}
