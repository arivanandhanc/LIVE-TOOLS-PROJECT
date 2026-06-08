import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { posts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guides, tutorials, productivity tips, AI insights, and developer resources from Arivanandhan Tools.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <div className="container-page max-w-4xl py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Arivanandhan Tools Blog
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Tutorials, guides, productivity tips, developer resources, AI
          insights, and best practices to help you get more from our tools.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary"
          >
            <span className="text-xs font-medium uppercase tracking-wide text-primary">{post.category}</span>
            <h2 className="mt-2 font-semibold leading-snug group-hover:text-primary">{post.title}</h2>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{post.description}</p>
            <span className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="size-3.5" /> {post.readingMinutes} min read
              <ArrowRight className="ml-auto size-4 text-primary transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-12 rounded-lg border bg-card p-6 text-center">
        <h2 className="text-xl font-semibold">More guides coming soon</h2>
        <p className="mt-2 text-muted-foreground">
          New tutorials, tool guides, AI resources, and productivity content are added regularly.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/tools">Explore Tools</Link>
        </Button>

        <Button asChild variant="outline">
          <a
            href="https://arivanandhan.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            Arivanandhan.in
          </a>
        </Button>
      </div>
    </div>
  );
}