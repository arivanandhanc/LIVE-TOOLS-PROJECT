import type { FaqItem } from "./seo";

/**
 * Hand-written, tool-specific page content.
 *
 * WHY THIS FILE EXISTS
 * Every tool page used to be generated from the templates in `seo.ts`, which
 * produced pages that were 46–66% textually identical to each other — a PDF
 * merger and a Base64 encoder shared half their words. That is precisely the
 * "programmatically-generated pages with little added value" pattern Google's
 * spam and helpful-content systems demote, and publishing ~500 of them diluted
 * the whole domain rather than multiplying its chances.
 *
 * The fix is deliberately NOT "generate more varied templates". It is to write
 * genuinely distinct content for the tools worth ranking, and to `noindex`
 * everything else until it earns the same treatment. Fifteen strong pages beat
 * eight hundred weak ones.
 *
 * RULES FOR ADDING A TOOL HERE
 * 1. Write about THIS tool. If a sentence would read fine on another page,
 *    delete it — that sentence is what caused the problem.
 * 2. Be specific: real numbers, real formats, real edge cases, real failure
 *    modes. Specifics are what make a page worth linking to.
 * 3. `limitations` is mandatory and must be honest. Competitors don't publish
 *    theirs, so it's both a trust signal and genuinely unique text.
 * 4. Only add a tool when there's something true and useful to say. An entry
 *    padded to hit a word count recreates the exact problem this file solves.
 */
export interface ToolContent {
  /** Opening prose. Replaces the templated intro entirely. */
  intro: string;
  /** Concrete situations a real person is actually in. */
  useCases: { title: string; body: string }[];
  /** Steps written for this tool, referencing its real controls. */
  howTo: string[];
  /** Honest constraints. Never omit to make the tool look better. */
  limitations: string[];
  /** Questions specific to this tool — not "is it free" on every page. */
  faqs: FaqItem[];
}

