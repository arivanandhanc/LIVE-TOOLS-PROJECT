import type { GenSpec } from "./types";

const words = (s: string) =>
  s.replace(/([a-z0-9])([A-Z])/g, "$1 $2").split(/[^a-zA-Z0-9]+/).filter(Boolean);

const T = (
  slug: string,
  name: string,
  description: string,
  keywords: string[],
  run: (s: string) => string,
  opts: Partial<GenSpec> = {}
): GenSpec => ({ slug, name, description, keywords, category: "text", kind: "transform", live: true, run, ...opts });

export const textTools: GenSpec[] = [
  T("snake-case", "snake_case Converter", "Convert text to snake_case.", ["snake", "case"], (s) => words(s).map((w) => w.toLowerCase()).join("_")),
  T("kebab-case", "kebab-case Converter", "Convert text to kebab-case.", ["kebab", "case", "dash"], (s) => words(s).map((w) => w.toLowerCase()).join("-")),
  T("camel-case", "camelCase Converter", "Convert text to camelCase.", ["camel", "case"], (s) => words(s).map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase())).join("")),
  T("pascal-case", "PascalCase Converter", "Convert text to PascalCase.", ["pascal", "case"], (s) => words(s).map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join("")),
  T("constant-case", "CONSTANT_CASE Converter", "Convert text to CONSTANT_CASE.", ["constant", "upper", "snake"], (s) => words(s).map((w) => w.toUpperCase()).join("_")),
  T("dot-case", "dot.case Converter", "Convert text to dot.case.", ["dot", "case"], (s) => words(s).map((w) => w.toLowerCase()).join(".")),
  T("sentence-case", "Sentence case Converter", "Capitalize the first letter of each sentence.", ["sentence", "case"], (s) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase())),
  T("swap-case", "Swap Case", "Swap uppercase and lowercase letters.", ["swap", "case", "invert"], (s) => s.replace(/[a-zA-Z]/g, (c) => (c === c.toLowerCase() ? c.toUpperCase() : c.toLowerCase()))),
  T("capitalize-first", "Capitalize First Letter", "Capitalize only the first letter of the text.", ["capitalize", "first"], (s) => s.charAt(0).toUpperCase() + s.slice(1)),
  T("alternating-case", "aLtErNaTiNg CaSe", "Convert text to alternating caps.", ["alternating", "mocking"], (s) => [...s].map((c, i) => (i % 2 ? c.toUpperCase() : c.toLowerCase())).join("")),
  T("extract-words", "Extract Words", "List every word on its own line.", ["words", "extract", "split"], (s) => { const w = words(s); if (!w.length) throw new Error("No words found."); return w.join("\n"); }),
  T("unique-words", "Unique Words", "List each unique word once.", ["unique", "words", "dedupe"], (s) => { const w = [...new Set(words(s).map((x) => x.toLowerCase()))]; if (!w.length) throw new Error("No words found."); return w.join("\n"); }),
  T("remove-numbers", "Remove Numbers", "Strip all digits from the text.", ["remove", "numbers", "digits"], (s) => s.replace(/[0-9]/g, "")),
  T("keep-numbers-only", "Keep Numbers Only", "Remove everything except digits.", ["numbers", "only", "digits"], (s) => s.replace(/[^0-9]/g, "")),
  T("remove-letters", "Remove Letters", "Remove all alphabetic characters.", ["remove", "letters"], (s) => s.replace(/[a-zA-Z]/g, "")),
  T("remove-whitespace", "Remove All Whitespace", "Strip every space, tab and newline.", ["whitespace", "remove", "spaces"], (s) => s.replace(/\s+/g, "")),
  T("extract-hashtags", "Extract Hashtags", "Pull all #hashtags from the text.", ["hashtags", "extract", "social"], (s) => { const m = s.match(/#[\p{L}0-9_]+/gu) || []; if (!m.length) throw new Error("No hashtags found."); return [...new Set(m)].join("\n"); }),
  T("extract-mentions", "Extract @Mentions", "Pull all @mentions from the text.", ["mentions", "extract", "social"], (s) => { const m = s.match(/@[\p{L}0-9_]+/gu) || []; if (!m.length) throw new Error("No mentions found."); return [...new Set(m)].join("\n"); }),
  T("lines-to-comma", "Lines to Comma List", "Join lines into a comma-separated list.", ["lines", "comma", "join"], (s) => s.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).join(", ")),
  T("comma-to-lines", "Comma List to Lines", "Split a comma list into one item per line.", ["comma", "lines", "split"], (s) => s.split(/,\s*/).map((x) => x.trim()).filter(Boolean).join("\n")),
  T("trim-lines", "Trim Each Line", "Remove leading and trailing spaces on every line.", ["trim", "lines"], (s) => s.split(/\r?\n/).map((l) => l.trim()).join("\n")),
  T("reverse-line-order", "Reverse Line Order", "Flip the order of lines top to bottom.", ["reverse", "lines", "order"], (s) => s.split(/\r?\n/).reverse().join("\n")),
  T("spaces-to-dashes", "Spaces to Dashes", "Replace spaces with hyphens.", ["spaces", "dashes", "hyphen"], (s) => s.replace(/ +/g, "-")),
  T("spaces-to-underscores", "Spaces to Underscores", "Replace spaces with underscores.", ["spaces", "underscore"], (s) => s.replace(/ +/g, "_")),
  T("acronym-maker", "Acronym Maker", "Build an acronym from the first letters.", ["acronym", "initials"], (s) => { const w = words(s); if (!w.length) throw new Error("No words found."); return w.map((x) => x[0].toUpperCase()).join(""); }),
  T("remove-emoji", "Remove Emoji", "Strip emoji characters from text.", ["emoji", "remove"], (s) => s.replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, "").replace(/  +/g, " ")),
  T("extract-emoji", "Extract Emoji", "List every emoji in the text.", ["emoji", "extract"], (s) => { const m = s.match(/\p{Extended_Pictographic}/gu) || []; if (!m.length) throw new Error("No emoji found."); return m.join(" "); }),
  T("sentence-splitter", "Sentence Splitter", "Put each sentence on its own line.", ["sentence", "split"], (s) => s.replace(/([.!?])\s+/g, "$1\n").trim()),
  T("vowel-counter", "Vowel Counter", "Count the vowels in your text.", ["vowels", "count"], (s) => String((s.match(/[aeiou]/gi) || []).length)),
  T("consonant-counter", "Consonant Counter", "Count the consonants in your text.", ["consonants", "count"], (s) => String((s.match(/[bcdfghjklmnpqrstvwxyz]/gi) || []).length)),
  T("word-wrap", "Word Wrap (80)", "Wrap text to lines of up to 80 characters.", ["wrap", "format", "columns"], (s) => s.split(/\r?\n/).map((line) => { const out: string[] = []; let cur = ""; for (const w of line.split(/ +/)) { if ((cur + " " + w).trim().length > 80) { out.push(cur.trim()); cur = w; } else cur += " " + w; } if (cur.trim()) out.push(cur.trim()); return out.join("\n"); }).join("\n")),
];
