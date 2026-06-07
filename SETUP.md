# ConvertFlow — Repo, Domain & Deployment Setup

This guide gets ConvertFlow from local code to a live site at **tools.arivanandhan.in**.
Do these steps side-by-side while development continues.

---

## 1. Git repository

From the project root (`D:\ENHANCEMENT\PROJECTS\TOOLS`):

```bash
git init
git add .
git commit -m "Initial commit: ConvertFlow platform"
```

Create an empty repo on GitHub (e.g. `convertflow`), then:

```bash
git branch -M main
git remote add origin https://github.com/<you>/convertflow.git
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

## 4. Domain setup — tools.arivanandhan.in

You'll point a **subdomain** at the two hosts.

### 4a. reCAPTCHA (do this first)
In the [reCAPTCHA admin console](https://www.google.com/recaptcha/admin) for your
site key, confirm **`tools.arivanandhan.in`** (and `localhost` for testing) are in
the **Domains** list. Your existing key is already for `arivanandhan.in`, so just
add the subdomain.
⚠️ **Rotate the secret key** — it was shared in plaintext during development.

### 4b. DNS records (at your domain registrar / Cloudflare)
- **Frontend** → Vercel: add a `CNAME` for `tools` pointing to `cname.vercel-dns.com`
  (Vercel shows the exact target when you add the domain).
- **API** → Render: add a `CNAME` for `api` (e.g. `api.arivanandhan.in`) pointing to
  your Render service's `onrender.com` hostname.

So: site = `https://tools.arivanandhan.in`, API = `https://api.arivanandhan.in`.

---

## 5. Deploy the backend (Render)

1. New → **Web Service** → connect the GitHub repo → root directory `server`.
2. Build command: `npm install && npm run build && npm run prisma:generate`
3. Start command: `npm run prisma:deploy && npm start`
4. Environment variables (from `server/.env.example`):
   - `NODE_ENV=production`
   - `DATABASE_URL=` (Neon)
   - `CORS_ORIGINS=https://tools.arivanandhan.in`
   - `API_BASE_URL=https://api.arivanandhan.in`
   - `JWT_SECRET=` (long random string)
   - `RECAPTCHA_SECRET_KEY=` (your rotated secret), `RECAPTCHA_ENABLED=true`
   - storage: `STORAGE_DRIVER=s3` + the `S3_*` vars if using R2 (else `local`)
5. Add the custom domain `api.arivanandhan.in` in Render → Settings → Custom Domains.

## 6. Deploy the frontend (Vercel)

1. New Project → import the repo → root directory `frontend` (framework auto-detected).
2. Environment variables:
   - `NEXT_PUBLIC_SITE_URL=https://tools.arivanandhan.in`
   - `NEXT_PUBLIC_API_URL=https://api.arivanandhan.in`
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY=` (your public site key)
3. Deploy, then add the domain `tools.arivanandhan.in` in Vercel → Settings → Domains.

---

## 7. Post-deploy SEO checklist
- Submit `https://tools.arivanandhan.in/sitemap.xml` in **Google Search Console**.
- Verify `robots.txt` and the OG image (`/opengraph-image`) render.
- Run Lighthouse on a tool page; confirm 95+ scores.
- Request indexing for the top featured tool pages.

---

## 8. Quick verification
```bash
curl https://api.arivanandhan.in/ready          # backend health + tool list
open https://tools.arivanandhan.in/tools/pdf/merge-pdf   # try a real merge
```
