# PostgreSQL context

PostgreSQL, MySQL (InnoDB primary baseline), and SQLite have dialect contexts
in this review. Unsupported dialects are listed as excluded, not reviewed by
analogy.

## Where PostgreSQL projects state their baseline

Server major version in Docker/Compose images (`postgres:<tag>`), CI services,
Terraform/Helm manifests, `postgresql.conf`, and `pgbouncer.ini` (`pool_mode`,
`max_prepared_statements`). Cumulative schema in `pg_dump` snapshots, ordered
migrations, and ORM/declarative configs (Prisma, Drizzle, Diesel, Atlas,
Flyway, Liquibase, `sqlx`). Runtime evidence in committed `EXPLAIN (ANALYZE,
BUFFERS)` plans and locked driver versions (`Cargo.lock`, `go.sum`, JS/TS or
JVM lockfiles).

## Verify in source and baseline

Pin the server major version, pooler mode, and resolved driver version from
workspace files, never from memory. Inspect locked driver or ORM source already
on disk (`vendor/`, `~/.cargo/registry/src`, `node_modules/`, `GOMODCACHE`,
`~/.m2/repository`) before claiming protocol, pooling, or transaction behavior.
Verify both current SQL and proposed safer forms against the pinned server
version. When a missing server version or pooler config decides the claim,
route to `needs confirmation` or mark the step unproven.

## Questions to settle before claiming

- **Exclusive DDL locks and lock-safe `NOT NULL`**: Does rewriting or metadata
  `ALTER TABLE`, `TRUNCATE`, `VACUUM FULL`, or `CLUSTER` omit `lock_timeout`?
  Check lock-safe `NOT NULL` (PG 18 `NOT NULL ... NOT VALID`, earlier `CHECK
  (col IS NOT NULL) NOT VALID`) and ensure `NOT VALID` and `VALIDATE` run in
  separate transactions so `ACCESS EXCLUSIVE` is not held across the scan;
  binary-coercible type alters still rebuild non-matching indexes.
- **Foreign keys and concurrent indexes**: Does `ADD FOREIGN KEY ... NOT VALID`
  still take `SHARE ROW EXCLUSIVE` on both child and parent tables, requiring a
  `lock_timeout`? On partitioned tables, `CREATE INDEX CONCURRENTLY` cannot
  target the parent directly (use `ON ONLY parent`, per-leaf `CONCURRENTLY`,
  and `ATTACH PARTITION`); failed `CONCURRENTLY` leaves `INVALID` indexes that
  `IF NOT EXISTS` silently skips.
- **Session state, poolers, and MVCC**: Is `SET LOCAL` run outside an explicit
  `BEGIN...COMMIT` (emitting a warning with no effect)? Check `pgbouncer.ini`
  before flagging driver protocol prepared statements (PgBouncer 1.21+ supports
  them when `max_prepared_statements > 0`, whereas explicit SQL `PREPARE` still
  breaks transaction pooling). Check `40001` retry loops under `SERIALIZABLE`
  or `REPEATABLE READ` and long transactions holding back vacuum.
- **NULL uniqueness and RLS boundaries**: Does a `UNIQUE` index allow duplicate
  `NULL`s where `UNIQUE NULLS NOT DISTINCT` (PG 15+) or a partial index is
  needed? Remember `FORCE ROW LEVEL SECURITY` still does not apply to
  `SUPERUSER` or `BYPASSRLS` roles, and `SECURITY DEFINER` functions need a
  pinned `SET search_path`.
- **Planner and B-tree skip scans**: Check the server version before flagging
  an omitted low-cardinality leading index column (PG 18 adds B-tree skip
  scans), and require an `EXPLAIN (ANALYZE, BUFFERS)` plan before claiming
  HOT-update loss or correlated `EXISTS`/`IN` slowness.

## PostgreSQL boundaries

- **Finding**: Valid on the pinned PostgreSQL version, pooler mode, and driver;
  keeps results, `NULL`/collation behavior, and rolling-deploy `D -> H` safety;
  never places `CONCURRENTLY` inside a transaction block.
- **Tradeoff**: Adds index write/storage cost or potential HOT-update loss,
  splits DDL into multi-step expand-and-contract deploys, increases isolation
  with retry overhead, or replaces `OFFSET` with keyset pagination.

## Not a finding in PostgreSQL

- `TEXT` versus `VARCHAR(n)` for performance (`varlena` storage is identical;
  flag only when an enforced domain length constraint is missing).
- Uniform-direction B-tree reverse scans (`ASC` vs `DESC`) when no mixed
  multi-column sort direction or `NULLS` ordering mismatch exists.
- Flagging protocol-level prepared statements under PgBouncer without reading
  the PgBouncer version and `max_prepared_statements` setting.
- Unconditional HOT-update loss or PG 18+ skip-scan rejections without an
  `EXPLAIN (ANALYZE, BUFFERS)` plan.
