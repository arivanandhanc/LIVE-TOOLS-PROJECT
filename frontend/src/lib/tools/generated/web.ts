import type { GenSpec } from "./types";

const X = (slug: string, name: string, description: string, keywords: string[], run: (s: string) => string, live = true): GenSpec =>
  ({ slug, name, description, keywords, category: "developer", kind: "transform", live, run });
const D = (slug: string, name: string, description: string, keywords: string[], aLabel: string, aRun: (s: string) => string, bLabel: string, bRun: (s: string) => string): GenSpec =>
  ({ slug, name, description, keywords, category: "developer", kind: "dual", aLabel, aRun, bLabel, bRun });

const parse = (s: string) => { try { return JSON.parse(s); } catch (e) { throw new Error("Invalid JSON: " + (e as Error).message); } };

const HTTP: Record<string, string> = {
  "100": "Continue", "101": "Switching Protocols", "200": "OK", "201": "Created", "202": "Accepted", "204": "No Content", "206": "Partial Content", "301": "Moved Permanently", "302": "Found", "304": "Not Modified", "307": "Temporary Redirect", "308": "Permanent Redirect", "400": "Bad Request", "401": "Unauthorized", "403": "Forbidden", "404": "Not Found", "405": "Method Not Allowed", "408": "Request Timeout", "409": "Conflict", "410": "Gone", "418": "I'm a teapot", "422": "Unprocessable Entity", "429": "Too Many Requests", "500": "Internal Server Error", "501": "Not Implemented", "502": "Bad Gateway", "503": "Service Unavailable", "504": "Gateway Timeout",
};
const MIME: Record<string, string> = {
  html: "text/html", htm: "text/html", css: "text/css", js: "text/javascript", mjs: "text/javascript", json: "application/json", xml: "application/xml", txt: "text/plain", csv: "text/csv", md: "text/markdown", pdf: "application/pdf", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", webp: "image/webp", svg: "image/svg+xml", ico: "image/x-icon", avif: "image/avif", mp3: "audio/mpeg", wav: "audio/wav", ogg: "audio/ogg", mp4: "video/mp4", webm: "video/webm", zip: "application/zip", gz: "application/gzip", tar: "application/x-tar", doc: "application/msword", docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", xls: "application/vnd.ms-excel", xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ppt: "application/vnd.ms-powerpoint", pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation", woff: "font/woff", woff2: "font/woff2", ttf: "font/ttf", otf: "font/otf",
};

const sortKeys = (o: unknown): unknown =>
  Array.isArray(o) ? o.map(sortKeys) : o && typeof o === "object" ? Object.fromEntries(Object.keys(o as object).sort().map((k) => [k, sortKeys((o as Record<string, unknown>)[k])])) : o;

const flatten = (o: Record<string, unknown>, p = "", r: Record<string, unknown> = {}) => {
  for (const k in o) {
    const key = p ? `${p}.${k}` : k;
    const v = o[k];
    if (v && typeof v === "object" && !Array.isArray(v)) flatten(v as Record<string, unknown>, key, r);
    else r[key] = v;
  }
  return r;
};

const toPhp = (o: unknown, ind = "  "): string => {
  if (Array.isArray(o)) return "[\n" + o.map((v) => ind + toPhp(v, ind + "  ")).join(",\n") + "\n" + ind.slice(2) + "]";
  if (o && typeof o === "object") return "[\n" + Object.entries(o).map(([k, v]) => `${ind}'${k}' => ${toPhp(v, ind + "  ")}`).join(",\n") + "\n" + ind.slice(2) + "]";
  return typeof o === "string" ? `'${o.replace(/'/g, "\\'")}'` : String(o);
};

