# Arivu's Scrab Tools — Database review & feature status

This document reviews the data model and records the status of the work in this
update, including what each remaining "coming soon" item still needs.

## Database structure (Prisma / PostgreSQL)

The schema (`server/prisma/schema.prisma`) is well-normalised and already covers
everything the dashboard and auth features need.

| Model | Purpose | Used by |
|-------|---------|---------|
| `User` | Accounts. `emailVerified`, `passwordHash`, `image`, `role`, `planTier`, `mfaEnabled` | auth, dashboard, plan gating |
| `Account` | Linked OAuth providers (`provider` + `providerAccountId`) | **Google sign-in** (new) |
| `Session` | Rotating refresh tokens | login persistence / refresh |
| `EmailOtp` | One-time email codes (`codeHash`, `purpose`, `attempts`, `expiresAt`) | **OTP verification** (new model) |
| `File` | Stored outputs with retention `expiresAt` | storage, dashboard "storage used" |
| `Job` | Server tool runs | server tools |
| `ToolUsage` | Per-run record (`tool`, `userId`/`guestId`, `success`, `durationMs`) | **dashboard stats + recent activity** |
| `Favorite` | Per-user starred tools | dashboard favorites |
| `AuditLog`, `ConsentRecord`, `Plan`, `Setting`, `Notification` | admin / compliance | admin panel |

**No schema gaps for the shipped features.** Only one model was added this
round: `EmailOtp`. Because deploy uses `prisma db push` (see commit history),
the new table is created automatically on the next deploy — no migration file
needed.

> Note: persistence features (accounts, dashboard stats, favorites, OTP, Google
> sign-in) require `DATABASE_URL`. Without it the API runs guest-only and these
> endpoints return 503 by design.

## What shipped in this update

- **Refresh keeps you signed in.** Refresh cookie is now `SameSite=None; Secure`
  in production so it survives the cross-site web⇄API request. (`routes/auth.ts`,
  `middleware/identity.ts`)
- **Dashboard is live data.** New `/api/me/stats`, `/api/me/activity`,
  `/api/me/favorites` endpoints + a `/api/usage` beacon so browser tools also
  record history. Dashboard renders real numbers and recent activity.
- **Region pricing.** Two plans (Basic free / Pro). Pro shows ₹10/mo for India,
  $10/mo elsewhere, via a CDN-country header (`/api/geo`) with a timezone
  fallback.
- **AI tools live.** `document-summary`, `pdf-summary`, `ocr-extraction`,
  `content-generator`, `image-analysis` call the Claude API (`@anthropic-ai/sdk`,
  model `claude-opus-4-8`). Activates when `ANTHROPIC_API_KEY` is set; require an
  account.
- **Google sign-in.** Full OAuth code flow; activates when
  `OAUTH_GOOGLE_CLIENT_ID/SECRET` are set.
- **OTP email verification.** Register/login now require a 6-digit emailed code
  before issuing tokens. Sends via SMTP when configured, otherwise logs the code
  (dev).
- **Featured tools** moved to a separate section at the bottom of the home page.
- **Owner link** to arivanandhan.in in the footer.
- **Blog** with real tool-explainer articles at `/blog/[slug]` (+ sitemap).

## Plans (Task: basic free / advanced paid)

- `PlanTier` enum already exists (`FREE`, `PRO`, `BUSINESS`, `ENTERPRISE`) and
  `User.planTier` defaults to `FREE`.
- Pricing page presents **Basic (free)** and **Pro** (₹10/$10). Pro is positioned
  for AI tools + high-resource server processing.
- AI tools already require an account. To turn the positioning into a hard
  paywall, two things remain (intentionally not enabled — they need a billing
  provider): (1) a Stripe (or Razorpay for INR) checkout that sets
  `user.planTier = PRO`; (2) a `requirePro` guard on AI/high-resource routes that
  checks `req.userRole`/plan. The hook points are `routes/ai.ts` and
  `services/jobs.ts`.

## "Coming soon" tools — what each still needs

Activated now: the **AI** category (needs `ANTHROPIC_API_KEY`).

Still `soon` because each needs a real engine or third-party service:

| Tool(s) | Needs |
|---------|-------|
| PDF↔Word / Excel / PowerPoint | LibreOffice (headless) or a conversion API; heavy native deps |
| pdf-to-jpg, unlock/protect/repair/ocr/sign/edit PDF | rasterizer (pdfium/poppler), qpdf, an OCR engine |
| background-remover, ai-image-enhancement | a vision/segmentation model or API |
| csv-to-excel / excel-to-csv | `xlsx` library (client) — straightforward follow-up |
| qr-scanner, html-to-markdown, cron-parser, .htpasswd, data-formatter | small client libs — straightforward follow-ups |

The quickest wins (no infra) are the client-side ones: `csv-to-excel`,
`excel-to-csv`, `html-to-markdown`, `qr-scanner`, `cron-parser`. They just need a
client `impl/` component registered in `components/tools/runner.tsx` and the
registry status flipped to `live`.
