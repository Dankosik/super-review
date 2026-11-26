# Queries and distributed execution

**Do analytical, deduplicating, and Distributed queries return right results
and avoid right-side RAM blowup, N^2 shard amplification, and full-column
scans?**

## Expect

- Queries on `ReplacingMergeTree`, `CollapsingMergeTree`, and `SummingMergeTree`
  deduplicate or collapse explicitly (`FINAL` matching 1-arg vs 2-arg tombstone
  semantics, or `GROUP BY` with `argMax`), never relying on background merges.
- Outer joins account for `join_use_nulls = 0`, `ARRAY JOIN` preserves empty
  arrays when required, dictionary lookups handle misses and RAM limits, and
  large joins bound right-side memory.
- Multi-shard `Distributed` subqueries avoid N^2 fan-out (`GLOBAL IN` /
  `GLOBAL JOIN` or co-located sharding) without broadcasting unbounded sets.
- Queries read only needed columns, preserve primary-key pruning, and use
  deterministic tie-breakers with `LIMIT`.

## Look for

Inspect standalone `.sql` queries, views, dictionaries, embedded SQL, `SETTINGS`
clauses, `EXPLAIN indexes = 1`, `EXPLAIN PLAN`, and `system.query_log` outputs.

- **Unmerged reads and tombstone semantics**: reading `ReplacingMergeTree`
  without `FINAL` or `argMax`; assuming 1-arg `ReplacingMergeTree(ver)` `FINAL`
  filters a plain `is_deleted` column (only 2-arg `(ver, is_deleted)` auto-filters
  on `24.8+`); `max(is_deleted)` breaking reactivated keys (use `HAVING
  argMax(is_deleted, ver) = 0`); `do_not_merge_across_partitions_select_final = 1`
  across partitions.
- **Outer-join defaults, `ARRAY JOIN`, and `ANY JOIN`**: `LEFT`/`RIGHT`/`FULL
  JOIN` testing `WHERE r.col IS NULL` on non-`Nullable` columns under default
  `join_use_nulls = 0` (filled with `0`/`''`); `ARRAY JOIN` silently dropping
  rows with `[]` (use `LEFT ARRAY JOIN` when empty rows must survive);
  `ANY JOIN` on non-unique right keys picking arbitrary rows.
- **Right-side `JOIN` OOM**: large right-hand table in `hash`/`parallel_hash`
  when auto-swap does not apply (`< 24.12`, `query_plan_join_swap_table =
  'false'`, `USING`, missing estimates on subqueries/table functions, legacy
  outer join with `parallel_hash`, or both sides large).
- **Join algorithm spill and fallback caveats**: `grace_hash` needs a spill
  threshold (`max_bytes_in_join` on `24-25.x`, else no spill; `26.4+`/`26.5+`
  `max_bytes_before_external_join` / `max_bytes_ratio_before_external_join`,
  else skipped/rejected and `UNKNOWN_SETTING` on `24-25.x`); listing
  `full_sorting_merge` (even as fallback) tightens key types (`TYPE_MISMATCH`
  on mixed `Nullable`) and disables `read_in_order` for `ORDER BY ... LIMIT`.
- **`Distributed` N^2 fan-out and broadcast bounds**: non-`GLOBAL` `IN`/`JOIN`
  across `Distributed` tables (`distributed_product_mode = 'allow'` N^2 storm or
  default `deny` crash); `GLOBAL` broadcasting unbounded sets.
- **Dictionary layout and silent miss defaults**: `FLAT` failing at
  `MAX_ARRAY_SIZE = 500,000` or exhausting RAM on sparse/large `UInt64` keys,
  unbounded `FLAT`/`HASHED` RAM, or `dictGet` silently returning `<null_value>`
  / `0` / `''` on misses instead of `dictGetOrNull` or `dictHas`.
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
- Join table order when `query_plan_join_swap_table = 'auto'` applies (`INNER
  JOIN` on `24.12+`, and analyzer `enable_analyzer = 1` `ALL ... ON` outer joins
  on `25.8+` with row estimates) unless `EXPLAIN PLAN` shows the wrong build
  side or `'false'` is set.
- Omitting manual `PREWHERE` when `optimize_move_to_prewhere` is enabled.
