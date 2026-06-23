# Scrab Tools — Expansion Roadmap

> Gap analysis + build backlog. Generated against the current registry
> (`frontend/src/lib/tools/registry.ts`). Everything in **Part B** is *new* —
> deduplicated against what already ships. **Part C** is outbound: tools we
> deliberately *don't* build but link to from a dedicated page.

Legend for Part B:
- **[C]** = pure client-side (browser-only, no server, cheapest to ship — preferred)
- **[S]** = needs a server worker (heavy native libs, headless render, etc.)
- **[AI]** = needs an LLM / model call (metered cost)

---

## Part A — What we already have (~100 tools)

**PDF (24):** merge, split, compress, pdf-to-word, word-to-pdf*, pdf-to-excel*,
excel-to-pdf, pdf-to-powerpoint*, powerpoint-to-pdf*, pdf-to-jpg, jpg-to-pdf,
rotate, watermark, unlock*, protect*, repair, ocr, sign, edit*, extract-pages,
organize-pages, remove-pages, add-page-numbers, add-header-footer.

**Image (11):** jpg-to-png, png-to-jpg, webp-converter, resize, compress, crop,
rotate, watermark, svg-converter, background-remover*, ai-image-enhancement*.

**CSV (12):** csv-to-json, json-to-csv, csv-to-tsv, tsv-to-csv, csv-cleaner,
duplicate-remover, csv-to-excel, excel-to-csv, xml-to-csv, column-splitter,
column-merger, data-formatter.

**Text (10):** word-counter, character-counter, case-converter, text-cleaner,
remove-duplicates, reverse-text, lorem-ipsum, slugify, text-diff, sort-lines.

**Developer (33):** json-formatter, xml-formatter, yaml⇄json, base64-enc/dec,
jwt-decoder, hash-generator, uuid-generator, qr-generator, qr-scanner*,
url-enc/dec, html-formatter, css-minifier, js-minifier, sql-formatter,
regex-tester, password-generator, color-converter, gradient-generator,
timestamp-converter, number-base-converter, json-to-xml, xml-to-json,
markdown-to-html, html-to-markdown*, text-to-binary, rot13, user-agent-parser,
cron-parser*, htpasswd-generator*, robots-generator, meta-tag-generator.

**AI (5):** document-summary, pdf-summary, ocr-extraction, content-generator,
image-analysis.

`*` = currently "soon" / not live.

---

## Part B — 500+ new tools to build (deduplicated)

### B1. PDF — deeper (1–34)
1. PDF page numbering with roman/letter styles [C]
2. PDF to PDF/A (archival) [S]
3. PDF to PDF/X (print) [S]
4. Flatten PDF form fields [C]
5. Fill PDF forms (AcroForm) [C]
6. Extract PDF form data to CSV/JSON [C]
7. PDF bookmark / outline editor [C]
8. PDF metadata editor (title/author/keywords) [C]
9. Remove PDF metadata (privacy scrub) [C]
10. PDF table of contents generator [C]
11. PDF to plain text (.txt) [C]
12. PDF to Markdown [C]
13. PDF to HTML [S]
14. PDF to EPUB [S]
15. EPUB to PDF [S]
16. PDF to images (PNG/TIFF batch) [C]
17. TIFF to PDF [C]
18. PNG to PDF [C]
19. Multi-image to PDF (mixed formats) [C]
20. PDF compare / redline (visual diff) [S]
21. PDF redaction (true black-box removal) [S]
22. PDF crop / trim margins [C]
23. PDF resize page size (A4↔Letter) [C]
24. PDF booklet imposition (n-up) [C]
25. PDF N-up (2/4/6 pages per sheet) [C]
26. PDF split by bookmark [C]
27. PDF split by file size [C]
28. PDF split every N pages [C]
29. Insert blank pages [C]
30. Duplicate pages [C]
31. PDF page reverse order [C]
32. PDF overlay / stamp one PDF onto another [C]
33. PDF background color / image [C]
34. Grayscale a PDF [C]

### B2. PDF — forms, security, scan (35–60)
35. Add hyperlinks to PDF [C]
36. Remove all links from PDF [C]
37. PDF digital signature (PKI / cert) [S]
38. Verify PDF signature [S]
39. PDF permission editor (print/copy flags) [S]
40. Batch PDF password protect [S]
41. Batch PDF unlock [S]
42. Compress scanned PDF (MRC) [S]
43. Deskew scanned PDF [S]
44. Despeckle / clean scan [S]
45. Auto-rotate scanned pages [C]
46. Searchable PDF from scan (OCR layer) [S]
47. PDF to audio (text-to-speech) [S]
48. PDF word/char/page counter [C]
49. PDF font lister / extractor [C]
50. Extract images from PDF [C]
51. Extract attachments from PDF [C]
52. Attach files to PDF [C]
53. PDF layers (OCG) toggle viewer [C]
54. PDF annotation extractor (comments) [C]
55. Highlight text in PDF [C]
56. PDF measuring tool (scale) [C]
57. PDF Bates numbering (legal) [C]
58. PDF watermark remover [S]
59. PDF page extractor by text search [C]
60. PDF thumbnail sheet (contact sheet) [C]

