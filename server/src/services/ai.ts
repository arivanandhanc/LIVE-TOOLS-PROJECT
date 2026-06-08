import { env } from "../config/env";
import { logger } from "../config/logger";
import { HttpError } from "../middleware/error";

/**
 * Provider-agnostic AI helper.
 * Priority for text: Groq → Hugging Face → Anthropic.
 * Priority for vision: Groq (vision model) → Anthropic.
 * Activates whenever any provider key is configured.
 */

export function aiEnabled(): boolean {
  return Boolean(env.ai.groqKey || env.ai.hfKey || env.ai.anthropicKey);
}

type ImageMedia = "image/jpeg" | "image/png" | "image/webp" | "image/gif";
const MAX_TOKENS = 2000;

// ─────────────────────────── Groq (OpenAI-compatible) ───────────────────────────

async function groqText(system: string, user: string): Promise<string | null> {
  if (!env.ai.groqKey) return null;
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.ai.groqKey}` },
      body: JSON.stringify({
        model: env.ai.groqModel,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        max_tokens: MAX_TOKENS,
        temperature: 0.4,
      }),
    });
    if (!res.ok) {
      logger.warn({ status: res.status }, "Groq text request failed");
      return null;
    }
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (err) {
    logger.warn({ err }, "Groq text request error");
    return null;
  }
}

async function groqVision(system: string, base64: string, mediaType: ImageMedia, prompt: string): Promise<string | null> {
  if (!env.ai.groqKey) return null;
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.ai.groqKey}` },
      body: JSON.stringify({
        model: env.ai.groqVisionModel,
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: `data:${mediaType};base64,${base64}` } },
            ],
          },
        ],
        max_tokens: MAX_TOKENS,
        temperature: 0.3,
      }),
    });
    if (!res.ok) {
      logger.warn({ status: res.status }, "Groq vision request failed");
      return null;
    }
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (err) {
    logger.warn({ err }, "Groq vision request error");
    return null;
  }
}

// ─────────────────────────── Hugging Face (text fallback) ───────────────────────────

async function hfText(system: string, user: string): Promise<string | null> {
  if (!env.ai.hfKey) return null;
  try {
    const res = await fetch(`https://api-inference.huggingface.co/models/${env.ai.hfModel}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.ai.hfKey}` },
      body: JSON.stringify({
        inputs: `<s>[INST] ${system}\n\n${user} [/INST]`,
        parameters: { max_new_tokens: 1000, return_full_text: false, temperature: 0.4 },
      }),
    });
    if (!res.ok) {
      logger.warn({ status: res.status }, "Hugging Face request failed");
      return null;
    }
    const data = (await res.json()) as Array<{ generated_text?: string }> | { generated_text?: string };
    const text = Array.isArray(data) ? data[0]?.generated_text : data.generated_text;
    return text?.trim() || null;
  } catch (err) {
    logger.warn({ err }, "Hugging Face request error");
    return null;
  }
}

// ─────────────────────────── Anthropic (optional fallback) ───────────────────────────

async function anthropicText(system: string, user: string): Promise<string | null> {
  if (!env.ai.anthropicKey) return null;
  try {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey: env.ai.anthropicKey });
    const msg = await client.messages.create({
      model: env.ai.anthropicModel,
      max_tokens: MAX_TOKENS,
      system,
      messages: [{ role: "user", content: user }],
    });
    return msg.content.map((b) => (b.type === "text" ? b.text : "")).join("\n").trim() || null;
  } catch (err) {
    logger.warn({ err }, "Anthropic request error");
    return null;
  }
}

async function anthropicVision(system: string, base64: string, mediaType: ImageMedia, prompt: string): Promise<string | null> {
  if (!env.ai.anthropicKey) return null;
  try {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey: env.ai.anthropicKey });
    const msg = await client.messages.create({
      model: env.ai.anthropicModel,
      max_tokens: MAX_TOKENS,
      system,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
            { type: "text", text: prompt },
          ],
        },
      ],
    });
    return msg.content.map((b) => (b.type === "text" ? b.text : "")).join("\n").trim() || null;
  } catch (err) {
    logger.warn({ err }, "Anthropic vision error");
    return null;
  }
}

// ─────────────────────────── Orchestration ───────────────────────────

async function completeText(system: string, user: string): Promise<string> {
  const out = (await groqText(system, user)) ?? (await hfText(system, user)) ?? (await anthropicText(system, user));
  if (!out) throw new HttpError(502, "The AI service is busy or unavailable right now. Please try again.");
  return out;
}

async function completeVision(system: string, base64: string, mediaType: ImageMedia, prompt: string): Promise<string> {
  const out = (await groqVision(system, base64, mediaType, prompt)) ?? (await anthropicVision(system, base64, mediaType, prompt));
  if (!out) throw new HttpError(502, "AI image analysis isn't available right now. A vision-capable model must be configured.");
  return out;
}

// ─────────────────────────── Public tool functions ───────────────────────────

export async function documentSummary(text: string): Promise<string> {
  return completeText(
    "You are a precise summarizer. Produce a concise summary followed by 3-7 key bullet points. Plain text, no preamble.",
    `Summarize the following:\n\n${text}`
  );
}

export async function generateContent(prompt: string): Promise<string> {
  return completeText(
    "You are a helpful writing assistant. Write clear, well-structured content for the user's request. Respond with the content only, no preamble.",
    prompt
  );
}

/** PDF text is extracted client-side and passed here as plain text. */
export async function pdfSummary(text: string): Promise<string> {
  return completeText(
    "You are a precise document analyst. Summarize the document with a short overview followed by key points. Plain text, no preamble.",
    `Summarize this document:\n\n${text}`
  );
}

export async function analyzeImage(base64: string, mediaType: ImageMedia, question?: string): Promise<string> {
  return completeVision(
    "You are a helpful vision assistant.",
    base64,
    mediaType,
    question?.trim() || "Describe this image in detail. Note any text, objects, people, and notable context."
  );
}

export async function ocrImage(base64: string, mediaType: ImageMedia): Promise<string> {
  return completeVision(
    "You are an OCR engine. Transcribe ALL text visible in the image exactly, preserving line breaks where reasonable. Output only the extracted text.",
    base64,
    mediaType,
    "Extract all text from this image."
  );
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