export const toolContent: Record<string, ToolContent> = {
  // ─────────────────────────────── PDF ───────────────────────────────
  "merge-pdf": {
    intro:
      "Merging PDFs sounds trivial until the details bite: page order silently reverses, bookmarks vanish, form fields stop working, or a 40 MB scan balloons to 300 MB because every embedded font got duplicated. This merger keeps the original page objects intact rather than rasterising them, so text stays selectable, links keep working, and the output is close to the sum of the inputs rather than a multiple of it. Files are combined in the order you arrange them, and you can reorder before running.",
    useCases: [
      {
        title: "Assembling an application pack",
        body: "Visa, university and mortgage applications usually demand one PDF containing passport, transcripts, payslips and cover letter in a stated order. Merge them once in the required sequence instead of re-scanning everything into a single pass.",
      },
      {
        title: "Combining scanned chapters",
        body: "Book or report scans often arrive as one file per chapter. Merging preserves each chapter's original resolution — no re-compression pass, so text scans stay legible.",
      },
      {
        title: "Consolidating monthly statements",
        body: "Twelve bank statements into one file for an accountant. Because the merge is lossless, figures stay crisp and searchable rather than being flattened into images.",
      },
    ],
    howTo: [
      "Drop all the PDFs you want to combine onto the upload area — you can add them in several batches.",
      "Drag the file cards to set the exact order; the topmost file becomes page 1 of the output.",
      "Remove any file you added by mistake with the ✕ on its card.",
      "Click Merge PDF. Files are processed and the combined document is returned for download.",
    ],
    limitations: [
      "Merging does not merge form fields. If two files both contain a field named \"signature\", the second one's value can be lost — flatten forms before merging if the data matters.",
      "Encrypted or password-protected PDFs must be unlocked before merging; the tool cannot open them for you.",
      "Bookmarks from the individual files are not currently rewritten into a combined outline.",
      "Each file is capped at 50 MB and 20 files per request.",
    ],
    faqs: [
      {
        question: "Will merging reduce the quality of my PDFs?",
        answer:
          "No. Pages are copied as-is rather than re-rendered, so there is no re-compression step. Text stays as text, vector graphics stay vector, and scanned images keep their original resolution. The merged file is roughly the sum of the inputs.",
      },
      {
        question: "Can I merge PDFs in a specific order?",
        answer:
          "Yes, and this is the main thing to get right. Drag the file cards into the order you want before clicking Merge — the file at the top becomes page 1. The order shown on screen is exactly the order used.",
      },
      {
        question: "What happens to fillable forms when I merge?",
        answer:
          "Static content is preserved, but interactive form fields can collide when two documents use the same field names, and one value may win. If your files contain filled forms whose data matters, flatten each one first so the values become permanent page content.",
      },
      {
        question: "Can I merge a password-protected PDF?",
        answer:
          "Not directly. Encrypted files must be decrypted first — open the file in a PDF reader with the password and save an unprotected copy, then merge that.",
      },
    ],
  },

  "split-pdf": {
    intro:
      "Splitting is the operation people most often do by hand, badly — printing to PDF page by page, which rasterises text and multiplies file size. This tool extracts the page objects you ask for into a new document, so a page pulled out of a 200-page report is byte-for-byte the same page, still searchable and still selectable. You specify pages by number or range, and the original file is never modified.",
    useCases: [
      {
        title: "Sending one section to one person",
        body: "Pull the three pages of a contract that a counterparty actually needs, rather than emailing the whole 80-page agreement and asking them to scroll.",
      },
      {
        title: "Splitting a scanned batch",
        body: "A stack fed through a document scanner arrives as one PDF containing several unrelated documents. Extract each into its own file so they can be filed separately.",
      },
      {
        title: "Getting under an upload limit",
        body: "Portals that cap uploads at a few MB often accept a document split into parts. Splitting by range is lossless, unlike compressing the whole file until it degrades.",
      },
    ],
    howTo: [
      "Upload the PDF you want to split.",
      "Enter the pages or ranges to extract — for example 1-3 for the first three pages, or 5 for a single page.",
      "Check the page count shown for the uploaded file so your range is in bounds.",
      "Run the tool and download the extracted document.",
    ],
    limitations: [
      "Page ranges are 1-based and inclusive; a range beyond the document's page count returns an error rather than silently clamping.",
      "Extracted pages lose bookmarks and any outline entries that pointed into the original document.",
      "Internal links pointing to pages outside the extracted range will no longer resolve.",
      "Password-protected files must be unlocked first.",
    ],
    faqs: [
      {
        question: "How do I specify which pages to extract?",
        answer:
          "Use page numbers and ranges, such as 1-3 for pages one to three. Page numbering starts at 1 and ranges include both ends, so 1-3 gives you three pages, not two.",
      },
      {
        question: "Does splitting reduce quality or make text unsearchable?",
        answer:
          "No. Pages are copied rather than re-rendered, so the extracted pages are identical to the originals — text remains selectable and searchable. This is the key difference from 'printing' selected pages to a new PDF, which flattens everything to images.",
      },
      {
        question: "Is the original file changed?",
        answer:
          "Never. The upload is read to build a new document and your local copy is untouched. Server-side, the uploaded file is deleted automatically — within an hour for guests.",
      },
    ],
  },

  "compress-pdf": {
    intro:
      "Almost all avoidable PDF bloat comes from one place: images embedded at far higher resolution than anything needs. A phone-scanned page can carry a 12-megapixel photo behind text that will only ever be viewed at screen size. Compression here works by downsampling and re-encoding those images while leaving text and vector content untouched, which is why a scanned document may shrink by 80% while a text-only report barely moves — there was nothing to reclaim in the first place.",
    useCases: [
      {
        title: "Email attachment limits",
        body: "Most mail servers reject attachments over 20–25 MB. Scanned contracts routinely exceed that and compress well, because the scan resolution is far beyond what the recipient will view.",
      },
      {
        title: "Government and exam portals",
        body: "Upload forms frequently impose hard caps such as 2 MB. If you need an exact ceiling rather than 'smaller', use the target-size compressor, which iterates until it lands under your limit.",
      },
      {
        title: "Slimming a slide deck export",
        body: "Slides exported to PDF embed full-resolution images for every copy of a background. Compression removes that redundancy without touching your text.",
      },
    ],
    howTo: [
      "Upload the PDF you want to shrink.",
      "Run the compressor and compare the reported output size against the original.",
      "Open the result and check any image-heavy pages before relying on it — compression is a quality trade-off by definition.",
      "If you need to hit a specific limit such as 2 MB, use the target-size version of this tool instead.",
    ],
    limitations: [
      "A text-only or vector-only PDF will barely shrink. There is no redundancy to remove, and a tool promising otherwise is discarding something you wanted.",
      "Compression is lossy for images. Fine print in a low-quality scan can become harder to read.",
      "Already-compressed PDFs (previously optimised, or exported small) yield little further reduction.",
      "The tool cannot compress encrypted files.",
    ],
    faqs: [
      {
        question: "Why did my PDF barely get smaller?",
        answer:
          "Because it was probably already efficient. Compression reclaims space from over-sized embedded images. A PDF that is mostly text and vector graphics has very little to reclaim, so a 5–10% reduction is a correct result, not a failure.",
      },
      {
        question: "Will compression make my text blurry?",
        answer:
          "Not for real text. Text and vector content pass through untouched and stay sharp at any zoom. Only embedded images are re-encoded — so a scanned page, which is entirely an image, can lose detail while a typed document will not.",
      },
      {
        question: "I need the file under an exact size. Can this guarantee that?",
        answer:
          "This tool compresses once with sensible settings. For a hard ceiling, use the target-size compressor, which repeatedly adjusts quality until the output lands under the size you specify — the right choice for portals that reject anything over a stated limit.",
      },
    ],
  },

  "jpg-to-pdf": {
    intro:
      "Converting photos to PDF is mostly a layout problem, not a format problem. The questions that matter are how a 4:3 photo sits on a portrait A4 page, whether several images share a page, and whether the image gets re-compressed on the way in. This converter places each image on its own page, scaled to fit while preserving aspect ratio, and embeds the original JPEG data rather than decoding and re-encoding it — so the PDF is no blurrier than the photos you started with.",
    useCases: [
      {
        title: "Turning phone photos of documents into a submission",
        body: "Photographing pages is faster than finding a scanner, but most portals only accept PDF. Convert the photos, in order, into a single document.",
      },
      {
        title: "Receipt and expense claims",
        body: "Finance systems generally want one PDF per claim. Converting photographed receipts keeps them legible and in a fixed order.",
      },
      {
        title: "Sending images that must not be re-compressed",
        body: "Messaging apps aggressively re-compress photos. Wrapping them in a PDF preserves the original image data end to end.",
      },
    ],
    howTo: [
      "Upload the JPG or PNG images you want in the document.",
      "Arrange them into the order you want the pages to appear.",
      "Run the converter — each image becomes one page, scaled to fit and centred.",
      "Download the PDF and check the page order before sending it on.",
    ],
    limitations: [
      "One image per page. Multiple photos on a single page is not currently supported.",
      "Very tall or very wide images are scaled to fit the page, which can leave visible margins on the short edge.",
      "No OCR is performed — the result is a picture of text, so the PDF will not be searchable. Use the OCR tool if you need selectable text.",
      "Accepted inputs are JPG and PNG, each up to 50 MB.",
    ],
    faqs: [
      {
        question: "Will my photos lose quality when converted?",
        answer:
          "No. The original JPEG data is embedded directly rather than decoded and re-encoded, so there is no generational quality loss. The PDF looks exactly as good as your source photos.",
      },
      {
        question: "Can I put several photos on one page?",
        answer:
          "Not at the moment — each image becomes its own page. If you need a contact-sheet layout, combine the images first in an image editor and convert the resulting single image.",
      },
      {
        question: "Will I be able to search the text in my photographed documents?",
        answer:
          "No. A photo of a page is an image, and converting it to PDF keeps it an image. To get selectable, searchable text you need optical character recognition — use the OCR tool for that.",
      },
    ],
  },

  // ────────────────────────────── IMAGE ──────────────────────────────
  "image-converter": {
    intro:
      "Converting between image formats is mostly a question of what you lose. JPEG discards colour detail and has no transparency; PNG keeps every pixel but is large for photographs; WebP and AVIF compress far better than either but are newer, so support varies. This converter decodes anything your browser can display — including AVIF, SVG and ICO — and re-encodes it to whichever format you pick, in batch. Encoder availability is probed on your actual browser rather than assumed, so you're only offered formats that will genuinely work.",
    useCases: [
      {
        title: "Modernising images for the web",
        body: "Converting a folder of JPEGs to WebP typically cuts 25–35% of the bytes at visually identical quality — usually the single easiest page-speed win available.",
      },
      {
        title: "Meeting an upload that rejects your format",
        body: "Plenty of portals accept only JPG or PNG and reject WebP, HEIC or AVIF outright. Convert once and upload, rather than screenshotting the image.",
      },
      {
        title: "Flattening transparency deliberately",
        body: "Moving a transparent PNG to JPEG turns transparent pixels black unless a background is filled in. Here you choose that colour instead of discovering the problem later.",
      },
    ],
    howTo: [
      "Drop in one image or a whole batch — mixed input formats are fine.",
      "Pick the output format. Only formats your browser can actually encode are shown.",
      "For lossy formats set the quality; for formats without transparency choose the background fill colour.",
      "Convert, then download individually or grab everything as a single ZIP.",
    ],
    limitations: [
      "No browser can encode GIF or TIFF from a canvas, so those are input-only. An animated GIF converts to a still image of its first frame.",
      "AVIF encoding is unavailable in some browsers and is noticeably slower where it exists; the option is hidden when unsupported.",
      "HEIC from iPhones usually cannot be decoded outside Safari. Set your iPhone to 'Most Compatible' to capture JPEG instead.",
      "Converting to a lossy format re-encodes the image. Going JPEG → WebP → JPEG compounds artefacts — always convert from your original.",
      "SVG converts to raster and loses its infinite scalability. There is no meaningful raster-to-SVG direction.",
    ],
    faqs: [
      {
        question: "Which format should I convert to?",
        answer:
          "For photographs on the web, WebP is the best default — broadly supported and materially smaller than JPEG. Use PNG for logos, screenshots and anything needing transparency. Use JPEG when something explicitly demands it. AVIF compresses best of all but encodes slowly and isn't universally supported.",
      },
      {
        question: "Why does my transparent PNG turn black as a JPEG?",
        answer:
          "JPEG has no alpha channel, so transparency has to become a solid colour, and undefined pixels commonly render black. This converter fills transparent areas with a background colour you choose — white by default. If transparency matters, convert to PNG or WebP instead.",
      },
      {
        question: "Can I convert many images at once?",
        answer:
          "Yes. Add as many as you like, including a mix of source formats, and they're all converted to your chosen target. A single result downloads directly; multiple results are bundled into one ZIP.",
      },
      {
        question: "Are my images uploaded anywhere?",
        answer:
          "No. Decoding and encoding both happen on a canvas in your browser, so the pixels never leave your device. That's a real consideration here, since the images people convert are so often ID photos, signatures or screenshots of private documents.",
      },
    ],
  },

  "compress-image": {
    intro:
      "Image compression is a negotiation between file size and visible artefacts, and the right setting depends entirely on the picture. Photographs with smooth gradients tolerate aggressive JPEG compression; screenshots with sharp text and flat colour show banding and ringing almost immediately. This tool runs entirely in your browser using the Canvas encoder, which means the image is never uploaded anywhere — a meaningful difference when the picture is an ID document or a medical scan.",
    useCases: [
      {
        title: "Meeting a strict KB limit",
        body: "Job portals and government forms often cap photo uploads at 100 KB or 200 KB. Adjust quality until the reported output size drops under the limit.",
      },
      {
        title: "Speeding up a website",
        body: "Unoptimised hero images are the single most common cause of poor Largest Contentful Paint scores. Compressing before upload usually costs nothing visible.",
      },
      {
        title: "Compressing sensitive images",
        body: "Passport scans and medical images shouldn't be uploaded to a stranger's server just to make them smaller. Here the pixels never leave your device.",
      },
    ],
    howTo: [
      "Drop the image onto the page — it is read locally and never uploaded.",
      "Adjust the quality setting and watch the resulting file size update.",
      "Compare the preview against the original, paying attention to text edges and flat areas where artefacts appear first.",
      "Download the compressed image once you are happy with the trade-off.",
    ],
    limitations: [
      "JPEG compression is lossy and irreversible. Always keep your original; re-compressing an already-compressed image compounds the damage.",
      "PNG screenshots containing text often compress poorly as JPEG — halos appear around letters. Keep them as PNG, or use WebP.",
      "Very large images (above roughly 30–40 megapixels) can exhaust browser memory on low-end mobile devices.",
      "Because processing is local, speed depends on your device rather than a server.",
    ],
    faqs: [
      {
        question: "Are my images uploaded to your server?",
        answer:
          "No. This tool runs entirely in your browser using the Canvas API. The image is read from your disk into local memory, compressed on your own device, and written back out. Nothing is transmitted — you can verify this by loading the page, disconnecting from the internet, and compressing an image anyway.",
      },
      {
        question: "What quality setting should I use?",
        answer:
          "For photographs, 75–85% is usually indistinguishable from the original at a fraction of the size. For screenshots or images containing text, stay above 90% or use a lossless format instead — sharp edges reveal JPEG artefacts far more readily than photographic detail does.",
      },
      {
        question: "Why did my PNG get bigger instead of smaller?",
        answer:
          "PNG is lossless and already efficient for flat-colour graphics like logos and screenshots. Converting such an image to JPEG can genuinely increase its size while also adding artefacts. If the image has large areas of uniform colour, PNG is already the right format.",
      },
    ],
  },

  "resize-image": {
    intro:
      "Resizing is where most quality is quietly lost, because scaling down and scaling up are entirely different operations. Reducing dimensions averages pixels together and generally looks fine; enlarging invents pixels that were never captured, and no amount of filtering recovers detail that isn't there. This tool resizes locally in your browser, keeps aspect ratio locked by default, and shows the resulting dimensions before you commit.",
    useCases: [
      {
        title: "Exact dimensions for a profile or ID photo",
        body: "Application forms often demand a precise pixel size such as 600×600. Enter the numbers rather than cropping by eye.",
      },
      {
        title: "Preparing images for the web",
        body: "Serving a 4000px photo into a 800px slot wastes bandwidth on every page load. Resize to the size it will actually be displayed at.",
      },
      {
        title: "Fitting platform requirements",
        body: "Social and marketplace listings reject images outside their expected ratios. Resize to the documented dimensions before uploading.",
      },
    ],
    howTo: [
      "Load your image — it stays on your device throughout.",
      "Enter the target width or height; the other dimension follows automatically while aspect ratio is locked.",
      "Unlock the ratio only if you deliberately want to stretch the image, which will distort it.",
      "Download the resized image.",
    ],
    limitations: [
      "Enlarging cannot add detail. Scaling a 200px image to 2000px produces a soft, blurry result — this is a mathematical limit, not a tool limitation.",
      "Unlocking aspect ratio distorts the image; faces and text look visibly wrong.",
      "Repeated resize cycles accumulate softness. Always resize from your original, not from a previous output.",
      "Extremely large source images may exhaust memory on mobile browsers.",
    ],
    faqs: [
      {
        question: "Can I make a small image bigger without losing quality?",
        answer:
          "No — and be sceptical of any tool that claims otherwise. Detail absent from the original cannot be recovered; upscaling interpolates between existing pixels, which produces a larger but softer image. Start from the highest-resolution original you have.",
      },
      {
        question: "Why does my image look stretched?",
        answer:
          "The aspect-ratio lock was probably disabled, letting width and height change independently. Re-enable it and set only one dimension — the other is calculated to preserve proportions.",
      },
      {
        question: "Does resizing happen on your servers?",
        answer:
          "No. Resizing runs in your browser via Canvas. The image never leaves your device, which matters when you're resizing an ID photo or anything else you'd rather not upload.",
      },
    ],
  },

  // ──────────────────────────── DEVELOPER ────────────────────────────
  "json-formatter": {
    intro:
      "A JSON formatter earns its place on the day something is broken. Minified API responses arrive as a single 40,000-character line, and the useful question is rarely 'how does this look indented' but 'where exactly is the syntax error'. This formatter parses with the browser's native JSON parser and reports the position of the first failure, so a trailing comma or unquoted key is located rather than guessed at. Everything runs locally, which matters because API responses routinely contain tokens and personal data.",
    useCases: [
      {
        title: "Debugging an API response",
        body: "Paste a minified payload to see its actual structure — where the array of results really begins, and which fields are nested where.",
      },
      {
        title: "Finding the syntax error in a config file",
        body: "package.json, tsconfig.json and CI configs fail on a single trailing comma. The parser points at the offending position instead of failing silently.",
      },
      {
        title: "Inspecting a payload containing credentials",
        body: "Responses often include bearer tokens or customer records. Pasting those into an unknown server-side formatter is a data-leak incident; here the text stays in your tab.",
      },
    ],
    howTo: [
      "Paste your JSON into the input area.",
      "Format it to expand the structure with consistent indentation.",
      "If parsing fails, read the reported error position and inspect that point in the source — the true mistake is often just before it.",
      "Copy the formatted result, or minify it again for transport.",
    ],
    limitations: [
      "Only strict JSON is accepted. Comments, trailing commas and single-quoted strings are valid JavaScript but invalid JSON, and are rejected by design.",
      "Very large documents (tens of megabytes) can make the browser tab unresponsive while parsing.",
      "Key order is preserved as written, but JSON objects are formally unordered — don't rely on it.",
      "Numbers beyond JavaScript's safe integer range lose precision on parse. This affects large IDs, notably Twitter/X snowflake IDs.",
    ],
    faqs: [
      {
        question: "Why does my JSON fail to parse when it looks correct?",
        answer:
          "The usual culprits are a trailing comma after the last element, keys without double quotes, single quotes instead of double, or a stray non-breaking space pasted in from a document. All four are legal JavaScript object syntax but invalid JSON, which is why they slip past a visual check.",
      },
      {
        question: "Is my data sent anywhere?",
        answer:
          "No. Parsing and formatting happen in your browser using the built-in JSON parser. This is the main reason to prefer a client-side formatter — API payloads frequently contain access tokens and personal data that should never be pasted into a remote service.",
      },
      {
        question: "Why did my large ID number change?",
        answer:
          "JavaScript stores numbers as doubles, so integers above 9,007,199,254,740,991 cannot be represented exactly and get rounded on parse. If your IDs are that large, they should be transmitted as strings — this is a JSON/JavaScript constraint rather than a bug in the formatter.",
      },
    ],
  },

  "base64-encoder": {
    intro:
      "Base64 is an encoding, not encryption — a point worth stating plainly, because it is routinely misused as though it hid something. It exists to carry binary data through channels that only reliably survive text, such as email bodies, JSON string fields and data: URLs. The trade-off is size: output is roughly 33% larger than the input, since every three bytes become four characters. Encoding happens in your browser.",
    useCases: [
      {
        title: "Embedding a small image in CSS or HTML",
        body: "A data: URL removes one HTTP request. Worth it for small icons; counterproductive for large images, which then can't be cached separately.",
      },
      {
        title: "Putting binary data in a JSON field",
        body: "JSON has no binary type, so file contents are conventionally Base64-encoded into a string field.",
      },
      {
        title: "Reading a Basic Auth header",
        body: "Authorization: Basic headers are Base64 of user:password. Decoding one while debugging shows exactly which credentials are being sent.",
      },
    ],
    howTo: [
      "Paste or type the text you want to encode.",
      "The Base64 output is produced as you type.",
      "Copy the result to your clipboard.",
      "To go the other way, use the Base64 decoder.",
    ],
    limitations: [
      "Base64 provides no security whatsoever. Anyone can decode it instantly — never use it to protect a password or key.",
      "Output is about 33% larger than the input, so it's a poor choice for large payloads.",
      "This tool encodes text, treating input as UTF-8. Arbitrary binary files need the file-oriented encoder.",
      "Standard Base64 includes + and / characters, which must be URL-encoded before use in a query string, or you need the URL-safe variant.",
    ],
    faqs: [
      {
        question: "Is Base64 a form of encryption?",
        answer:
          "No, and this is the most consequential misunderstanding about it. Base64 is a reversible encoding with no key and no secret — anyone who sees the string can decode it in seconds. It makes data transport-safe, not private. To protect data you need actual encryption.",
      },
      {
        question: "Why is my encoded string bigger than the original?",
        answer:
          "Because Base64 represents every three bytes using four ASCII characters, which is an unavoidable ~33% increase, plus padding. That's the cost of making binary data survive text-only channels, and it's why Base64 is a poor fit for large files.",
      },
      {
        question: "Why does my Base64 break when I put it in a URL?",
        answer:
          "Standard Base64 uses + and / and = , all of which have reserved meanings in URLs. Either percent-encode the string or use URL-safe Base64, which substitutes - and _ and drops the padding.",
      },
    ],
  },

  "jwt-decoder": {
    intro:
      "A JSON Web Token is three Base64url segments separated by dots: header, payload, and signature. The first two are merely encoded, so anyone holding the token can read its claims — which is exactly why you must never put secrets in a JWT payload. This decoder splits the token and renders the header and payload locally, so you can check the expiry, issuer and audience claims while debugging an auth flow.",
    useCases: [
      {
        title: "Working out why a request returns 401",
        body: "Decode the token and check exp against the current time. An expired token, or a clock skew between services, explains a surprising share of auth bugs.",
      },
      {
        title: "Verifying claims during integration",
        body: "Confirm that iss, aud and scope hold what the receiving service expects before blaming its configuration.",
      },
      {
        title: "Confirming nothing sensitive is being leaked",
        body: "Because payloads are readable by anyone, decoding your own tokens is a quick audit that no personal data or internal identifiers are being exposed.",
      },
    ],
    howTo: [
      "Paste the full token, including all three dot-separated segments.",
      "Read the decoded header to see the signing algorithm.",
      "Read the payload claims — check exp (expiry) and iat (issued at), both Unix timestamps in seconds.",
      "Compare the claims against what the receiving service expects.",
    ],
    limitations: [
      "This decodes but does not VERIFY. A valid-looking payload proves nothing about authenticity without checking the signature against the signing key.",
      "Signature verification requires the secret or public key and must happen server-side; never ship a signing secret to a browser.",
      "Encrypted tokens (JWE, five segments) are not supported — only signed tokens (JWS, three segments).",
      "Timestamps are seconds since epoch, not milliseconds; multiplying by 1000 is the usual conversion mistake.",
    ],
    faqs: [
      {
        question: "Does decoding a JWT mean it's valid?",
        answer:
          "No, and conflating the two is a genuine security bug. Decoding only reverses Base64url — anyone can do it to any token. Validity requires verifying the signature with the issuer's key, plus checking expiry, issuer and audience. Never trust a token's claims because they decoded cleanly.",
      },
      {
        question: "Is it safe to paste a token here?",
        answer:
          "Decoding happens entirely in your browser, so the token isn't transmitted. That said, treat any live token as a credential: if it's an active session token, prefer an expired or test token when possible, and rotate anything you've pasted into a tool you don't control.",
      },
      {
        question: "Why can I read the payload? Isn't that insecure?",
        answer:
          "It's by design. JWTs are signed, not encrypted — the signature guarantees the claims haven't been tampered with, not that they're hidden. This is precisely why passwords, keys and sensitive personal data must never be placed in a JWT payload.",
      },
    ],
  },

  "uuid-generator": {
    intro:
      "A version 4 UUID is 122 random bits, which is enough that generating a billion per second for a century still leaves collision odds negligible. That property is what makes UUIDs useful: two systems can each mint identifiers with no coordination and safely assume they'll never clash. This generator uses the browser's cryptographic random number source rather than Math.random, which matters if the value is ever used where predictability would be a problem.",
    useCases: [
      {
        title: "Primary keys created before an insert",
        body: "Letting the client generate the ID means a record can be referenced immediately, without a round-trip to learn what the database assigned.",
      },
      {
        title: "Correlation IDs for tracing",
        body: "Tag a request at the edge and carry the same ID through every service, so one identifier reconstructs the whole path through your logs.",
      },
      {
        title: "Idempotency keys",
        body: "Payment APIs use a unique key per attempt so a retried request is not charged twice.",
      },
    ],
    howTo: [
      "Open the tool — a fresh UUID is generated immediately.",
      "Generate again for as many as you need.",
      "Copy the value straight to your clipboard.",
      "Use lowercase form consistently; UUIDs are case-insensitive but mixing cases breaks naive string comparisons.",
    ],
    limitations: [
      "Version 4 UUIDs carry no timestamp, so they do not sort chronologically. Sorting by UUID gives you random order.",
      "As a database primary key, their randomness fragments B-tree indexes and hurts insert performance at scale. UUIDv7 or ULID address this.",
      "They are 36 characters as text versus 4 bytes for a 32-bit integer — meaningful in large tables and in URLs.",
      "Unguessable is not the same as access control. Never treat a UUID in a URL as authorisation.",
    ],
    faqs: [
      {
        question: "Can two generated UUIDs ever be the same?",
        answer:
          "In theory yes, in practice no. With 122 random bits you would need to generate about 2.7 × 10^18 UUIDs before reaching a 50% chance of a single collision. For any realistic application, treating them as unique is safe.",
      },
      {
        question: "Are these random enough to use as security tokens?",
        answer:
          "They're generated with crypto.getRandomValues, the browser's cryptographically secure source, so they aren't predictable. Even so, a UUID identifies rather than authorises — a resource reachable by anyone who knows its UUID is not access-controlled, it's just obscure.",
      },
      {
        question: "Should I use UUIDs as database primary keys?",
        answer:
          "It's a real trade-off. You gain client-side generation and no cross-system collisions; you pay in index fragmentation, since random values scatter inserts across the index, and in storage. If you want both, look at UUIDv7 or ULID, which are time-ordered and keep inserts sequential.",
      },
    ],
  },

  "qr-generator": {
    intro:
      "QR codes encode data with Reed–Solomon error correction, which is why a code still scans with a logo covering its middle or a coffee stain across a corner. Higher correction levels tolerate more damage but pack the data into denser modules, so the printed code needs more physical space. The practical failure mode is almost never the encoding — it's printing too small, or omitting the quiet zone that scanners need to find the code's edges.",
    useCases: [
      {
        title: "Linking a printed item to a page",
        body: "Posters, packaging and business cards where typing a URL is friction the reader won't accept.",
      },
      {
        title: "Wi-Fi access for guests",
        body: "A WIFI-format code joins the network without reading a password aloud.",
      },
      {
        title: "Table-side menus and ordering",
        body: "Point a code at a menu URL so it can be updated without reprinting anything.",
      },
    ],
    howTo: [
      "Enter the URL or text you want the code to carry.",
      "Keep the content as short as possible — shorter data produces a sparser, more reliably scannable code.",
      "Generate and download the image.",
      "Test by scanning the final printed or displayed size, not the version on your screen.",
    ],
    limitations: [
      "Long URLs create dense codes that fail at small print sizes. Shorten the link first.",
      "The quiet zone — clear margin of at least four modules on every side — is required. Cropping tight to the pattern is the most common cause of a code that won't scan.",
      "Printing below roughly 2 × 2 cm is unreliable for typical phone cameras at arm's length.",
      "Low contrast, inverted colours, or printing on a glossy reflective surface all break scanning.",
    ],
    faqs: [
      {
        question: "Why won't my QR code scan?",
        answer:
          "In order of likelihood: it's printed too small, the quiet-zone margin was cropped away, contrast is too low, or the surface is reflecting light back at the camera. Encoding errors are rare — test at the actual final size rather than on screen.",
      },
      {
        question: "Do these codes expire or need an account?",
        answer:
          "No. The data is encoded directly into the image, so the code works forever and doesn't depend on this site existing. Beware 'dynamic' QR services that encode a redirect through their own domain — those stop working if the provider disappears or starts charging.",
      },
      {
        question: "How much data can one code hold?",
        answer:
          "Up to about 4,300 alphanumeric characters in theory, but that's a dense grid needing high-quality printing at a large size. In practice keep it under roughly 300 characters, and ideally to a short URL — reliability drops sharply as density rises.",
      },
    ],
  },

  // ──────────────────────────────── CSV ────────────────────────────────
  "csv-to-json": {
    intro:
      "CSV looks simple until real data arrives. A field containing a comma must be quoted; a field containing a quote must escape it by doubling; line breaks can appear inside a quoted field, so splitting on newlines corrupts the file. This converter parses CSV properly rather than splitting on delimiters, uses the first row as object keys, and runs in your browser — which matters, because CSV exports are usually customer lists.",
    useCases: [
      {
        title: "Loading a spreadsheet export into an app",
        body: "Turn an exported sheet into a JSON array you can seed a database or fixture file with.",
      },
      {
        title: "Preparing a request body",
        body: "APIs take JSON, business teams produce spreadsheets. This converts between the two without a script.",
      },
      {
        title: "Inspecting an export safely",
        body: "Customer and payroll exports contain personal data. Local conversion keeps that data off third-party servers and out of GDPR trouble.",
      },
    ],
    howTo: [
      "Paste your CSV, or load the file — the first row is treated as the header.",
      "Check that the detected columns match what you expect.",
      "Convert to get an array of objects, one per data row.",
      "Copy the JSON output or download it.",
    ],
    limitations: [
      "The first row must be a header. A file starting straight into data will have its first record consumed as column names.",
      "Every value is produced as a string. Numbers and booleans are not inferred, because guessing types silently corrupts data such as leading-zero postcodes.",
      "Duplicate column names collide — later columns overwrite earlier ones, since object keys must be unique.",
      "Very large files may exhaust browser memory; multi-hundred-megabyte exports belong in a streaming script.",
    ],
    faqs: [
      {
        question: "Why are my numbers strings in the output?",
        answer:
          "Deliberately. Automatic type inference is a classic source of silent data corruption — postcodes like 01234 lose their leading zero, long IDs lose precision, and values like NaN or version numbers get mangled. Keeping everything as strings preserves your data exactly; cast the specific fields you know are numeric.",
      },
      {
        question: "My CSV has commas inside the values. Will that break it?",
        answer:
          "No, provided those fields are quoted, as the CSV convention requires. The parser handles quoted fields containing commas, escaped double quotes, and even line breaks inside a quoted field — cases that a naive split-on-comma approach gets wrong.",
      },
      {
        question: "Is my data uploaded anywhere?",
        answer:
          "No — conversion happens entirely in your browser. This is the main reason to use a client-side converter for CSV: exports are typically customer records, employee data or financial rows, and uploading those to an unknown service can itself be a reportable data-protection breach.",
      },
    ],
  },

  // ──────────────────────────────── TEXT ────────────────────────────────
  "word-counter": {
    intro:
      "Word counts disagree between tools more often than people expect, because 'what is a word' is a convention rather than a fact. Hyphenated compounds, contractions, numerals and em-dashes are all counted differently by different software, and a 500-word limit enforced by one system may read as 508 in another. This counter splits on whitespace — the most common convention, and the one Word broadly matches — and updates live as you type, entirely in your browser.",
    useCases: [
      {
        title: "Hitting an assignment limit",
        body: "Essays and applications with a hard cap, where going over risks being marked down or truncated.",
      },
      {
        title: "Writing within platform limits",
        body: "Meta descriptions, ad copy and social posts have character budgets that must be checked exactly.",
      },
      {
        title: "Tracking a daily writing target",
        body: "Paste a draft to see progress without opening a full word processor.",
      },
    ],
    howTo: [
      "Paste or type your text into the input area.",
      "Word, character and related counts update live as you edit.",
      "Check whether your limit counts characters with or without spaces — the two differ substantially.",
      "Keep editing in place; nothing needs to be re-run.",
    ],
    limitations: [
      "Counts can differ by a few words from Microsoft Word or Google Docs, which apply their own rules to hyphenated and punctuated tokens.",
      "Text pasted from a PDF often carries line-break artefacts that split words in two, inflating the count.",
      "Formatting is not counted — footnotes, captions and headers pasted in are treated as ordinary text.",
      "Languages without spaces between words, such as Chinese and Japanese, cannot be word-counted by whitespace splitting.",
    ],
    faqs: [
      {
        question: "Why is my count different from Microsoft Word?",
        answer:
          "Because there's no single standard. Word applies its own rules to hyphenated compounds, em-dashes and numbers, so 'state-of-the-art' may be one word or four depending on the tool. Expect small differences, and if you're near a hard limit, check in whichever tool the recipient will use.",
      },
      {
        question: "Should I count characters with or without spaces?",
        answer:
          "It depends who set the limit, and the gap is large — roughly 15–20% of a typical English text is spaces. Publishing and translation work usually counts with spaces; some academic limits exclude them. Both figures are shown, so use whichever your brief specifies.",
      },
      {
        question: "Is my text sent to a server?",
        answer:
          "No. Counting happens in your browser as you type, which is why it updates instantly with no network delay. Your draft never leaves the tab — worth knowing if you're pasting unpublished or confidential writing.",
      },
    ],
  },
};

/** Tools with genuinely unique, hand-written page content. */
export function getToolContent(slug: string): ToolContent | undefined {
  return toolContent[slug];
}

/**
 * Whether a tool page carries enough original content to deserve indexing.
 *
 * Pages without it are `noindex,follow`: crawlers still traverse their links,
 * but the near-duplicate text stops competing with — and diluting — the pages
 * that are actually worth ranking. Write an entry above and the page becomes
 * indexable automatically; nothing else needs changing.
 */
export function isIndexable(slug: string): boolean {
  return slug in toolContent;
}

/** Count used by the sitemap and by build-time reporting. */
export const richContentSlugs = Object.keys(toolContent);
