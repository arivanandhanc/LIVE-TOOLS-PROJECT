"use client";

import { Transformer } from "@/components/tools/transformer";

function decodeSegment(segment: string): unknown {
  const padded = segment.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

export default function JwtDecoder() {
  return (
    <Transformer
      inputLabel="JWT"
      outputLabel="Decoded (header + payload)"
      inputPlaceholder="eyJhbGciOiJIUzI1Ni;…"
      live
      actions={[
        {
          label: "Decode",
          run: (input) => {
            const parts = input.trim().split(".");
            if (parts.length < 2) throw new Error("A JWT has at least two dot-separated parts.");
            try {
              const header = decodeSegment(parts[0]);
              const payload = decodeSegment(parts[1]);
              return JSON.stringify({ header, payload }, null, 2);
            } catch {
              throw new Error("Could not decode token — is it a valid JWT?");
            }
          },
        },
      ]}
    />
  );
}
