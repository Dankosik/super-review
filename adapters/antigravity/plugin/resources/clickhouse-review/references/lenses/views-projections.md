# Views and projections

**Do materialized views, target engines, and projections compute exact
incremental state without per-block corruption, missed updates, or backfill
gaps?**

## Expect

- Incremental materialized views write via explicit `TO target_table` as
  stateless per-block `INSERT` triggers using mergeable `-State` columns (or
  `SimpleAggregateFunction`) into `AggregatingMergeTree` / `SummingMergeTree`.
- Readers of aggregate targets merge partial states (`-Merge` / `sum()` with
  `GROUP BY`), and multi-MV retry pipelines guard against partial-write drift.
- Backfills avoid `CREATE MATERIALIZED VIEW ... POPULATE` live-ingest gaps, and
  downstream MVs do not read raw unmerged streams off merging engines expecting
  deduplicated inputs.
- Projections respect version DDL limits (no `JOIN`, `WHERE` only on versions
  supporting filtered projections), table-level `deduplicate_merge_projection_mode`,
  and mutation compatibility.

## Look for

Inspect all `MATERIALIZED VIEW` definitions, target tables, backfill scripts,
queries reading MV targets, `users.xml`/profile settings, and `PROJECTION`s.

- **Per-block aggregation corruption**: incremental MV writing non-associative
  finalized aggregates (`avg`, `uniq`, `quantile`) or plain `sum`/`count` into
  `MergeTree` instead of `AggregatingMergeTree` with `-State` (or
  `SimpleAggregateFunction` / `SummingMergeTree`).
- **Unmerged reads on aggregate target tables**: `SELECT` from
  `AggregatingMergeTree` or `SummingMergeTree` without matching `-Merge`
  combinators and `GROUP BY`, returning partial per-block states.
- **`POPULATE` race and implicit `.inner` storage**: `POPULATE` on live tables
  silently drops concurrent inserts; omitting `TO target_table` ties `.inner`
  data survival to `DROP VIEW` and hinders evolution (`MODIFY QUERY` is allowed
  on `.inner`, yet neither alters `.inner_id.*` columns nor backfills rows).
- **Non-atomic multi-MV writes and error hiding**: source inserts plus multiple
  MVs are not atomic; under default `deduplicate_blocks_in_dependent_materialized_views
  = 0` (pre-26.2), retrying a partially failed insert skips source blocks and
  leaves failed MVs missing (enabling `= 1` requires synchronous inserts
  pre-26.1). Also flag `materialized_views_ignore_errors = 1` hiding drift.
- **MV `JOIN` asymmetry and cascading traps**: incremental MV with `JOIN`
  triggers only on left-table inserts (right-table updates never refresh past
  rows); downstream MV attached to `Replacing*`/`Collapsing*`/`Summing*`
  receives raw unmerged blocks.
- **Refreshable MVs and heavy state**: `REFRESH EVERY` MVs with overlapping
  `APPEND` windows, missing `DEPENDS ON` chaining, or tight full scans;
  unbounded `uniqExactState`/`groupArrayState` in high-cardinality MVs (route
  unmeasured RAM vs accuracy to `tradeoff` or `needs confirmation`).
- **Invalid or unmaterialized projections**: `PROJECTION` using `JOIN`, `WHERE`
  on versions lacking filtered projections, or adding a projection without
  `MATERIALIZE PROJECTION` while expecting historical parts to prune.
- **Projections on merging/deduplicating engines**: adding a `PROJECTION` to
  `Replacing*`/`Summing*`/`Aggregating*`/`Collapsing*` fails under `24.8+`
  default table setting `deduplicate_merge_projection_mode = 'throw'` unless
  explicitly configured to `'drop'` or `'rebuild'`.

## Not a finding

- `SimpleAggregateFunction(sum/min/max/anyLast, T)` without `-State`/`-Merge`
  combinators when the aggregate is strictly associative and commutative.
- `ENGINE = Null` ingestion tables feeding `CREATE MATERIALIZED VIEW ... TO
  target` (standard zero-storage fan-out pattern).
- Separate `CREATE TABLE` + `CREATE MATERIALIZED VIEW ... TO target` followed
  by a bounded historical `INSERT INTO target SELECT ...` backfill.
- Creating a projection (including a filtered `WHERE` projection on ClickHouse
  versions supporting it; route unstated server versions to `needs confirmation`)
  when storage overhead is documented and both `deduplicate_merge_projection_mode`
  and `lightweight_mutation_projection_mode` are verified.
