import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Blog",
  description: "Guides, tips and updates from the ConvertFlow team.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <div className="container-page max-w-3xl py-16 text-center">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">The ConvertFlow blog</h1>
      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
        We&apos;re preparing in-depth guides on PDF workflows, data conversion and productivity.
        Check back soon.
      </p>
      <Button asChild className="mt-8"><Link href="/tools">Explore tools meanwhile</Link></Button>
    </div>
  );
}
