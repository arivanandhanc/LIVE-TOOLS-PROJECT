export interface BlogSection {
  heading: string;
  body: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  /** Related tool path, e.g. /tools/pdf/merge-pdf */
  toolHref?: string;
  toolLabel?: string;
  readingMinutes: number;
  updated: string; // ISO date
  sections: BlogSection[];
}

export const posts: BlogPost[] = [
  {
    slug: "how-to-merge-pdf-files-online",
    title: "How to merge PDF files online (free, no watermark)",
    description:
      "Combine multiple PDFs into one document in seconds — securely, with no sign-up and no watermarks.",
    category: "PDF Tools",
    toolHref: "/tools/pdf/merge-pdf",
    toolLabel: "Merge PDF",
    readingMinutes: 3,
    updated: "2026-06-08",
    sections: [
      {
        heading: "Why merge PDFs?",
        body: [
          "Merging PDFs is one of the most common document tasks: combining invoices into a single file, stitching together scanned pages, or assembling a report from several exports. Doing it manually by printing and re-scanning is slow and lossy. A proper merge keeps the text selectable and the quality intact.",
        ],
      },
      {
        heading: "Step-by-step",
        body: [
          "1. Open the Merge PDF tool and drop in two or more PDF files.",
          "2. Drag the files to set the order you want them combined in.",
          "3. Click Merge — the files are processed on our secure backend and combined into one document.",
          "4. Download the result. Files are automatically deleted within an hour for guests, 24 hours for signed-in users.",
        ],
      },
      {
        heading: "Is it private?",
        body: [
          "Your files travel over an encrypted connection, are processed in an isolated worker, and are deleted automatically. We never sell or share uploaded content. For maximum privacy on smaller tasks, many of our other tools run entirely in your browser and never upload anything at all.",
        ],
      },
    ],
  },
  {
    slug: "compress-images-without-losing-quality",
    title: "How to compress images without losing quality",
    description:
      "Shrink JPG, PNG and WebP files for faster websites and smaller uploads — all in your browser.",
    category: "Image Tools",
    toolHref: "/tools/image/compress-image",
    toolLabel: "Compress Image",
    readingMinutes: 4,
    updated: "2026-06-08",
    sections: [
      {
        heading: "Lossy vs lossless",
        body: [
          "Image compression comes in two flavours. Lossless compression removes redundant data without changing a single pixel — great for logos and screenshots. Lossy compression discards detail the human eye barely notices, achieving far smaller files — ideal for photos.",
          "The Compress Image tool lets you pick a quality level so you can trade size against fidelity and preview the result before downloading.",
        ],
      },
      {
        heading: "Practical tips",
        body: [
          "Use WebP for the web — it is typically 25–35% smaller than JPG at the same quality.",
          "Resize before you compress: a 4000px photo displayed at 800px is wasting bandwidth. Use the Resize Image tool first.",
          "For transparency, prefer PNG or WebP; JPG has no alpha channel.",
        ],
      },
      {
        heading: "Runs in your browser",
        body: [
          "This tool processes images entirely on your device using the Canvas API. Nothing is uploaded — your photos never leave your computer, which makes it both private and instant.",
        ],
      },
    ],
  },
  {
    slug: "json-formatting-best-practices",
    title: "JSON formatting best practices for developers",
    description:
      "Validate, beautify and minify JSON the right way — and avoid the most common JSON mistakes.",
    category: "Developer Utilities",
    toolHref: "/tools/developer/json-formatter",
    toolLabel: "JSON Formatter",
    readingMinutes: 4,
    updated: "2026-06-08",
    sections: [
      {
        heading: "Beautify for humans, minify for machines",
        body: [
          "Pretty-printed JSON with two-space indentation is far easier to read and diff in code review. Minified JSON (no whitespace) is what you ship over the wire — smaller payloads, faster parsing. The JSON Formatter does both with a click.",
        ],
      },
      {
        heading: "Common mistakes it catches",
        body: [
          "Trailing commas after the last element — valid in JavaScript objects, invalid in JSON.",
          "Single quotes instead of double quotes around keys and strings.",
          "Unescaped control characters or stray BOM bytes at the start of a file.",
          "The validator points to the exact line and column so you can fix it fast.",
        ],
      },
      {
        heading: "Privacy for sensitive payloads",
        body: [
          "Because the formatter runs entirely in your browser, you can safely paste API responses or config that contain secrets — the data is never sent to a server.",
        ],
      },
    ],
  },
  {
    slug: "ai-document-summary-explained",
    title: "How AI document summaries work (and when to use them)",
    description:
      "Turn long documents and PDFs into clear key points with AI — what it's good at and how to get the best results.",
    category: "AI Tools",
    toolHref: "/tools/ai/document-summary",
    toolLabel: "Document Summary",
    readingMinutes: 4,
    updated: "2026-06-08",
    sections: [
      {
        heading: "What it does",
        body: [
          "The AI Document Summary tool reads text you paste (or a PDF you upload) and produces a short overview plus the key bullet points. It's ideal for skimming reports, research papers, meeting notes, and long email threads before you commit time to reading the whole thing.",
        ],
      },
      {
        heading: "Getting good summaries",
        body: [
          "Give it clean text — strip page headers/footers if you can.",
          "For very long documents, summarize section by section, then summarize the summaries.",
          "Always verify critical facts against the source; AI summaries are a fast first pass, not a substitute for the original on high-stakes material.",
        ],
      },
      {
        heading: "Account and privacy",
        body: [
          "AI tools run on our secure backend and are tied to your account, which is why they need sign-in. Inputs are used only to produce your result and are not used to train models.",
        ],
      },
    ],
  },
  {
    slug: "base64-encode-decode-guide",
    title: "Base64 encoding and decoding: a practical guide",
    description:
      "What Base64 is, when to use it, and how to encode or decode text and files safely in your browser.",
    category: "Developer Utilities",
    toolHref: "/tools/developer/base64-encoder",
    toolLabel: "Base64 Encoder",
    readingMinutes: 3,
    updated: "2026-06-08",
    sections: [
      {
        heading: "What is Base64?",
        body: [
          "Base64 represents binary data using 64 printable ASCII characters. It's how you embed an image in a CSS file, send a small file inside JSON, or put binary data into a URL or email — anywhere a transport only safely handles text.",
        ],
      },
      {
        heading: "When to use it (and when not to)",
        body: [
          "Use Base64 for small assets and data that must ride through text-only channels. Avoid it for large files: Base64 inflates size by roughly 33%, so a 9 MB file becomes ~12 MB.",
        ],
      },
      {
        heading: "Encode and decode instantly",
        body: [
          "The Base64 Encoder and Decoder run in your browser, so even sensitive strings stay on your device. Paste text to encode, or paste Base64 to decode it back to the original.",
        ],
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
