"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { ToolPanel, Stat } from "@/components/tools/panel";

export default function WordCounter() {
  const [text, setText] = React.useState("");

  const stats = React.useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const sentences = (text.match(/[.!?]+(\s|$)/g) || []).length;
    const paragraphs = trimmed ? trimmed.split(/\n{2,}/).filter(Boolean).length : 0;
    const lines = text ? text.split(/\n/).length : 0;
    const readingTime = Math.max(1, Math.round(words / 200));
    return { words, chars, charsNoSpaces, sentences, paragraphs, lines, readingTime };
  }, [text]);

  return (
    <div className="space-y-4">
      <ToolPanel>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your text…"
          className="min-h-64 font-sans"
          aria-label="Text to analyze"
        />
      </ToolPanel>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Words" value={stats.words.toLocaleString()} />
        <Stat label="Characters" value={stats.chars.toLocaleString()} />
        <Stat label="No spaces" value={stats.charsNoSpaces.toLocaleString()} />
        <Stat label="Sentences" value={stats.sentences.toLocaleString()} />
        <Stat label="Paragraphs" value={stats.paragraphs.toLocaleString()} />
        <Stat label="Read (min)" value={stats.readingTime} />
      </div>
    </div>
  );
}
