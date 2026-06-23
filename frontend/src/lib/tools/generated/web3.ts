import type { GenSpec } from "./types";

const ls = (s: string) => s.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const X = (slug: string, name: string, description: string, keywords: string[], run: (s: string) => string): GenSpec =>
  ({ slug, name, description, keywords, category: "developer", kind: "transform", live: true, run });

export const web3Tools: GenSpec[] = [
  X("html-ul-generator", "HTML List (UL) Generator", "Turn lines into an HTML bullet list.", ["html", "ul", "list"], (s) => "<ul>\n" + ls(s).map((l) => `  <li>${esc(l)}</li>`).join("\n") + "\n</ul>"),
  X("html-ol-generator", "HTML List (OL) Generator", "Turn lines into an HTML numbered list.", ["html", "ol", "list"], (s) => "<ol>\n" + ls(s).map((l) => `  <li>${esc(l)}</li>`).join("\n") + "\n</ol>"),
  X("markdown-bullet-list", "Markdown Bullet List", "Turn lines into a Markdown bullet list.", ["markdown", "list", "bullet"], (s) => ls(s).map((l) => `- ${l}`).join("\n")),
  X("markdown-numbered-list", "Markdown Numbered List", "Turn lines into a numbered Markdown list.", ["markdown", "list", "numbered"], (s) => ls(s).map((l, i) => `${i + 1}. ${l}`).join("\n")),
  X("markdown-checklist", "Markdown Checklist", "Turn lines into a Markdown task list.", ["markdown", "checklist", "tasks"], (s) => ls(s).map((l) => `- [ ] ${l}`).join("\n")),
  X("html-paragraph-wrap", "HTML Paragraph Wrapper", "Wrap each line in a <p> tag.", ["html", "paragraph"], (s) => ls(s).map((l) => `<p>${esc(l)}</p>`).join("\n")),
  X("anchor-link-generator", "Anchor Link Generator", "Turn URLs into HTML anchor tags.", ["html", "anchor", "link"], (s) => ls(s).map((u) => `<a href="${u}">${u}</a>`).join("\n")),
  X("img-tag-generator", "Image Tag Generator", "Turn image URLs into <img> tags.", ["html", "img", "image"], (s) => ls(s).map((u) => `<img src="${u}" alt="" />`).join("\n")),
  X("hashtag-generator", "Hashtag Generator", "Turn words or lines into #hashtags.", ["hashtag", "social"], (s) => (s.match(/[\p{L}\p{N}]+/gu) || []).map((w) => "#" + w).join(" ")),
  X("slugify-filename", "Filename Slugifier", "Make safe, lowercase filenames.", ["filename", "slug", "safe"], (s) => ls(s).map((l) => l.toLowerCase().replace(/\.[^.]+$/, (e) => e).replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "")).join("\n")),
  X("extract-domain", "Domain Extractor", "Pull the domain from URLs.", ["domain", "url", "extract"], (s) => { const out = ls(s).map((u) => { try { return new URL(u.includes("://") ? u : "http://" + u).hostname; } catch { return null; } }).filter(Boolean) as string[]; if (!out.length) throw new Error("No valid URLs found."); return [...new Set(out)].join("\n"); }),
  X("remove-query-params", "Remove URL Query Params", "Strip query strings and hashes from URLs.", ["url", "query", "clean"], (s) => ls(s).map((u) => u.replace(/[?#].*$/, "")).join("\n")),
  X("url-encode-lines", "URL Encode Lines", "Percent-encode each line for URLs.", ["url", "encode", "lines"], (s) => ls(s).map((l) => encodeURIComponent(l)).join("\n")),
  X("json-to-markdown-table", "JSON to Markdown Table", "Convert a JSON array of objects to a table.", ["json", "markdown", "table"], (s) => { let a; try { a = JSON.parse(s); } catch (e) { throw new Error("Invalid JSON: " + (e as Error).message); } if (!Array.isArray(a) || !a.length) throw new Error("Provide a non-empty JSON array of objects."); const cols = [...new Set(a.flatMap((o: object) => Object.keys(o)))]; const head = `| ${cols.join(" | ")} |`; const sep = `| ${cols.map(() => "---").join(" | ")} |`; const rows = a.map((o: Record<string, unknown>) => `| ${cols.map((c) => String(o[c] ?? "")).join(" | ")} |`); return [head, sep, ...rows].join("\n"); }),
  X("csv-transpose", "CSV Transpose", "Swap rows and columns of CSV data.", ["csv", "transpose", "rows"], (s) => { const rows = ls(s).map((l) => l.split(",")); const cols = Math.max(...rows.map((r) => r.length)); return Array.from({ length: cols }, (_, c) => rows.map((r) => (r[c] ?? "").trim()).join(",")).join("\n"); }),
  X("list-to-checklist-html", "HTML Checklist Generator", "Turn lines into HTML checkbox items.", ["html", "checkbox", "list"], (s) => ls(s).map((l) => `<label><input type="checkbox" /> ${esc(l)}</label>`).join("\n")),
  X("count-substring", "Word Occurrence Counter", "Count each distinct line's occurrences.", ["count", "occurrence", "lines"], (s) => { const m = new Map<string, number>(); for (const l of ls(s)) m.set(l, (m.get(l) ?? 0) + 1); return [...m.entries()].sort((a, b) => b[1] - a[1]).map(([l, n]) => `${n}\t${l}`).join("\n"); }),
  X("text-to-html-br", "Line Breaks to HTML", "Convert newlines into <br> tags.", ["html", "br", "newline"], (s) => esc(s).replace(/\r?\n/g, "<br>\n")),
  X("list-prefix-numbers", "Number a List", "Add 1) 2) 3) prefixes to each line.", ["list", "number", "prefix"], (s) => ls(s).map((l, i) => `${i + 1}) ${l}`).join("\n")),
  X("title-case-headline", "Headline Title Case", "Capitalize a headline in title case.", ["headline", "title case", "capitalize"], (s) => { const small = new Set(["a", "an", "and", "as", "at", "but", "by", "for", "in", "of", "on", "or", "the", "to", "vs", "via"]); return s.toLowerCase().split(/\s+/).map((w, i, arr) => (i !== 0 && i !== arr.length - 1 && small.has(w) ? w : w.replace(/^\w/, (c) => c.toUpperCase()))).join(" "); }),
];