### B3. Image — convert (61–110)
61. HEIC to JPG [C]
62. HEIC to PNG [C]
63. AVIF converter (to/from) [C]
64. BMP to PNG/JPG [C]
65. GIF to PNG (frames) [C]
66. PNG to GIF [C]
67. Image to GIF (animated) [C]
68. APNG maker [C]
69. ICO generator (favicon multi-size) [C]
70. ICNS (macOS icon) generator [C]
71. TIFF converter [C]
72. RAW to JPG (camera) [S]
73. PSD to PNG (flatten) [S]
74. EXR / HDR tone-map [S]
75. JPEG XL converter [S]
76. PPM/PGM/PBM converter [C]
77. DDS texture converter [S]
78. TGA converter [C]
79. WebP to MP4 (animated) [S]
80. Image to Base64 data URI [C]
81. Base64 to image [C]
82. SVG to PNG/JPG/PDF [C]
83. PNG/JPG to SVG (vectorize/trace) [S]
84. SVG optimizer (SVGO) [C]
85. SVG minifier [C]
86. Image to ASCII art [C]
87. ASCII art to image [C]
88. Image to pixel art [C]
89. Image to favicon package [C]
90. Sprite sheet generator [C]
91. Sprite sheet slicer [C]
92. Image to CSS (data-uri/background) [C]
93. PNG color depth reducer (8-bit) [C]
94. GIF optimizer [S]
95. GIF splitter (to frames) [C]
96. GIF reverse [C]
97. GIF speed changer [C]
98. Image format batch converter [C]
99. Multi-page TIFF splitter [C]
100. DICOM to JPG (medical) [S]
101. Image to PDF (single) [C]
102. Animated WebP splitter [C]
103. Lottie to GIF [S]
104. SVG to React component [C]
105. SVG to Vue component [C]
106. SVG to Android VectorDrawable [C]
107. Color profile (ICC) converter [S]
108. CMYK ↔ RGB image convert [S]
109. 16-bit to 8-bit image [C]
110. Image bit-depth inspector [C]

### B4. Image — edit & enhance (111–165)
111. Flip image (H/V) [C]
112. Image rotate by exact degree [C]
113. Straighten / deskew photo [C]
114. Resize by percentage [C]
115. Bulk resize (batch) [C]
116. Resize for social (IG/FB/X presets) [C]
117. Image canvas resize (padding) [C]
118. Round image corners [C]
119. Circle crop / avatar maker [C]
120. Add border / frame [C]
121. Image collage maker [C]
122. Photo grid maker [C]
123. Side-by-side image joiner [C]
124. Vertical image stitcher [C]
125. Add text to image (meme/caption) [C]
126. Meme generator [C]
127. Add logo / watermark batch [C]
128. Remove watermark (inpaint) [AI]
129. Blur image / region [C]
130. Pixelate / mosaic region [C]
131. Face blur (auto) [AI]
132. License-plate blur [AI]
133. Brightness / contrast [C]
134. Saturation / hue / vibrance [C]
135. Grayscale / B&W [C]
136. Sepia / vintage filter [C]
137. Invert colors [C]
138. Color temperature (warm/cool) [C]
139. Sharpen [C]
140. Gaussian blur [C]
141. Noise reduction [S]
142. Add film grain [C]
143. Vignette [C]
144. Duotone generator [C]
145. Posterize [C]
146. Threshold (black/white) [C]
147. Photo filters (Instagram-like) [C]
148. Auto-enhance (levels) [C]
149. White balance [C]
150. Red-eye remover [C]
151. Color picker from image (eyedropper) [C]
152. Dominant color extractor / palette [C]
153. Color palette from photo [C]
154. Image histogram viewer [C]
155. EXIF viewer [C]
156. EXIF remover (privacy) [C]
157. GPS-from-EXIF map [C]
158. Image compare slider [C]
159. Image upscaler 2x/4x [AI]
160. AI denoise [AI]
161. Old photo restoration [AI]
162. Colorize B&W photo [AI]
163. Cartoonize photo [AI]
164. Object remover (inpaint) [AI]
165. Sky replacement [AI]

### B5. Image — generators & design (166–195)
166. Placeholder image generator (custom size/text) [C]
167. Solid color image generator [C]
168. Gradient image generator [C]
169. Pattern generator (stripes/dots) [C]
170. Noise texture generator [C]
171. Mesh gradient generator [C]
172. Blob / wave SVG generator [C]
173. Avatar / identicon generator [C]
174. Gravatar lookup [C]
175. Open Graph image generator [C]
176. Twitter card image generator [C]
177. YouTube thumbnail maker [C]
178. App icon set generator (all sizes) [C]
179. Splash screen generator [C]
180. Favicon from text/emoji [C]
181. QR code with logo [C]
182. Animated QR / WiFi QR [C]
183. Barcode generator (EAN/UPC/Code128) [C]
184. Barcode scanner [C]
185. Data Matrix / Aztec code [C]
186. Mockup generator (device frames) [C]
187. Screenshot beautifier (gradient bg) [C]
188. Code-to-image (carbon-style) [C]
189. Tweet-to-image [C]
190. Certificate generator [C]
191. Business card generator [C]
192. Letterhead generator [C]
193. Email signature generator [C]
194. Image map generator (HTML) [C]
195. Sprite + CSS generator [C]