function b64urlEnc(s: string) {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlDec(s: string) {
  let t = s.replace(/-/g, "+").replace(/_/g, "/");
  while (t.length % 4) t += "=";
  return new TextDecoder().decode(Uint8Array.from(atob(t), (c) => c.charCodeAt(0)));
}

export const webTools: GenSpec[] = [
  X("css-beautify", "CSS Beautifier", "Format and indent minified CSS.", ["css", "beautify", "format"], (s) => s.replace(/\s*{\s*/g, " {\n  ").replace(/;\s*/g, ";\n  ").replace(/\s*}\s*/g, "\n}\n\n").replace(/\n {2}\n}/g, "\n}").trim(), false),
  X("sql-minifier", "SQL Minifier", "Collapse SQL onto a single line.", ["sql", "minify"], (s) => s.replace(/--.*$/gm, "").replace(/\s+/g, " ").trim(), false),
  X("json-sort-keys", "JSON Key Sorter", "Alphabetically sort all keys in JSON.", ["json", "sort", "keys"], (s) => JSON.stringify(sortKeys(parse(s)), null, 2)),
  X("html-minifier", "HTML Minifier", "Strip comments and whitespace from HTML.", ["html", "minify"], (s) => s.replace(/<!--[\s\S]*?-->/g, "").replace(/>\s+</g, "><").replace(/\s{2,}/g, " ").trim()),
  X("remove-css-comments", "Remove CSS Comments", "Strip /* … */ comments from CSS.", ["css", "comments"], (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\n{3,}/g, "\n\n").trim()),
  X("remove-html-comments", "Remove HTML Comments", "Strip <!-- … --> comments from HTML.", ["html", "comments"], (s) => s.replace(/<!--[\s\S]*?-->/g, "").trim()),
  X("remove-js-comments", "Remove JS Comments", "Strip // and /* */ comments from code.", ["javascript", "comments"], (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'])\/\/.*$/gm, "$1").trim()),
  X("json-validator", "JSON Validator", "Check whether text is valid JSON.", ["json", "validate", "lint"], (s) => { const o = parse(s); const kind = Array.isArray(o) ? `array (${o.length} items)` : typeof o === "object" && o ? `object (${Object.keys(o).length} keys)` : typeof o; return `Valid JSON — ${kind}`; }),
  D("json-stringify", "JSON String Escape", "Wrap text as a JSON string literal and back.", ["json", "stringify", "escape"], "Stringify", (s) => JSON.stringify(s), "Parse", (s) => { const v = JSON.parse(s); if (typeof v !== "string") throw new Error("Input is not a JSON string."); return v; }),
  X("http-status-lookup", "HTTP Status Code Lookup", "Look up the meaning of HTTP status codes.", ["http", "status", "code"], (s) => { const codes = s.match(/\d{3}/g); if (!codes) throw new Error("Enter an HTTP status code, e.g. 404."); return codes.map((c) => `${c} ${HTTP[c] ?? "Unknown status"}`).join("\n"); }),
  X("mime-type-lookup", "MIME Type Lookup", "Find the MIME type for a file extension.", ["mime", "content-type", "extension"], (s) => { const exts = s.toLowerCase().match(/[a-z0-9]+/g); if (!exts) throw new Error("Enter a file extension, e.g. png."); return exts.map((e) => `${e} → ${MIME[e] ?? "application/octet-stream"}`).join("\n"); }),
  X("utf8-byte-counter", "UTF-8 Byte Counter", "Count bytes and characters in text.", ["bytes", "utf8", "size"], (s) => `${new TextEncoder().encode(s).length} bytes\n${[...s].length} characters`),
  D("jsonl-converter", "JSONL ⇄ JSON Array", "Convert between JSON Lines and a JSON array.", ["jsonl", "ndjson", "json"], "JSONL → Array", (s) => JSON.stringify(s.split(/\r?\n/).filter((l) => l.trim()).map((l) => JSON.parse(l)), null, 2), "Array → JSONL", (s) => { const a = parse(s); if (!Array.isArray(a)) throw new Error("Input must be a JSON array."); return a.map((x) => JSON.stringify(x)).join("\n"); }),
  X("json-flatten", "JSON Flattener", "Flatten nested JSON into dot-notation keys.", ["json", "flatten", "dot"], (s) => JSON.stringify(flatten(parse(s)), null, 2)),
  X("json-keys-extractor", "JSON Key Extractor", "List the top-level keys of a JSON object.", ["json", "keys", "extract"], (s) => { const o = parse(s); if (typeof o !== "object" || !o || Array.isArray(o)) throw new Error("Provide a JSON object."); return Object.keys(o).join("\n"); }),
  X("json-to-php", "JSON to PHP Array", "Convert JSON into a PHP array literal.", ["json", "php", "convert"], (s) => "<?php\n$data = " + toPhp(parse(s)) + ";"),
  X("css-color-extractor", "CSS Color Extractor", "Pull all hex colors out of CSS or text.", ["css", "color", "hex"], (s) => { const m = s.match(/#[0-9a-fA-F]{3,8}\b/g); if (!m) throw new Error("No hex colors found."); return [...new Set(m.map((c) => c.toLowerCase()))].join("\n"); }),
  X("css-class-extractor", "CSS Class Extractor", "List unique class selectors in CSS.", ["css", "class", "selector"], (s) => { const m = s.match(/\.[-_a-zA-Z][-_a-zA-Z0-9]*/g); if (!m) throw new Error("No class selectors found."); return [...new Set(m)].sort().join("\n"); }),
  X("line-counter", "Line Counter", "Count total and non-empty lines.", ["lines", "count"], (s) => { const l = s.split(/\r?\n/); return `Lines: ${l.length}\nNon-empty: ${l.filter((x) => x.trim()).length}`; }),
  X("char-frequency", "Character Frequency", "Count how often each character appears.", ["character", "frequency"], (s) => { const m = new Map<string, number>(); for (const c of s.replace(/\s/g, "")) m.set(c, (m.get(c) ?? 0) + 1); return [...m.entries()].sort((a, b) => b[1] - a[1]).map(([c, n]) => `${n}\t${c}`).join("\n"); }),
  D("base64url", "Base64URL Encode / Decode", "URL-safe Base64 encoding and decoding.", ["base64url", "encode", "decode"], "Encode", b64urlEnc, "Decode", b64urlDec),
  X("escape-sql-string", "SQL String Escaper", "Escape single quotes for SQL literals.", ["sql", "escape", "quote"], (s) => s.replace(/'/g, "''")),
  X("duplicate-line-finder", "Duplicate Line Finder", "List lines that appear more than once.", ["duplicate", "lines", "find"], (s) => { const m = new Map<string, number>(); for (const l of s.split(/\r?\n/)) m.set(l, (m.get(l) ?? 0) + 1); const dups = [...m.entries()].filter(([, n]) => n > 1); if (!dups.length) throw new Error("No duplicate lines found."); return dups.map(([l, n]) => `${n}× ${l}`).join("\n"); }),
];
