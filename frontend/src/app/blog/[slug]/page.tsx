import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ArrowRight, Clock } from "lucide-react";
import { posts, getPost } from "@/lib/blog";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `${siteConfig.url}/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    dateModified: post.updated,
    author: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
  };

  return (
    <article className="container-page max-w-3xl py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/blog" className="hover:text-foreground">Blog</Link>
        <ChevronRight className="size-4" />
        <span className="text-foreground">{post.category}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{post.description}</p>
        <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="size-3.5" /> {post.readingMinutes} min read · Updated{" "}
          {new Date(post.updated).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </header>

      {post.toolHref && (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
          <p className="text-sm">
            Try it now: <span className="font-semibold">{post.toolLabel}</span>
          </p>
          <Button asChild size="sm">
            <Link href={post.toolHref}>
              Open tool <ArrowRight />
            </Link>
          </Button>
        </div>
      )}

      <div className="space-y-8">
        {post.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="mb-3 text-xl font-bold tracking-tight">{section.heading}</h2>
            <div className="space-y-3">
              {section.body.map((p, i) => (
                <p key={i} className="text-muted-foreground">{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 border-t border-border pt-8">
        <h2 className="mb-4 text-lg font-semibold">Keep reading</h2>
        <ul className="space-y-2">
          {posts.filter((p) => p.slug !== post.slug).slice(0, 3).map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="text-primary hover:underline">
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
