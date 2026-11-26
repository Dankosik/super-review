# Views and projections

**Do materialized views, target engines, and projections compute exact
incremental state without per-block corruption, missed updates, or backfill
gaps?**

## Expect

- Incremental materialized views treat their `SELECT` as a stateless per-block
  `INSERT` trigger and write mergeable `-State` columns (or
  `SimpleAggregateFunction`) into `AggregatingMergeTree` / `SummingMergeTree`.
- Readers of `AggregatingMergeTree` or `SummingMergeTree` target tables merge
  partial states (`-Merge` / `sum()` with `GROUP BY`) instead of assuming
  background merges already finalized every key.
- Backfills avoid `CREATE MATERIALIZED VIEW ... POPULATE` live-ingest gaps, and
  downstream MVs do not read raw unmerged streams off merging engines expecting
  deduplicated inputs.
- Projections respect DDL limits for the pinned ClickHouse version (no `JOIN`,
  and `WHERE` only on versions that support filtered projections) and stay
  compatible with table mutations and lightweight deletes.

## Look for

Inspect all `MATERIALIZED VIEW` definitions, target tables, backfill scripts,
queries reading MV targets, and `PROJECTION` clauses.

- **Per-block aggregation corruption**: incremental MV writing non-associative
  finalized aggregates (such as `avg`, `uniq`, `quantile`) or plain `sum`/
  `count` into `MergeTree` instead of `AggregatingMergeTree` with `-State` /
  `AggregateFunction(...)` (or `SimpleAggregateFunction` / `SummingMergeTree`).
- **Unmerged reads on aggregate target tables**: `SELECT` from
  `AggregatingMergeTree` or `SummingMergeTree` without matching `-Merge`
  combinators and `GROUP BY`, returning partial per-block states.
- **`POPULATE` race and backfill data loss**: `CREATE MATERIALIZED VIEW ...
  POPULATE` on an active ingestion table, silently dropping rows inserted while
  the initial population scan runs.
- **MV `JOIN` asymmetry and cascading traps**: incremental MV with `JOIN`
  expecting right-table updates to refresh past rows (triggers only on left
  table inserts); downstream MV attached to `ReplacingMergeTree`/
  `CollapsingMergeTree`/`SummingMergeTree` receiving raw unmerged blocks;
  `materialized_views_ignore_errors = 1` hiding rollup divergence.
- **Heavy state blowup and invalid projections**: unbounded `uniqExactState`/
  `groupArrayState` in high-cardinality MVs (tradeoff vs approximate states);
  tight-interval full-scan `REFRESH EVERY` MVs; `PROJECTION` using `JOIN`,
  `WHERE` on versions without filtered projections, or missing
  `MATERIALIZE PROJECTION` for historical parts.

## Not a finding

- `SimpleAggregateFunction(sum/min/max/anyLast, T)` without `-State`/`-Merge`
  combinators when the aggregate is strictly associative and commutative.
- `ENGINE = Null` ingestion tables feeding `CREATE MATERIALIZED VIEW ... TO
  target` (standard zero-storage fan-out pattern).
- Separate `CREATE TABLE` + `CREATE MATERIALIZED VIEW ... TO target` followed
  by a bounded historical `INSERT INTO target SELECT ...` backfill.
- Creating a projection (including a filtered `WHERE` projection on ClickHouse
  versions supporting it; route unstated server versions to `needs confirmation`)
  when storage overhead is documented and mutation compatibility
  (`lightweight_mutation_projection_mode`) is verified.
