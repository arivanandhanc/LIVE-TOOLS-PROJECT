"use client";

import { Transformer } from "@/components/tools/transformer";

const run = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");

export default function RemoveAccents() {
  return (
    <Transformer
      inputLabel="Text"
      outputLabel="Without accents"
      inputPlaceholder="Café, naïve, jalapeño, résumé…"
      live
      actions={[{ label: "Remove accents", run }]}
    />
  );
}
