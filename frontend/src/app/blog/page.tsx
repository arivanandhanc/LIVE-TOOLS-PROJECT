import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guides, tutorials, productivity tips, AI insights, and developer resources from Arivanandhan Tools.",
  alternates: { canonical: "/blog" },
};

const blogSections = [
  {
    title: "PDF Tools",
    articles: [
      "How to merge PDF files online",
      "Compress PDFs without losing quality",
      "Convert PDF to Word easily",
      "Best PDF workflow tips for professionals",
    ],
  },
  {
    title: "Image Tools",
    articles: [
      "How to convert PNG to JPG",
      "Reduce image size without quality loss",
      "Best image formats explained",
      "Image optimization guide for websites",
    ],
  },
  {
    title: "Developer Utilities",
    articles: [
      "JSON formatting best practices",
      "Base64 encode and decode guide",
      "URL encoding explained",
      "Useful online tools for developers",
    ],
  },
  {
    title: "AI Tools",
    articles: [
      "Using AI to improve productivity",
      "AI tools every developer should know",
      "Benefits of browser-based AI tools",
      "Future of AI-powered utilities",
    ],
  },
  {
    title: "Productivity",
    articles: [
      "Save time with online tools",
      "Automating repetitive tasks",
      "Digital workflow optimization",
      "Productivity tips for remote workers",
    ],
  },
];
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

      <div className="mt-12 space-y-4">
        {blogSections.map((section) => (
          <details
            key={section.title}
            className="rounded-lg border bg-card p-5"
          >
            <summary className="cursor-pointer text-lg font-semibold">
              {section.title}
            </summary>

            <ul className="mt-4 space-y-2 text-muted-foreground">
              {section.articles.map((article) => (
                <li key={article}>• {article}</li>
              ))}
            </ul>
          </details>
        ))}
      </div>

      <div className="mt-12 rounded-lg border bg-card p-6 text-center">
        <h2 className="text-xl font-semibold">
          More Articles Coming Soon
        </h2>

        <p className="mt-2 text-muted-foreground">
          New tutorials, tool guides, AI resources, and productivity content
          are regularly added.
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