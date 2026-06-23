import type { GenSpec } from "./types";

const words = (s: string) => s.match(/[\p{L}\p{N}']+/gu) || [];

const T = (slug: string, name: string, description: string, keywords: string[], run: (s: string) => string): GenSpec =>
  ({ slug, name, description, keywords, category: "text", kind: "transform", live: true, run });

export const text2Tools: GenSpec[] = [
  T("count-paragraphs", "Paragraph Counter", "Count the paragraphs in your text.", ["paragraphs", "count"], (s) => String(s.split(/\n\s*\n/).filter((p) => p.trim()).length)),
  T("count-sentences", "Sentence Counter", "Count the sentences in your text.", ["sentences", "count"], (s) => String((s.match(/[.!?]+(\s|$)/g) || []).length)),
  T("count-syllables", "Syllable Counter", "Estimate the syllables in your text.", ["syllables", "count"], (s) => { const w = words(s); const c = w.reduce((a, x) => a + (x.toLowerCase().replace(/e$/, "").match(/[aeiouy]+/g) || ["x"]).length, 0); return String(c); }),
  T("average-word-length", "Average Word Length", "Find the average length of words.", ["average", "word", "length"], (s) => { const w = words(s); if (!w.length) throw new Error("No words found."); return (w.join("").length / w.length).toFixed(2) + " characters"; }),
  T("longest-word", "Longest Word Finder", "Find the longest word in the text.", ["longest", "word"], (s) => { const w = words(s); if (!w.length) throw new Error("No words found."); return w.reduce((a, b) => (b.length > a.length ? b : a)); }),
  T("shortest-word", "Shortest Word Finder", "Find the shortest word in the text.", ["shortest", "word"], (s) => { const w = words(s); if (!w.length) throw new Error("No words found."); return w.reduce((a, b) => (b.length < a.length ? b : a)); }),
  T("longest-line", "Longest Line Finder", "Find the longest line in the text.", ["longest", "line"], (s) => s.split(/\r?\n/).reduce((a, b) => (b.length > a.length ? b : a), "")),
  T("remove-duplicate-words", "Remove Duplicate Words", "Keep only the first occurrence of each word.", ["duplicate", "words", "dedupe"], (s) => { const seen = new Set<string>(); return s.replace(/\S+/g, (w) => { const k = w.toLowerCase(); if (seen.has(k)) return ""; seen.add(k); return w; }).replace(/\s{2,}/g, " ").trim(); }),
  T("remove-repeated-punctuation", "Fix Repeated Punctuation", "Collapse !!! and ??? to a single mark.", ["punctuation", "repeated"], (s) => s.replace(/([!?.,])\1+/g, "$1")),
  T("remove-first-word", "Remove First Word", "Drop the first word of every line.", ["remove", "first", "word"], (s) => s.split(/\r?\n/).map((l) => l.replace(/^\s*\S+\s*/, "")).join("\n")),
  T("remove-last-word", "Remove Last Word", "Drop the last word of every line.", ["remove", "last", "word"], (s) => s.split(/\r?\n/).map((l) => l.replace(/\s*\S+\s*$/, "")).join("\n")),
  T("sort-lines-by-length", "Sort Lines by Length", "Sort lines from shortest to longest.", ["sort", "length", "lines"], (s) => s.split(/\r?\n/).sort((a, b) => a.length - b.length).join("\n")),
  T("sort-words-alphabetically", "Sort Words Alphabetically", "Sort all words A→Z.", ["sort", "words", "alphabetical"], (s) => words(s).sort((a, b) => a.localeCompare(b)).join(" ")),
  T("wrap-lines-brackets", "Wrap Lines in Brackets", "Surround each line with [square brackets].", ["wrap", "brackets"], (s) => s.split(/\r?\n/).map((l) => (l.trim() ? `[${l}]` : l)).join("\n")),
  T("quote-lines", "Quote Each Line", "Wrap each line in double quotes.", ["quotes", "wrap", "lines"], (s) => s.split(/\r?\n/).map((l) => (l.trim() ? `"${l}"` : l)).join("\n")),
  T("single-quote-lines", "Single-quote Each Line", "Wrap each line in single quotes.", ["quotes", "single", "lines"], (s) => s.split(/\r?\n/).map((l) => (l.trim() ? `'${l}'` : l)).join("\n")),
  T("count-words-per-line", "Words Per Line", "Count words on each line.", ["words", "per line", "count"], (s) => s.split(/\r?\n/).map((l) => `${(l.match(/\S+/g) || []).length}\t${l}`).join("\n")),
  T("reverse-each-word", "Reverse Each Word", "Reverse the letters in each word.", ["reverse", "word", "letters"], (s) => s.replace(/\S+/g, (w) => [...w].reverse().join(""))),
  T("capitalize-each-line", "Capitalize Each Line", "Capitalize the first letter of each line.", ["capitalize", "line"], (s) => s.split(/\r?\n/).map((l) => l.replace(/^\s*\S/, (c) => c.toUpperCase())).join("\n")),
  T("remove-non-ascii", "Remove Non-ASCII", "Strip characters outside basic ASCII.", ["ascii", "non-ascii", "clean"], (s) => s.replace(/[^\x00-\x7F]/g, "")),
  T("tabs-to-spaces", "Tabs to Spaces", "Convert tabs into four spaces.", ["tabs", "spaces", "indent"], (s) => s.replace(/\t/g, "    ")),
  T("spaces-to-tabs", "Spaces to Tabs", "Convert four spaces into a tab.", ["spaces", "tabs", "indent"], (s) => s.replace(/ {4}/g, "\t")),
  T("remove-trailing-spaces", "Remove Trailing Spaces", "Strip trailing whitespace on each line.", ["trailing", "spaces", "trim"], (s) => s.replace(/[ \t]+$/gm, "")),
  T("remove-leading-spaces", "Remove Leading Spaces", "Strip leading whitespace on each line.", ["leading", "spaces", "trim"], (s) => s.replace(/^[ \t]+/gm, "")),
  T("extract-quoted-text", "Extract Quoted Text", "Pull text inside double quotes.", ["quotes", "extract"], (s) => { const m = [...s.matchAll(/"([^"]+)"/g)].map((x) => x[1]); if (!m.length) throw new Error("No quoted text found."); return m.join("\n"); }),
  T("strip-markdown", "Strip Markdown", "Remove Markdown formatting characters.", ["markdown", "strip", "plain"], (s) => s.replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[*_`~#>]/g, "").replace(/^\s*[-+]\s+/gm, "").trim()),
  T("count-emoji", "Emoji Counter", "Count the emoji in your text.", ["emoji", "count"], (s) => String((s.match(/\p{Extended_Pictographic}/gu) || []).length)),
  T("unique-line-counter", "Unique Line Counter", "Count how many distinct lines there are.", ["unique", "lines", "count"], (s) => { const l = s.split(/\r?\n/).filter((x) => x.trim()); return `${new Set(l).size} unique of ${l.length} lines`; }),
];
