"use client";

import { Transformer } from "@/components/tools/transformer";

const TO_MORSE: Record<string, string> = {
  a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.",
  h: "....", i: "..", j: ".---", k: "-.-", l: ".-..", m: "--", n: "-.",
  o: "---", p: ".--.", q: "--.-", r: ".-.", s: "...", t: "-", u: "..-",
  v: "...-", w: ".--", x: "-..-", y: "-.--", z: "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
  "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.", "!": "-.-.--",
  "/": "-..-.", "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...",
  ";": "-.-.-.", "=": "-...-", "+": ".-.-.", "-": "-....-", "_": "..--.-",
  '"': ".-..-.", "$": "...-..-", "@": ".--.-.",
};
const FROM_MORSE: Record<string, string> = Object.fromEntries(
  Object.entries(TO_MORSE).map(([k, v]) => [v, k])
);

const toMorse = (s: string) =>
  s
    .toLowerCase()
    .split("")
    .map((c) => (c === " " ? "/" : TO_MORSE[c] ?? ""))
    .filter(Boolean)
    .join(" ");

const fromMorse = (s: string) =>
  s
    .trim()
    .split(/\s+/)
    .map((code) => (code === "/" ? " " : FROM_MORSE[code] ?? ""))
    .join("");

export default function MorseCode() {
  return (
    <Transformer
      inputLabel="Text or Morse"
      outputLabel="Result"
      inputPlaceholder="Type text to encode, or paste Morse (use / for spaces) to decode…"
      actions={[
        { label: "Text → Morse", run: toMorse },
        { label: "Morse → Text", run: fromMorse, variant: "outline" },
      ]}
    />
  );
}
