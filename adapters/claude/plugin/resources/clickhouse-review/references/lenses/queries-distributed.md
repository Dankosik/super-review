# Queries and distributed execution

**Do analytical, deduplicating, and Distributed queries return right results
and avoid right-side RAM blowup, N^2 shard amplification, and full-column
scans?**

## Expect

- Queries on `ReplacingMergeTree`, `CollapsingMergeTree`, and `SummingMergeTree`
  deduplicate or collapse explicitly (`FINAL`, `argMax(..., ver)` with
  `argMax(is_deleted, ver)`, or `GROUP BY`) instead of relying on background
  merges.
- Outer joins account for ClickHouse's `join_use_nulls = 0` default, and large
  joins bound right-side memory (`join_algorithm` fallbacks or memory limits).
- Multi-shard `Distributed` subqueries avoid N^2 fan-out (`GLOBAL IN` /
  `GLOBAL JOIN` or co-located sharding) without broadcasting unbounded sets.
- Queries read only needed columns, preserve primary-key pruning, and use
  deterministic tie-breakers with `LIMIT`.

## Look for

Inspect standalone `.sql` queries, views, embedded SQL, `SETTINGS` clauses,
`EXPLAIN indexes = 1`, `EXPLAIN PLAN`, and `system.query_log` outputs.

- **Unmerged reads and tombstone bugs**: querying `ReplacingMergeTree` without
  `FINAL` or `argMax` and assuming unique rows; `max(is_deleted)` breaking
  re-inserted keys (needs `argMax(is_deleted, ver)`);
  `do_not_merge_across_partitions_select_final = 1` when updates for one
  `ORDER BY` key span partitions.
- **`join_use_nulls = 0` outer-join bugs and non-deterministic `ANY JOIN`**:
  `LEFT`/`RIGHT`/`FULL JOIN` testing `WHERE r.col IS NULL` on non-`Nullable`
  columns under default `join_use_nulls = 0` (filled with `0`/`''`, so `IS NULL`
  never matches); `ANY JOIN` on non-unique right keys picking arbitrary rows.
- **Right-side `JOIN` OOM and `Distributed` N^2 fan-out**: large right-hand
  table in `hash`/`parallel_hash` join (when join auto-swap does not apply:
  outer joins, older versions, or `query_plan_join_swap_table = 'false'`)
  without `grace_hash`/`full_sorting_merge` or `max_bytes_in_join`; non-`GLOBAL`
  `IN`/`JOIN` across `Distributed` tables (`distributed_product_mode = 'allow'`
  N^2 storm or default `deny` crash); `GLOBAL` broadcasting unbounded sets.
- **Defeated pruning and wide columnar I/O**: non-monotonic functions (`toHour`,
  `lower`, `substring`, modulo) wrapping primary/partition key columns;
  `SELECT *` on wide MergeTree tables reading every column file; unordered
  `LIMIT` across parts/shards; unbounded high-cardinality `GROUP BY`.
- **Schema-evolution fragility**: `SELECT *` in production queries/views,
  columnless `INSERT`, positional `ORDER BY 1`/`GROUP BY 1`, or unqualified
  multi-table columns that break on column additions or reordering.

## Not a finding

- Using `FINAL` on modern ClickHouse without `EXPLAIN` or `system.query_log`
  proof of excessive read cost (parallel `FINAL` with selective primary-key
  filters is often fast; route unmeasured cases to `needs confirmation`).
- Monotonic functions on primary or partition keys (such as `toDate`,
  `toYYYYMM`, `toStartOfHour`): ClickHouse primary-index range analysis prunes
  granules natively; require `EXPLAIN indexes = 1` before flagging.
- `INNER JOIN` table order on versions where `query_plan_join_swap_table =
  'auto'` is enabled unless `EXPLAIN PLAN` shows the wrong build side.
- Omitting manual `PREWHERE` when `optimize_move_to_prewhere` is enabled.
