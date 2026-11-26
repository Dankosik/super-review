# MySQL context

## Where MySQL projects state their baseline

Server version and fork in Docker/Compose images (`mysql:<tag>` or
`mariadb:<tag>`), CI services, cloud manifests, and `my.cnf` (`sql_mode`,
`transaction_isolation`, `default_storage_engine`, `lower_case_table_names`).
Cumulative schema in `mysqldump` snapshots, ordered migrations, declarative or
ORM schemas, and migration runner configs. Runtime evidence in committed
`EXPLAIN FORMAT=TREE` or `EXPLAIN ANALYZE` plans and driver DSN/lockfiles.
InnoDB is the primary baseline; for MariaDB, verify divergences against the
repo's pinned version and docs.

## Verify in source and baseline

Pin MySQL or MariaDB version, storage engine, `sql_mode`, default
charset/collation, migration runner behavior, and DSN flags (`parseTime`,
`multiStatements`, strict mode) from workspace files, never memory. Inspect
locked driver or ORM source on disk (per the contract) before claiming pooling,
timezone, error-code, or statement behavior. Verify both current SQL and
proposed safer forms against the pinned version; route missing deciding config
to `needs confirmation` or mark absent source `unproven`.

## Questions to settle before claiming

- **Online DDL, locks, and implicit commits**: Does `ALTER TABLE` omit explicit
  `ALGORITHM=` and `LOCK=` clauses, risking silent table-copy locks? Verify
  `ALGORITHM=INSTANT` limits (row-version ceiling and FK restrictions) and
  `CHECK` constraint enforcement against the pinned server version; remember DDL
  implicitly commits enclosing transactions on mid-file failure.
- **Silent coercion and unsafe write clauses**: Does non-strict `sql_mode`
  allow silent truncation or zero dates? Does `ON DUPLICATE KEY UPDATE` match
  any unique key rather than only the intended one? Does `REPLACE INTO` delete
  and re-insert (firing `ON DELETE CASCADE`), does `INSERT IGNORE` discard
  errors, or does `UPDATE`/`DELETE ... LIMIT` omit `ORDER BY`?
- **Charset, collation, and NULL-safe comparison**: Does `utf8`/`utf8mb3`
  truncate 4-byte Unicode instead of `utf8mb4`? Do joins or filters mix
  collations (defeating indexes) or mix legacy `PAD SPACE` collations with
  `utf8mb4_0900_ai_ci` (`NO PAD`)? MySQL lacks `IS DISTINCT FROM`; use null-safe
  `NOT (a <=> b)`.
- **InnoDB locking and clustered primary keys**: Under default
  `REPEATABLE READ`, do locking reads or `INSERT INTO ... SELECT` acquire
  gap/next-key or shared source locks causing deadlocks? Does a table omit an
  explicit `PRIMARY KEY` or use random UUID strings as clustered PK on
  write-heavy tables (bloating every secondary index leaf)?
- **SQL mode, `GROUP BY`, and fork divergences**: Does `sql_mode` omit
  `ONLY_FULL_GROUP_BY` so queries return arbitrary non-aggregated column values?
  Verify pinned MySQL vs MariaDB divergences (online DDL clauses, `CHECK`
  enforcement, JSON types, optimizer transforms) against the project's version
  and docs before citing engine rules.

## MySQL boundaries

- **Finding**: Valid on the pinned MySQL/InnoDB (or verified MariaDB) version
  and `sql_mode`, uses MySQL-valid syntax (`<=>`, explicit `ALGORITHM`/`LOCK`),
  and keeps results, collation behavior, and rolling-deploy `D -> H` safety.
- **Tradeoff**: Rebuilding a table to change its clustered PK layout, switching
  isolation to `READ COMMITTED`, adopting online schema-change tooling, or
  adding secondary indexes (each leaf stores the clustered PK).
- **Rejected**: Safer forms relying on PostgreSQL-only syntax (`IS DISTINCT
  FROM`, `CONCURRENTLY`, partial `WHERE` indexes) or transactional DDL
  rollback.

## Not a finding in MySQL

- Missing child foreign-key index in InnoDB (InnoDB automatically creates a
  supporting index on child FK columns unless an existing index already has them
  as a leading prefix).
- Unbacked `O(N*M)` claims on `EXISTS`/`IN` semi-joins, `NOT EXISTS` antijoins
  (added separately from `EXISTS` semi-joins in MySQL 8.0; verify pinned
  version), or omitted low-cardinality leading columns (Index Skip Scan) lacking
  `EXPLAIN`.
- Default InnoDB `REPEATABLE READ` isolation when no gap-lock, next-key, or
  deadlock anomaly is traced.
- Narrowing integer widths (`TINYINT` vs `INT`) on small tables without
  established row-width or index-size impact.
