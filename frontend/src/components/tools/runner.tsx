"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type { ComponentType } from "react";
import { recordToolUsage } from "@/lib/api";

const Loading = () => (
  <div className="flex min-h-64 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground">
    <Loader2 className="size-6 animate-spin" />
  </div>
);

/**
 * Maps a tool slug to its lazily-loaded client implementation.
 * Each entry is code-split so a tool page only ships that tool's JS.
 */
const registry: Record<string, ComponentType> = {
  // Text
  "word-counter": dynamic(() => import("./impl/word-counter"), { loading: Loading }),
  "character-counter": dynamic(() => import("./impl/character-counter"), { loading: Loading }),
  "case-converter": dynamic(() => import("./impl/case-converter"), { loading: Loading }),
  "text-cleaner": dynamic(() => import("./impl/text-cleaner"), { loading: Loading }),
  "remove-duplicates": dynamic(() => import("./impl/remove-duplicates"), { loading: Loading }),
  "reverse-text": dynamic(() => import("./impl/reverse-text"), { loading: Loading }),
  "slugify": dynamic(() => import("./impl/slugify"), { loading: Loading }),
  "sort-lines": dynamic(() => import("./impl/sort-lines"), { loading: Loading }),

  // Developer
  "json-formatter": dynamic(() => import("./impl/json-formatter"), { loading: Loading }),
  "cron-parser": dynamic(() => import("./impl/cron-parser"), { loading: Loading }),
  "html-to-markdown": dynamic(() => import("./impl/html-to-markdown"), { loading: Loading }),
  "htaccess-generator": dynamic(() => import("./impl/htaccess-generator"), { loading: Loading }),
  "qr-scanner": dynamic(() => import("./impl/qr-scanner"), { loading: Loading }),
  "base64-encoder": dynamic(() => import("./impl/base64-encoder"), { loading: Loading }),
  "base64-decoder": dynamic(() => import("./impl/base64-decoder"), { loading: Loading }),
  "jwt-decoder": dynamic(() => import("./impl/jwt-decoder"), { loading: Loading }),
  "url-encoder": dynamic(() => import("./impl/url-encoder"), { loading: Loading }),
  "url-decoder": dynamic(() => import("./impl/url-decoder"), { loading: Loading }),
  "rot13": dynamic(() => import("./impl/rot13"), { loading: Loading }),
  "text-to-binary": dynamic(() => import("./impl/text-to-binary"), { loading: Loading }),
  "uuid-generator": dynamic(() => import("./impl/uuid-generator"), { loading: Loading }),
  "password-generator": dynamic(() => import("./impl/password-generator"), { loading: Loading }),
  "hash-generator": dynamic(() => import("./impl/hash-generator"), { loading: Loading }),
  "qr-generator": dynamic(() => import("./impl/qr-generator"), { loading: Loading }),

  // CSV
  "csv-to-json": dynamic(() => import("./impl/csv-to-json"), { loading: Loading }),
  "json-to-csv": dynamic(() => import("./impl/json-to-csv"), { loading: Loading }),
  "csv-to-tsv": dynamic(() => import("./impl/csv-to-tsv"), { loading: Loading }),
  "tsv-to-csv": dynamic(() => import("./impl/tsv-to-csv"), { loading: Loading }),
  "csv-cleaner": dynamic(() => import("./impl/csv-cleaner"), { loading: Loading }),
  "duplicate-remover": dynamic(() => import("./impl/duplicate-remover"), { loading: Loading }),
  "data-formatter": dynamic(() => import("./impl/data-formatter"), { loading: Loading }),
  "csv-to-excel": dynamic(() => import("./impl/csv-to-excel"), { loading: Loading }),
  "excel-to-csv": dynamic(() => import("./impl/excel-to-csv"), { loading: Loading }),

  // Image
  "jpg-to-png": dynamic(() => import("./impl/jpg-to-png"), { loading: Loading }),
  "png-to-jpg": dynamic(() => import("./impl/png-to-jpg"), { loading: Loading }),
  "webp-converter": dynamic(() => import("./impl/webp-converter"), { loading: Loading }),
  "resize-image": dynamic(() => import("./impl/resize-image"), { loading: Loading }),
  "compress-image": dynamic(() => import("./impl/compress-image"), { loading: Loading }),
  "rotate-image": dynamic(() => import("./impl/rotate-image"), { loading: Loading }),
};

export function ToolRunner({ slug }: { slug: string }) {
  const Component = registry[slug];

  // Record that this tool was used so it appears in the dashboard history.
  // Guarded so React StrictMode's double-mount in dev only fires once.
  const recorded = React.useRef(false);
  React.useEffect(() => {
    if (!Component || recorded.current) return;
    recorded.current = true;
    recordToolUsage(slug);
  }, [slug, Component]);

  if (!Component) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
        <p className="font-medium">We&apos;re putting the finishing touches on this tool.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          It&apos;s coming very soon — check back shortly.
        </p>
      </div>
    );
  }
  return <Component />;
}
