/**
 * Pure, dependency-light formatting/conversion helpers shared by the
 * developer & data tools. Everything runs in the browser.
 */

// ───────────────────────── XML ─────────────────────────

/** Pretty-print an XML string with 2-space indentation. */
export function formatXml(xml: string): string {
  const trimmed = xml.trim();
  if (!trimmed) throw new Error("Nothing to format.");
  // Validate first so we surface real parse errors.
  const doc = new DOMParser().parseFromString(trimmed, "application/xml");
  const err = doc.querySelector("parsererror");
  if (err) throw new Error("Invalid XML: " + (err.textContent?.split("\n")[0] ?? "parse error"));

  const withBreaks = trimmed.replace(/>\s*</g, ">\n<");
  let indent = 0;
  return withBreaks
    .split("\n")
    .map((line) => {
      const l = line.trim();
      if (/^<\/[^>]+>/.test(l)) indent = Math.max(0, indent - 1);
      const padded = "  ".repeat(indent) + l;
      if (/^<[^!?/][^>]*[^/]>$/.test(l) && !/^<[^>]+>.*<\/[^>]+>$/.test(l)) indent++;
      return padded;
    })
    .join("\n");
}

/** Minify XML by stripping inter-tag whitespace. */
export function minifyXml(xml: string): string {
  return xml.replace(/>\s+</g, "><").trim();
}

// ───────────────────────── HTML ─────────────────────────

const VOID_TAGS = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);

/** Pretty-print HTML with 2-space indentation. */
export function formatHtml(html: string): string {
  const tokens = html.replace(/>\s*</g, ">\n<").trim().split("\n");
  let indent = 0;
  return tokens
    .map((raw) => {
      const line = raw.trim();
      const isClosing = /^<\//.test(line);
      const tagName = line.match(/^<\/?([a-zA-Z0-9-]+)/)?.[1]?.toLowerCase();
      const isVoid = tagName ? VOID_TAGS.has(tagName) : false;
      const selfContained = /^<[^>]+>.*<\/[^>]+>$/.test(line) || /\/>$/.test(line);
      if (isClosing) indent = Math.max(0, indent - 1);
      const out = "  ".repeat(indent) + line;
      if (!isClosing && !isVoid && !selfContained && /^<[a-zA-Z]/.test(line)) indent++;
      return out;
    })
    .join("\n");
}

// ───────────────────────── CSS / JS minify ─────────────────────────

export function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")    // comments
    .replace(/\s+/g, " ")                  // collapse whitespace
    .replace(/\s*([{}:;,>])\s*/g, "$1")  // around punctuation
    .replace(/;}/g, "}")                   // trailing semicolons
    .trim();
}

/**
 * Conservative JS minifier: strips comments and collapses insignificant
 * whitespace while preserving string/template/regex literals. Not a full
 * compiler — keep a copy of your source.
 */
export function minifyJs(src: string): string {
  let out = "";
  let i = 0;
  const n = src.length;
  const isWord = (c: string) => /[\w$]/.test(c);
  while (i < n) {
    const c = src[i];
    const next = src[i + 1];
    // line comment
    if (c === "/" && next === "/") {
      while (i < n && src[i] !== "\n") i++;
      continue;
    }
    // block comment
    if (c === "/" && next === "*") {
      i += 2;
      while (i < n && !(src[i] === "*" && src[i + 1] === "/")) i++;
      i += 2;
      continue;
    }
    // strings & templates
    if (c === '"' || c === "'" || c === "`") {
      const quote = c;
      out += c;
      i++;
      while (i < n) {
        out += src[i];
        if (src[i] === "\\") { out += src[i + 1] ?? ""; i += 2; continue; }
        if (src[i] === quote) { i++; break; }
        i++;
      }
      continue;
    }
    // whitespace runs → single space, but drop around obvious punctuation
    if (/\s/.test(c)) {
      let j = i;
      while (j < n && /\s/.test(src[j])) j++;
      const prev = out[out.length - 1] ?? "";
      const after = src[j] ?? "";
      // keep a space only when needed to separate identifiers/keywords
      if (isWord(prev) && isWord(after)) out += " ";
      i = j;
      continue;
    }
    out += c;
    i++;
  }
  return out.trim();
}

// ───────────────────────── SQL ─────────────────────────

const SQL_KEYWORDS = [
  "SELECT", "FROM", "WHERE", "AND", "OR", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN",
  "FULL JOIN", "JOIN", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "OFFSET",
  "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM", "ON", "AS", "UNION",
];
const SQL_NEWLINE = new Set(["SELECT", "FROM", "WHERE", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM", "UNION", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "JOIN"]);

export function formatSql(sql: string): string {
  let s = sql.replace(/\s+/g, " ").trim();
  // Uppercase + line-break the major clauses.
  for (const kw of SQL_KEYWORDS.sort((a, b) => b.length - a.length)) {
    const re = new RegExp(`\\b${kw.replace(/ /g, "\\s+")}\\b`, "gi");
    s = s.replace(re, (m) => {
      const upper = kw;
      return SQL_NEWLINE.has(kw) ? `\n${upper}` : upper;
    });
  }
  return s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join("\n")
    .replace(/,\s*/g, ",\n  ");
}

// ───────────────────────── JSON ⇄ XML ─────────────────────────

export function jsonToXml(jsonStr: string): string {
  const data = JSON.parse(jsonStr);
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const build = (value: unknown, key: string, indent: number): string => {
    const pad = "  ".repeat(indent);
    if (Array.isArray(value)) return value.map((v) => build(v, key, indent)).join("\n");
    if (value !== null && typeof value === "object") {
      const inner = Object.entries(value as Record<string, unknown>)
        .map(([k, v]) => build(v, k, indent + 1))
        .join("\n");
      return `${pad}<${key}>\n${inner}\n${pad}</${key}>`;
    }
    return `${pad}<${key}>${esc(String(value))}</${key}>`;
  };
  const root = Array.isArray(data) ? "items" : "root";
  return `<?xml version="1.0" encoding="UTF-8"?>\n${build(data, root, 0)}`;
}

export function xmlToJson(xmlStr: string): string {
  const doc = new DOMParser().parseFromString(xmlStr.trim(), "application/xml");
  const err = doc.querySelector("parsererror");
  if (err) throw new Error("Invalid XML.");
  const walk = (node: Element): unknown => {
    const children = Array.from(node.children);
    if (children.length === 0) return node.textContent?.trim() ?? "";
    const obj: Record<string, unknown> = {};
    for (const child of children) {
      const val = walk(child);
      if (child.tagName in obj) {
        const existing = obj[child.tagName];
        obj[child.tagName] = Array.isArray(existing) ? [...existing, val] : [existing, val];
      } else {
        obj[child.tagName] = val;
      }
    }
    return obj;
  };
  const root = doc.documentElement;
  return JSON.stringify({ [root.tagName]: walk(root) }, null, 2);
}
