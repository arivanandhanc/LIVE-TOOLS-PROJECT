import type { Metadata } from "next";
import { TOOL_COUNT } from "@/lib/tools/registry";
import { ToolsExplorer } from "@/components/tools-explorer";

export const metadata: Metadata = {
  title: "All Tools",
  description: `Browse all ${TOOL_COUNT}+ Arivu's Scrab Tools tools: PDF, image, CSV, text, developer and AI utilities. Fast, secure and free.`,
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return (
    <div className="container-page py-10">
      <header className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">All tools</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {TOOL_COUNT}+ tools to convert, compress, edit and transform your files. Search or
          filter by category — everything works right in your browser.
        </p>
      </header>
      <ToolsExplorer />
    </div>
  );
}
