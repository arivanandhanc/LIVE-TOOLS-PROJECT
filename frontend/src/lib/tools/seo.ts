import type { Tool } from "./types";
import { getCategory } from "./registry";

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Generate unique, useful How-To steps for a tool. Programmatic but specific —
 * each page gets distinct, indexable content (key for ranking long-tail queries).
 */
export function getHowToSteps(tool: Tool): string[] {
  const isServer = tool.mode === "server";
  const verb = tool.name.toLowerCase();
  return [
    isServer
      ? `Upload your file to the ${tool.name} tool — drag and drop or click to browse.`
      : `Open the ${tool.name} tool and paste or drop your content into the input area.`,
    `Adjust the available options to match exactly what you need.`,
    `Run the tool — ${verb} completes ${isServer ? "in seconds on our secure servers" : "instantly in your browser"}.`,
    `Preview the result, then copy it or download the output file.`,
  ];
}

/** Generate a tool-specific FAQ block used for FAQPage structured data + on-page content. */
export function getFaqs(tool: Tool): FaqItem[] {
  const category = getCategory(tool.category);
  const isClient = tool.mode === "client";
  const faqs: FaqItem[] = [
    {
      question: `Is the ${tool.name} tool free to use?`,
      answer: `Yes. ${tool.name} is completely free with no watermarks, no sign-up requirement, and no file-size paywall. Create a free account only if you want your history and favorites saved.`,
    },
    {
      question: `Is my data safe with the ${tool.name} tool?`,
      answer: isClient
        ? `Absolutely. ${tool.name} runs entirely in your browser — your files and text never leave your device and nothing is uploaded to our servers.`
        : `Yes. Files are transferred over an encrypted connection, processed in an isolated worker, and automatically deleted (within 1 hour for guests and 24 hours for registered users). We are GDPR and CCPA aligned.`,
    },
    {
      question: `Do I need to install anything to ${tool.name.toLowerCase()}?`,
      answer: `No installation needed. ${tool.name} works in any modern browser on Windows, macOS, Linux, Android and iOS, and can be installed as a lightweight web app (PWA).`,
    },
    {
      question: `What ${category?.name.toLowerCase() ?? "file"} formats does it support?`,
      answer: tool.description,
    },
  ];
  return faqs;
}

/** Build a concise, keyword-rich long description for meta tags when one isn't set. */
export function getLongDescription(tool: Tool): string {
  return (
    tool.longDescription ??
    `${tool.description} ${tool.name} is a fast, free and secure online tool from ConvertFlow — no sign-up, no watermarks, and ${
      tool.mode === "client" ? "100% private (runs in your browser)" : "with automatic file deletion"
    }.`
  );
}
