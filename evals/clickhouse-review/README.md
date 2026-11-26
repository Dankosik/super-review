# ClickHouse Review evaluation cases

Maintainer and evaluator material only. Do not pass this file, `cases.json`, or
peer packets to any review agent.

## Purpose

This contrasting corpus exercises core `clickhouse-review` decisions across all
six lenses (`storage-keys`, `mutations-lifecycle`, `views-projections`,
`queries-distributed`, `cluster-ddl`, `ingestion-client`) and both deployment
contexts (`self-managed`, `cloud`):

- `CH01` / `CH02` (`storage-keys`, `self-managed`): high-cardinality
  `PARTITION BY user_id` plus skipping index `GRANULARITY 8192` (confusing rows
  with granules, confirmed by `system.parts` and `EXPLAIN indexes = 1`) vs
  coarse `PARTITION BY toYYYYMM(event_time)` and `GRANULARITY 1`.
- `CH03` / `CH04` (`mutations-lifecycle`, `self-managed`, Go `clickhouse-go/v2`):
  per-message `ALTER TABLE ... UPDATE` mutation loop under default async
  `mutations_sync = 0` plus `TTL` without `ttl_only_drop_parts = 1` vs batched
  Native inserts into partition-aligned `ReplicatedReplacingMergeTree` with
  `ttl_only_drop_parts = 1`.
- `CH05` / `CH06` (`views-projections`, `self-managed`): incremental
  `MATERIALIZED VIEW ... POPULATE` writing finalized `avg()`/`uniq()` into
  `ReplicatedMergeTree` with direct unmerged reads vs argless
  `ReplicatedAggregatingMergeTree` inside `DatabaseReplicated` with
  `-State`/`-Merge`, explicit `TO` target, and separate bounded backfill.
- `CH07` / `CH08` (`queries-distributed`, `self-managed`): `LEFT JOIN ... WHERE
  s.account_id IS NULL` broken by default `join_use_nulls = 0`, non-`GLOBAL`
  distributed `IN` causing N^2 fan-out, `max(is_deleted)` breaking re-activated
  keys, and wide `SELECT *` with unordered `LIMIT` vs `LEFT ANTI JOIN`, bounded
  `GLOBAL IN` with `argMax(is_deleted, updated_at)`, explicit columns, and
  deterministic `ORDER BY ... LIMIT`.
- `CH09` / `CH10` (`cluster-ddl`, `cloud`): ClickHouse Cloud migration using
  `ON CLUSTER`, manual `ReplicatedMergeTree` Keeper paths, redundant
  `Distributed` wrapper, and breaking `DROP COLUMN` still read by a live MV vs
  plain `MergeTree` (auto-backed by `SharedMergeTree`), no `ON CLUSTER`, and
  additive `D -> H` column evolution.
- `CH11` / `CH12` (`ingestion-client`, `cloud`, TypeScript `@clickhouse/client`):
  durable payment-audit writer with `wait_for_async_insert = 0` and no retry
  deduplication token plus SQL interpolation, unbounded `resultSet.json()`
  buffering before `.slice(0, limit)`, and early `limit <= 0` return leaking an
  unconsumed `ResultSet` without `resultSet.close()` vs
  `wait_for_async_insert = 1`, `async_insert_deduplicate = 1`, deterministic
  `insert_deduplication_token`, `query_params`, closed sort allowlist, pre-query
  limit validation with SQL `LIMIT`/`max_execution_time`/`max_memory_usage`, and
  complete `resultSet.stream()` consumption inside `finally { resultSet.close(); }`.

## Isolation protocol

- `inputs.json` contains neutral single-case packets (`CH01`..`CH12`) with
  pinned files, deployment baselines, and passive `EXPLAIN indexes = 1` /
  `system.parts` / `system.query_log` evidence. Supply at most one input object
  per fresh agent run together with the canonical `clickhouse-review` contract,
  assigned lens, matching deployment context, and finding template.
- `cases.json` is evaluator-only: it pairs each positive finding with its
  symmetric retain control and records grading criteria.
- Status is `NOT RUN`. Mechanical fixture integrity, Go/TypeScript client code
  verification, and delivery isolation are checked by
  `tests/clickhouse-review.test.ts`; they do not measure model judgment.
