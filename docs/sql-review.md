# SQL Review

SQL Review checks schemas, migrations, queries, transactions, indexes, and
application database boundaries by reading. It is one of six reviews in this
repository; [the family design](review-family.md) explains how they relate,
where SQL Review's boundary meets sibling skills, and why none of them executes
project code or connects to a database.

## Supported dialects and sources

- **Dialects (v1):** PostgreSQL, MySQL (InnoDB primary baseline; MariaDB
  divergences verified against the repository's version baseline and docs),
  and SQLite.
- **Excluded dialects:** SQL Server/T-SQL, Oracle, ClickHouse, BigQuery,
  Snowflake, DuckDB, and NoSQL stores are excluded and listed, never reviewed
  by analogy.
- **SQL sources:** standalone `.sql` files (migrations, views, routines,
  triggers, named queries such as `sqlc`, backfills), declarative and ORM
  schemas (`schema.prisma`, Drizzle, Diesel, Atlas HCL, Liquibase, Flyway,
  JPA `@Entity`/`@Table`, GORM models), and embedded SQL or DB call sites in
  Go, TypeScript, Rust, and Java.

## Six lenses

| Lens | Focus |
| --- | --- |
| `schema` | Integrity constraints, exact/lossless column types, cascades, declared RLS/tenant isolation, schema-to-model drift. |
| `migrations` | Non-blocking DDL, explicit lock bounds, rolling-deploy (`D -> H`) safety, bounded idempotent backfills, invalid-index and partial-commit hazards. |
| `queries` | Three-valued `NULL` logic, join multiplicity and outer-join filter placement, deterministic ordering and pagination, unbounded writes, and provable schema-evolution fragility. |
| `transactions` | Check-then-act and lost-update races, deadlock lock-order inversions, transactions held across external I/O, session/pooler boundaries, serialization retries. |
| `indexing` | Non-sargable predicates on indexed columns, missing FK/hot indexes on established scale, composite column order and sort alignment, redundant or invalid indexes, deep `OFFSET`. |
| `app-boundary` | Parameter binding and identifier allowlists, N+1 and unbounded reads, connection/row/cursor lifecycle and `Err()` checks, timeouts, pooler compatibility, DB error mapping. |

For a small change (~300 changed lines or fewer in one area), related lenses
are paired without mixing correctness hunting and indexing/performance in one
reader: `schema` + `migrations`, `queries` + `transactions`, `indexing` solo,
and `app-boundary` solo (at most four readers).

## Proof bar and independent challenge

A finding requires four checkable parts plus survival of an independent
challenge:

1. **Mechanism, traced or quoted** against the reconstructed cumulative schema,
   ordered migration history, application callers, locked driver source, and
   pinned dialect/version baseline.
2. **Expectation and basis** (`written`, `schema`, or `engine`).
3. **Concrete impact** (data corruption, wrong result, lock/downtime outage,
   concurrency anomaly, scan/round-trip amplification, broken isolation or
   parameter boundary, or provable schema-evolution fragility).
4. **Minimal safer form** valid for the project's pinned dialect, server
   version, migration runner, ORM/driver baseline, and rolling-deploy contract.

An independent challenger receives each claim without the reader's reasoning
and attacks it on four lines: dialect/version mechanism, trigger/runtime
evidence (including missing `EXPLAIN` or cardinality proof), safer-form
validity and tradeoffs, and prior documented intent or `Not a finding` guards.
The orchestrator walks every trace itself and decides each candidate as
`finding`, `tradeoff`, `disputed`, `needs confirmation`, `unproven`, or
`rejected`.

## Scope boundaries

- **Style excluded; fragility included:** cosmetic formatting, casing, and
  alias preferences are out of scope. Provable schema-evolution fragility
  (`SELECT *` in production queries/views, columnless `INSERT`, positional
  `ORDER BY 1`/`GROUP BY 1`, unqualified multi-table columns, implicit comma
  joins) stays in scope in `queries` and is reported compactly at the end of
  Findings.
- **Security seam:** broad security and compliance audits (auth architecture,
  IAM, encryption at rest, secrets) stay out of scope. Concrete
  source-provable SQL contract failures whose harm is security stay in scope:
  broken parameterization (SQL injection), unallowlisted dynamic identifiers,
  broken declared RLS/tenant isolation, `SECURITY DEFINER` missing a pinned
  `search_path`, and unbounded `UPDATE`/`DELETE` missing `WHERE`.
- **Static proof vs runtime confirmation:** SQL Review never connects to a
  database or runs `EXPLAIN`. Claims depending on unconfirmed server versions,
  migration runner transactional mode, live-traffic or maintenance-window
  status, table sizes, skewed cardinality, skip-scan profitability, or
  HOT-update loss route to `Needs your confirmation` with the exact check or
  `EXPLAIN` output that settles them. User-supplied or committed `EXPLAIN` plans
  are evidence.

## Current limits

- Available in Claude Code (`/super-review:sql`), Codex (`$sql-review`),
  OpenCode (`/sql-review`), and Google Antigravity (`/sql-review`). Cursor
  ships Super Review only.
- Dialect contexts cover PostgreSQL, MySQL (InnoDB primary baseline), and
  SQLite; MariaDB projects require checking MariaDB-specific divergences
  against the repository baseline.
- Version 0.2.0 has no live model evaluation runs yet; contrasting fixture
  packets in `evals/sql-review/` are `NOT RUN`.
