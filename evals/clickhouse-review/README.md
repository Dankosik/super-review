# ClickHouse Review evaluation cases

Maintainer and evaluator material only. Do not pass this file, `cases.json`, or
peer packets to any review agent.

## Purpose

This contrasting corpus exercises core `clickhouse-review` decisions across all
six lenses (`storage-keys`, `mutations-lifecycle`, `views-projections`,
`queries-distributed`, `cluster-ddl`, `ingestion-client`), both deployment
contexts (`self-managed`, `cloud`), and all six decision outcomes (`finding`,
`finding+tradeoff`, `tradeoff`, `disputed`, `needs confirmation`, `retain`):

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
- `CH13` / `CH14` (`storage-keys`, `self-managed`): invalid
  `Nullable(LowCardinality(String))` wrapper order, unzoned `DateTime` in
  `PARTITION BY toYYYYMM(session_started_at)`, and `ReplicatedCollapsingMergeTree` under
  out-of-order multi-threaded writes vs `LowCardinality(Nullable(String))`,
  `DateTime('UTC')`, and `ReplicatedVersionedCollapsingMergeTree`.
- `CH15` / `CH16` (`mutations-lifecycle`, `self-managed`): static lightweight
  `UPDATE` failures on ClickHouse `25.8` (key-column update and missing
  `enable_block_number_column`/`enable_block_offset_column` on `sales.orders`)
  plus obsolete query-level `lightweight_mutation_projection_mode` on
  `DELETE FROM sales.order_archive` (`finding`) vs valid non-key lightweight
  `UPDATE` on projection-free `sales.orders` with table-level
  `lightweight_mutation_projection_mode = 'rebuild'` on `sales.order_archive`,
  unstated `25.x` version, and unmeasured `batch_id` row share
  (`needs confirmation`).
- `CH17` / `CH18` (`views-projections`, `self-managed`): `PROJECTION` on
  `ReplicatedReplacingMergeTree` missing `deduplicate_merge_projection_mode`,
  implicit `.inner` MV storage, and multi-MV retry divergence under default
  `deduplicate_blocks_in_dependent_materialized_views = 0` vs
  `deduplicate_merge_projection_mode = 'rebuild'`, explicit `TO` target tables,
  and profile-enabled `deduplicate_blocks_in_dependent_materialized_views = 1`.
- `CH19` / `CH20` (`queries-distributed`, `self-managed`): `ARRAY JOIN`
  dropping empty arrays, 1-arg `ReplacingMergeTree(updated_at)` `FINAL` failing
  to filter `is_deleted`, `FLAT` dictionary on sparse `UInt64` keys with silent
  `dictGet`, and non-swappable subquery `LEFT JOIN USING` vs `LEFT ARRAY JOIN`,
  2-arg `ReplacingMergeTree(updated_at, is_deleted)` `FINAL`, bounded `HASHED`
  dictionary with `dictGetOrNull`, and `25.8` analyzer auto-swapped
  `LEFT JOIN ... ON` confirmed by `EXPLAIN PLAN`.
- `CH21` / `CH22` (`cluster-ddl`, `self-managed`): invalid in-place
  `MODIFY ORDER BY` reordering existing columns plus `Distributed` wrapper drift
  vs valid same-`ALTER` append of a brand-new defaultless `ADD COLUMN` to
  `ORDER BY` plus later `HEAD` migration syncing `Distributed` and
  `MODIFY SETTING ttl_only_drop_parts = 1`.
- `CH23` / `CH24` (`ingestion-client`, `self-managed`, TypeScript): `26.2`-only
  `deduplicate_insert` on ClickHouse `25.3`, reused constant
  `insert_deduplication_token` silently dropping distinct batches, direct
  `SELECT` on `Kafka` engine, and `kafka_handle_error_mode = 'default'` stall vs
  `async_insert_deduplicate = 1`, unique per-batch token, and `Kafka`
  `kafka_handle_error_mode = 'stream'` feeding explicit `TO` MVs + DLQ.
- `CH25` / `CH26` (`ingestion-client`, `cloud`, TypeScript): false-premise
  prior ADR claiming `wait_for_async_insert = 0` is durable on ClickHouse Cloud
  (`finding`, stands rather than `disputed`) vs true prior ADR explicitly
  accepting bounded loss on best-effort frontend click telemetry (`disputed`).
- `CH27` / `CH28` (`storage-keys` + `mutations-lifecycle`, `self-managed`):
  splitting cheap in-place `MODIFY SETTING ttl_only_drop_parts = 1` (`finding`)
  from live-table `EXCHANGE TABLES` `ORDER BY` rebuild (`tradeoff`) with
  coherent DDL (`finding+tradeoff`) vs `ttl_only_drop_parts = 1` already set
  leaving only the `EXCHANGE TABLES` rebuild (`tradeoff`).

## Isolation protocol

- `inputs.json` contains neutral single-case packets (`CH01`..`CH28`) with
  pinned files, deployment baselines, and passive `EXPLAIN indexes = 1` /
  `EXPLAIN PLAN` / `system.parts` / `system.query_log` evidence. Supply at most
  one input object per fresh agent run together with the canonical
  `clickhouse-review` contract, assigned lens(es), matching deployment context,
  and finding template.
- `cases.json` is evaluator-only: it pairs each positive finding with its
  symmetric retain or calibration control and records grading criteria.
- Status is `NOT RUN`. Mechanical fixture integrity, Go/TypeScript client code
  verification, XML/JSON/SQL static validation, and delivery isolation are
  checked by `tests/clickhouse-review.test.ts`; they do not measure model
  judgment.
