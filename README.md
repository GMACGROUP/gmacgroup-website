# GMACGROUP Website

> **Bridging Learning, Opportunity, and Impact.**

The official digital platform for **GMACGROUP**, a Human Capital, Research, and
Professional Development organization.

This repository is a **scaffold**: the folder structure, routes, models,
schemas, and components described in the project brief are all in place with
working imports and type signatures, but the actual business logic is left as
`TODO` / `NotImplementedError` stubs. Nothing here is production-ready yet —
it's meant to be a clear, buildable starting point for the team to implement
against.

## Status

**Initial scaffold — not implemented.** Every route, service method, and page
component compiles/runs but returns placeholder data or raises
`NotImplementedError` where real logic is needed. Search the codebase for
`TODO` to find every open item.

## Structure

```text
gmacgroup-website/
├── frontend/     # Next.js 14 + React + TypeScript + Tailwind CSS
├── backend/      # FastAPI (Python) — versioned REST API under /api/v1
├── database/     # SQL migrations, schema docs, seed data (PostgreSQL/Supabase)
├── docs/         # Architecture, API, database, deployment, dev guides
└── .github/      # CI workflow, issue templates, PR template
```

## Getting Started

### Prerequisites
Node.js, npm, Python 3.11+, Git, and a Supabase account.

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # or .venv\Scripts\Activate.ps1 on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Environment
Copy `.env.example` to `.env` in the root (and/or per-package as needed) and
fill in real Supabase, database, and provider credentials. **Never commit
`.env`.**

### Flutterwave payments
Paid VIP and Premium offers use Flutterwave. Add `FLW_SECRET_KEY` and
`FLW_WEBHOOK_SECRET_HASH` to the backend environment, set `FRONTEND_URL`, and
configure the Flutterwave webhook URL as
`https://your-api-host/api/v1/payments/webhook`. Free offers continue to submit
without payment. The backend verifies the transaction amount, currency, and
reference before confirming an enrolment or application.

## What's implemented vs. stubbed

| Layer | What exists | What's stubbed |
|---|---|---|
| Frontend pages | Full route tree (`/about`, `/services`, `/programmes`, `/opportunities`, `/research`, `/insights`, `/contact`, `/login`, `/register`, `/dashboard`) with layout, nav, and footer | Real data fetching, auth wiring, form submission logic |
| Backend API | All route groups (`users`, `services`, `programmes`, `opportunities`, `research`, `contact`, `ai`) registered under `/api/v1`, with Pydantic schemas and ORM models defined | Database queries, auth/JWT verification, AI provider integration — all raise `NotImplementedError` |
| Database | Initial migration (`database/migrations/0001_init.sql`) covering core tables | RLS policies, indexes, seed data |
| CI/CD | GitHub Actions workflow lints frontend and runs backend tests | Build/deploy steps, staging/production pipelines |

## Next Steps

1. Fill in `app/core/config.py` and `.env` with real Supabase/DB credentials.
2. Implement `app/services/*/service.py` methods against the database.
3. Wire frontend pages to `lib/api/client.ts` and `lib/supabase/client.ts`.
4. Implement authentication end-to-end (Supabase Auth + `get_current_user`).
5. Flesh out `docs/` as architectural decisions are made.

## Ownership

Maintained by **GMACGROUP**. Company-owned source code, documentation, and
related intellectual property should be managed according to GMACGROUP's
internal policies and access controls.

---

**GMACGROUP** — Human Capital • Research • Professional Development
