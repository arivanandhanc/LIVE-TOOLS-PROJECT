import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Founder — Arivanandhan Chitheshwaran",
  description:
    "Arivanandhan Chitheshwaran is the founder and engineer behind Arivu's Scrab Tools, a privacy-first suite of 95+ free online file and document tools.",
  alternates: { canonical: "/about/founder" },
};

const SAME_AS = [
  "https://arivanandhan.in",
  "https://www.linkedin.com/in/arivanandhan",
  "https://github.com/arivanandhanc",
];

export default function FounderPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Arivanandhan Chitheshwaran",
    url: `${siteConfig.url}/about/founder`,
    jobTitle: "Founder & Software Engineer",
    worksFor: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    knowsAbout: [
      "PDF processing",
      "File conversion",
      "Web application development",
      "Privacy-first software",
      "Productivity tools",
    ],
    sameAs: SAME_AS,
  };

  return (
    <div className="container-page max-w-3xl py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Arivanandhan Chitheshwaran
      </h1>
      <p className="mt-2 text-lg text-muted-foreground">
        Founder &amp; Engineer — Arivu&apos;s Scrab Tools
      </p>

      <div className="mt-6 space-y-4 text-muted-foreground">
        <p>
          I&apos;m Arivanandhan, an independent software engineer and the founder of{" "}
          <strong>Arivu&apos;s Scrab Tools</strong>. I design and build every tool on this
          platform — a growing suite of {`95+`} free utilities for PDF, image, CSV, text and
          developer work.
        </p>
        <p>
          I started this project because the file tools most people reach for online quietly upload
          your documents to a server. I believe that&apos;s the wrong default. So I engineered the
          majority of these tools to run entirely in your browser — your files never leave your
          device, which makes them both faster and genuinely private.
        </p>
        <p>
          My background is in building practical, reliable software: automation, dashboards,
          AI-powered applications and developer tooling. Everything here reflects that focus —
          fast, accessible, no dark patterns, no forced sign-ups, no watermarks.
        </p>
        <p>
          You can see more of my work and get in touch through the links below.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <a href="https://arivanandhan.in" target="_blank" rel="noopener noreferrer">
            Portfolio — arivanandhan.in
          </a>
        </Button>
        <Button asChild variant="outline">
          <Link href="/about">About the platform</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/security">Our security approach</Link>
        </Button>
      </div>
    </div>
  );
}
