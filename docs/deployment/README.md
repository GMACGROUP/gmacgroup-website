# Deployment

This project deploys as two services backed by managed PostgreSQL/Supabase:

- `frontend`: Next.js standalone server on port `3000`.
- `backend`: FastAPI/Uvicorn service on port `8000`.
- Database and document storage: managed PostgreSQL/Supabase and durable object storage.

Do not deploy local upload storage, development secrets, or the repository
`.env.example` values to production.

## Required Production Configuration

Backend environment variables:

```env
ENVIRONMENT=production
DATABASE_URL=postgresql://...
ALLOWED_ORIGINS=["https://www.example.com"]
JWT_SECRET=<at-least-32-random-characters>
FRONTEND_URL=https://www.example.com
STORAGE_PROVIDER=supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<secret>
STORAGE_BUCKET=resumes
FLW_SECRET_KEY=<secret>
FLW_WEBHOOK_SECRET_HASH=<secret>
EMAIL_PROVIDER=resend
RESEND_API_KEY=<secret>
EMAIL_FROM=GMACGROUP <notifications@example.com>
OPERATIONS_EMAIL=operations@example.com
```

Frontend build-time environment variables:

```env
NEXT_PUBLIC_API_URL=https://api.example.com/api/v1
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<public-anon-key>
```

Only `NEXT_PUBLIC_*` values are exposed to browser code. Store all other
secrets in the hosting provider's secret manager.

## Database Migration

Apply migrations in filename order against the production database before
starting a new backend release. Migration `0008_member_history_indexes.sql`
supports member history and admin pagination queries. Take a database backup
before applying migrations and verify indexes with representative
`EXPLAIN (ANALYZE, BUFFERS)` queries.

## Container Builds

Run these commands from the repository root:

```bash
docker build -f backend/Dockerfile -t gmacgroup-backend:latest .
docker build -f frontend/Dockerfile --build-arg NEXT_PUBLIC_API_URL=https://api.example.com/api/v1 -t gmacgroup-frontend:latest frontend
```

The backend image runs as a non-root user with two Uvicorn workers. The
frontend uses Next.js standalone output and runs as the non-root `nextjs` user.

The frontend build argument must be supplied by CI or the hosting platform.

## Service Probes

- Backend liveness: `GET /health` expects HTTP `200`.
- Backend readiness: `GET /ready` expects HTTP `200`; it returns `503` when the database cannot be reached.
- Frontend: `GET /` expects HTTP `200`.

Route the payment webhook to:

```text
https://api.example.com/api/v1/payments/webhook
```

## Release Order

1. Build and scan both images in CI.
2. Apply database migrations.
3. Deploy the backend and wait for `/ready` to return `200`.
4. Deploy the frontend with the production API URL.
5. Verify `/`, `/health`, `/ready`, login, catalogue pages, document upload, and payment webhook delivery.
6. Keep the previous image available for rollback.

The GitHub Actions workflow now runs frontend lint/build and backend
installation, compilation, and tests. A production pipeline should additionally
build and scan both Docker images, publish immutable image tags, and run
migrations as an explicit deployment step rather than during container startup.
