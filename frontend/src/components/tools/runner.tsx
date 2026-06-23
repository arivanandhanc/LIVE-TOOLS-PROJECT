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
  "remove-line-breaks": dynamic(() => import("./impl/remove-line-breaks"), { loading: Loading }),
  "add-line-numbers": dynamic(() => import("./impl/add-line-numbers"), { loading: Loading }),
  "remove-empty-lines": dynamic(() => import("./impl/remove-empty-lines"), { loading: Loading }),
  "extract-emails": dynamic(() => import("./impl/extract-emails"), { loading: Loading }),
  "extract-urls": dynamic(() => import("./impl/extract-urls"), { loading: Loading }),
  "upside-down-text": dynamic(() => import("./impl/upside-down-text"), { loading: Loading }),
  "morse-code": dynamic(() => import("./impl/morse-code"), { loading: Loading }),
  "remove-extra-spaces": dynamic(() => import("./impl/remove-extra-spaces"), { loading: Loading }),
  "word-frequency-counter": dynamic(() => import("./impl/word-frequency-counter"), { loading: Loading }),
  "remove-punctuation": dynamic(() => import("./impl/remove-punctuation"), { loading: Loading }),
  "extract-numbers": dynamic(() => import("./impl/extract-numbers"), { loading: Loading }),
  "remove-html-tags": dynamic(() => import("./impl/remove-html-tags"), { loading: Loading }),
  "nato-phonetic": dynamic(() => import("./impl/nato-phonetic"), { loading: Loading }),
  "leetspeak": dynamic(() => import("./impl/leetspeak"), { loading: Loading }),
  "reverse-words": dynamic(() => import("./impl/reverse-words"), { loading: Loading }),
  "shuffle-lines": dynamic(() => import("./impl/shuffle-lines"), { loading: Loading }),
  "remove-accents": dynamic(() => import("./impl/remove-accents"), { loading: Loading }),
  "remove-line-numbers": dynamic(() => import("./impl/remove-line-numbers"), { loading: Loading }),
  "text-repeater": dynamic(() => import("./impl/text-repeater"), { loading: Loading }),
  "find-and-replace": dynamic(() => import("./impl/find-and-replace"), { loading: Loading }),

  // Developer
  "json-formatter": dynamic(() => import("./impl/json-formatter"), { loading: Loading }),
  "json-minifier": dynamic(() => import("./impl/json-minifier"), { loading: Loading }),
  "html-entity-encoder": dynamic(() => import("./impl/html-entity-encoder"), { loading: Loading }),
  "html-entity-decoder": dynamic(() => import("./impl/html-entity-decoder"), { loading: Loading }),
  "string-escape": dynamic(() => import("./impl/string-escape"), { loading: Loading }),
  "text-to-hex": dynamic(() => import("./impl/text-to-hex"), { loading: Loading }),
  "query-string-parser": dynamic(() => import("./impl/query-string-parser"), { loading: Loading }),
  "json-to-query-string": dynamic(() => import("./impl/json-to-query-string"), { loading: Loading }),
  "xml-minifier": dynamic(() => import("./impl/xml-minifier"), { loading: Loading }),
  "unicode-escape": dynamic(() => import("./impl/unicode-escape"), { loading: Loading }),
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
  // PDF (client-side via pdf-lib / pdf.js)
  "add-header-footer": dynamic(() => import("./impl/add-header-footer"), { loading: Loading }),
  "repair-pdf": dynamic(() => import("./impl/repair-pdf"), { loading: Loading }),
  "sign-pdf": dynamic(() => import("./impl/sign-pdf"), { loading: Loading }),
  "excel-to-pdf": dynamic(() => import("./impl/excel-to-pdf"), { loading: Loading }),
  "pdf-to-jpg": dynamic(() => import("./impl/pdf-to-jpg"), { loading: Loading, ssr: false }),
  "pdf-to-word": dynamic(() => import("./impl/pdf-to-word"), { loading: Loading, ssr: false }),
  "organize-pages": dynamic(() => import("./impl/organize-pages"), { loading: Loading, ssr: false }),
  "ocr-pdf": dynamic(() => import("./impl/ocr-pdf"), { loading: Loading, ssr: false }),

  // Image
  "jpg-to-png": dynamic(() => import("./impl/jpg-to-png"), { loading: Loading }),
  "png-to-jpg": dynamic(() => import("./impl/png-to-jpg"), { loading: Loading }),
  "webp-converter": dynamic(() => import("./impl/webp-converter"), { loading: Loading }),
  "resize-image": dynamic(() => import("./impl/resize-image"), { loading: Loading }),
  "compress-image": dynamic(() => import("./impl/compress-image"), { loading: Loading }),
  "rotate-image": dynamic(() => import("./impl/rotate-image"), { loading: Loading }),

  // PDF moved fully in-browser (no Render round-trip, no cold start)
  "merge-pdf": dynamic(() => import("./impl/merge-pdf"), { loading: Loading }),
  "split-pdf": dynamic(() => import("./impl/split-pdf"), { loading: Loading }),
  "compress-pdf": dynamic(() => import("./impl/compress-pdf"), { loading: Loading }),
  "jpg-to-pdf": dynamic(() => import("./impl/jpg-to-pdf"), { loading: Loading }),
  "rotate-pdf": dynamic(() => import("./impl/rotate-pdf"), { loading: Loading }),
  "watermark-pdf": dynamic(() => import("./impl/watermark-pdf"), { loading: Loading }),
  "extract-pages": dynamic(() => import("./impl/extract-pages"), { loading: Loading }),
  "remove-pages": dynamic(() => import("./impl/remove-pages"), { loading: Loading }),
  "add-page-numbers": dynamic(() => import("./impl/add-page-numbers"), { loading: Loading }),

  // CSV / data
  "xml-to-csv": dynamic(() => import("./impl/xml-to-csv"), { loading: Loading }),
  "column-splitter": dynamic(() => import("./impl/column-splitter"), { loading: Loading }),
  "column-merger": dynamic(() => import("./impl/column-merger"), { loading: Loading }),
  "csv-to-markdown": dynamic(() => import("./impl/csv-to-markdown"), { loading: Loading }),
  "csv-to-html": dynamic(() => import("./impl/csv-to-html"), { loading: Loading }),
  "tsv-to-json": dynamic(() => import("./impl/tsv-to-json"), { loading: Loading }),

  // Image
  "crop-image": dynamic(() => import("./impl/crop-image"), { loading: Loading }),
  "image-watermark": dynamic(() => import("./impl/image-watermark"), { loading: Loading }),
  "svg-converter": dynamic(() => import("./impl/svg-converter"), { loading: Loading }),

  // Text
  "lorem-ipsum": dynamic(() => import("./impl/lorem-ipsum"), { loading: Loading }),
  "text-diff": dynamic(() => import("./impl/text-diff"), { loading: Loading }),

  // Developer
  "xml-formatter": dynamic(() => import("./impl/xml-formatter"), { loading: Loading }),
  "yaml-converter": dynamic(() => import("./impl/yaml-converter"), { loading: Loading }),
  "html-formatter": dynamic(() => import("./impl/html-formatter"), { loading: Loading }),
  "css-minifier": dynamic(() => import("./impl/css-minifier"), { loading: Loading }),
  "js-minifier": dynamic(() => import("./impl/js-minifier"), { loading: Loading }),
  "sql-formatter": dynamic(() => import("./impl/sql-formatter"), { loading: Loading }),
  "regex-tester": dynamic(() => import("./impl/regex-tester"), { loading: Loading }),
  "color-converter": dynamic(() => import("./impl/color-converter"), { loading: Loading }),
  "gradient-generator": dynamic(() => import("./impl/gradient-generator"), { loading: Loading }),
  "timestamp-converter": dynamic(() => import("./impl/timestamp-converter"), { loading: Loading }),
  "number-base-converter": dynamic(() => import("./impl/number-base-converter"), { loading: Loading }),
  "json-to-xml": dynamic(() => import("./impl/json-to-xml"), { loading: Loading }),
  "xml-to-json": dynamic(() => import("./impl/xml-to-json"), { loading: Loading }),
  "markdown-to-html": dynamic(() => import("./impl/markdown-to-html"), { loading: Loading }),
  "user-agent-parser": dynamic(() => import("./impl/user-agent-parser"), { loading: Loading }),
  "robots-generator": dynamic(() => import("./impl/robots-generator"), { loading: Loading }),
  "meta-tag-generator": dynamic(() => import("./impl/meta-tag-generator"), { loading: Loading }),

  // Converters & Calculators
  "percentage-calculator": dynamic(() => import("./impl/percentage-calculator"), { loading: Loading }),
  "bmi-calculator": dynamic(() => import("./impl/bmi-calculator"), { loading: Loading }),
  "age-calculator": dynamic(() => import("./impl/age-calculator"), { loading: Loading }),
  "tip-calculator": dynamic(() => import("./impl/tip-calculator"), { loading: Loading }),
  "discount-calculator": dynamic(() => import("./impl/discount-calculator"), { loading: Loading }),
  "roman-numeral-converter": dynamic(() => import("./impl/roman-numeral-converter"), { loading: Loading }),
  "number-to-words": dynamic(() => import("./impl/number-to-words"), { loading: Loading }),
  "data-size-converter": dynamic(() => import("./impl/data-size-converter"), { loading: Loading }),
  "length-converter": dynamic(() => import("./impl/length-converter"), { loading: Loading }),
  "weight-converter": dynamic(() => import("./impl/weight-converter"), { loading: Loading }),
  "temperature-converter": dynamic(() => import("./impl/temperature-converter"), { loading: Loading }),
  "area-converter": dynamic(() => import("./impl/area-converter"), { loading: Loading }),
  "volume-converter": dynamic(() => import("./impl/volume-converter"), { loading: Loading }),
  "speed-converter": dynamic(() => import("./impl/speed-converter"), { loading: Loading }),
  "time-converter": dynamic(() => import("./impl/time-converter"), { loading: Loading }),
  "pressure-converter": dynamic(() => import("./impl/pressure-converter"), { loading: Loading }),
  "energy-converter": dynamic(() => import("./impl/energy-converter"), { loading: Loading }),
  "angle-converter": dynamic(() => import("./impl/angle-converter"), { loading: Loading }),
  "compound-interest-calculator": dynamic(() => import("./impl/compound-interest-calculator"), { loading: Loading }),
  "loan-emi-calculator": dynamic(() => import("./impl/loan-emi-calculator"), { loading: Loading }),
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
