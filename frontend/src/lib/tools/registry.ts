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
  AtSign, FlipVertical2, Radio, Repeat, Percent,
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
    id: "convert",
    name: "Converters & Calculators",
    slug: "convert",
    description: "Convert units and run everyday calculators instantly.",
    accent: "cat-convert",
    icon: Calculator,
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
  t({ slug: "merge-pdf", name: "Merge PDF", description: "Combine multiple PDFs into one document in any order.", category: "pdf", icon: Merge, keywords: ["combine", "join", "pdf"], mode: "client", status: "live", featured: true, savable: true }),
  t({ slug: "split-pdf", name: "Split PDF", description: "Separate a PDF into multiple files or extract page ranges.", category: "pdf", icon: SplitSquareHorizontal, keywords: ["divide", "separate"], mode: "client", status: "live", featured: true, savable: true }),
  t({ slug: "compress-pdf", name: "Compress PDF", description: "Reduce PDF file size while preserving quality.", category: "pdf", icon: Minimize2, keywords: ["reduce", "size", "optimize"], mode: "client", status: "live", featured: true, savable: true }),
  t({ slug: "pdf-to-word", name: "PDF to Word", description: "Extract a PDF's text into an editable DOCX file.", category: "pdf", icon: FileType2, keywords: ["docx", "convert"], mode: "client", status: "live", savable: true }),
  t({ slug: "excel-to-pdf", name: "Excel to PDF", description: "Convert XLS and XLSX spreadsheets to PDF tables.", category: "pdf", icon: FileOutput, keywords: ["xlsx", "convert"], mode: "client", status: "live", savable: true }),
  t({ slug: "pdf-to-jpg", name: "PDF to JPG", description: "Convert each PDF page into a JPG image.", category: "pdf", icon: FileImage, keywords: ["image", "convert"], mode: "client", status: "live", savable: true }),
  t({ slug: "jpg-to-pdf", name: "JPG to PDF", description: "Combine JPG images into a single PDF.", category: "pdf", icon: FileInput, keywords: ["image", "convert"], mode: "client", status: "live", featured: true, savable: true }),
  t({ slug: "rotate-pdf", name: "Rotate PDF", description: "Rotate all or selected pages of a PDF.", category: "pdf", icon: RotateCw, keywords: ["turn", "orientation"], mode: "client", status: "live", savable: true }),
  t({ slug: "watermark-pdf", name: "Watermark PDF", description: "Add text or image watermarks to a PDF.", category: "pdf", icon: Stamp, keywords: ["brand", "overlay"], mode: "client", status: "live", savable: true }),
  t({ slug: "repair-pdf", name: "Repair PDF", description: "Attempt to recover a damaged or corrupt PDF.", category: "pdf", icon: Wrench, keywords: ["fix", "recover"], mode: "client", status: "live", savable: true }),
  t({ slug: "ocr-pdf", name: "OCR PDF", description: "Extract text from scanned PDFs with AI text recognition.", category: "pdf", icon: ScanText, keywords: ["scan", "recognize"], mode: "client", status: "live", savable: true }),
  t({ slug: "sign-pdf", name: "Sign PDF", description: "Add your signature image to a PDF document.", category: "pdf", icon: PenTool, keywords: ["signature", "esign"], mode: "client", status: "live", savable: true }),
  t({ slug: "extract-pages", name: "Extract Pages", description: "Pull selected pages out of a PDF into a new file.", category: "pdf", icon: FileStack, keywords: ["pages", "select"], mode: "client", status: "live", savable: true }),
  t({ slug: "organize-pages", name: "Organize Pages", description: "Reorder, rotate and delete pages visually.", category: "pdf", icon: Files, keywords: ["reorder", "arrange"], mode: "client", status: "live", savable: true }),
  t({ slug: "remove-pages", name: "Remove Pages", description: "Delete unwanted pages from a PDF.", category: "pdf", icon: Scissors, keywords: ["delete", "pages"], mode: "client", status: "live", savable: true }),
  t({ slug: "add-page-numbers", name: "Add Page Numbers", description: "Insert page numbers with custom position and style.", category: "pdf", icon: ListOrdered, keywords: ["pagination", "numbers"], mode: "client", status: "live", savable: true }),
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
  t({ slug: "csv-to-markdown", name: "CSV to Markdown Table", description: "Convert CSV data into a Markdown table.", category: "csv", icon: Table2, keywords: ["markdown", "table", "convert"], mode: "client", status: "live", savable: true }),
  t({ slug: "csv-to-html", name: "CSV to HTML Table", description: "Convert CSV data into a clean HTML table.", category: "csv", icon: Code2, keywords: ["html", "table", "convert"], mode: "client", status: "live", savable: true }),
  t({ slug: "tsv-to-json", name: "TSV to JSON", description: "Convert tab-separated values into JSON.", category: "csv", icon: FileJson, keywords: ["tsv", "json", "convert"], mode: "client", status: "live", savable: true }),

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
  t({ slug: "remove-line-breaks", name: "Remove Line Breaks", description: "Strip line breaks and join text into one clean line.", category: "text", icon: AlignLeft, keywords: ["line breaks", "join", "newlines"], mode: "client", status: "live" }),
  t({ slug: "add-line-numbers", name: "Add Line Numbers", description: "Prefix every line of text with a sequential number.", category: "text", icon: ListOrdered, keywords: ["numbering", "lines"], mode: "client", status: "live" }),
  t({ slug: "remove-empty-lines", name: "Remove Empty Lines", description: "Delete blank and whitespace-only lines from text.", category: "text", icon: Eraser, keywords: ["blank", "empty", "lines"], mode: "client", status: "live" }),
  t({ slug: "extract-emails", name: "Extract Emails", description: "Pull all unique email addresses out of any text.", category: "text", icon: AtSign, keywords: ["email", "extract", "scrape"], mode: "client", status: "live" }),
  t({ slug: "extract-urls", name: "Extract URLs", description: "Find and list every unique link in a block of text.", category: "text", icon: Link2, keywords: ["url", "links", "extract"], mode: "client", status: "live" }),
  t({ slug: "upside-down-text", name: "Upside Down Text", description: "Flip text into upside-down unicode characters.", category: "text", icon: FlipVertical2, keywords: ["flip", "upside down", "unicode"], mode: "client", status: "live" }),
  t({ slug: "morse-code", name: "Morse Code Translator", description: "Convert text to Morse code and back.", category: "text", icon: Radio, keywords: ["morse", "translate", "cipher"], mode: "client", status: "live" }),
  t({ slug: "remove-extra-spaces", name: "Remove Extra Spaces", description: "Collapse repeated spaces, tabs and blank lines.", category: "text", icon: Eraser, keywords: ["whitespace", "spaces", "trim"], mode: "client", status: "live" }),
  t({ slug: "word-frequency-counter", name: "Word Frequency Counter", description: "Count how often each word appears in your text.", category: "text", icon: Hash, keywords: ["frequency", "count", "words"], mode: "client", status: "live" }),
  t({ slug: "remove-punctuation", name: "Remove Punctuation", description: "Strip punctuation and symbols from text.", category: "text", icon: Eraser, keywords: ["punctuation", "symbols", "clean"], mode: "client", status: "live" }),
  t({ slug: "extract-numbers", name: "Extract Numbers", description: "Pull every number out of a block of text.", category: "text", icon: Calculator, keywords: ["numbers", "digits", "extract"], mode: "client", status: "live" }),
  t({ slug: "remove-html-tags", name: "Remove HTML Tags", description: "Strip HTML markup and leave only plain text.", category: "text", icon: Code2, keywords: ["html", "strip", "plain text"], mode: "client", status: "live" }),
  t({ slug: "nato-phonetic", name: "NATO Phonetic Speller", description: "Spell text using the NATO phonetic alphabet.", category: "text", icon: Radio, keywords: ["nato", "phonetic", "alphabet"], mode: "client", status: "live" }),
  t({ slug: "leetspeak", name: "Leetspeak Converter", description: "Turn ordinary text into 1337 5p34k.", category: "text", icon: Shuffle, keywords: ["leet", "1337", "gamer"], mode: "client", status: "live" }),
  t({ slug: "reverse-words", name: "Reverse Word Order", description: "Reverse the order of words in each line.", category: "text", icon: Replace, keywords: ["reverse", "words", "order"], mode: "client", status: "live" }),
  t({ slug: "shuffle-lines", name: "Shuffle Lines", description: "Randomly reorder the lines of your text.", category: "text", icon: Shuffle, keywords: ["shuffle", "randomize", "lines"], mode: "client", status: "live" }),
  t({ slug: "remove-accents", name: "Remove Accents", description: "Convert accented letters to plain ASCII.", category: "text", icon: Eraser, keywords: ["accents", "diacritics", "ascii"], mode: "client", status: "live" }),
  t({ slug: "remove-line-numbers", name: "Remove Line Numbers", description: "Strip leading numbering from each line.", category: "text", icon: ListOrdered, keywords: ["line numbers", "strip", "clean"], mode: "client", status: "live" }),
  t({ slug: "text-repeater", name: "Text Repeater", description: "Repeat any text a set number of times.", category: "text", icon: Repeat, keywords: ["repeat", "duplicate", "multiply"], mode: "client", status: "live" }),
  t({ slug: "find-and-replace", name: "Find and Replace", description: "Find and replace text with regex and case options.", category: "text", icon: Replace, keywords: ["find", "replace", "regex"], mode: "client", status: "live" }),

  // ─────────────────────────── Developer ───────────────────────────
  t({ slug: "json-formatter", name: "JSON Formatter", description: "Beautify, minify and validate JSON.", category: "developer", icon: Braces, keywords: ["beautify", "validate", "json"], mode: "client", status: "live", featured: true }),
  t({ slug: "json-minifier", name: "JSON Minifier", description: "Compress JSON to a single line, or beautify it back.", category: "developer", icon: Minimize2, keywords: ["minify", "compress", "json"], mode: "client", status: "live" }),
  t({ slug: "html-entity-encoder", name: "HTML Entity Encoder", description: "Escape special characters into safe HTML entities.", category: "developer", icon: Code2, keywords: ["html", "entities", "escape"], mode: "client", status: "live" }),
  t({ slug: "html-entity-decoder", name: "HTML Entity Decoder", description: "Convert HTML entities back into plain characters.", category: "developer", icon: Code2, keywords: ["html", "entities", "unescape"], mode: "client", status: "live" }),
  t({ slug: "string-escape", name: "String Escape / Unescape", description: "Escape or unescape strings for JSON and code.", category: "developer", icon: Code2, keywords: ["escape", "json", "string"], mode: "client", status: "live" }),
  t({ slug: "text-to-hex", name: "Text to Hex", description: "Convert text to hexadecimal bytes and back.", category: "developer", icon: Binary, keywords: ["hex", "hexadecimal", "encode"], mode: "client", status: "live" }),
  t({ slug: "query-string-parser", name: "Query String Parser", description: "Parse a URL query string into readable JSON.", category: "developer", icon: Link2, keywords: ["query", "url", "params"], mode: "client", status: "live" }),
  t({ slug: "json-to-query-string", name: "JSON to Query String", description: "Turn a JSON object into a URL query string.", category: "developer", icon: Link2, keywords: ["json", "query", "url"], mode: "client", status: "live" }),
  t({ slug: "xml-minifier", name: "XML Minifier", description: "Compress XML by removing whitespace and comments.", category: "developer", icon: Minimize2, keywords: ["minify", "xml", "compress"], mode: "client", status: "live" }),
  t({ slug: "unicode-escape", name: "Unicode Escape / Unescape", description: "Convert non-ASCII characters to \\uXXXX and back.", category: "developer", icon: Binary, keywords: ["unicode", "escape", "encode"], mode: "client", status: "live" }),
  t({ slug: "xml-formatter", name: "XML Formatter", description: "Beautify and validate XML documents.", category: "developer", icon: Code2, keywords: ["beautify", "xml"], mode: "client", status: "live" }),
  t({ slug: "yaml-converter", name: "YAML ⇄ JSON", description: "Convert between YAML and JSON.", category: "developer", icon: FileJson, keywords: ["yaml", "json", "convert"], mode: "client", status: "live" }),
  t({ slug: "base64-encoder", name: "Base64 Encoder", description: "Encode text or files to Base64.", category: "developer", icon: Binary, keywords: ["encode", "base64"], mode: "client", status: "live", featured: true }),
  t({ slug: "base64-decoder", name: "Base64 Decoder", description: "Decode Base64 back to text.", category: "developer", icon: Binary, keywords: ["decode", "base64"], mode: "client", status: "live" }),
  t({ slug: "jwt-decoder", name: "JWT Decoder", description: "Decode and inspect JWT header and payload.", category: "developer", icon: KeySquare, keywords: ["jwt", "token", "decode"], mode: "client", status: "live", featured: true }),
  t({ slug: "hash-generator", name: "Hash Generator", description: "Generate MD5, SHA-1, SHA-256 and SHA-512 hashes.", category: "developer", icon: Fingerprint, keywords: ["md5", "sha", "hash"], mode: "client", status: "live" }),
  t({ slug: "uuid-generator", name: "UUID Generator", description: "Generate v4 UUIDs in bulk.", category: "developer", icon: KeyRound, keywords: ["uuid", "guid"], mode: "client", status: "live" }),
  t({ slug: "qr-generator", name: "QR Code Generator", description: "Create QR codes for URLs, text and more.", category: "developer", icon: QrCode, keywords: ["qr", "code"], mode: "client", status: "live", featured: true }),
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
  t({ slug: "html-to-markdown", name: "HTML to Markdown", description: "Convert HTML markup back into Markdown.", category: "developer", icon: FileText, keywords: ["html", "markdown"], mode: "client", status: "live" }),
  t({ slug: "text-to-binary", name: "Text ⇄ Binary", description: "Convert text to binary and back.", category: "developer", icon: Binary, keywords: ["binary", "text"], mode: "client", status: "live" }),
  t({ slug: "rot13", name: "ROT13 Cipher", description: "Encode and decode text with the ROT13 cipher.", category: "developer", icon: Shuffle, keywords: ["cipher", "rot13"], mode: "client", status: "live" }),
  t({ slug: "user-agent-parser", name: "User-Agent Parser", description: "Parse a user-agent string into browser and OS details.", category: "developer", icon: Globe, keywords: ["useragent", "browser"], mode: "client", status: "live" }),
  t({ slug: "cron-parser", name: "Cron Expression Helper", description: "Explain cron expressions in plain English.", category: "developer", icon: Clock, keywords: ["cron", "schedule"], mode: "client", status: "live" }),
  t({ slug: "htaccess-generator", name: ".htpasswd Generator", description: "Generate Apache .htpasswd credentials.", category: "developer", icon: ShieldCheck, keywords: ["htpasswd", "apache"], mode: "client", status: "live" }),
  t({ slug: "robots-generator", name: "robots.txt Generator", description: "Build a robots.txt for your site.", category: "developer", icon: Network, keywords: ["robots", "seo"], mode: "client", status: "live" }),
  t({ slug: "meta-tag-generator", name: "Meta Tag Generator", description: "Generate SEO and Open Graph meta tags.", category: "developer", icon: Code2, keywords: ["meta", "seo", "og"], mode: "client", status: "live" }),

  // ─────────────────────────── Converters & Calculators ───────────────────────────
  t({ slug: "percentage-calculator", name: "Percentage Calculator", description: "Work out percentages, ratios and percent change.", category: "convert", icon: Percent, keywords: ["percent", "percentage", "calculator"], mode: "client", status: "live", featured: true }),
  t({ slug: "bmi-calculator", name: "BMI Calculator", description: "Calculate body mass index in metric or imperial units.", category: "convert", icon: Calculator, keywords: ["bmi", "health", "weight"], mode: "client", status: "live" }),
  t({ slug: "age-calculator", name: "Age Calculator", description: "Find your exact age in years, months and days.", category: "convert", icon: Clock, keywords: ["age", "birthday", "date"], mode: "client", status: "live" }),
  t({ slug: "tip-calculator", name: "Tip Calculator", description: "Split the bill and work out the tip per person.", category: "convert", icon: Calculator, keywords: ["tip", "bill", "split"], mode: "client", status: "live" }),
  t({ slug: "discount-calculator", name: "Discount Calculator", description: "See how much you save and the final sale price.", category: "convert", icon: Percent, keywords: ["discount", "sale", "price"], mode: "client", status: "live" }),
  t({ slug: "roman-numeral-converter", name: "Roman Numeral Converter", description: "Convert numbers to Roman numerals and back.", category: "convert", icon: Hash, keywords: ["roman", "numeral", "convert"], mode: "client", status: "live" }),
  t({ slug: "number-to-words", name: "Number to Words", description: "Spell any whole number out in English words.", category: "convert", icon: Type, keywords: ["number", "words", "spell"], mode: "client", status: "live" }),
  t({ slug: "data-size-converter", name: "Data Size Converter", description: "Convert between bytes, KB, MB, GB, TB and PB.", category: "convert", icon: Database, keywords: ["bytes", "megabytes", "convert"], mode: "client", status: "live" }),
  t({ slug: "length-converter", name: "Length Converter", description: "Convert meters, miles, feet, inches and more.", category: "convert", icon: Maximize2, keywords: ["length", "distance", "convert"], mode: "client", status: "live" }),
  t({ slug: "weight-converter", name: "Weight Converter", description: "Convert kg, pounds, ounces, stones and more.", category: "convert", icon: Calculator, keywords: ["weight", "mass", "convert"], mode: "client", status: "live" }),
  t({ slug: "temperature-converter", name: "Temperature Converter", description: "Convert Celsius, Fahrenheit and Kelvin.", category: "convert", icon: Calculator, keywords: ["temperature", "celsius", "fahrenheit"], mode: "client", status: "live" }),
  t({ slug: "area-converter", name: "Area Converter", description: "Convert square meters, acres, hectares and more.", category: "convert", icon: Crop, keywords: ["area", "acres", "convert"], mode: "client", status: "live" }),
  t({ slug: "volume-converter", name: "Volume Converter", description: "Convert liters, gallons, cups and more.", category: "convert", icon: Database, keywords: ["volume", "liters", "gallons"], mode: "client", status: "live" }),
  t({ slug: "speed-converter", name: "Speed Converter", description: "Convert km/h, mph, knots and m/s.", category: "convert", icon: Calculator, keywords: ["speed", "velocity", "mph"], mode: "client", status: "live" }),
  t({ slug: "time-converter", name: "Time Converter", description: "Convert seconds, minutes, hours, days and years.", category: "convert", icon: Clock, keywords: ["time", "duration", "convert"], mode: "client", status: "live" }),
  t({ slug: "pressure-converter", name: "Pressure Converter", description: "Convert bar, PSI, pascals and atmospheres.", category: "convert", icon: Calculator, keywords: ["pressure", "psi", "bar"], mode: "client", status: "live" }),
  t({ slug: "energy-converter", name: "Energy Converter", description: "Convert joules, calories, kWh and BTU.", category: "convert", icon: Calculator, keywords: ["energy", "joules", "calories"], mode: "client", status: "live" }),
  t({ slug: "angle-converter", name: "Angle Converter", description: "Convert degrees, radians, gradians and turns.", category: "convert", icon: Calculator, keywords: ["angle", "degrees", "radians"], mode: "client", status: "live" }),
  t({ slug: "compound-interest-calculator", name: "Compound Interest Calculator", description: "Project savings growth with compound interest.", category: "convert", icon: Percent, keywords: ["compound", "interest", "savings"], mode: "client", status: "live", featured: true }),
  t({ slug: "loan-emi-calculator", name: "Loan EMI Calculator", description: "Calculate monthly loan payments and interest.", category: "convert", icon: Calculator, keywords: ["loan", "emi", "mortgage"], mode: "client", status: "live" }),

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
