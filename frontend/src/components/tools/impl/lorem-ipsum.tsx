"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { ToolPanel, Field } from "@/components/tools/panel";

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(" ");

function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function sentence(min = 6, max = 14): string {
  const len = min + Math.floor(Math.random() * (max - min));
  const words = Array.from({ length: len }, randomWord);
  words[0] = words[0][0].toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

function paragraph(): string {
  const count = 3 + Math.floor(Math.random() * 4);
  return Array.from({ length: count }, () => sentence()).join(" ");
}

export default function LoremIpsum() {
  const [unit, setUnit] = React.useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [count, setCount] = React.useState(3);
  const [output, setOutput] = React.useState("");

  function generate() {
    let text = "";
    if (unit === "paragraphs") text = Array.from({ length: count }, paragraph).join("\n\n");
    else if (unit === "sentences") text = Array.from({ length: count }, () => sentence()).join(" ");
    else text = Array.from({ length: count }, randomWord).join(" ");
    setOutput(text);
  }

  React.useEffect(generate, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-4">
      <ToolPanel className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <Field label="Amount">
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value))))}
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
          />
        </Field>
        <Field label="Unit">
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as typeof unit)}
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </Field>
        <Button onClick={generate}>Generate</Button>
      </ToolPanel>

      <ToolPanel className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Output</span>
          <CopyButton value={output} />
        </div>
        <Textarea value={output} readOnly className="min-h-64" aria-label="Generated text" />
      </ToolPanel>
    </div>
  );
}
