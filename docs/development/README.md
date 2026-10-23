# Development Guide

TODO: document local setup steps beyond the root README (env variables,
running migrations, seeding data, coding conventions, branch strategy).

## Database Route Handling

The backend currently uses a synchronous SQLAlchemy `Session` from
`app.core.database`. Route handlers that perform synchronous database work and
do not await an asynchronous operation should use `def`, not `async def`.
FastAPI runs synchronous handlers in its threadpool, preventing SQLAlchemy
operations from blocking the event loop.

Handlers that also perform asynchronous work, such as notification delivery,
file processing, or external payment HTTP requests, remain `async def`. If the
database layer is migrated to SQLAlchemy's async engine in the future, these
routes can be converted back as part of that migration.

## Admin Pagination

Admin queues return a bounded response in the form `{ total, page, page_size,
items }`. The default page size is 20 and the API caps requests at 100 items.
The admin console requests only the active page and uses the returned total for
queue navigation. New admin list endpoints should follow the same contract and
apply `LIMIT/OFFSET` in the database query rather than slicing a full result in
Python.

## Server-Rendered Catalogue Pages

The public programmes and opportunities pages fetch catalogue data on the
server. Next.js caches each response for 60 seconds with `unstable_cache`,
while the pages remain dynamic so a frontend build does not permanently cache
an empty result when the backend is unavailable during deployment.
