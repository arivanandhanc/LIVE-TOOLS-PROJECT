# Testing Strategy

ConvertFlow uses a layered testing approach so that the most valuable, highest-risk
logic is covered first, with fast feedback in CI.

## Layers

| Layer | Scope | Tooling | Status |
|-------|-------|---------|--------|
| Unit | Pure logic: PDF processors, password hashing, JWT, CSV/text transforms | Vitest | ✅ implemented (`server/src/__tests__`) |
| Type safety | Whole codebase | `tsc --noEmit` (server), `next build` (frontend) | ✅ enforced in CI |
| Integration | API routes end-to-end (upload → process → download) | Vitest + supertest | 🔜 recommended next |
| Component | React tool components | Vitest + React Testing Library | 🔜 |
| E2E | Critical user journeys (run a tool, sign in, admin) | Playwright | 🔜 |
| Accessibility | WCAG checks on key pages | axe-core / Lighthouse CI | 🔜 |

## What's covered today

- **PDF processors** — merge (page totals + single-file rejection), rotate, split range,
  page numbers (`server/src/__tests__/pdf.test.ts`).
- **Auth primitives** — scrypt hash verify/reject, JWT sign/verify/tamper
  (`server/src/__tests__/auth.test.ts`).
- **Build-time type checks** — every one of the 110 frontend pages is type-checked and
  prerendered during `next build`.

## Running

```bash
cd server   && npm test            # unit tests
cd server   && npm run typecheck   # types
cd frontend && npm run build       # types + full static build
```

## CI

`.github/workflows/ci.yml` runs lint, typecheck, tests and builds for both apps on every
push/PR, then builds the Docker images. Add a Postgres service container to the `server`
job to enable DB-backed integration tests.

## Recommended additions

1. **API integration tests** with an ephemeral Postgres (Testcontainers or CI service) to
   cover auth, admin and consent flows.
2. **Playwright E2E** for: run a client tool, run a server PDF tool, sign up → dashboard,
   admin consent export.
3. **Lighthouse CI** budget gate to hold the 95+ performance/accessibility/SEO targets.