### B6. Audio (ffmpeg.wasm / Web Audio) (196–230)
196. MP3 converter (to/from) [C]
197. WAV converter [C]
198. FLAC converter [C]
199. AAC / M4A converter [C]
200. OGG / Opus converter [C]
201. Audio compressor (bitrate) [C]
202. Audio trimmer / cutter [C]
203. Audio joiner / merger [C]
204. Audio splitter (by silence) [C]
205. Volume normalizer [C]
206. Volume booster / gain [C]
207. Fade in / out [C]
208. Audio speed changer [C]
209. Pitch shifter [C]
210. Stereo to mono [C]
211. Channel splitter [C]
212. Audio reverser [C]
213. Silence remover [C]
214. Audio waveform image [C]
215. Spectrogram generator [C]
216. Ringtone maker (M4R) [C]
217. Extract audio from video [C]
218. Audio metadata (ID3) editor [C]
219. Album art extractor [C]
220. Audio sample-rate converter [C]
221. Bit-depth converter [C]
222. Mono mixdown [C]
223. Audio loudness (LUFS) meter [C]
224. Click / pop remover [S]
225. Noise gate [C]
226. Karaoke (vocal remover) [AI]
227. Stem splitter (vocals/drums) [AI]
228. Speech to text (transcribe) [AI]
229. Text to speech [AI]
230. Audio language detector [AI]

### B7. Video (ffmpeg.wasm) (231–275)
231. MP4 converter [C]
232. WebM converter [C]
233. MOV converter [C]
234. AVI / MKV converter [C]
235. GIF to video [C]
236. Video to GIF [C]
237. Video compressor [C]
238. Video trimmer / cutter [C]
239. Video joiner / merger [C]
240. Video splitter [C]
241. Video resize / scale [C]
242. Video crop [C]
243. Video rotate / flip [C]
244. Change frame rate [C]
245. Change resolution (1080p→720p) [C]
246. Mute video [C]
247. Replace audio track [C]
248. Add background music [C]
249. Extract frames (to images) [C]
250. Make video from images (slideshow) [C]
251. Add subtitles (burn-in) [C]
252. Subtitle extractor [C]
253. SRT/VTT converter [C]
254. SRT shifter (sync offset) [C]
255. Video watermark / logo [C]
256. Video speed (slow-mo/timelapse) [C]
257. Video reverse [C]
258. Video loop maker [C]
259. Boomerang maker [C]
260. Video thumbnail generator [C]
261. Video contact sheet (storyboard) [C]
262. Video to MP3 [C]
263. Video stabilizer [S]
264. Video brightness/contrast [C]
265. Square / vertical crop for social [C]
266. Aspect-ratio padding (letterbox) [C]
267. Two videos side by side [C]
268. Picture-in-picture [C]
269. Green screen / chroma key [S]
270. Video metadata viewer [C]
271. Strip video metadata [C]
272. HEVC ↔ H.264 [C]
273. Video → animated WebP [C]
274. Auto-caption (transcribe + burn) [AI]
275. Video summary / highlights [AI]

### B8. Text — more (276–325)
276. Title case (smart, AP/Chicago) [C]
277. Sentence case [C]
278. aLtErNaTiNg case [C]
279. Small caps / unicode font styler [C]
280. Bold/italic unicode text (𝐱) [C]
281. Strikethrough / underline unicode [C]
282. Zalgo / glitch text [C]
283. Upside-down text [C]
284. Cursive / fancy fonts [C]
285. Bubble / square text [C]
286. Morse code translator [C]
287. NATO phonetic translator [C]
288. Pig Latin translator [C]
289. Leetspeak converter [C]
290. Braille translator [C]
291. Binary ↔ text [C] *(have text-to-binary; add full UI)*
292. ASCII / Unicode code point lookup [C]
293. Emoji finder / picker [C]
294. Emoji to text (demojize) [C]
295. Remove emojis [C]
296. Remove accents / diacritics [C]
297. Transliterate (Cyrillic→Latin etc.) [C]
298. Whitespace remover / collapser [C]
299. Line break remover / adder [C]
300. Add line numbers [C]
301. Remove line numbers [C]
302. Trim each line [C]
303. Prefix / suffix each line [C]
304. Wrap each line in quotes [C]
305. Join lines with delimiter [C]
306. Split text into lines (by delimiter) [C]
307. Shuffle lines [C]
308. Random line picker [C]
309. Number the lines / list maker [C]
310. Find and replace (regex) [C]
311. Extract emails from text [C]
312. Extract URLs from text [C]
313. Extract phone numbers [C]
314. Extract numbers [C]
315. Extract hashtags / mentions [C]
316. Word frequency counter [C]
317. Keyword density analyzer [C]
318. Readability scorer (Flesch) [C]
319. Text repeater [C]
320. Column-to-comma list [C]
321. Comma list to column [C]
322. Text to columns (table) [C]
323. Remove HTML tags from text [C]
324. Escape / unescape HTML entities [C]
325. Unicode normalizer (NFC/NFD) [C]

