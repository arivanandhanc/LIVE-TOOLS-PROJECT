"use client";

import { Transformer } from "@/components/tools/transformer";

const slug = (s: string, sep: string) =>
  s
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, sep)
    .replace(new RegExp(`^${sep}+|${sep}+$`, "g"), "");

export default function Slugify() {
  return (
    <Transformer
      inputLabel="Text"
      outputLabel="Slug"
      inputPlaceholder="My Awesome Blog Post!"
      live
      actions={[
        { label: "Slugify", run: (s) => slug(s, "-") },
        { label: "Underscore", variant: "secondary", run: (s) => slug(s, "_") },
      ]}
    />
  );
}
