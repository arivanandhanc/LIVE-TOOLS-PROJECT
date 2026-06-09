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
  {
    slug: "how-to-split-a-pdf-online",
    title: "How to split a PDF online (extract or separate pages, free)",
    description:
      "Split a large PDF into separate files or pull out specific page ranges — instantly, in your browser, with no sign-up.",
    category: "PDF Tools",
    toolHref: "/tools/pdf/split-pdf",
    toolLabel: "Split PDF",
    readingMinutes: 3,
    updated: "2026-06-09",
    sections: [
      {
        heading: "When you need to split a PDF",
        body: [
          "Splitting a PDF is essential when you only need a few pages from a long document, want to separate chapters, or need to send one section without exposing the rest. Instead of printing the pages you want and re-scanning them, a clean split keeps text selectable and quality untouched.",
        ],
      },
      {
        heading: "How to split a PDF step by step",
        body: [
          "1. Open the Split PDF tool and drop in your file.",
          "2. Enter the page ranges you want (for example 1-3, 5, 8-10).",
          "3. Run the tool — each range becomes its own PDF.",
          "4. Download your files. Everything happens in your browser, so the document never leaves your device.",
        ],
      },
      {
        heading: "Private and instant",
        body: [
          "Because Split PDF runs entirely on your device, there is no upload, no waiting on a server, and no privacy risk — ideal for contracts, statements, and anything confidential.",
        ],
      },
    ],
  },
  {
    slug: "how-to-compress-a-pdf-online",
    title: "How to compress a PDF online without losing quality",
    description:
      "Reduce PDF file size for email and uploads while keeping it readable — free, private, and in your browser.",
    category: "PDF Tools",
    toolHref: "/tools/pdf/compress-pdf",
    toolLabel: "Compress PDF",
    readingMinutes: 3,
    updated: "2026-06-09",
    sections: [
      {
        heading: "Why PDFs get so large",
        body: [
          "Most oversized PDFs are heavy because of high-resolution images and embedded fonts. Email attachment limits (often 25 MB) and upload forms that cap at 5 or 10 MB make a bloated PDF a real problem. Compressing it solves this in seconds.",
        ],
      },
      {
        heading: "How to compress a PDF",
        body: [
          "1. Open the Compress PDF tool and add your file.",
          "2. Let it optimise images and structure to shrink the size.",
          "3. Download the smaller file — readable, shareable, and still selectable text.",
        ],
      },
      {
        heading: "Your file stays private",
        body: [
          "Compression runs in your browser. The PDF is never uploaded to a server, so even sensitive documents stay completely on your device.",
        ],
      },
    ],
  },
  {
    slug: "convert-pdf-to-jpg-online",
    title: "How to convert a PDF to JPG images (free, high quality)",
    description:
      "Turn each PDF page into a crisp JPG image for slides, previews, or sharing — instantly and privately.",
    category: "PDF Tools",
    toolHref: "/tools/pdf/pdf-to-jpg",
    toolLabel: "PDF to JPG",
    readingMinutes: 3,
    updated: "2026-06-09",
    sections: [
      {
        heading: "Why convert PDF pages to images",
        body: [
          "JPG images drop straight into presentations, social posts, and chat apps where PDFs are awkward. Converting a PDF to JPG also lets you share a single page as a quick visual preview without handing over the whole document.",
        ],
      },
      {
        heading: "How to convert PDF to JPG",
        body: [
          "1. Open the PDF to JPG tool and drop in your PDF.",
          "2. Each page is rendered to a high-quality JPG image.",
          "3. Download the images individually or as a zip.",
        ],
      },
      {
        heading: "No upload, no quality loss",
        body: [
          "Rendering happens in your browser at full resolution, so images stay sharp and your file never leaves your device.",
        ],
      },
    ],
  },
  {
    slug: "convert-jpg-to-pdf-online",
    title: "How to convert JPG to PDF online (combine images into one PDF)",
    description:
      "Merge photos and scans into a single, tidy PDF in the right order — free, no watermark, no sign-up.",
    category: "PDF Tools",
    toolHref: "/tools/pdf/jpg-to-pdf",
    toolLabel: "JPG to PDF",
    readingMinutes: 3,
    updated: "2026-06-09",
    sections: [
      {
        heading: "Turn images into a shareable document",
        body: [
          "Sending five separate photos of a receipt or a signed form looks messy. Combining them into one ordered PDF is cleaner, easier to print, and what most offices and portals expect.",
        ],
      },
      {
        heading: "How to convert JPG to PDF",
        body: [
          "1. Open the JPG to PDF tool and add your images.",
          "2. Drag them into the order you want.",
          "3. Click convert and download a single PDF containing every image.",
        ],
      },
      {
        heading: "Private by design",
        body: [
          "Your images are assembled into a PDF locally in the browser — nothing is uploaded, so personal photos and documents stay private.",
        ],
      },
    ],
  },
  {
    slug: "convert-csv-to-json-online",
    title: "How to convert CSV to JSON online (for developers and analysts)",
    description:
      "Transform spreadsheet CSV data into clean, structured JSON in seconds — entirely in your browser.",
    category: "CSV & Spreadsheet",
    toolHref: "/tools/csv/csv-to-json",
    toolLabel: "CSV to JSON",
    readingMinutes: 3,
    updated: "2026-06-09",
    sections: [
      {
        heading: "Why convert CSV to JSON",
        body: [
          "CSV is great for spreadsheets but awkward for code. JSON is the language of APIs and modern apps. Converting CSV to JSON lets you feed exported data straight into a frontend, a database seed, or a test fixture without hand-editing.",
        ],
      },
      {
        heading: "How to convert CSV to JSON",
        body: [
          "1. Open the CSV to JSON tool and paste or upload your CSV.",
          "2. The first row is treated as the keys; each following row becomes an object.",
          "3. Copy or download the structured JSON output.",
        ],
      },
      {
        heading: "Safe for sensitive data",
        body: [
          "The conversion runs in your browser, so customer lists or internal exports never touch a server.",
        ],
      },
    ],
  },
  {
    slug: "convert-png-to-jpg-online",
    title: "How to convert PNG to JPG online (smaller files, free)",
    description:
      "Convert PNG images to compressed JPG for smaller files and easier sharing — instant and private.",
    category: "Image Tools",
    toolHref: "/tools/image/png-to-jpg",
    toolLabel: "PNG to JPG",
    readingMinutes: 3,
    updated: "2026-06-09",
    sections: [
      {
        heading: "PNG vs JPG",
        body: [
          "PNG is lossless and supports transparency, which makes it perfect for logos and screenshots but heavy for photos. JPG uses lossy compression to produce much smaller files for photographic images. Converting PNG to JPG is the quickest way to cut file size when you do not need transparency.",
        ],
      },
      {
        heading: "How to convert PNG to JPG",
        body: [
          "1. Open the PNG to JPG tool and drop in your PNG.",
          "2. Choose a quality level to balance size against detail.",
          "3. Click convert, then download your JPG.",
        ],
      },
      {
        heading: "Runs entirely in your browser",
        body: [
          "The conversion uses the Canvas API on your own device. Nothing is uploaded, so it is both instant and completely private.",
        ],
      },
    ],
  },
  {
    slug: "best-free-online-pdf-tools-no-upload",
    title: "The best free online PDF tools that don't upload your files",
    description:
      "A privacy-first toolbox for merging, splitting, compressing and converting PDFs — all running in your browser, free and without sign-up.",
    category: "PDF Tools",
    toolHref: "/tools/pdf",
    toolLabel: "All PDF tools",
    readingMinutes: 5,
    updated: "2026-06-09",
    sections: [
      {
        heading: "Why 'no upload' matters",
        body: [
          "Most popular PDF sites upload your file to their servers to process it. For invoices, contracts, IDs, and medical records, that means handing a copy of sensitive data to a third party. Browser-based tools process the file on your own device, so the document never leaves your computer — the strongest privacy guarantee there is.",
        ],
      },
      {
        heading: "Everything you can do in the browser",
        body: [
          "Merge PDF — combine multiple files into one, in any order.",
          "Split PDF — extract pages or separate a document into parts.",
          "Compress PDF — shrink file size for email and upload limits.",
          "Rotate, add page numbers, watermark, extract and remove pages.",
          "Convert PDF to JPG, and JPG to PDF — without sending anything to a server.",
        ],
      },
      {
        heading: "Free, with no catches",
        body: [
          "Every tool is completely free: no watermarks, no file-size paywall, and no sign-up required. You can create a free account if you want your history and favorites saved, but you never have to.",
        ],
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
