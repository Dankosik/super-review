# PostgreSQL context

## Where PostgreSQL projects state their baseline

Server major version in Docker/Compose images (`postgres:<tag>`), CI services,
Terraform/Helm manifests, `postgresql.conf`, and `pgbouncer.ini` (`pool_mode`,
`max_prepared_statements`). Cumulative schema in `pg_dump` snapshots, ordered
migrations, declarative or ORM schemas, and migration runner configs (noting
transactional mode and opt-out syntax). Runtime evidence in committed
`EXPLAIN (ANALYZE, BUFFERS)` plans and locked driver manifests.

## Verify in source and baseline

Pin the server major version, pooler mode, migration runner transactional mode,
and resolved driver version from workspace files, never memory. Inspect locked
driver or ORM source on disk (per the contract) before claiming protocol,
pooling, error-code, or transaction behavior. Verify both current SQL and
proposed safer forms against the pinned version and runner mode; route missing
deciding config to `needs confirmation` or mark absent source `unproven`.

## Questions to settle before claiming

- **Exclusive DDL locks and lock-safe `NOT NULL`**: Does rewriting or metadata
  `ALTER TABLE`, `TRUNCATE`, or full-table maintenance omit `lock_timeout`?
  Check lock-safe `NOT NULL` (PG 18 `ADD CONSTRAINT ... NOT NULL col NOT VALID`,
  earlier `CHECK (col IS NOT NULL) NOT VALID`), ensure `NOT VALID` and `VALIDATE`
  run in separate transactions, and verify binary-coercible alters do not
  rebuild indexes.
- **Foreign keys and concurrent indexes**: Does `ADD FOREIGN KEY ... NOT VALID`
  take `SHARE ROW EXCLUSIVE` on both child and parent tables without a
  `lock_timeout`? Check runner non-transactional opt-out before `CREATE INDEX
  CONCURRENTLY` (use `SET`/`RESET lock_timeout`, not `SET LOCAL`); partitioned
  parents need `ON ONLY` plus per-leaf `CONCURRENTLY` and attach; failed builds
  leave `INVALID` indexes that `IF NOT EXISTS` skips.
- **Session state, poolers, and MVCC**: Is `SET LOCAL` run outside an explicit
  `BEGIN...COMMIT` (warning/no-op)? Does code use explicit SQL `PREPARE`,
  session `SET`, `LISTEN`, or temp tables under transaction-mode pooling? Check
  `40001` retry loops under `SERIALIZABLE` or `REPEATABLE READ` and long
  transactions stalling vacuum.
- **NULL uniqueness and RLS boundaries**: Does a `UNIQUE` index allow duplicate
  `NULL`s where `UNIQUE NULLS NOT DISTINCT` (check pinned PG version) or a
  partial index is needed? Check whether `FORCE ROW LEVEL SECURITY` is bypassed
  by `SUPERUSER` or `BYPASSRLS` roles, and whether `SECURITY DEFINER` routines
  pin `SET search_path`.
- **Collation, expression indexes, and version gates**: Do `LOWER(...)` or
  timezone-dependent expressions defeat B-tree indexes or depend on session
  `TimeZone` (for example `timestamptz + INTERVAL '1 day'` vs `'24 hours'`
  across DST)? Verify pinned PG major version before proposing version-gated
  DDL or indexing changes.

## PostgreSQL boundaries

- **Finding**: Valid on the pinned PostgreSQL version, pooler mode, migration
  runner tx mode, and driver; keeps results, `NULL`/collation behavior, and
  rolling-deploy `D -> H` safety; never places `CONCURRENTLY` inside a
  transaction block or `SET LOCAL` outside one.
- **Tradeoff**: Adds index write/storage cost or potential HOT-update loss,
  splits DDL into multi-step expand-and-contract deploys, raises isolation retry
  overhead, or replaces `OFFSET` with keyset pagination.

## Not a finding in PostgreSQL

- `TEXT` versus `VARCHAR(n)` for performance (`varlena` storage is identical;
  flag only when an enforced domain length constraint is missing).
- Protocol-level prepared statements under PgBouncer when `pgbouncer.ini` sets
  `max_prepared_statements > 0` on a supporting version, or without reading
  `pgbouncer.ini`.
- Unbacked HOT-update loss or PG 18+ B-tree skip scan rejections lacking an
  `EXPLAIN (ANALYZE, BUFFERS)` plan.
