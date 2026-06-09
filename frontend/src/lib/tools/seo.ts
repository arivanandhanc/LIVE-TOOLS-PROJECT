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

/**
 * A unique, keyword-rich intro paragraph for the top of each tool page. Varies by
 * category and processing mode so no two pages read the same — this is the primary
 * block of original, indexable prose Google uses to rank the page.
 */
export function getIntro(tool: Tool): string {
  const category = getCategory(tool.category)?.name.toLowerCase() ?? "file";
  const name = tool.name;
  const kw = tool.keywords?.[0] ?? name.toLowerCase();
  const privacy =
    tool.mode === "client"
      ? `Because ${name} runs entirely inside your browser, your files are never uploaded to a server — the whole process happens on your own device, so it stays completely private and works even on slow connections.`
      : `${name} processes your file on our secure, isolated backend over an encrypted connection and deletes it automatically afterwards, so nothing lingers on our servers.`;
  return `${tool.description} Whether you need to ${kw} a single file or handle them in bulk, this free online ${category} tool gives you a fast, no-nonsense result with no sign-up, no watermark and no software to install. ${privacy}`;
}

/**
 * Concrete, scannable benefits for each tool. Mixed generic + category/mode-specific
 * so the bullet sets differ across pages rather than reading as boilerplate.
 */
export function getBenefits(tool: Tool): string[] {
  const category = getCategory(tool.category)?.name.toLowerCase() ?? "file";
  const benefits = [
    `100% free — no subscription, no credit card and no hidden limits.`,
    `No account required; sign in only if you want to save your history and favorites.`,
    tool.mode === "client"
      ? `Fully private — files are processed locally in your browser and never leave your device.`
      : `Secure processing with automatic file deletion (1 hour for guests, 24 hours for members).`,
    `Works in any modern browser on desktop and mobile — installable as a fast PWA.`,
    `Clean output with no watermarks added to your ${category} files.`,
  ];
  return benefits;
}

/** Generate a tool-specific FAQ block used for FAQPage structured data + on-page content. */
export function getFaqs(tool: Tool): FaqItem[] {
  const category = getCategory(tool.category);
  const categoryName = category?.name.toLowerCase() ?? "file";
  const isClient = tool.mode === "client";
  const name = tool.name;
  const lower = name.toLowerCase();

  const faqs: FaqItem[] = [
    {
      question: `Is the ${name} tool free to use?`,
      answer: `Yes. ${name} is completely free with no watermarks, no sign-up requirement, and no file-size paywall. Create a free account only if you want your history and favorites saved.`,
    },
    {
      question: `Is my data safe with the ${name} tool?`,
      answer: isClient
        ? `Absolutely. ${name} runs entirely in your browser — your files and text never leave your device and nothing is uploaded to our servers.`
        : `Yes. Files are transferred over an encrypted connection, processed in an isolated worker, and automatically deleted (within 1 hour for guests and 24 hours for registered users). We are GDPR and CCPA aligned.`,
    },
    {
      question: `How do I ${lower} online?`,
      answer: isClient
        ? `Open this page, drop or paste your content into the ${name} tool, choose your options, and the result is generated instantly in your browser — then download or copy it. No installation or upload needed.`
        : `Upload your file to the ${name} tool, pick your options, and we process it on our secure servers within seconds. Download the finished file straight away — no installation needed.`,
    },
    {
      question: `Is there a file size or usage limit?`,
      answer: isClient
        ? `There is no per-file paywall. Because ${name} runs on your own device, the practical limit is your browser's available memory rather than an artificial cap — most everyday ${categoryName} files process instantly.`
        : `Guests can process generously sized files for free. Registered users get higher limits and longer file retention. There are no daily usage caps for normal use.`,
    },
    {
      question: `Do I need to install anything to ${lower}?`,
      answer: `No installation needed. ${name} works in any modern browser on Windows, macOS, Linux, Android and iOS, and can be installed as a lightweight web app (PWA) for one-tap access.`,
    },
    {
      question: `Does ${name} work on mobile?`,
      answer: `Yes. The tool is fully responsive and works on phones and tablets exactly as it does on desktop, so you can ${lower} on the go.`,
    },
  ];
  return faqs;
}

/** Build a concise, keyword-rich long description for meta tags when one isn't set. */
export function getLongDescription(tool: Tool): string {
  return (
    tool.longDescription ??
    `${tool.description} ${tool.name} is a fast, free and secure online tool from Arivu's Scrab Tools — no sign-up, no watermarks, and ${
      tool.mode === "client" ? "100% private (runs in your browser)" : "with automatic file deletion"
    }.`
  );
}
