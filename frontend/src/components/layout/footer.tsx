import Link from "next/link";
import { Logo } from "./logo";
import { categories } from "@/lib/tools/registry";
import { siteConfig } from "@/lib/site";

const footerLinks = {
  Product: [
    { title: "All Tools", href: "/tools" },
    { title: "Dashboard", href: "/dashboard" },
  ],
  // High-intent programmatic landing pages — sitewide links concentrate crawl
  // and internal PageRank on our best money-pages.
  Popular: [
    { title: "Compress PDF to 100KB", href: "/compress-pdf-to-100kb" },
    { title: "Compress PDF to 50KB", href: "/compress-pdf-to-50kb" },
    { title: "Compress JPG to 50KB", href: "/compress-jpg-to-50kb" },
    { title: "Compress JPG to 20KB", href: "/compress-jpg-to-20kb" },
    { title: "Resize Image to 1080×1080", href: "/resize-image-to-1080x1080" },
    { title: "Compress PDF to 200KB", href: "/compress-pdf-to-200kb" },
  ],
  Company: [
    { title: "About", href: "/about" },
    { title: "Blog", href: "/blog" },
    { title: "Contact", href: "/contact" },
    { title: "Support", href: "https://support.arivanandhan.in" },
  ],
  Legal: [
   
    { title: "Security", href: "/security" },
    { title: "Privacy Policy", href: "/legal/privacy" },
    { title: "Cookie Policy", href: "/legal/cookies" },
    { title: "Terms of Service", href: "/legal/terms" },
    { title: "GDPR", href: "/legal/gdpr" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="container-page py-14">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.5fr_repeat(5,1fr)]">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xs text-sm text-muted-foreground">{siteConfig.tagline}</p>
            <p className="text-xs text-muted-foreground">
              Files are processed securely and auto-deleted. Privacy-first by design.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Categories</h3>
            <ul className="space-y-2 text-sm">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/tools/${c.slug}`}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="mb-3 text-sm font-semibold">{heading}</h3>
              <ul className="space-y-2 text-sm">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>
            Built by{" "}
            <a
              href="https://arivanandhan.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground transition-colors hover:text-primary"
            >
              arivanandhan.in
            </a>{" "}
            — for speed, security and privacy.
          </p>
        </div>
      </div>
    </footer>
  );
}
