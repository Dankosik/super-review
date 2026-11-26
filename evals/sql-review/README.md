# SQL Review evaluation cases

Maintainer and evaluator material only. Do not pass this file, `cases.json`, or
peer packets to any review agent.

## Purpose

This contrasting corpus exercises core `sql-review` decisions across all six
lenses (`schema`, `migrations`, `queries`, `transactions`, `indexing`,
`app-boundary`), all three v1 dialects (`postgresql`, `mysql`, `sqlite`),
non-binary calibration outcomes (`finding`, `finding+tradeoff`, `tradeoff`,
`disputed`, `needs confirmation`, `retain`), cumulative migration histories,
same-table merges, and driver/ORM boundaries:

- `SQL01` / `SQL02` (`schema`, SQLite): `DECIMAL(12, 2)` float affinity for
  monetary amounts and caller-violated nullable `currency` (with optional
  `memo` anti-folklore control) vs `STRICT` integer-cents schema.
- `SQL03` / `SQL04` (`migrations`, PostgreSQL 16): blocking `SET NOT NULL` and
  non-concurrent `CREATE INDEX` without `lock_timeout` (with symmetric
  completed-backfill baseline) vs separate-transaction `NOT VALID` /
  `VALIDATE CONSTRAINT` / `SET NOT NULL` with `SET LOCAL lock_timeout` and
  non-transactional `CREATE INDEX CONCURRENTLY` with `SET`/`RESET lock_timeout`.
- `SQL05` / `SQL06` (`queries`, MySQL 8.0): statically provable `NOT IN` over
  nullable subquery column plus unordered `LIMIT` (with no `EXPLAIN` or table
  size doc) vs `NOT EXISTS` antijoin with deterministic tie-breaker.
- `SQL07` / `SQL08` (`transactions`, PostgreSQL 16 / Go `pgx`): check-then-act
  lost update with transaction held across documented outbound HTTP I/O vs
  pre-check read-only HTTP call and atomic conditional `UPDATE`.
- `SQL09` / `SQL10` (`indexing`, PostgreSQL 16): non-sargable
  `DATE_TRUNC('day', created_at, 'UTC')` defeating an existing B-tree index on
  a documented 50M-row table vs DST-safe half-open UTC `INTERVAL '24 hours'`
  range predicate.
- `SQL11` / `SQL12` (`app-boundary`, PostgreSQL 16 / TypeScript `pg`): SQL
  string interpolation of `status` and dynamic `ORDER BY` plus N+1 loop vs
  bound parameters, closed `Map` allowlist, symmetric `limit`/`ids` caps, and
  batched `ANY($1::bigint[])`.
- `SQL13` / `SQL14` (`migrations`, PostgreSQL 16): `CONCURRENTLY` inside an
  Atlas transactional migration and `SET LOCAL lock_timeout` under
  `-- atlas:txmode none` vs `-- atlas:txmode none` + `SET`/`RESET lock_timeout`.
- `SQL15` / `SQL16` (`migrations`, PostgreSQL): pinned PG 18 + live traffic +
  Atlas tx mode (`finding`) vs unstated PG version, traffic, and runner tx mode
  (`needs confirmation`).
- `SQL17` / `SQL18` (`migrations`, PostgreSQL 16): `NUMERIC(12,2) -> (18,4)`
  rewrite backed by a false-premise prior ADR (`finding+tradeoff`, `stands`) vs
  prior offline maintenance-window ADR accepting the rewrite lock (`disputed`).
- `SQL19` / `SQL20` (`indexing`, MySQL 8.0 InnoDB): unindexed logical
  `account_id` on a documented 20M-row table (`finding`) vs InnoDB `FOREIGN KEY`
  auto-created child index (`retain`).
- `SQL21` / `SQL22` (`schema`, PostgreSQL 16): multi-migration history across
  table rename lacking `UNIQUE` required by `ON CONFLICT` (`finding`) vs later
  migration `0004` up to `HEAD` adding `NOT NULL` and `UNIQUE` (`retain`).
- `SQL23` / `SQL24` (`schema` + `indexing` + `migrations`, PostgreSQL 16):
  same-table merge preserving `UNIQUE (tenant_id, external_id)` with `INCLUDE`
  and one coherent concurrent `USING INDEX` migration sequence (`finding`) vs
  already merged safe DDL (`retain`).
- `SQL25` / `SQL26` (`queries`, PostgreSQL 16): splitting cheap safe
  deterministic `ORDER BY` tie-breaker (`finding`) from API-changing keyset
  pagination (`tradeoff`) vs tie-breaker already present leaving only
  `tradeoff`.
- `SQL27` / `SQL28` (`transactions`, PostgreSQL 16 / Go `pgx`): executing a
  helper on top-level `pool` inside an active transaction (`finding`) vs
  consistent `pgx.Tx` propagation (`retain`).
- `SQL29` / `SQL30` (`app-boundary`, MySQL 8.0 / TypeScript `mysql2`):
  unguarded empty `IN ()` placeholder expansion plus bare `catch` swallowing
  errors as duplicate (`finding`) vs empty-array guard and exact `ER_DUP_ENTRY`
  handling (`retain`).

## Isolation protocol

- `inputs.json` contains neutral single-case packets (`SQL01`..`SQL30`) with
  pinned files and baselines. Supply at most one input object per fresh agent
  run together with the canonical `sql-review` contract, assigned lens(es),
  matching dialect context, and finding template.
- `cases.json` is evaluator-only: it pairs each positive case with its
  symmetric retain or calibration control and records grading criteria.
- Status is `NOT RUN`. Mechanical fixture integrity and delivery isolation are
  checked by `tests/sql-review.test.ts`; they do not measure model judgment.
