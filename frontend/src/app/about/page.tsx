import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TOOL_COUNT } from "@/lib/tools/registry";

export const metadata: Metadata = {
  title: "About",
  description: "ConvertFlow is a fast, private, free platform with 100+ file tools.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="container-page max-w-3xl py-14">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">About ConvertFlow</h1>
      <div className="mt-6 space-y-4 text-muted-foreground">
        <p>
          ConvertFlow brings {TOOL_COUNT}+ file tools together in one fast, beautiful workspace — PDF,
          image, CSV, text, developer and AI utilities. Our goal is simple: make file tasks effortless
          while respecting your privacy.
        </p>
        <p>
          Most of our tools run entirely in your browser, so your data never leaves your device. The
          rest are processed on secure, isolated infrastructure with automatic deletion. No watermarks,
          no file-size traps, and no account required.
        </p>
        <p>
          We&apos;re building ConvertFlow to feel faster, cleaner and more trustworthy than anything else
          out there.
        </p>
      </div>
      <div className="mt-8 flex gap-3">
        <Button asChild><Link href="/tools">Explore tools</Link></Button>
        <Button asChild variant="outline"><Link href="/contact">Contact us</Link></Button>
      </div>
    </div>
  );
}
