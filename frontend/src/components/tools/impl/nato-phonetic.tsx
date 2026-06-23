"use client";

import { Transformer } from "@/components/tools/transformer";

const NATO: Record<string, string> = {
  a: "Alfa", b: "Bravo", c: "Charlie", d: "Delta", e: "Echo", f: "Foxtrot",
  g: "Golf", h: "Hotel", i: "India", j: "Juliett", k: "Kilo", l: "Lima",
  m: "Mike", n: "November", o: "Oscar", p: "Papa", q: "Quebec", r: "Romeo",
  s: "Sierra", t: "Tango", u: "Uniform", v: "Victor", w: "Whiskey",
  x: "X-ray", y: "Yankee", z: "Zulu",
  "0": "Zero", "1": "One", "2": "Two", "3": "Three", "4": "Four",
  "5": "Five", "6": "Six", "7": "Seven", "8": "Eight", "9": "Nine",
};

const run = (s: string) =>
  [...s.toLowerCase()]
    .map((c) => (c === " " ? "|" : NATO[c] ?? c))
    .join(" ");

export default function NatoPhonetic() {
  return (
    <Transformer
      inputLabel="Text"
      outputLabel="NATO phonetic"
      inputPlaceholder="Type a word or code to spell out…"
      live
      actions={[{ label: "Convert to NATO", run }]}
    />
  );
}
