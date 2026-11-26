# SQLite context

## Where SQLite projects state their baseline

Bundled or target SQLite version in lockfiles and manifests, connection-open
hooks executing `PRAGMA` statements, ordered migrations, `.schema` dumps,
migration runner configs, and committed `EXPLAIN QUERY PLAN` outputs.

## Verify in source and baseline

Pin the bundled or runtime SQLite version and inspect every connection
initialization path: SQLite resets per-connection `PRAGMA` settings on each new
connection unless an open hook applies them. Inspect locked driver source on
disk (per the contract) for transaction defaults, busy handlers, error codes,
and pool sizing. Verify both current SQL and proposed safer forms against the
pinned SQLite version; route missing deciding version or `PRAGMA` setup to
`needs confirmation` or mark absent source `unproven`.

## Questions to settle before claiming

- **Per-connection foreign keys**: Is `PRAGMA foreign_keys = ON` executed on
  every connection outside any transaction? It defaults `OFF` per connection
  and is a silent no-op inside an active transaction or `SAVEPOINT`.
- **Table-rebuild migrations**: Do 12-step rebuilds follow the documented
  sequence (`PRAGMA foreign_keys = OFF` outside tx, `BEGIN`, rebuild,
  `PRAGMA foreign_key_check`, `COMMIT`, `PRAGMA foreign_keys = ON`) so dropping
  the old table does not fail or fire `ON DELETE CASCADE`?
- **Write concurrency and deferred upgrades**: Do read-then-write transactions
  start with default `BEGIN DEFERRED`? Upgrading a deferred read transaction to
  a write lock under concurrency returns `SQLITE_BUSY` immediately, bypassing
  `busy_timeout`. Write transactions need `BEGIN IMMEDIATE` paired with
  `PRAGMA busy_timeout` and `PRAGMA journal_mode = WAL`.
- **Type affinity and exact decimals**: Does the schema store money or exact
  decimals in `NUMERIC` or `DECIMAL` columns? SQLite stores fractional
  `NUMERIC`/`DECIMAL` values as 64-bit IEEE-754 `REAL` floats; exact decimals
  need scaled `INTEGER` minor units or a dedicated decimal representation.
  Without `STRICT` tables (verify pinned version) or `CHECK` constraints, SQLite
  accepts any value type in any column.
- **Version-gated SQL/DDL and query plans**: Verify the pinned SQLite version
  before proposing newer clauses (`RETURNING`, `DROP COLUMN`, or `IS DISTINCT
  FROM`, where older SQLite uses `IS NOT`). Check `EXPLAIN QUERY PLAN` before
  flagging `EXISTS`/`IN` semi-joins or planner index choices.

## SQLite boundaries

- **Finding**: Valid on the pinned SQLite version and driver, honors
  outside-transaction `PRAGMA` rules, and preserves numeric precision,
  referential integrity, and write-concurrency safety.
- **Tradeoff**: Enabling `WAL` mode (requires local filesystem support for
  `-wal`/`-shm` sidecar files), rebuilding live tables to adopt `STRICT`,
  changing monetary storage representation, or serializing writers in app code.
- **Rejected**: Safer forms relying on unsupported client-server syntax
  (`CREATE INDEX CONCURRENTLY`, `ALGORITHM=INSTANT`, `SELECT ... FOR UPDATE`)
  or features newer than the pinned SQLite version.

## Not a finding in SQLite

- Using `TEXT` instead of `VARCHAR(n)` (SQLite ignores `n`; enforce domain
  length limits with `CHECK (length(col) <= n)` only when required).
- Omitting `AUTOINCREMENT` on `INTEGER PRIMARY KEY` (`INTEGER PRIMARY KEY`
  already auto-increments via rowid; `AUTOINCREMENT` adds overhead and is only
  needed when deleted rowids must never be reused).
- Omitted low-cardinality leading index columns on analyzed tables without
  `EXPLAIN QUERY PLAN`.