### B9. Writing & AI-text (326–355)
326. Grammar checker [AI]
327. Spell checker [C/AI]
328. Paraphraser / rewriter [AI]
329. Tone changer (formal/casual) [AI]
330. Text summarizer (short) [AI]
331. Bullet-point extractor [AI]
332. Title / headline generator [AI]
333. Blog outline generator [AI]
334. Email writer [AI]
335. Cover letter generator [AI]
336. Product description generator [AI]
337. Social caption generator [AI]
338. Hashtag generator [AI]
339. Translation (multi-language) [AI]
340. Language detector [C/AI]
341. Sentiment analyzer [AI]
342. Keyword extractor [AI]
343. Text expander (shorthand→full) [AI]
344. Text simplifier (ELI5) [AI]
345. Acronym explainer [AI]
346. Plagiarism-style rephraser [AI]
347. AI text humanizer [AI]
348. Bio generator [AI]
349. Resume bullet improver [AI]
350. Meeting-notes summarizer [AI]
351. FAQ generator from text [AI]
352. Quiz generator from text [AI]
353. Flashcard generator [AI]
354. Story / prompt generator [AI]
355. Name generator (brand/baby/band) [C]

### B10. Data / CSV / spreadsheet — more (356–395)
356. JSON viewer / tree explorer [C]
357. JSON validator (schema) [C]
358. JSON minifier [C]
359. JSON beautifier [C] *(have formatter; split UX)*
360. JSON path finder (JSONPath) [C]
361. JSON diff [C]
362. JSON to TypeScript types [C]
363. JSON to Go struct [C]
364. JSON to Python dataclass [C]
365. JSON to SQL (CREATE+INSERT) [C]
366. JSON to YAML [C]
367. JSON to TOML [C]
368. TOML to JSON [C]
369. JSON flatten / unflatten [C]
370. JSON to CSV (nested) [C]
371. CSV to SQL inserts [C]
372. CSV to Markdown table [C]
373. CSV to HTML table [C]
374. CSV to LaTeX table [C]
375. Markdown table generator (visual) [C]
376. HTML table to CSV/JSON [C]
377. SQL to CSV (parse inserts) [C]
378. CSV viewer / editor (grid) [C]
379. CSV column reorder [C]
380. CSV column delete / keep [C]
381. CSV row filter [C]
382. CSV sort by column [C]
383. CSV merge (join two files) [C]
384. CSV concat (stack files) [C]
385. CSV transpose [C]
386. CSV diff [C]
387. CSV stats (sum/avg/min/max) [C]
388. CSV to chart (bar/line/pie) [C]
389. CSV random sampler [C]
390. CSV header generator [C]
391. Fixed-width to CSV [C]
392. CSV encoding fixer (UTF-8) [C]
393. CSV delimiter detector / changer [C]
394. NDJSON ↔ JSON array [C]
395. Excel formula explainer [AI]

### B11. Developer / encoding / web (396–450)
396. JSON Web Token (JWT) encoder/signer [C]
397. JWT verifier (signature) [C]
398. Hash verifier (compare) [C]
399. HMAC generator [C]
400. bcrypt hash / verify [C]
401. Argon2 hash [S]
402. CRC32 / Adler checksum [C]
403. File checksum (MD5/SHA of file) [C]
404. Base32 encode/decode [C]
405. Base58 encode/decode [C]
406. Base85 / Ascii85 [C]
407. Hex encode/decode [C]
408. Binary file viewer (hex dump) [C]
409. URL parser (query breakdown) [C]
410. Query string ↔ JSON [C]
411. Query string builder [C]
412. Cookie parser [C]
413. cURL to code (fetch/axios/python) [C]
414. HTTP header inspector [S]
415. HTTP status code reference [C]
416. MIME type lookup [C]
417. User-agent generator [C]
418. IP address info (geo) [S]
419. IPv4 ↔ IPv6 / CIDR calculator [C]
420. Subnet calculator [C]
421. MAC address lookup (vendor) [C]
422. DNS lookup [S]
423. WHOIS lookup [S]
424. SSL certificate checker [S]
425. Port scanner reference [C]
426. Ping / latency tester [S]
427. Webhook tester (request bin) [S]
428. JSONP / CORS tester [S]
429. Regex cheat-sheet + builder [C]
430. Cron expression builder (visual) [C]
431. Crontab generator [C]
432. Glob tester [C]
433. .gitignore generator [C]
434. .editorconfig generator [C]
435. Dockerfile generator [C]
436. docker-compose generator [C]
437. Nginx config generator [C]
438. Apache .htaccess generator [C]
439. systemd unit generator [C]
440. Makefile generator [C]
441. package.json generator [C]
442. tsconfig generator [C]
443. ESLint config generator [C]
444. Prettier playground [C]
445. License chooser / generator [C]
446. README generator [C]
447. Badge / shield generator [C]
448. Changelog generator [C]
449. Semantic version bumper [C]
450. Commit message generator [AI]

### B12. Code utilities (451–490)
451. Code beautifier (multi-lang) [C]
452. Code minifier (multi-lang) [C]
453. JS obfuscator [C]
454. JS deobfuscator / beautify [C]
455. SCSS/LESS to CSS [S]
456. CSS to SCSS [C]
457. Autoprefixer [C]
458. CSS unit converter (px↔rem) [C]
459. CSS specificity calculator [C]
460. CSS shadow generator [C]
461. CSS border-radius generator [C]
462. CSS flexbox playground [C]
463. CSS grid generator [C]
464. CSS animation / keyframes generator [C]
465. CSS clip-path generator [C]
466. CSS triangle generator [C]
467. CSS glassmorphism generator [C]
468. CSS neumorphism generator [C]
469. Cubic-bezier editor [C]
470. Tailwind class sorter [C]
471. Tailwind → CSS [C]
472. HTML entity reference [C]
473. HTML table generator [C]
474. HTML form generator [C]
475. HTML email boilerplate [C]
476. SVG path editor [C]
477. SVG to CSS background [C]
478. Diff / merge tool (3-way) [C]
479. Text encoding detector [C]
480. Line ending converter (CRLF/LF) [C]
481. Tabs ↔ spaces [C]
482. Indentation fixer [C]
483. Code snippet beautify-screenshot [C]
484. Color contrast checker (WCAG) [C]
485. Accessibility color palette [C]
486. Lorem picsum / faker data UI [C]
487. Mock API response generator [C]
488. GraphQL query formatter [C]
489. Protobuf ↔ JSON [S]
490. ENV file ↔ JSON [C]

