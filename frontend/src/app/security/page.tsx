import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, Trash2, EyeOff, ServerOff, FileCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Security & Privacy — Your files never leave your browser",
  description:
    "How Arivu's Scrab Tools keeps your files private: most tools run 100% in your browser with zero upload, encrypted transfers for server tools, and automatic deletion. GDPR & CCPA aligned.",
  alternates: { canonical: "/security" },
};

const pillars = [
  {
    icon: ServerOff,
    title: "No upload for most tools",
    body: "The majority of our tools — PDF merge/split/compress, image and text utilities — run entirely on your device using your browser. Your file is never sent to any server, so it is mathematically impossible for us (or anyone) to see it.",
  },
  {
    icon: Lock,
    title: "Encrypted transfers",
    body: "For the few tools that need server processing, files travel over TLS (HTTPS) and are handled in an isolated worker, never exposed publicly.",
  },
  {
    icon: Trash2,
    title: "Automatic deletion",
    body: "Server-processed files are deleted automatically — within 1 hour for guests and 24 hours for signed-in users. We keep nothing longer than needed.",
  },
  {
    icon: EyeOff,
    title: "No tracking of your content",
    body: "We never read, sell, or share the contents of your files. We do not use your documents to train AI models.",
  },
  {
    icon: FileCheck2,
    title: "No account required",
    body: "Every tool works as a guest. You only create an account if you want history and favorites saved — your choice, never forced.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance & hardening",
    body: "GDPR and CCPA aligned, served with a strict Content-Security-Policy, HSTS, and OWASP-aligned headers across the whole site.",
  },
];

export default function SecurityPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Security & Privacy",
    url: `${siteConfig.url}/security`,
    description:
      "How Arivu's Scrab Tools protects your files: in-browser processing with no upload, encrypted transfers, and automatic deletion.",
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
  };

  return (
    <div className="container-page max-w-4xl py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm font-medium">
          <ShieldCheck className="size-4 text-success" /> Privacy-first by design
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Your files never leave your browser
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Most file tools online upload your document to their servers to process it. We took a
          different approach: wherever it is technically possible, your file is processed right on
          your own device and is never uploaded anywhere. Here is exactly how we protect you.
        </p>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {pillars.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <span className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-5" />
            </span>
            <h2 className="mt-4 font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>

      <section className="mt-12 rounded-xl border border-border bg-card/50 p-8">
        <h2 className="text-xl font-bold tracking-tight">How to verify it yourself</h2>
        <p className="mt-3 text-muted-foreground">
          You do not have to take our word for it. Open any client-side tool (for example Merge PDF),
          then open your browser&apos;s developer tools and watch the Network tab while you use it —
          you will see that no file is ever sent to a server. That is the strongest privacy guarantee
          there is: data that never leaves your device cannot be leaked.
        </p>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/tools">Explore tools</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/legal/privacy">Privacy Policy</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/legal/gdpr">GDPR</Link>
        </Button>
      </div>
    </div>
  );
}
