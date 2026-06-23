import type { GenSpec } from "./types";
import type { ToolCategoryId } from "../types";

const ri = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
const hexColor = () => "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");

const ADJ = ["swift", "brave", "lunar", "crimson", "silent", "cosmic", "golden", "wild", "frost", "neon", "shadow", "rapid", "mighty", "clever", "epic"];
const NOUN = ["falcon", "tiger", "comet", "river", "ember", "pixel", "nomad", "raven", "atlas", "quartz", "vortex", "willow", "phoenix", "otter", "maple"];
const FIRST = ["Alex", "Jordan", "Maya", "Liam", "Aria", "Noah", "Zoe", "Kai", "Ivy", "Leo", "Nora", "Ravi", "Sara", "Theo", "Mia"];
const LAST = ["Stone", "Vale", "Cruz", "Frost", "Reed", "Lane", "Hart", "Pike", "Wells", "Knox", "Bloom", "Sky", "Marsh", "Quinn", "Fox"];
const WORDS = ["apple", "river", "stone", "cloud", "ember", "tiger", "maple", "ocean", "flint", "raven", "amber", "pixel", "comet", "willow", "nova", "delta", "harbor", "lemon", "violet", "cobalt"];

function luhnCard() {
  const d: number[] = [4];
  for (let i = 0; i < 14; i++) d.push(ri(0, 9));
  let sum = 0;
  for (let i = 0; i < 15; i++) { let n = d[14 - i]; if (i % 2 === 0) { n *= 2; if (n > 9) n -= 9; } sum += n; }
  d.push((10 - (sum % 10)) % 10);
  return d.join("").replace(/(.{4})/g, "$1 ").trim();
}

const G = (slug: string, name: string, description: string, keywords: string[], category: ToolCategoryId, generate: () => string, generateLabel = "Generate"): GenSpec =>
  ({ slug, name, description, keywords, category, kind: "generate", generate, generateLabel });

export const generateTools: GenSpec[] = [
  G("random-number-generator", "Random Number Generator", "Generate ten random numbers from 1 to 100.", ["random", "number"], "convert", () => Array.from({ length: 10 }, () => ri(1, 100)).join(", ")),
  G("random-hex-color", "Random Color Generator", "Generate a random hex color.", ["random", "color", "hex"], "developer", () => hexColor()),
  G("color-palette-generator", "Color Palette Generator", "Generate a random five-color palette.", ["palette", "color", "design"], "developer", () => Array.from({ length: 5 }, hexColor).join("\n")),
  G("nanoid-generator", "NanoID Generator", "Generate URL-friendly NanoIDs.", ["nanoid", "id", "unique"], "developer", () => { const A = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-"; return Array.from({ length: 5 }, () => Array.from({ length: 21 }, () => A[ri(0, 63)]).join("")).join("\n"); }),
  G("ulid-generator", "ULID-style ID Generator", "Generate sortable Crockford base32 IDs.", ["ulid", "id"], "developer", () => { const A = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; return Array.from({ length: 5 }, () => Array.from({ length: 26 }, () => A[ri(0, 31)]).join("")).join("\n"); }),
  G("random-string-generator", "Random String Generator", "Generate random alphanumeric strings.", ["random", "string"], "developer", () => { const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; return Array.from({ length: 5 }, () => Array.from({ length: 16 }, () => A[ri(0, 61)]).join("")).join("\n"); }),
  G("random-bytes-hex", "Random Bytes (Hex)", "Generate cryptographically random hex bytes.", ["random", "bytes", "hex"], "developer", () => { const b = new Uint8Array(16); crypto.getRandomValues(b); return [...b].map((x) => x.toString(16).padStart(2, "0")).join(""); }),
  G("random-pin-generator", "Random PIN Generator", "Generate 4- and 6-digit PIN codes.", ["pin", "code", "random"], "developer", () => `4-digit: ${ri(0, 9999).toString().padStart(4, "0")}\n6-digit: ${ri(0, 999999).toString().padStart(6, "0")}`),
  G("random-mac-address", "Random MAC Address", "Generate a random MAC address.", ["mac", "address", "network"], "developer", () => Array.from({ length: 6 }, () => ri(0, 255).toString(16).padStart(2, "0")).join(":")),
  G("random-ip-address", "Random IP Address", "Generate a random IPv4 address.", ["ip", "ipv4", "network"], "developer", () => Array.from({ length: 4 }, () => ri(0, 255)).join(".")),
  G("random-port-number", "Random Port Number", "Generate a random non-reserved port.", ["port", "network", "random"], "developer", () => String(ri(1024, 65535))),
  G("passphrase-generator", "Passphrase Generator", "Generate a memorable word-based passphrase.", ["passphrase", "password", "diceware"], "developer", () => Array.from({ length: 3 }, () => Array.from({ length: 4 }, () => pick(WORDS)).join("-") + "-" + ri(10, 99)).join("\n")),
  G("random-username-generator", "Username Generator", "Generate fun, available-style usernames.", ["username", "handle", "random"], "text", () => Array.from({ length: 6 }, () => pick(ADJ) + pick(NOUN).replace(/^./, (c) => c.toUpperCase()) + ri(1, 999)).join("\n")),
  G("random-name-generator", "Random Name Generator", "Generate random full names.", ["name", "random"], "text", () => Array.from({ length: 6 }, () => `${pick(FIRST)} ${pick(LAST)}`).join("\n")),
  G("credit-card-test-number", "Test Credit Card Number", "Generate Luhn-valid test card numbers (not real).", ["credit card", "test", "luhn"], "developer", () => Array.from({ length: 3 }, luhnCard).join("\n")),
  G("random-gradient-generator", "Random CSS Gradient", "Generate a random CSS linear-gradient.", ["gradient", "css", "random"], "developer", () => `background: linear-gradient(${ri(0, 360)}deg, ${hexColor()}, ${hexColor()});`),
];