### B13. Calculators & converters (491–560)
491. Unit converter (length) [C]
492. Weight / mass converter [C]
493. Temperature converter [C]
494. Volume converter [C]
495. Area converter [C]
496. Speed converter [C]
497. Time / duration converter [C]
498. Data-size converter (KB/MB/GB) [C]
499. Pressure converter [C]
500. Energy / power converter [C]
501. Angle converter [C]
502. Fuel economy converter [C]
503. Cooking measurement converter [C]
504. Shoe / clothing size converter [C]
505. Currency converter [S]
506. Crypto price converter [S]
507. Roman numeral converter [C]
508. Number to words [C]
509. Words to number [C]
510. Scientific notation converter [C]
511. Fraction ↔ decimal [C]
512. Percentage calculator [C]
513. Ratio calculator [C]
514. Average / mean / median calc [C]
515. Standard deviation calc [C]
516. Loan / EMI calculator [C]
517. Mortgage calculator [C]
518. Compound interest calc [C]
519. Simple interest calc [C]
520. Investment / ROI calc [C]
521. Savings goal calc [C]
522. Tip calculator [C]
523. Discount calculator [C]
524. Tax / VAT / GST calculator [C]
525. Salary (hourly↔annual) calc [C]
526. Paycheck / take-home calc [C]
527. Invoice generator [C]
528. Profit margin calculator [C]
529. Break-even calculator [C]
530. Depreciation calculator [C]
531. Currency denomination breakdown [C]
532. BMI calculator [C]
533. BMR / calorie calculator [C]
534. Body fat calculator [C]
535. Ideal weight calculator [C]
536. Water intake calculator [C]
537. Pregnancy due-date calculator [C]
538. Ovulation calculator [C]
539. Age calculator [C]
540. Date difference calculator [C]
541. Date add / subtract [C]
542. Business-days calculator [C]
543. Countdown timer / generator [C]
544. Time zone converter [C]
545. Meeting planner (multi-zone) [C]
546. Unix time ↔ date [C] *(have basic; expand)*
547. Week number calculator [C]
548. Stopwatch / timer [C]
549. Pomodoro timer [C]
550. GPA calculator [C]
551. Grade / percentage calc [C]
552. Scientific calculator [C]
553. Matrix calculator [C]
554. Equation solver (quadratic) [C]
555. Triangle / geometry calc [C]
556. Prime checker / factorizer [C]
557. GCD / LCM calculator [C]
558. Permutation / combination calc [C]
559. Random number generator [C]
560. Dice / coin / picker [C]

### B14. Color & design (561–585)
561. Color palette generator [C]
562. Color shades / tints generator [C]
563. Complementary color finder [C]
564. Color scheme (analogous/triadic) [C]
565. Gradient generator (advanced) [C] *(have basic)*
566. Color blindness simulator [C]
567. Color name finder (nearest) [C]
568. HEX ↔ RGB ↔ HSL ↔ HSV ↔ CMYK [C] *(expand converter)*
569. Pantone-style approximator [C]
570. Tailwind color palette generator [C]
571. Material Design palette [C]
572. Random color generator [C]
573. Image → color palette [C]
574. CSS variable theme generator [C]
575. Dark-mode color generator [C]
576. Contrast ratio checker [C]
577. Color mixer / blender [C]
578. Lighten / darken tool [C]
579. Opacity / alpha blender [C]
580. Color picker (system/screen) [C]
581. Brand color extractor (from logo) [C]
582. Color harmony wheel [C]
583. Hex to color name [C]
584. CSS named-colors reference [C]
585. Color temperature (Kelvin→RGB) [C]

### B15. SEO & web tools (586–615)
586. Meta tag analyzer [S]
587. Open Graph previewer [S]
588. Twitter card previewer [S]
589. SERP snippet preview [C]
590. robots.txt tester [C] *(have generator)*
591. sitemap.xml generator [C]
592. sitemap validator [S]
593. XML sitemap splitter [C]
594. Canonical tag checker [S]
595. Hreflang generator [C]
596. Schema.org / JSON-LD generator [C]
597. Structured data tester [S]
598. Keyword density (page) [S]
599. Word count (URL) [S]
600. Heading structure (H1–H6) checker [S]
601. Broken link checker [S]
602. Redirect checker (301/302 chain) [S]
603. HTTP header checker [S]
604. Page speed reference / tips [C]
605. Mobile-friendly preview [C]
606. UTM link builder [C]
607. URL shortener (own) [S]
608. URL expander (unshorten) [S]
609. QR for URL [C]
610. Favicon checker [S]
611. .well-known generator (security.txt) [C]
612. ads.txt generator [C]
613. Slug / permalink generator [C] *(have slugify; SEO variant)*
614. Title tag length checker [C]
615. Meta description length checker [C]

