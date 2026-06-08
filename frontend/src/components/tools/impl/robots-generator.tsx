"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/ui/copy-button";
import { ToolPanel, Field } from "@/components/tools/panel";

export default function RobotsGenerator() {
  const [allowAll, setAllowAll] = React.useState(true);
  const [disallow, setDisallow] = React.useState("/admin\n/private");
  const [sitemap, setSitemap] = React.useState("https://example.com/sitemap.xml");

  const output = React.useMemo(() => {
    const lines = ["User-agent: *"];
    if (allowAll) {
      lines.push("Allow: /");
      disallow.split("\n").map((s) => s.trim()).filter(Boolean).forEach((p) => lines.push(`Disallow: ${p}`));
    } else {
      lines.push("Disallow: /");
    }
    if (sitemap.trim()) lines.push("", `Sitemap: ${sitemap.trim()}`);
    return lines.join("\n");
  }, [allowAll, disallow, sitemap]);

  return (
    <div className="space-y-4">
      <ToolPanel className="space-y-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={allowAll} onChange={(e) => setAllowAll(e.target.checked)} className="accent-[var(--color-primary)]" />
          Allow crawlers (uncheck to block the whole site)
        </label>
        {allowAll && (
          <Field label="Disallow paths" hint="One path per line.">
            <Textarea value={disallow} onChange={(e) => setDisallow(e.target.value)} className="min-h-28 font-mono" />
          </Field>
        )}
        <Field label="Sitemap URL (optional)">
          <Input value={sitemap} onChange={(e) => setSitemap(e.target.value)} />
        </Field>
      </ToolPanel>

      <ToolPanel className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">robots.txt</span>
          <CopyButton value={output} />
        </div>
        <Textarea value={output} readOnly className="min-h-40 font-mono" />
      </ToolPanel>
    </div>
  );
}
