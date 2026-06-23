import type { GenSpec } from "./types";

const shift = (s: string, n: number) =>
  s.replace(/[a-z]/gi, (c) => {
    const b = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - b + n + 26) % 26) + b);
  });

const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
function b32enc(str: string) {
  const bytes = new TextEncoder().encode(str);
  let bits = "";
  for (const b of bytes) bits += b.toString(2).padStart(8, "0");
  let out = "";
  for (let i = 0; i < bits.length; i += 5) out += B32[parseInt(bits.slice(i, i + 5).padEnd(5, "0"), 2)];
  while (out.length % 8) out += "=";
  return out;
}
function b32dec(s: string) {
  s = s.replace(/=+$/, "").toUpperCase().replace(/[^A-Z2-7]/g, "");
  let bits = "";
  for (const c of s) bits += B32.indexOf(c).toString(2).padStart(5, "0");
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2));
  return new TextDecoder().decode(new Uint8Array(bytes));
}

const dual = (slug: string, name: string, description: string, keywords: string[], aLabel: string, aRun: (s: string) => string, bLabel: string, bRun: (s: string) => string): GenSpec =>
  ({ slug, name, description, keywords, category: "developer", kind: "dual", aLabel, aRun, bLabel, bRun });

const xform = (slug: string, name: string, description: string, keywords: string[], run: (s: string) => string): GenSpec =>
  ({ slug, name, description, keywords, category: "developer", kind: "transform", live: true, run });

export const cipherTools: GenSpec[] = [
  dual("caesar-cipher", "Caesar Cipher", "Shift letters by three (ROT3) and back.", ["caesar", "cipher", "shift"], "Encode", (s) => shift(s, 3), "Decode", (s) => shift(s, 23)),
  xform("atbash-cipher", "Atbash Cipher", "Mirror the alphabet (A↔Z). Self-reversing.", ["atbash", "cipher"], (s) => s.replace(/[a-z]/gi, (c) => { const b = c <= "Z" ? 65 : 97; return String.fromCharCode(b + 25 - (c.charCodeAt(0) - b)); })),
  xform("rot47", "ROT47 Cipher", "Rotate printable ASCII by 47. Self-reversing.", ["rot47", "cipher"], (s) => s.replace(/[!-~]/g, (c) => String.fromCharCode(33 + ((c.charCodeAt(0) - 33 + 47) % 94)))),
  dual("a1z26-cipher", "A1Z26 Cipher", "Convert letters to their position number and back.", ["a1z26", "cipher", "number"], "Encode", (s) => s.toLowerCase().replace(/[a-z]/g, (c) => c.charCodeAt(0) - 96 + " ").replace(/[^0-9 ]/g, "").trim(), "Decode", (s) => s.trim().split(/\s+/).map((n) => String.fromCharCode(+n + 96)).join("")),
  dual("bacon-cipher", "Bacon Cipher", "Encode text as Baconian A/B groups and back.", ["bacon", "cipher"], "Encode", (s) => s.toLowerCase().replace(/[a-z]/g, (c) => (c.charCodeAt(0) - 97).toString(2).padStart(5, "0").replace(/0/g, "A").replace(/1/g, "B") + " ").trim(), "Decode", (s) => s.trim().split(/\s+/).map((g) => String.fromCharCode(parseInt(g.replace(/A/gi, "0").replace(/B/gi, "1"), 2) + 97)).join("")),
  dual("ascii-code-converter", "ASCII Code Converter", "Convert text to ASCII codes and back.", ["ascii", "code", "convert"], "Text → Codes", (s) => [...s].map((c) => c.charCodeAt(0)).join(" "), "Codes → Text", (s) => s.trim().split(/\s+/).map((n) => String.fromCharCode(+n)).join("")),
  dual("base32", "Base32 Encode / Decode", "Encode and decode Base32 (RFC 4648).", ["base32", "encode", "decode"], "Encode", b32enc, "Decode", b32dec),
  dual("binary-decimal", "Binary ⇄ Decimal", "Convert binary numbers to decimal and back.", ["binary", "decimal", "convert"], "Binary → Decimal", (s) => s.trim().split(/\s+/).map((b) => parseInt(b, 2)).join(" "), "Decimal → Binary", (s) => s.trim().split(/\s+/).map((d) => (parseInt(d, 10) >>> 0).toString(2)).join(" ")),
];
