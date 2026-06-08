import Anthropic from "@anthropic-ai/sdk";
import { env } from "../config/env";
import { HttpError } from "../middleware/error";

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!env.anthropic.apiKey) {
    throw new HttpError(501, "AI tools aren't configured yet. Set ANTHROPIC_API_KEY on the server to enable them.");
  }
  if (!client) client = new Anthropic({ apiKey: env.anthropic.apiKey });
  return client;
}

export function aiEnabled(): boolean {
  return Boolean(env.anthropic.apiKey);
}

const MODEL = env.anthropic.model;
const MAX_TOKENS = 4000;

function textBlocks(message: Anthropic.Message): string {
  return message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}

type ImageMedia = "image/jpeg" | "image/png" | "image/webp" | "image/gif";

/** Summarize a block of text into key points. */
export async function documentSummary(text: string): Promise<string> {
  const msg = await getClient().messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system:
      "You are a precise summarizer. Produce a concise summary followed by 3-7 key bullet points. Use plain text, no preamble.",
    messages: [{ role: "user", content: `Summarize the following:\n\n${text}` }],
  });
  return textBlocks(msg);
}

/** Generate content from an instruction/prompt. */
export async function generateContent(prompt: string): Promise<string> {
  const msg = await getClient().messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system:
      "You are a helpful writing assistant. Write clear, well-structured content for the user's request. Respond with the content only, no preamble.",
    messages: [{ role: "user", content: prompt }],
  });
  return textBlocks(msg);
}

/** Describe / analyze an image. */
export async function analyzeImage(base64: string, mediaType: ImageMedia, question?: string): Promise<string> {
  const msg = await getClient().messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
          { type: "text", text: question?.trim() || "Describe this image in detail. Note any text, objects, people, and notable context." },
        ],
      },
    ],
  });
  return textBlocks(msg);
}

/** Extract text from an image (OCR). */
export async function ocrImage(base64: string, mediaType: ImageMedia): Promise<string> {
  const msg = await getClient().messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system:
      "You are an OCR engine. Transcribe ALL text visible in the image exactly, preserving line breaks and layout where reasonable. Output only the extracted text, nothing else.",
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
          { type: "text", text: "Extract all text from this image." },
        ],
      },
    ],
  });
  return textBlocks(msg);
}

/** Summarize a PDF document. */
export async function pdfSummary(base64: string): Promise<string> {
  const msg = await getClient().messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system:
      "You are a precise document analyst. Summarize the PDF with a short overview followed by key points. Plain text, no preamble.",
    messages: [
      {
        role: "user",
        content: [
          { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } },
          { type: "text", text: "Summarize this document." },
        ],
      },
    ],
  });
  return textBlocks(msg);
}

export function imageMediaTypeFrom(mime: string): ImageMedia {
  switch (mime) {
    case "image/jpeg":
    case "image/jpg":
      return "image/jpeg";
    case "image/png":
      return "image/png";
    case "image/webp":
      return "image/webp";
    case "image/gif":
      return "image/gif";
    default:
      throw new HttpError(415, `Unsupported image type: ${mime}`);
  }
}
