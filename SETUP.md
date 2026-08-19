# Scrab Tools — Repo, Domain & Deployment Setup

This guide gets Scrab Tools from local code to a live site at **www.scrabtools.site**.
Do these steps side-by-side while development continues.

---

## 1. Git repository

From the project root (`D:\ENHANCEMENT\PROJECTS\TOOLS`):

```bash
git init
git add .
git commit -m "Initial commit: Scrab Tools platform"
```

Create an empty repo on GitHub (e.g. `scrab-tools`), then:

```bash
git branch -M main
git remote add origin https://github.com/<you>/scrab-tools.git
git push -u origin main
```

> `.env` and `.env.local` are gitignored — your real secrets (incl. the reCAPTCHA
> secret) will **not** be pushed. Only `.env.example` files are committed.

**Monorepo layout**
```
/frontend   Next.js 16 app  → deploy to Vercel
/server     Express API     → deploy to Render
```

---

## 2. Free infrastructure accounts (all have free tiers)

| Need        | Service                | Notes |
|-------------|------------------------|-------|
| PostgreSQL  | **Neon** (neon.tech)   | Create a project → copy the `postgresql://...` connection string |
| Redis       | **Upstash** (upstash.com) | Optional. Enables distributed rate-limiting + BullMQ queue |
| File storage| **Cloudflare R2**      | Optional. Create a bucket + API token (S3-compatible) |

Without any of these, the app still runs (guest mode, local-disk storage,
in-memory processing). Add them when you want accounts, history and scale.

---

## 3. Local development

**Backend**
```bash
cd server
cp .env.example .env          # then edit values
npm install
npm run prisma:generate       # needs a DATABASE_URL only for migrate
npm run dev                   # http://localhost:4000  (GET /ready to verify)
```

**Frontend**
```bash
cd frontend
cp .env.example .env.local    # already has localhost defaults
npm install
npm run dev                   # http://localhost:3000
```

To enable accounts locally, set `DATABASE_URL` in `server/.env` to your Neon
string, then `npm run prisma:migrate` once to create the tables.

---

## 4. Domain setup — www.scrabtools.site

You'll point a **subdomain** at the two hosts.

### 4a. reCAPTCHA (do this first)
reCAPTCHA runs on **every page** of the site and is verified on **every
state-changing API call**. Two tiers are supported — pick one and configure both
apps to match.

**Enterprise (default).** In the Google Cloud console → *Security → reCAPTCHA*,
open your score-based key and confirm **`www.scrabtools.site`** (and
`localhost` for testing) are in the **Domains** list. You need three values:

| Value | Where to find it | Goes in |
|---|---|---|
| Site key (public, e.g. `6Lfo…`) | reCAPTCHA key details | `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` + `RECAPTCHA_SITE_KEY` |
| GCP project ID | Cloud console project picker | `RECAPTCHA_PROJECT_ID` |
| API key | *APIs & Services → Credentials → Create API key*, then **restrict it to the reCAPTCHA Enterprise API** | `RECAPTCHA_API_KEY` |

Enable the **reCAPTCHA Enterprise API** for the project or assessments return 403.

**Classic v3.** Set `RECAPTCHA_MODE=classic` on both apps and supply
`RECAPTCHA_SECRET_KEY` instead of the project/API key pair.

⚠️ **Rotate any secret that was shared in plaintext during development.**
The API key and secret key must never be exposed to the browser — only the
site key is public.

### 4b. DNS records (at your domain registrar / Cloudflare)
- **Frontend** → Vercel: add a `CNAME` for `tools` pointing to `cname.vercel-dns.com`
  (Vercel shows the exact target when you add the domain).
- **API** → Render: add a `CNAME` for `api` (e.g. `api.arivanandhan.in`) pointing to
  your Render service's `onrender.com` hostname.

So: site = `https://www.scrabtools.site`, API = `https://api.arivanandhan.in`.

---

## 5. Deploy the backend (Render)

1. New → **Web Service** → connect the GitHub repo → root directory `server`.
2. Build command: `npm install && npm run build && npm run prisma:generate`
3. Start command: `npm run prisma:deploy && npm start`
4. Environment variables (from `server/.env.example`):
   - `NODE_ENV=production`
   - `DATABASE_URL=` (Neon)
   - `CORS_ORIGINS=https://www.scrabtools.site`
   - `API_BASE_URL=https://api.arivanandhan.in`
   - `JWT_SECRET=` (long random string)
   - reCAPTCHA: `RECAPTCHA_ENABLED=true`, `RECAPTCHA_MODE=enterprise`,
     `RECAPTCHA_PROJECT_ID=`, `RECAPTCHA_API_KEY=`, `RECAPTCHA_SITE_KEY=`
     (classic mode instead: `RECAPTCHA_MODE=classic` + `RECAPTCHA_SECRET_KEY=`)
   - storage: `STORAGE_DRIVER=s3` + the `S3_*` vars if using R2 (else `local`)
5. Add the custom domain `api.arivanandhan.in` in Render → Settings → Custom Domains.

## 6. Deploy the frontend (Vercel)

1. New Project → import the repo → root directory `frontend` (framework auto-detected).
2. Environment variables:
   - `NEXT_PUBLIC_SITE_URL=https://www.scrabtools.site`
   - `NEXT_PUBLIC_API_URL=https://api.arivanandhan.in`
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY=` (your public site key)
   - `NEXT_PUBLIC_RECAPTCHA_MODE=enterprise` (or `classic` — must match the API)
3. Deploy, then add the domain `www.scrabtools.site` in Vercel → Settings → Domains.

---

## 7. Post-deploy SEO checklist
- Submit `https://www.scrabtools.site/sitemap.xml` in **Google Search Console**.
- Verify `robots.txt` and the OG image (`/opengraph-image`) render.
- Run Lighthouse on a tool page; confirm 95+ scores.
- Request indexing for the top featured tool pages.

---

## 8. Quick verification
```bash
curl https://api.arivanandhan.in/ready          # backend health + tool list
open https://www.scrabtools.site/tools/pdf/merge-pdf   # try a real merge
```
