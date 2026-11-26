# SQL Review evaluation cases

Maintainer and evaluator material only. Do not pass this file, `cases.json`, or
peer packets to any review agent.

## Purpose

This contrasting corpus exercises core `sql-review` decisions across all six
lenses (`schema`, `migrations`, `queries`, `transactions`, `indexing`,
`app-boundary`) and all three v1 dialects (`postgresql`, `mysql`, `sqlite`):

- `SQL01` / `SQL02` (`schema`, SQLite): `DECIMAL(12, 2)` float affinity for
  monetary amounts and missing constraints vs `STRICT` integer-cents schema.
- `SQL03` / `SQL04` (`migrations`, PostgreSQL 16): blocking `SET NOT NULL` and
  non-concurrent `CREATE INDEX` without `lock_timeout` vs separate-transaction
  `NOT VALID` / `VALIDATE CONSTRAINT` / `SET NOT NULL` with `SET LOCAL
  lock_timeout` and `CREATE INDEX CONCURRENTLY`.
- `SQL05` / `SQL06` (`queries`, MySQL 8.0): `NOT IN` over nullable subquery
  column plus unordered `LIMIT` vs `NOT EXISTS` with deterministic tie-breaker.
- `SQL07` / `SQL08` (`transactions`, PostgreSQL 16 / Go `pgx`): check-then-act
  lost update with transaction held across HTTP I/O vs pre-check HTTP call and
  atomic conditional `UPDATE` preserving `ErrWalletNotFound` vs
  `ErrInsufficientFunds`.
- `SQL09` / `SQL10` (`indexing`, PostgreSQL 16): non-sargable
  `DATE_TRUNC('day', created_at, 'UTC')` defeating an existing B-tree index on a
  documented large table vs half-open UTC range predicate.
- `SQL11` / `SQL12` (`app-boundary`, PostgreSQL 16 / TypeScript `pg`): SQL
  string interpolation of `status` and dynamic `ORDER BY` plus N+1 loop vs
  bound parameters, prototype-safe `Map` identifier allowlist, validated integer
  `limit`, and batched `ANY($1::bigint[])`.

## Isolation protocol

- `inputs.json` contains neutral single-case packets (`SQL01`..`SQL12`) with
  pinned files and baselines. Supply at most one input object per fresh agent
  run together with the canonical `sql-review` contract, assigned lens,
  matching dialect context, and finding template.
- `cases.json` is evaluator-only: it pairs each positive finding with its
  symmetric retain control and records grading criteria.
- Status is `NOT RUN`. Mechanical fixture integrity and delivery isolation are
  checked by `tests/sql-review.test.ts`; they do not measure model judgment.
