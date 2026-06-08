import {
  FileText, FileType2, Files, Scissors, Minimize2, FileOutput, FileInput,
  Image as ImageIcon, RotateCw, Stamp, LockOpen, Lock, Wrench, ScanText,
  PenTool, Pencil, FileStack, ListOrdered, Hash, Type, CaseSensitive, Eraser,
  CopyMinus, Braces, Code2, FileJson, Binary, KeyRound, Fingerprint, QrCode,
  ScanLine, Link2, Unlink2, Palette, Sparkles, Bot, Brain, FileSearch, Table2,
  Columns3, Merge, SplitSquareHorizontal, ArrowLeftRight, Calculator, Clock,
  Shuffle, GitCompareArrows, Globe, Crop, Maximize2, Eye, Wand2,
  Replace, FileSpreadsheet, Presentation, FileImage, Quote, AlignLeft,
  KeySquare, Network, ShieldCheck, Database, Regex, Pipette,
  type LucideIcon,
} from "lucide-react";
import type { Tool, ToolCategory } from "./types";

export const categories: ToolCategory[] = [
  {
    id: "pdf",
    name: "PDF Tools",
    slug: "pdf",
    description: "Merge, split, compress, convert, protect and edit PDF files.",
    accent: "cat-pdf",
    icon: FileText,
  },
  {
    id: "image",
    name: "Image Tools",
    slug: "image",
    description: "Convert, resize, compress, crop and enhance images.",
    accent: "cat-image",
    icon: ImageIcon,
  },
  {
    id: "csv",
    name: "CSV & Spreadsheet",
    slug: "csv",
    description: "Convert and clean CSV, TSV, JSON, XML and spreadsheet data.",
    accent: "cat-csv",
    icon: Table2,
  },
  {
    id: "text",
    name: "Text Tools",
    slug: "text",
    description: "Count, transform, clean and format text content.",
    accent: "cat-text",
    icon: Type,
  },
  {
    id: "developer",
    name: "Developer Tools",
    slug: "developer",
    description: "Encoders, formatters, generators and utilities for developers.",
    accent: "cat-dev",
    icon: Code2,
  },
  {
    id: "ai",
    name: "AI Tools",
    slug: "ai",
    description: "Summarize, extract and generate content with AI.",
    accent: "cat-ai",
    icon: Sparkles,
  },
];

const t = (tool: Tool): Tool => tool;

