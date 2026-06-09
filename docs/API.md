# Arivu's Scrab Tools API Reference

Base URL (local): `http://localhost:4000` · (prod): `https://api.arivanandhan.in`

All responses are JSON unless downloading a file. Authentication is **optional** — most
endpoints work for guests. Authenticated requests send `Authorization: Bearer <accessToken>`.

## Auth model

- **Access token** (JWT, ~15 min) — returned in the JSON body; store in memory.
- **Refresh token** — set as an httpOnly cookie (`cf_refresh`); rotated on each refresh.
- **Guest id** — httpOnly cookie (`cf_guest`) for anonymous usage tracking.

---

## Health

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness — `{ status, uptime }` |
| GET | `/ready` | Readiness — service status + supported server tools |

## File tools

### `POST /api/tools/:tool`
Process uploaded files with a server-side tool. `multipart/form-data`.

**Fields**
- `files` — one or more files (PDF or JPG/PNG depending on tool).
- `params` — JSON string of tool options (optional).

**Supported tools:** `merge-pdf`, `split-pdf`, `extract-pages`, `remove-pages`,
`rotate-pdf`, `compress-pdf`, `add-page-numbers`, `watermark-pdf`, `jpg-to-pdf`.

**Params by tool**
| Tool | Params |
|------|--------|
| split-pdf / extract-pages / remove-pages | `pages` e.g. `"1-3,5,8-10"` |
| rotate-pdf | `angle` (90/180/270) |
| add-page-numbers | `position` (bottom-center/left/right) |
| watermark-pdf | `text` |

**Response 200**
```json
{
  "jobId": "…",
  "durationMs": 42,
  "file": {
    "id": "…",
    "filename": "merged.pdf",
    "size": 10240,
    "mimeType": "application/pdf",
    "expiresAt": "2026-06-08T12:00:00.000Z",
    "downloadUrl": "http://localhost:4000/api/files/…/download"
  }
}
```

**Errors:** `400` bad input · `404` unknown tool · `413` too large · `415` bad type ·
`422` processing failed · `429` rate limited.

### `GET /api/files/:id/download`
Streams the processed file as an attachment. `404` if expired/auto-deleted.

## Authentication

| Method | Path | Body | Notes |
|--------|------|------|-------|
| POST | `/api/auth/register` | `{ email, password, name? }` | reCAPTCHA-guarded; requires DB |
| POST | `/api/auth/login` | `{ email, password }` | reCAPTCHA-guarded |
| POST | `/api/auth/refresh` | — | uses `cf_refresh` cookie |
| POST | `/api/auth/logout` | — | clears session |
| GET  | `/api/auth/me` | — | requires Bearer token |
| GET  | `/api/auth/oauth/:provider` | — | google/github/microsoft (when configured) |

reCAPTCHA token is sent in the `X-Recaptcha-Token` header.

## Consent

### `POST /api/consent`
Records a cookie-consent choice (IP, country, browser, version captured server-side).
```json
{ "necessary": true, "analytics": true, "marketing": false, "consentVersion": "1.0" }
```

## Admin (requires ADMIN role)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/stats` | Totals: users, files, jobs, usage, consents |
| GET | `/api/admin/tools` | Per-tool usage, failures, avg duration |
| GET | `/api/admin/users?q=` | Search users |
| PATCH | `/api/admin/users/:id` | `{ status: ACTIVE\|SUSPENDED\|DELETED }` |
| GET | `/api/admin/consent/export?format=csv` | Download consent ledger as CSV |
| GET | `/api/admin/audit` | Recent audit log entries |

## Rate limits

- Global API: 300 requests / 15 min per IP.
- Uploads: 40 / 15 min per IP.
Exceeding returns `429` with `{ "error": "Too many requests…" }`.
