import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2 font-bold tracking-tight", className)}
      aria-label={`${siteConfig.name} home`}
    >
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        {/* Stylized flow mark */}
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
          <path
            d="M4 7c4-3 12 3 16 0M4 12c4-3 12 3 16 0M4 17c4-3 12 3 16 0"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="text-lg whitespace-nowrap">
        Arivu&apos;s <span className="text-primary">Scrab Tools</span>
      </span>
    </Link>
  );
}