export const tools: Tool[] = [
  // ─────────────────────────── PDF (server-side) ───────────────────────────
  t({ slug: "merge-pdf", name: "Merge PDF", description: "Combine multiple PDFs into one document in any order.", category: "pdf", icon: Merge, keywords: ["combine", "join", "pdf"], mode: "server", status: "live", featured: true, savable: true }),
  t({ slug: "split-pdf", name: "Split PDF", description: "Separate a PDF into multiple files or extract page ranges.", category: "pdf", icon: SplitSquareHorizontal, keywords: ["divide", "separate"], mode: "server", status: "live", featured: true, savable: true }),
  t({ slug: "compress-pdf", name: "Compress PDF", description: "Reduce PDF file size while preserving quality.", category: "pdf", icon: Minimize2, keywords: ["reduce", "size", "optimize"], mode: "server", status: "live", featured: true, savable: true }),
  t({ slug: "pdf-to-word", name: "PDF to Word", description: "Extract a PDF's text into an editable DOCX file.", category: "pdf", icon: FileType2, keywords: ["docx", "convert"], mode: "client", status: "live", savable: true }),
  t({ slug: "word-to-pdf", name: "Word to PDF", description: "Convert DOC and DOCX files to PDF.", category: "pdf", icon: FileOutput, keywords: ["docx", "convert"], mode: "server", status: "soon", savable: true }),
  t({ slug: "pdf-to-excel", name: "PDF to Excel", description: "Extract tables from PDF into XLSX spreadsheets.", category: "pdf", icon: FileSpreadsheet, keywords: ["xlsx", "table"], mode: "server", status: "soon", savable: true }),
  t({ slug: "excel-to-pdf", name: "Excel to PDF", description: "Convert XLS and XLSX spreadsheets to PDF tables.", category: "pdf", icon: FileOutput, keywords: ["xlsx", "convert"], mode: "client", status: "live", savable: true }),
  t({ slug: "pdf-to-powerpoint", name: "PDF to PowerPoint", description: "Turn PDF slides into editable PPTX presentations.", category: "pdf", icon: Presentation, keywords: ["pptx", "slides"], mode: "server", status: "soon", savable: true }),
  t({ slug: "powerpoint-to-pdf", name: "PowerPoint to PDF", description: "Convert PPT and PPTX presentations to PDF.", category: "pdf", icon: FileOutput, keywords: ["pptx", "slides"], mode: "server", status: "soon", savable: true }),
  t({ slug: "pdf-to-jpg", name: "PDF to JPG", description: "Convert each PDF page into a JPG image.", category: "pdf", icon: FileImage, keywords: ["image", "convert"], mode: "client", status: "live", savable: true }),
  t({ slug: "jpg-to-pdf", name: "JPG to PDF", description: "Combine JPG images into a single PDF.", category: "pdf", icon: FileInput, keywords: ["image", "convert"], mode: "server", status: "live", featured: true, savable: true }),
  t({ slug: "rotate-pdf", name: "Rotate PDF", description: "Rotate all or selected pages of a PDF.", category: "pdf", icon: RotateCw, keywords: ["turn", "orientation"], mode: "server", status: "live", savable: true }),
  t({ slug: "watermark-pdf", name: "Watermark PDF", description: "Add text or image watermarks to a PDF.", category: "pdf", icon: Stamp, keywords: ["brand", "overlay"], mode: "server", status: "live", savable: true }),
  t({ slug: "unlock-pdf", name: "Unlock PDF", description: "Remove password protection from a PDF you own.", category: "pdf", icon: LockOpen, keywords: ["password", "decrypt"], mode: "server", status: "soon", savable: true }),
  t({ slug: "protect-pdf", name: "Protect PDF", description: "Encrypt a PDF with a password.", category: "pdf", icon: Lock, keywords: ["password", "encrypt"], mode: "server", status: "soon", savable: true }),
  t({ slug: "repair-pdf", name: "Repair PDF", description: "Attempt to recover a damaged or corrupt PDF.", category: "pdf", icon: Wrench, keywords: ["fix", "recover"], mode: "client", status: "live", savable: true }),
  t({ slug: "ocr-pdf", name: "OCR PDF", description: "Make scanned PDFs searchable with text recognition.", category: "pdf", icon: ScanText, keywords: ["scan", "recognize"], mode: "server", status: "soon", savable: true }),
  t({ slug: "sign-pdf", name: "Sign PDF", description: "Add your signature image to a PDF document.", category: "pdf", icon: PenTool, keywords: ["signature", "esign"], mode: "client", status: "live", savable: true }),
  t({ slug: "edit-pdf", name: "Edit PDF", description: "Add text, shapes and annotations to a PDF.", category: "pdf", icon: Pencil, keywords: ["annotate", "modify"], mode: "server", status: "soon", savable: true }),
  t({ slug: "extract-pages", name: "Extract Pages", description: "Pull selected pages out of a PDF into a new file.", category: "pdf", icon: FileStack, keywords: ["pages", "select"], mode: "server", status: "live", savable: true }),
  t({ slug: "organize-pages", name: "Organize Pages", description: "Reorder, rotate and delete pages visually.", category: "pdf", icon: Files, keywords: ["reorder", "arrange"], mode: "server", status: "soon", savable: true }),
  t({ slug: "remove-pages", name: "Remove Pages", description: "Delete unwanted pages from a PDF.", category: "pdf", icon: Scissors, keywords: ["delete", "pages"], mode: "server", status: "live", savable: true }),
  t({ slug: "add-page-numbers", name: "Add Page Numbers", description: "Insert page numbers with custom position and style.", category: "pdf", icon: ListOrdered, keywords: ["pagination", "numbers"], mode: "server", status: "live", savable: true }),
  t({ slug: "add-header-footer", name: "Add Header & Footer", description: "Add headers, footers and page numbers to every PDF page.", category: "pdf", icon: AlignLeft, keywords: ["header", "footer"], mode: "client", status: "live", savable: true }),

  // ─────────────────────────── CSV & Spreadsheet ───────────────────────────
  t({ slug: "csv-to-json", name: "CSV to JSON", description: "Convert CSV data into structured JSON.", category: "csv", icon: FileJson, keywords: ["convert", "json"], mode: "client", status: "live", featured: true, savable: true }),
  t({ slug: "json-to-csv", name: "JSON to CSV", description: "Flatten JSON arrays into CSV rows.", category: "csv", icon: Table2, keywords: ["convert", "csv"], mode: "client", status: "live", savable: true }),
  t({ slug: "csv-to-tsv", name: "CSV to TSV", description: "Convert comma-separated values to tab-separated.", category: "csv", icon: ArrowLeftRight, keywords: ["tab", "convert"], mode: "client", status: "live", savable: true }),
  t({ slug: "tsv-to-csv", name: "TSV to CSV", description: "Convert tab-separated values to CSV.", category: "csv", icon: ArrowLeftRight, keywords: ["tab", "convert"], mode: "client", status: "live", savable: true }),
  t({ slug: "csv-cleaner", name: "CSV Cleaner", description: "Trim whitespace, drop empty rows and normalize CSV.", category: "csv", icon: Eraser, keywords: ["clean", "tidy"], mode: "client", status: "live", savable: true }),
  t({ slug: "duplicate-remover", name: "Duplicate Remover", description: "Remove duplicate rows from CSV data.", category: "csv", icon: CopyMinus, keywords: ["dedupe", "unique"], mode: "client", status: "live", savable: true }),
  t({ slug: "csv-to-excel", name: "CSV to Excel", description: "Convert CSV files to XLSX spreadsheets.", category: "csv", icon: FileSpreadsheet, keywords: ["xlsx", "convert"], mode: "client", status: "live", savable: true }),
  t({ slug: "excel-to-csv", name: "Excel to CSV", description: "Convert XLSX spreadsheets to CSV.", category: "csv", icon: Table2, keywords: ["xlsx", "convert"], mode: "client", status: "live", savable: true }),
  t({ slug: "xml-to-csv", name: "XML to CSV", description: "Flatten XML records into CSV rows.", category: "csv", icon: Code2, keywords: ["convert", "xml"], mode: "client", status: "live", savable: true }),
  t({ slug: "column-splitter", name: "Column Splitter", description: "Split one CSV column into multiple by a delimiter.", category: "csv", icon: SplitSquareHorizontal, keywords: ["split", "column"], mode: "client", status: "live", savable: true }),
  t({ slug: "column-merger", name: "Column Merger", description: "Merge multiple CSV columns into one.", category: "csv", icon: Merge, keywords: ["merge", "column"], mode: "client", status: "live", savable: true }),
  t({ slug: "data-formatter", name: "Data Formatter", description: "Trim, tidy and normalize CSV data and headers.", category: "csv", icon: Columns3, keywords: ["format", "normalize"], mode: "client", status: "live", savable: true }),

  // ─────────────────────────── Image ───────────────────────────
  t({ slug: "jpg-to-png", name: "JPG to PNG", description: "Convert JPG images to lossless PNG.", category: "image", icon: ImageIcon, keywords: ["convert", "png"], mode: "client", status: "live", featured: true, savable: true }),
  t({ slug: "png-to-jpg", name: "PNG to JPG", description: "Convert PNG images to compressed JPG.", category: "image", icon: ImageIcon, keywords: ["convert", "jpg"], mode: "client", status: "live", savable: true }),
  t({ slug: "webp-converter", name: "WEBP Converter", description: "Convert images to and from WebP.", category: "image", icon: FileImage, keywords: ["webp", "convert"], mode: "client", status: "live", savable: true }),
  t({ slug: "resize-image", name: "Resize Image", description: "Resize images to exact dimensions or by percentage.", category: "image", icon: Maximize2, keywords: ["scale", "dimensions"], mode: "client", status: "live", featured: true, savable: true }),
  t({ slug: "compress-image", name: "Compress Image", description: "Shrink image file size with adjustable quality.", category: "image", icon: Minimize2, keywords: ["optimize", "reduce"], mode: "client", status: "live", featured: true, savable: true }),
  t({ slug: "crop-image", name: "Crop Image", description: "Crop images to a custom region or aspect ratio.", category: "image", icon: Crop, keywords: ["cut", "trim"], mode: "client", status: "live", savable: true }),
  t({ slug: "rotate-image", name: "Rotate Image", description: "Rotate and flip images.", category: "image", icon: RotateCw, keywords: ["turn", "flip"], mode: "client", status: "live", savable: true }),
  t({ slug: "image-watermark", name: "Image Watermark", description: "Overlay a text watermark on your image.", category: "image", icon: Stamp, keywords: ["brand", "overlay"], mode: "client", status: "live", savable: true }),
  t({ slug: "svg-converter", name: "SVG Converter", description: "Rasterize SVG to PNG at any resolution.", category: "image", icon: FileImage, keywords: ["svg", "png"], mode: "client", status: "live", savable: true }),
  t({ slug: "background-remover", name: "Background Remover", description: "Remove the background from an image automatically.", category: "image", icon: Eraser, keywords: ["transparent", "cutout"], mode: "server", status: "soon", savable: true }),
  t({ slug: "ai-image-enhancement", name: "AI Image Enhancement", description: "Upscale and enhance images with AI.", category: "image", icon: Wand2, keywords: ["upscale", "enhance"], mode: "server", status: "soon", savable: true }),

  // ─────────────────────────── Text ───────────────────────────
  t({ slug: "word-counter", name: "Word Counter", description: "Count words, sentences and reading time instantly.", category: "text", icon: Type, keywords: ["count", "words"], mode: "client", status: "live", featured: true }),
  t({ slug: "character-counter", name: "Character Counter", description: "Count characters with and without spaces.", category: "text", icon: Hash, keywords: ["count", "characters"], mode: "client", status: "live" }),
  t({ slug: "case-converter", name: "Case Converter", description: "Convert text to upper, lower, title, camel and snake case.", category: "text", icon: CaseSensitive, keywords: ["uppercase", "lowercase", "title"], mode: "client", status: "live", featured: true }),
  t({ slug: "text-cleaner", name: "Text Cleaner", description: "Strip extra spaces, line breaks and special characters.", category: "text", icon: Eraser, keywords: ["clean", "trim"], mode: "client", status: "live" }),
  t({ slug: "remove-duplicates", name: "Remove Duplicate Lines", description: "Remove duplicate lines from a block of text.", category: "text", icon: CopyMinus, keywords: ["dedupe", "unique"], mode: "client", status: "live" }),
  t({ slug: "reverse-text", name: "Reverse Text", description: "Reverse characters, words or lines of text.", category: "text", icon: Replace, keywords: ["reverse", "flip"], mode: "client", status: "live" }),
  t({ slug: "lorem-ipsum", name: "Lorem Ipsum Generator", description: "Generate placeholder paragraphs, sentences or words.", category: "text", icon: Quote, keywords: ["placeholder", "dummy"], mode: "client", status: "live" }),
  t({ slug: "slugify", name: "Slug Generator", description: "Turn any text into a clean URL slug.", category: "text", icon: Link2, keywords: ["url", "slug"], mode: "client", status: "live" }),
  t({ slug: "text-diff", name: "Text Diff Checker", description: "Compare two texts and highlight differences.", category: "text", icon: GitCompareArrows, keywords: ["compare", "diff"], mode: "client", status: "live" }),
  t({ slug: "sort-lines", name: "Sort Text Lines", description: "Sort lines alphabetically, numerically or reverse.", category: "text", icon: AlignLeft, keywords: ["sort", "order"], mode: "client", status: "live" }),

  // ─────────────────────────── Developer ───────────────────────────
  t({ slug: "json-formatter", name: "JSON Formatter", description: "Beautify, minify and validate JSON.", category: "developer", icon: Braces, keywords: ["beautify", "validate", "json"], mode: "client", status: "live", featured: true }),
  t({ slug: "xml-formatter", name: "XML Formatter", description: "Beautify and validate XML documents.", category: "developer", icon: Code2, keywords: ["beautify", "xml"], mode: "client", status: "live" }),
  t({ slug: "yaml-converter", name: "YAML ⇄ JSON", description: "Convert between YAML and JSON.", category: "developer", icon: FileJson, keywords: ["yaml", "json", "convert"], mode: "client", status: "live" }),
  t({ slug: "base64-encoder", name: "Base64 Encoder", description: "Encode text or files to Base64.", category: "developer", icon: Binary, keywords: ["encode", "base64"], mode: "client", status: "live", featured: true }),
  t({ slug: "base64-decoder", name: "Base64 Decoder", description: "Decode Base64 back to text.", category: "developer", icon: Binary, keywords: ["decode", "base64"], mode: "client", status: "live" }),
  t({ slug: "jwt-decoder", name: "JWT Decoder", description: "Decode and inspect JWT header and payload.", category: "developer", icon: KeySquare, keywords: ["jwt", "token", "decode"], mode: "client", status: "live", featured: true }),
  t({ slug: "hash-generator", name: "Hash Generator", description: "Generate MD5, SHA-1, SHA-256 and SHA-512 hashes.", category: "developer", icon: Fingerprint, keywords: ["md5", "sha", "hash"], mode: "client", status: "live" }),
  t({ slug: "uuid-generator", name: "UUID Generator", description: "Generate v4 UUIDs in bulk.", category: "developer", icon: KeyRound, keywords: ["uuid", "guid"], mode: "client", status: "live" }),
  t({ slug: "qr-generator", name: "QR Code Generator", description: "Create QR codes for URLs, text and more.", category: "developer", icon: QrCode, keywords: ["qr", "code"], mode: "client", status: "live", featured: true }),
  t({ slug: "qr-scanner", name: "QR Code Scanner", description: "Scan QR codes from your camera or an image.", category: "developer", icon: ScanLine, keywords: ["qr", "scan"], mode: "client", status: "soon" }),
  t({ slug: "url-encoder", name: "URL Encoder", description: "Percent-encode text for safe use in URLs.", category: "developer", icon: Link2, keywords: ["encode", "url"], mode: "client", status: "live" }),
  t({ slug: "url-decoder", name: "URL Decoder", description: "Decode percent-encoded URL strings.", category: "developer", icon: Unlink2, keywords: ["decode", "url"], mode: "client", status: "live" }),
  t({ slug: "html-formatter", name: "HTML Formatter", description: "Beautify and tidy HTML markup.", category: "developer", icon: Code2, keywords: ["beautify", "html"], mode: "client", status: "live" }),
  t({ slug: "css-minifier", name: "CSS Minifier", description: "Minify CSS to reduce file size.", category: "developer", icon: Minimize2, keywords: ["minify", "css"], mode: "client", status: "live" }),
  t({ slug: "js-minifier", name: "JS Minifier", description: "Minify JavaScript safely in the browser.", category: "developer", icon: Minimize2, keywords: ["minify", "javascript"], mode: "client", status: "live" }),
  t({ slug: "sql-formatter", name: "SQL Formatter", description: "Format and beautify SQL queries.", category: "developer", icon: Database, keywords: ["format", "sql"], mode: "client", status: "live" }),
  t({ slug: "regex-tester", name: "Regex Tester", description: "Test regular expressions against sample text.", category: "developer", icon: Regex, keywords: ["regex", "test"], mode: "client", status: "live" }),
  t({ slug: "password-generator", name: "Password Generator", description: "Generate strong, customizable passwords.", category: "developer", icon: KeyRound, keywords: ["password", "secure"], mode: "client", status: "live" }),
  t({ slug: "color-converter", name: "Color Converter", description: "Convert between HEX, RGB and HSL.", category: "developer", icon: Pipette, keywords: ["color", "hex", "rgb"], mode: "client", status: "live" }),
  t({ slug: "gradient-generator", name: "CSS Gradient Generator", description: "Design CSS gradients visually and copy the code.", category: "developer", icon: Palette, keywords: ["gradient", "css"], mode: "client", status: "live" }),
  t({ slug: "timestamp-converter", name: "Unix Timestamp Converter", description: "Convert between Unix timestamps and dates.", category: "developer", icon: Clock, keywords: ["unix", "epoch", "time"], mode: "client", status: "live" }),
  t({ slug: "number-base-converter", name: "Number Base Converter", description: "Convert between binary, octal, decimal and hex.", category: "developer", icon: Calculator, keywords: ["binary", "hex", "convert"], mode: "client", status: "live" }),
  t({ slug: "json-to-xml", name: "JSON to XML", description: "Convert JSON objects into XML.", category: "developer", icon: Code2, keywords: ["json", "xml", "convert"], mode: "client", status: "live" }),
  t({ slug: "xml-to-json", name: "XML to JSON", description: "Convert XML documents into JSON.", category: "developer", icon: FileJson, keywords: ["xml", "json", "convert"], mode: "client", status: "live" }),
  t({ slug: "markdown-to-html", name: "Markdown to HTML", description: "Render Markdown into clean HTML.", category: "developer", icon: FileText, keywords: ["markdown", "html"], mode: "client", status: "live" }),
  t({ slug: "html-to-markdown", name: "HTML to Markdown", description: "Convert HTML markup back into Markdown.", category: "developer", icon: FileText, keywords: ["html", "markdown"], mode: "client", status: "soon" }),
  t({ slug: "text-to-binary", name: "Text ⇄ Binary", description: "Convert text to binary and back.", category: "developer", icon: Binary, keywords: ["binary", "text"], mode: "client", status: "live" }),
  t({ slug: "rot13", name: "ROT13 Cipher", description: "Encode and decode text with the ROT13 cipher.", category: "developer", icon: Shuffle, keywords: ["cipher", "rot13"], mode: "client", status: "live" }),
  t({ slug: "user-agent-parser", name: "User-Agent Parser", description: "Parse a user-agent string into browser and OS details.", category: "developer", icon: Globe, keywords: ["useragent", "browser"], mode: "client", status: "live" }),
  t({ slug: "cron-parser", name: "Cron Expression Helper", description: "Explain cron expressions in plain English.", category: "developer", icon: Clock, keywords: ["cron", "schedule"], mode: "client", status: "soon" }),
  t({ slug: "htaccess-generator", name: ".htpasswd Generator", description: "Generate Apache .htpasswd credentials.", category: "developer", icon: ShieldCheck, keywords: ["htpasswd", "apache"], mode: "client", status: "soon" }),
  t({ slug: "robots-generator", name: "robots.txt Generator", description: "Build a robots.txt for your site.", category: "developer", icon: Network, keywords: ["robots", "seo"], mode: "client", status: "live" }),
  t({ slug: "meta-tag-generator", name: "Meta Tag Generator", description: "Generate SEO and Open Graph meta tags.", category: "developer", icon: Code2, keywords: ["meta", "seo", "og"], mode: "client", status: "live" }),

  // ─────────────────────────── AI ───────────────────────────
  t({ slug: "document-summary", name: "Document Summary", description: "Summarize long documents into key points with AI.", category: "ai", icon: Brain, keywords: ["summary", "ai"], mode: "server", status: "live", featured: true, savable: true }),
  t({ slug: "pdf-summary", name: "PDF Summary", description: "Get an AI summary of any PDF.", category: "ai", icon: FileSearch, keywords: ["summary", "pdf", "ai"], mode: "server", status: "live", savable: true }),
  t({ slug: "ocr-extraction", name: "OCR Text Extraction", description: "Extract text from images and scans with AI.", category: "ai", icon: ScanText, keywords: ["ocr", "extract"], mode: "server", status: "live", savable: true }),
  t({ slug: "content-generator", name: "AI Content Generator", description: "Generate marketing copy, summaries and more.", category: "ai", icon: Bot, keywords: ["generate", "ai", "copy"], mode: "server", status: "live", savable: true }),
  t({ slug: "image-analysis", name: "AI Image Analysis", description: "Describe and analyze image contents with AI.", category: "ai", icon: Eye, keywords: ["vision", "analyze"], mode: "server", status: "live", savable: true }),
];