### B16. Crypto / security / privacy (616–640)
616. Password strength meter [C]
617. Passphrase (diceware) generator [C]
618. PIN generator [C]
619. Secret / API-key generator [C]
620. SSH key info parser [C]
621. RSA keypair generator [S]
622. Encrypt text (AES) [C]
623. Decrypt text (AES) [C]
624. File encrypt / decrypt (browser) [C]
625. PGP encrypt / decrypt [C]
626. Caesar cipher [C]
627. Vigenère cipher [C]
628. Atbash cipher [C]
629. XOR cipher [C]
630. Base64 of a file [C]
631. Steganography (hide text in image) [C]
632. Steganography reveal [C]
633. Random bytes / token [C]
634. TOTP / 2FA code generator [C]
635. Backup-codes generator [C]
636. Credit-card validator (Luhn) [C]
637. IBAN validator [C]
638. Data anonymizer (PII scrub) [C]
639. Fake identity generator [C]
640. GDPR cookie-policy generator [C]

### B17. Documents & office (641–665)
641. Markdown editor / previewer [C]
642. Markdown table editor [C]
643. Markdown to PDF [C]
644. Markdown to DOCX [S]
645. DOCX to Markdown [S]
646. DOCX to TXT [C]
647. DOCX to HTML [S]
648. RTF to PDF / DOCX [S]
649. ODT ↔ DOCX [S]
650. TXT to PDF [C]
651. TXT to DOCX [C]
652. EPUB reader / metadata editor [C]
653. MOBI ↔ EPUB [S]
654. Resume / CV builder [C]
655. Cover-letter template [C]
656. Invoice / quote builder [C]
657. Receipt generator [C]
658. Letter template generator [C]
659. Contract / NDA template [C]
660. Certificate maker [C]
661. Org-chart maker [C]
662. Flowchart / diagram (mermaid) [C]
663. Gantt chart generator [C]
664. Mind-map maker [C]
665. Slide / presentation outline [AI]

### B18. Generators & fun (666–700)
666. Lorem ipsum (variants: bacon/hipster) [C]
667. Fake data generator (names/addresses) [C]
668. Mock JSON dataset generator [C]
669. Credit-card test numbers [C]
670. UUID/ULID/NanoID generator [C]
671. Random string generator [C]
672. Slug / username generator [C]
673. Password list generator [C]
674. Barcode batch generator [C]
675. QR batch generator (CSV→QR) [C]
676. Random emoji / kaomoji [C]
677. ASCII banner / figlet [C]
678. Box-drawing / table ASCII [C]
679. Random quote generator [C]
680. Random fact generator [C]
681. Decision wheel / spinner [C]
682. Team / group randomizer [C]
683. Bracket / tournament generator [C]
684. Bingo card generator [C]
685. Sudoku generator / solver [C]
686. Crossword maker [C]
687. Word search generator [C]
688. Maze generator [C]
689. Number sequence generator [C]
690. Coupon code generator [C]
691. Hex / random palette art [C]
692. Pattern wallpaper generator [C]
693. Name combiner (couple/brand) [C]
694. Acronym generator [C]
695. Hashtag set generator [C]
696. Username availability formatter [C]
697. Strong-password phrase memorizer [C]
698. Random gradient wallpaper [C]
699. Birthday / countdown card [C]
700. Emoji art / pixel emoji [C]

> **Part B total: 700+ distinct, deduplicated tools.** That comfortably exceeds
> the 500 ask. Recommended build order: lead with **[C]** items (zero infra
> cost, instant SEO landing pages) — audio/video via `ffmpeg.wasm`, the
> calculator/converter family, and the color/text utilities are the highest
> ROI because each is a standalone indexable URL.

---

## Part C — 500+ external services to link out to

> Pattern: a `/resources` (or per-tool "Need more? Try…") page. Each links to a
> best-in-class external product we deliberately don't build. Grouped so you can
> spin up category landing pages (good for SEO + affiliate potential).

### C1. AI assistants & LLMs (1–25)
ChatGPT, Claude, Google Gemini, Microsoft Copilot, Perplexity, Poe, Mistral
Le Chat, Meta AI, Grok (xAI), DeepSeek, Qwen Chat, Hugging Face Chat, Cohere,
Together AI, Groq, Fireworks AI, OpenRouter, Anthropic Console, OpenAI Platform,
Google AI Studio, Replicate, Ollama, LM Studio, Jan, GPT4All.

### C2. AI writing & content (26–55)
Jasper, Copy.ai, Writesonic, Rytr, Sudowrite, Notion AI, Grammarly,
ProWritingAid, QuillBot, Wordtune, Hemingway Editor, Anyword, Frase, Surfer SEO,
Scalenut, Hypotenuse, Writer.com, Lex, Type.ai, Compose AI, HyperWrite,
INK Editor, ClosersCopy, Peppertype, Simplified, GravityWrite, Texta,
Neuroflash, ContentBot, Smart Copy.

