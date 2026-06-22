"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type { SeoToolParams } from "@/lib/seo-pages/types";

const Loading = () => (
  <div className="flex min-h-64 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground">
    <Loader2 className="size-6 animate-spin" />
  </div>
);

// All three tools are browser-only (pdf.js / canvas) and must not be SSR'd.
const CompressPdfTarget = dynamic(() => import("./impl/compress-pdf-target"), {
  loading: Loading,
  ssr: false,
});
const ImageCompressTarget = dynamic(() => import("./impl/image-compress-target"), {
  loading: Loading,
  ssr: false,
});
const ImageResizeFixed = dynamic(() => import("./impl/image-resize-fixed"), {
  loading: Loading,
  ssr: false,
});

/**
 * Mounts the right client tool for a programmatic SEO landing page. No usage
 * ping / backend call — these pages stay fully static + client-only.
 */
export function SeoToolRunner({ tool }: { tool: SeoToolParams }) {
  switch (tool.kind) {
    case "compress-pdf":
      return (
        <CompressPdfTarget targetBytes={tool.targetBytes} targetDisplay={tool.targetDisplay} />
      );
    case "compress-image":
      return (
        <ImageCompressTarget
          format={tool.format}
          targetBytes={tool.targetBytes}
          targetDisplay={tool.targetDisplay}
        />
      );
    case "resize-image":
      return <ImageResizeFixed width={tool.width} height={tool.height} />;
  }
}
