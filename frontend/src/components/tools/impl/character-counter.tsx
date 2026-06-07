"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { ToolPanel, Stat } from "@/components/tools/panel";

export default function CharacterCounter() {
  const [text, setText] = React.useState("");
  const chars = text.length;
  const noSpaces = text.replace(/\s/g, "").length;
  const bytes = new TextEncoder().encode(text).length;
  const lines = text ? text.split(/\n/).length : 0;

  return (
    <div className="space-y-4">
      <ToolPanel>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text…"
          className="min-h-64 font-sans"
          aria-label="Text to count"
        />
      </ToolPanel>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Characters" value={chars.toLocaleString()} />
        <Stat label="No spaces" value={noSpaces.toLocaleString()} />
        <Stat label="Bytes (UTF-8)" value={bytes.toLocaleString()} />
        <Stat label="Lines" value={lines.toLocaleString()} />
      </div>
    </div>
  );
}