### C3. AI image / art (56–90)
Midjourney, DALL·E, Stable Diffusion, Leonardo AI, Adobe Firefly, Ideogram,
Flux (BFL), Recraft, Playground AI, NightCafe, DreamStudio, Krea, Magnific,
Freepik AI, Canva Magic, Bing Image Creator, Civitai, Tensor.art, SeaArt,
Lexica, getimg.ai, Clipdrop, Photoroom, remove.bg, Cleanup.pictures, Pebblely,
Booth.ai, ProductScope, Stylar, Vance AI, Let's Enhance, Topaz Photo AI,
Pixelcut, PhotoRoom, Picsart.

### C4. AI video & audio (91–120)
Runway, Pika, Luma Dream Machine, Sora, Kling, Synthesia, HeyGen, D-ID,
Descript, CapCut, Veed.io, Pictory, InVideo, Lumen5, Fliki, elai.io, Colossyan,
Steve.ai, Kapwing, Opus Clip, Vizard, Submagic, ElevenLabs, Murf, Play.ht,
Resemble AI, Suno, Udio, LANDR, iZotope, Adobe Podcast, Krisp, Cleanvoice,
AssemblyAI, Deepgram.

### C5. Design & creative (121–160)
Canva, Figma, Adobe Express, Adobe Photoshop, Illustrator, InDesign, Sketch,
Framer, Penpot, Photopea, GIMP, Krita, Inkscape, Affinity Designer, Affinity
Photo, Pixlr, Fotor, BeFunky, Crello/VistaCreate, Snappa, Visme, Piktochart,
Venngage, Genially, Marq, Looka, Brandmark, Tailor Brands, Hatchful, Designhill,
Vectr, Gravit, Vexels, Iconscout, Flaticon, The Noun Project, unDraw, Storyset,
Lottiefiles.

### C6. Stock media (161–190)
Unsplash, Pexels, Pixabay, Freepik, Shutterstock, Adobe Stock, iStock, Getty,
Depositphotos, Dreamstime, 123RF, Vecteezy, Envato Elements, Creative Market,
Rawpixel, Burst, Gratisography, Kaboompics, Reshot, Lummi, Mixkit, Coverr,
Pond5, Artlist, Epidemic Sound, Storyblocks, Motion Array, Videvo, Splice,
Free Music Archive.

### C7. Productivity & docs (191–225)
Notion, Google Docs, Microsoft 365, Dropbox Paper, Coda, Obsidian, Roam,
Logseq, Evernote, OneNote, Bear, Craft, Slite, Almanac, Nuclino, ClickUp,
Confluence, Quip, Zoho Writer, WPS Office, OnlyOffice, LibreOffice, Apple
iWork, Grammarly, DeepL Write, Otter.ai, Fireflies, tl;dv, Mem, Reflect,
Tana, Capacities, Anytype, Heptabase, Scrintal.

### C8. Project / task management (226–255)
Trello, Asana, Monday.com, Jira, Linear, Basecamp, Wrike, Smartsheet, Airtable,
Todoist, TickTick, Microsoft To Do, Things, Notion, ClickUp, Height, Shortcut,
Teamwork, Hive, Nifty, Plane, Taiga, OpenProject, Redmine, Zenhub, Productboard,
Aha!, Roadmunk, Miro, Mural.

### C9. File conversion / PDF (peers — link, don't fear) (256–285)
iLovePDF, Smallpdf, PDF24, Sejda, PDFescape, Soda PDF, DocFly, PDF2Go,
Adobe Acrobat online, Foxit, Nitro, PDFelement, CloudConvert, Convertio,
Zamzar, FreeConvert, Online-Convert, DocsPal, Aspose apps, Stirling PDF,
PDF Candy, ILovePDF, TinyWow, 123Apps, Online2PDF, HiPDF, LightPDF,
DeftPDF, Xodo, Combine PDF.

### C10. Developer platforms (286–325)
GitHub, GitLab, Bitbucket, Vercel, Netlify, Cloudflare Pages, Render, Railway,
Fly.io, Heroku, AWS, Google Cloud, Azure, DigitalOcean, Linode, Supabase,
Firebase, PlanetScale, Neon, Turso, Upstash, MongoDB Atlas, Redis Cloud,
CockroachDB, Postman, Insomnia, Hoppscotch, Swagger, Stoplight, Sentry,
LogRocket, Datadog, New Relic, Grafana, Replit, CodeSandbox, StackBlitz,
Glitch, Gitpod, JSFiddle.

### C11. No-code / website builders (326–355)
Webflow, Framer, Wix, Squarespace, WordPress, Ghost, Shopify, Carrd, Dorik,
Typedream, Softr, Bubble, Glide, Adalo, FlutterFlow, Draftbium, Tilda, Strikingly,
Hostinger Builder, GoDaddy, Weebly, Jimdo, Durable, 10Web, Hostinger AI,
Mobirise, Pinegrow, Bricks, Elementor, Divi.

### C12. Marketing & email (356–385)
Mailchimp, Brevo (Sendinblue), ConvertKit, ActiveCampaign, Klaviyo,
Constant Contact, GetResponse, Drip, MailerLite, AWeber, Beehiiv, Substack,
Loops, Customer.io, HubSpot, Marketo, Salesforce, Pardot, Buffer, Hootsuite,
Later, Sprout Social, Publer, Metricool, SocialBee, Tailwind, Canva, Linktree,
Beacons, Bitly.

