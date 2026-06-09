import type { Metadata } from "next";
import { PricingPlans } from "@/components/pricing-plans";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Arivu's Scrab Tools Basic is free forever. Upgrade to Pro for AI tools and high-resource processing — ₹10/month in India, $10/month elsewhere.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <div className="container-page py-14">
      <header className="mx-auto mb-12 max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">Simple, honest pricing</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The <span className="font-semibold text-foreground">Basic</span> plan is free forever.
          Upgrade to <span className="font-semibold text-foreground">Pro</span> only when you need AI
          tools and heavier server processing — no surprises, no dark patterns.
        </p>
      </header>

      <PricingPlans />
    </div>
  );
}
