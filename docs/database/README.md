# Database Documentation

TODO: document the schema defined in `../../database/`, including table
relationships, indexes, and any Row-Level Security policies.

## Performance Indexes

Migration `0008_member_history_indexes.sql` adds indexes for the two
authenticated history queries and the paginated admin queues:

- Applications and programme enrolments: `user_id` or email followed by
	newest-first `created_at` ordering.
- Applications and programme enrolments: `status` followed by
	newest-first `created_at` ordering for filtered admin pages.
- Users, contact requests, and payments: newest-first `created_at` ordering
	for admin list pages.

The migration uses `CREATE INDEX IF NOT EXISTS`, so it can be applied safely
by deployment tooling that may retry migrations.