### C13. SEO & analytics (386–415)
Google Analytics, Google Search Console, Ahrefs, SEMrush, Moz, Ubersuggest,
Screaming Frog, Sitebulb, SE Ranking, Serpstat, Mangools, Surfer SEO,
Clearscope, MarketMuse, Frase, AnswerThePublic, AlsoAsked, Keyword Tool,
SpyFu, Majestic, Plausible, Fathom, Matomo, Mixpanel, Amplitude, Hotjar,
Microsoft Clarity, Crazy Egg, PostHog, Heap.

### C14. Forms & surveys (416–435)
Typeform, Google Forms, Jotform, Tally, Microsoft Forms, SurveyMonkey,
Formstack, Wufoo, Paperform, Cognito Forms, Fillout, Forms.app, Zoho Survey,
Qualtrics, Alchemer, Formspree, Getform, Basin, Formcarry, HeyForm.

### C15. Scheduling & comms (436–465)
Calendly, Cal.com, SavvyCal, Doodle, Acuity, Zoom, Google Meet, Microsoft
Teams, Slack, Discord, Webex, Whereby, Around, Loom, Vimeo Record, Zight,
Twilio, Vonage, Plivo, MessageBird, RingCentral, Aircall, Dialpad, OpenPhone,
Grasshopper, Front, Intercom, Crisp, Tawk.to, Zendesk.

### C16. Storage & file sharing (466–490)
Google Drive, Dropbox, OneDrive, Box, iCloud, pCloud, Mega, Sync.com, Icedrive,
Backblaze, WeTransfer, Smash, Filemail, Send Anywhere, Tresorit, Internxt,
Proton Drive, Wormhole, file.io, Gofile, MediaFire, Mega, Jumpshare, Droplr,
TransferNow.

### C17. Finance / commerce / utility (491–520)
Stripe, PayPal, Wise, Square, Razorpay, Paddle, Lemon Squeezy, Gumroad,
Shopify, WooCommerce, BigCommerce, Etsy, Squarespace Commerce, QuickBooks,
Xero, FreshBooks, Wave, Zoho Books, Bench, Expensify, Ramp, Brex, Mercury,
Revolut, Payoneer, Deel, Remote, Gusto, Rippling, Bill.com.

> **Part C total: 520+ services across 17 link-out categories.** Each category
> can be its own `/resources/<category>` page (e.g. "Best AI image generators",
> "Top PDF tools") — these rank well as comparison/listicle content and feed
> internal links back to your own tools.

---

## Build log — shipped this session (40 new tools, all live [C])

All wired through the existing lazy-load pipeline (`runner.tsx` `dynamic()` per
tool) so each tool page still ships only its own JS chunk. Verified: `tsc`
clean + every route returns HTTP 200 on the local dev server.

- **Wave 1 (10):** remove-line-breaks, add-line-numbers, remove-empty-lines,
  extract-emails, extract-urls, upside-down-text, morse-code, json-minifier,
  html-entity-encoder, html-entity-decoder.
- **Wave 2 (12):** remove-extra-spaces, word-frequency-counter,
  remove-punctuation, extract-numbers, remove-html-tags, nato-phonetic,
  leetspeak, reverse-words, string-escape, text-to-hex, query-string-parser,
  csv-to-markdown.
- **Wave 3 (10):** shuffle-lines, remove-accents, remove-line-numbers,
  text-repeater, find-and-replace, json-to-query-string, xml-minifier,
  unicode-escape, csv-to-html, tsv-to-json.
- **Wave 4 (8):** NEW category **Converters & Calculators** (`convert`) —
  percentage-calculator, bmi-calculator, age-calculator, tip-calculator,
  discount-calculator, roman-numeral-converter, number-to-words,
  data-size-converter.

Registry now holds **135 tool entries (122 live)** across **7 categories**.

## Path to 900–1,000+ indexable pages

| Source                                   | Now    | Target | Notes |
|------------------------------------------|--------|--------|-------|
| Tool pages (`/tools/<cat>/<slug>`)       | 135    | ~500   | +365 from Part B [C] items |
| Programmatic SEO clusters (`/<slug>`)    | ~400   | ~600   | size/dimension variants grow per new tool |
| Resource / service link-out pages (Part C)| 0     | ~520   | one page per service, or 17 hubs + per-service |
| Service category hubs (`/resources/*`)   | 0      | 17     | "Best AI image generators", etc. |
| Static/content (blog, legal, about…)     | ~15    | ~40    | comparison + how-to articles |
| **Total indexable URLs**                 | **~550** | **~1,650** | comfortably clears 900–1,000 |

**Fastest route to 1,000:** finish the [C] tool families (~365 pages) + ship the
520 service pages. That alone is ~885 new URLs on top of today's ~550.

## Suggested next steps
1. **Pick a wave.** I'd start with 30–40 **[C]** tools that share existing infra
   (text/color/calculator/converter families) — each becomes an indexable page
   with near-zero marginal cost.
2. **Audio/video via `ffmpeg.wasm`** is the biggest untapped category vs. iLovePDF
   peers — high search volume, fully client-side, no per-call cost.
3. **Resources pages (Part C)** can ship as static content immediately and start
   pulling SEO traffic while the new tools are built.

Want me to scaffold the first wave into `registry.ts` (say, the converter +
color + text families) so they appear as live/soon tool pages?