// ───────────────────────────── helpers ─────────────────────────────

const toolBySlug = new Map<string, Tool>(tools.map((tool) => [tool.slug, tool]));
const categoryById = new Map<string, ToolCategory>(categories.map((c) => [c.id, c]));

export function getTool(slug: string): Tool | undefined {
  return toolBySlug.get(slug);
}

export function getCategory(id: string): ToolCategory | undefined {
  return categoryById.get(id);
}

/** Sort live/active tools first, "coming soon" last, preserving original order within each group. */
export function liveFirst(list: Tool[]): Tool[] {
  return [...list].sort((a, b) => (a.status === b.status ? 0 : a.status === "live" ? -1 : 1));
}

export function getToolsByCategory(id: string): Tool[] {
  return liveFirst(tools.filter((tool) => tool.category === id));
}

export function getFeaturedTools(): Tool[] {
  return tools.filter((tool) => tool.featured);
}

export function getLiveTools(): Tool[] {
  return tools.filter((tool) => tool.status === "live");
}

export function searchTools(query: string): Tool[] {
  const q = query.trim().toLowerCase();
  if (!q) return tools;
  return tools.filter((tool) => {
    const haystack = [tool.name, tool.description, ...tool.keywords].join(" ").toLowerCase();
    return haystack.includes(q);
  });
}

export const TOOL_COUNT = tools.length;
export const LIVE_TOOL_COUNT = tools.filter((tool) => tool.status === "live").length;

export type { LucideIcon };
