# Launch posts

Copy-paste drafts for getting Scrab Tools in front of people who might link to it.
Backlinks are the binding constraint right now — not content, not more tools.

**Read this first.** Every one of these communities can smell marketing instantly,
and being caught doing it costs you the account and the domain's reputation.
The rules that actually matter:

- Post as yourself, disclose that you built it. "I built" is welcome; "check out
  this great tool I found" is not, and is trivially detected.
- Never use a link shortener, never post the same text to two places at once.
- Answer every comment, including hostile ones, within the first two hours.
  Engagement is what determines whether a post survives.
- Do not ask anyone for upvotes. On HN this is a bannable offence and the
  detection is better than people assume.
- Lead with the honest limitation. This audience rewards it and punishes the
  opposite.

The angle throughout is the one thing iLovePDF and Smallpdf genuinely cannot
claim: **most tools never upload your file at all.**

---

## 1. Hacker News — Show HN

Post title (HN titles must be plain, no marketing adjectives):

```
Show HN: PDF and image tools that run entirely in the browser
```

First comment, posted immediately after submitting:

```
I kept needing to merge or compress a PDF, and every option meant uploading a
document I'd rather not hand to a stranger's server. Usually a contract, a
passport scan, or a payslip.

Most of these tools don't upload anything. Image conversion, compression,
resizing, CSV/JSON work, JWT decoding, hashing and the text utilities all run on
a canvas or in plain JS in your tab. You can verify it the obvious way: open the
page, kill your network connection, and the tools still work.

Nine PDF operations do go to a server, because pdf-lib work on large files is
painful on a phone: merge, split, compress, rotate, watermark, page numbers,
extract/remove pages and JPG-to-PDF. Those uploads are deleted automatically —
an hour for guests. Each tool page states which mode it uses before you use it,
because a privacy claim you have to dig for isn't much of a claim.

Stack is Next.js on Vercel and a small Express/pdf-lib API on Render. No account
needed for anything.

Honest limitations, since they'll come up anyway:
- PDF-to-Word extracts text; it does not reconstruct layout. A PDF stores glyphs
  at coordinates and has no concept of a paragraph or a table, so anything
  claiming faithful conversion is inferring — I'd rather say what it does.
- Browser processing is bounded by your device's memory. Very large images can
  exhaust a tab on a low-end phone.
- No animated GIF output. Canvas holds one frame and no browser encodes
  animation from it.
- It's ad-supported. That's what pays for the server tools.

https://www.scrabtools.site

Happy to go into the client-side implementation if anyone's interested — the
encoder-support detection was more annoying than expected, since canvas.toBlob
silently substitutes PNG for formats it can't produce.
```

**Timing:** weekday, 08:00–10:00 US Eastern. Then stay at your desk — an
unanswered Show HN dies.

---

## 2. r/privacy

Read the subreddit rules before posting; some require flair or a mod-approved
self-promotion tag. If self-promotion is banned outright, do not post — post to
r/selfhosted and r/InternetIsBeautiful instead.

```
Title: I built browser-based file tools so documents never get uploaded

The thing that finally annoyed me into building this: every "free online PDF
tool" wants you to upload the document first. For a menu, fine. For a passport
scan, a payslip or a signed contract, you're handing a copy to a company whose
retention policy you've never read.

So most tools here don't upload anything. Image conversion and compression,
resizing, CSV and JSON conversion, hashing, JWT decoding, text utilities — all
of it runs in your browser. Load a page, go offline, and it still works. That's
the test I'd want to run before trusting a claim like this, so I've made it easy.

Being straight about the exceptions: nine PDF operations run server-side because
doing them in-browser on large files is genuinely bad on mobile. Those files are
deleted automatically, an hour for guests. Every tool page says which mode it
uses before you touch it.

It's ad-supported, which I mention because "privacy-focused" and "runs ads"
deserve to be said in the same breath rather than one of them being buried. Ads
have no access to the files — the browser-side tools never transmit them at all.

https://www.scrabtools.site

No account, no sign-up, nothing gated.
```

---

## 3. r/selfhosted

This audience will ask about self-hosting immediately. Have a real answer ready —
if the repo is private, say so plainly rather than dodging.

```
Title: Browser-based PDF/image tools — most run fully client-side

Built this after one too many "upload your PDF to continue" pages.

Client-side (nothing leaves the browser): image format conversion between JPG,
PNG, WebP, AVIF, BMP and SVG input, compression, resizing, cropping; CSV/JSON/
TSV/XML conversion; JWT decode, hashing, UUID, QR generation; the text
utilities.

Server-side (Express + pdf-lib, auto-deleted): merge, split, compress, rotate,
watermark, page numbers, extract and remove pages, JPG-to-PDF.

The split is on the page for each tool rather than in a privacy policy nobody
reads.

Stack: Next.js 16 / React 19 on Vercel, Express + pdf-lib on Render, Postgres
only for optional accounts. The whole thing runs without a database if you don't
want accounts.

https://www.scrabtools.site
```

---

## 4. r/InternetIsBeautiful

Strict rules — no self-promotion in the title, and the post must be about the
thing rather than about you. Check current rules before posting.

```
Title: A set of 140+ file tools where most never upload your file

Convert, compress, merge and edit PDFs, images, CSV and text. The image, data
and developer tools run entirely in your browser — you can disconnect from the
internet and they still work.

https://www.scrabtools.site
```

---

## 5. Product Hunt

```
Tagline (60 char max):
Mini tools for PDFs and digital assets — most never upload

Description:
140+ free tools for PDFs, images, CSV data, text and developer formats.

The difference from the usual suspects: most tools run entirely in your browser.
Image conversion, compression, resizing, data conversion and the developer
utilities never transmit your file anywhere — you can go offline mid-task and
they keep working.

Nine PDF operations use a server because in-browser processing of large files is
poor on mobile. Those are deleted automatically within the hour. Each tool page
tells you which mode it uses before you use it.

No account. No watermarks. No file-size paywall.
```

---

## Where else to submit

Low effort, small but real payoff. Do these regardless of whether the posts land:

- AlternativeTo — list as an alternative to Smallpdf and iLovePDF
- SaaSHub, Openalternative.co
- Relevant "awesome" GitHub lists (awesome-privacy, awesome-selfhosted) — read
  the contribution rules; a PR that ignores them gets closed
- Answer real Stack Overflow / Reddit questions where a specific tool genuinely
  helps. Only where it genuinely helps — drive-by links get removed and
  reported.

## What to expect

Be realistic. Most launches get modest traffic and a handful of links, and that
is still a win: you are going from zero backlinks, which is the single thing
holding the domain back. One good HN thread can produce more link equity than
months of adding tools.

Traffic from a launch is a spike that decays within days. The links are the
durable part.
