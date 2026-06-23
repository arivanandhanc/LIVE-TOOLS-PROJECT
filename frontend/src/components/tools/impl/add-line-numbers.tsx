"use client";

import { Transformer } from "@/components/tools/transformer";

const addNumbers = (s: string) => {
  const lines = s.split(/\r?\n/);
  const width = String(lines.length).length;
  return lines.map((l, i) => `${String(i + 1).padStart(width, " ")}. ${l}`).join("\n");
};

export default function AddLineNumbers() {
  return (
    <Transformer
      inputLabel="Text"
      outputLabel="Numbered"
      inputPlaceholder={"First line\nSecond line\nThird line"}
      live
      actions={[{ label: "Add line numbers", run: addNumbers }]}
    />
  );
}
