"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/ui/copy-button";
import { ToolPanel, Field } from "@/components/tools/panel";

function parseColor(input: string): [number, number, number] | null {
  const s = input.trim().toLowerCase();
  let m = /^#?([0-9a-f]{6})$/.exec(s);
  if (m) {
    const n = parseInt(m[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  m = /^#?([0-9a-f]{3})$/.exec(s);
  if (m) {
    const [r, g, b] = m[1].split("");
    return [parseInt(r + r, 16), parseInt(g + g, 16), parseInt(b + b, 16)];
  }
  m = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(s);
  if (m) return [+m[1], +m[2], +m[3]];
  return null;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

const toHex = (n: number) => n.toString(16).padStart(2, "0");

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="flex items-center gap-2">
        <code className="text-sm">{value}</code>
        <CopyButton value={value} />
      </span>
    </div>
  );
}

export default function ColorConverter() {
  const [input, setInput] = React.useState("#FBBF24");
  const rgb = parseColor(input);

  return (
    <div className="space-y-4">
      <ToolPanel className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-end">
        <div
          className="size-16 rounded-lg border border-border"
          style={{ background: rgb ? `rgb(${rgb.join(",")})` : "transparent" }}
        />
        <div className="flex items-end gap-3">
          <Field label="Color (HEX, RGB or HSL input)">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="#FBBF24 or rgb(251,191,36)" />
          </Field>
          <input
            type="color"
            value={rgb ? `#${toHex(rgb[0])}${toHex(rgb[1])}${toHex(rgb[2])}` : "#000000"}
            onChange={(e) => setInput(e.target.value)}
            className="size-10 shrink-0 cursor-pointer rounded border border-border bg-transparent"
            aria-label="Pick a color"
          />
        </div>
      </ToolPanel>

      {rgb ? (
        <ToolPanel className="grid gap-2 sm:grid-cols-2">
          <Row label="HEX" value={`#${toHex(rgb[0])}${toHex(rgb[1])}${toHex(rgb[2])}`.toUpperCase()} />
          <Row label="RGB" value={`rgb(${rgb.join(", ")})`} />
          <Row label="HSL" value={`hsl(${rgbToHsl(...rgb).map((v, i) => (i ? v + "%" : v)).join(", ")})`} />
          <Row label="RGB values" value={rgb.join(", ")} />
        </ToolPanel>
      ) : (
        <p className="text-sm text-muted-foreground">Enter a valid HEX, RGB or HSL color.</p>
      )}
    </div>
  );
}
