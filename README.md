# Arivu's Scrab Tools

> Every file tool you need, in one fast workspace. A privacy-first, enterprise-grade
> alternative to iLovePDF & Adobe Online Tools — **100+ tools**, free, no sign-up required.

Live target: **https://tools.arivanandhan.in**

---

## ✨ Highlights

- **100+ tools** across PDF, Image, CSV/Spreadsheet, Text, Developer and AI categories.
- **Privacy-first:** most tools run entirely in the browser — files never leave your device.
- **Optional login:** use everything as a guest; sign in only to save history & favorites.
- **Enterprise security:** strict CSP & security headers, rate limiting, reCAPTCHA, audit logs,
  encrypted transport, automatic file deletion (guests 1h, users 24h).
- **Built to rank:** static-rendered tool pages, dynamic sitemap, structured data (FAQ/HowTo/
  Breadcrumb), OG images, PWA.
- **Runs with zero infra** for development; upgrades transparently to Postgres + Redis + R2.
- **Beautiful, accessible UI:** yellow premium theme, light/dark mode, mobile-first.

## 🏗 Architecture

```
scrab-tools/
├── frontend/         Next.js 16 · React 19 · TypeScript · Tailwind v4 · PWA  → Vercel
├── server/           Express · TypeScript · Prisma · pdf-lib · BullMQ-ready  → Render
├── docker-compose.yml   Full local stack (Postgres + Redis + MinIO + apps)
├── render.yaml          Render blueprint for the API + managed Postgres
├── SETUP.md             Repo, domain & deployment instructions
└── docs/API.md          REST API reference
```

**Tech stack**

| Layer     | Choice |
|-----------|--------|
| Frontend  | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, next-themes |
| Backend   | Node.js, Express, TypeScript, Prisma ORM |
| Database  | PostgreSQL (Neon) — optional |
| Cache/Queue | Redis (Upstash) + BullMQ — optional |
| Storage   | Local disk → Cloudflare R2 / S3 (driver-based) |
| PDF engine| pdf-lib (pure JS, no native deps) |
| Auth      | JWT (access) + rotating refresh sessions; OAuth + MFA scaffolded |
| Security  | helmet, CORS allowlist, rate limiting, hpp, scrypt hashing, reCAPTCHA v3 |
| Hosting   | Vercel (web) · Render (API) · Cloudflare (CDN/DNS) |

## 🚀 Quick start (local, zero infra)

```bash
# Backend
cd server && cp .env.example .env && npm install && npm run dev      # :4000

# Frontend (new terminal)
cd frontend && cp .env.example .env.local && npm install && npm run dev  # :3000
```

Open http://localhost:3000. Client tools work immediately; the 9 server PDF tools call the API.
To enable accounts, set `DATABASE_URL` (Neon) in `server/.env` and run `npm run prisma:migrate`.

**Full stack via Docker:**
```bash
docker compose up --build      # web :3000, api :4000, postgres, redis, minio
```

See **[SETUP.md](./SETUP.md)** for GitHub, domain (tools.arivanandhan.in) and deployment.

## 🧰 Tool categories

| Category   | Examples | Runs |
|------------|----------|------|
| PDF        | Merge, Split, Compress, Rotate, Watermark, Page numbers, JPG→PDF | Server |
| Image      | JPG↔PNG, WebP, Resize, Compress, Crop, Rotate | Browser |
| CSV / Data | CSV↔JSON, CSV↔TSV, XML→CSV, Cleaner, Dedupe | Browser |
| Text       | Word/char counter, Case converter, Slugify, Diff, Sort | Browser |
| Developer  | JSON/XML formatter, Base64, JWT, Hash, UUID, QR, Regex, Color, Password | Browser |
| AI         | Summary, OCR, Content generation, Image analysis | Server (planned) |

## 🔐 Security & compliance

- GDPR/CCPA-aligned privacy model with on-page legal docs (`/legal/*`).
- Cookie consent banner with a server-side consent ledger (IP, country, browser, version)
  and CSV export in the admin panel.
- Strict Content-Security-Policy + HSTS, X-Frame-Options, nosniff, Referrer-Policy,
  Permissions-Policy (see `frontend/next.config.ts`).
- Server-side reCAPTCHA v3 verification on auth/contact forms; per-route rate limiting.
- Automatic file deletion with a retention sweeper.

## 🧪 Testing

```bash
cd server && npm test          # vitest — pdf processors, auth (hashing + JWT)
cd frontend && npm run build   # type-checks + builds all 110 pages
```

CI (`.github/workflows/ci.yml`) runs lint/typecheck/test/build for both apps and builds Docker images.

## 📈 Monitoring & logging

- Structured logging with **pino** (pretty in dev, JSON in prod) + request IDs and redaction of secrets.
- `/health` and `/ready` endpoints for uptime checks and service status.
- Audit logs and tool-usage metrics surfaced in the admin dashboard.

## 📄 License

Proprietary — © Arivu's Scrab Tools. All rights reserved.
