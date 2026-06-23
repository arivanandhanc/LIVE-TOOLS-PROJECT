import type { GenSpec } from "./types";
import type { ToolCategoryId } from "../types";

const M = (slug: string, name: string, description: string, keywords: string[], run: (s: string) => string, cat: ToolCategoryId = "text"): GenSpec =>
  ({ slug, name, description, keywords, category: cat, kind: "transform", live: true, run });

export const miscTools: GenSpec[] = [
  M("collapse-blank-lines", "Collapse Blank Lines", "Reduce repeated blank lines to one.", ["blank", "lines", "collapse"], (s) => s.replace(/\n{3,}/g, "\n\n")),
  M("fix-spacing-after-punctuation", "Fix Spacing After Punctuation", "Add a missing space after punctuation.", ["spacing", "punctuation"], (s) => s.replace(/([,.!?;:])([^\s\d])/g, "$1 $2")),
  M("remove-space-before-punctuation", "Remove Space Before Punctuation", "Delete spaces before punctuation marks.", ["spacing", "punctuation"], (s) => s.replace(/\s+([,.!?;:])/g, "$1")),
  M("straight-to-curly-quotes", "Straight to Curly Quotes", "Convert straight quotes to typographic quotes.", ["quotes", "curly", "smart"], (s) => s.replace(/(^|[\s([{])"/g, "$1“").replace(/"/g, "”").replace(/(^|[\s([{])'/g, "$1‘").replace(/'/g, "’")),
  M("curly-to-straight-quotes", "Curly to Straight Quotes", "Convert smart quotes back to straight quotes.", ["quotes", "straight"], (s) => s.replace(/[“”]/g, '"').replace(/[‘’]/g, "'")),
  M("capitalize-i", "Capitalize Lonely I", "Fix the standalone pronoun 'i' to 'I'.", ["capitalize", "grammar", "i"], (s) => s.replace(/\bi\b/g, "I")),
  M("remove-urls", "Remove URLs", "Strip web links from text.", ["urls", "remove", "links"], (s) => s.replace(/https?:\/\/\S+/g, "").replace(/ {2,}/g, " ").trim()),
  M("remove-emails-from-text", "Remove Emails", "Strip email addresses from text.", ["emails", "remove"], (s) => s.replace(/[^\s@]+@[^\s@]+\.[^\s@]+/g, "").replace(/ {2,}/g, " ").trim()),
  M("mask-email", "Email Masker", "Hide the local part of email addresses.", ["email", "mask", "privacy"], (s) => s.replace(/([^\s@])[^\s@]*@/g, "$1***@"), "developer"),
  M("line-length-checker", "Line Length Checker", "Show the character length of each line.", ["line", "length", "check"], (s) => s.split(/\r?\n/).map((l) => `${l.length}\t${l}`).join("\n"), "developer"),
  M("letters-only", "Letters Only", "Keep only alphabetic characters.", ["letters", "only", "filter"], (s) => s.replace(/[^a-zA-Z]/g, "")),
  M("alphanumeric-only", "Alphanumeric Only", "Keep only letters and numbers.", ["alphanumeric", "filter"], (s) => s.replace(/[^a-zA-Z0-9]/g, "")),
  M("count-tabs", "Tab Counter", "Count the tab characters in text.", ["tabs", "count"], (s) => String((s.match(/\t/g) || []).length)),
  M("extract-email-domains", "Extract Email Domains", "List the domains from email addresses.", ["email", "domain", "extract"], (s) => { const m = s.match(/[^\s@]+@([^\s@]+\.[^\s@]+)/g); if (!m) throw new Error("No emails found."); return [...new Set(m.map((e) => e.split("@")[1].toLowerCase()))].join("\n"); }, "developer"),
];
