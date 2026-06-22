"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { recordToolUsage } from "@/lib/api";

const Loading = () => (
  <div className="flex min-h-64 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground">
    <Loader2 className="size-6 animate-spin" />
  </div>
);

// pdf.js is browser-only, so this must not be server-rendered.
const CompressPdfTarget = dynamic(
  () => import("./impl/compress-pdf-target"),
  { loading: Loading, ssr: false }
);

export function CompressTargetRunner({
  targetBytes,
  targetDisplay,
  slug,
}: {
  targetBytes: number;
  targetDisplay: string;
  slug: string;
}) {
  const recorded = React.useRef(false);
  React.useEffect(() => {
    if (recorded.current) return;
    recorded.current = true;
    recordToolUsage(slug);
  }, [slug]);

  return <CompressPdfTarget targetBytes={targetBytes} targetDisplay={targetDisplay} />;
}
