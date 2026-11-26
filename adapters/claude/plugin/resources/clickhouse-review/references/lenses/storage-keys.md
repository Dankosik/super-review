# Storage and keys

**Do MergeTree engine choice, `ORDER BY`/`PRIMARY KEY`, `PARTITION BY`, column
types, and skipping indexes match actual write and read physics?**

## Expect

- `PARTITION BY` uses coarse, low-cardinality boundaries (such as monthly or
  daily time buckets with an explicit timezone) so inserts do not explode part
  counts or exceed `max_partitions_per_insert_block`.
- `ORDER BY` (and any `PRIMARY KEY` prefix) aligns with hot equality, range,
  and grouping predicates from low to high cardinality without forcing full
  table scans.
- MergeTree engine choice (`Replacing*`, `Summing*`, `Aggregating*`,
  `VersionedCollapsing*`) and column types match domain semantics with valid
  wrapper order and no silent truncation or dictionary bloat.
- Data skipping indexes use granule-scaled `GRANULARITY` (not row counts),
  match predicate types, and materialize over historical parts when added late.

## Look for

Inspect cumulative table DDL, `ALTER TABLE` history, `SHOW CREATE TABLE` dumps,
hot query predicates, `system.parts`, and `EXPLAIN indexes = 1` outputs.

- **Over-partitioning and part explosion**: `PARTITION BY` on high-cardinality
  columns (`user_id`, UUID, raw timestamp) creating thousands of tiny parts,
  breaking merges (`TOO_MANY_PARTS`), or failing `max_partitions_per_insert_block`.
- **Implicit timezone in keys and partitions**: unzoned `DateTime` or
  `PARTITION BY toYYYYMM(ts)` / `toDate(ts)` relying on implicit server
  timezone, shifting partition or day boundaries across host TZ or DST changes;
  specify an explicit timezone (such as `'UTC'`).
- **Misaligned `ORDER BY` / `PRIMARY KEY`**: leading high-cardinality or
  unfiltered columns blocking prefix range scans on hot queries; `PRIMARY KEY`
  not a prefix of `ORDER BY`; `Nullable` key columns adding null-bitmap cost
  without need. Re-sorting a live table requires `EXCHANGE TABLES` (`tradeoff`).
- **Merging-engine key mismatch**: `ReplacingMergeTree` lacking a deterministic
  version column on multi-threaded writes or receiving updates across
  partitions; `SummingMergeTree` silently dropping zero-sum rows or placing
  summed metrics inside `ORDER BY`.
- **Out-of-order collapsing corruption**: `CollapsingMergeTree` receiving
  out-of-order or multi-threaded `+1`/`-1` inserts corrupts collapsed state;
  use `VersionedCollapsingMergeTree` with a version column.
- **Broken skipping indexes**: `GRANULARITY` set as a row count (such as `8192`
  meaning `8192 * 8192` rows per block instead of `1`-`4` granules); `ADD INDEX`
  without `MATERIALIZE INDEX` expecting pruning on old parts; `minmax`/`set`
  used on uncorrelated high-cardinality keys.
- **Invalid or lossy column types**: invalid `Nullable(LowCardinality(T))`
  wrapper order (must be `LowCardinality(Nullable(T))`); `Float64` storing
  exact monetary totals instead of `Decimal`/minor units; `String` encoding
  dates or UUIDs used in range predicates.
- **Semi-structured and dictionary bloat**: `LowCardinality` on high-cardinality
  IDs; deprecated `Object('json')` where the pinned version supports native
  `JSON`; wide `Map(K, V)` full-column reads vs bucketed maps or native `JSON`
  subcolumns (route unmeasured I/O to `tradeoff` or `needs confirmation`).

## Not a finding

- Omitting `PARTITION BY` on small or medium tables: unpartitioned MergeTree
  tables merge cleanly and avoid unnecessary part splitting.
- `Nullable(T)` when SQL `NULL` carries real domain meaning distinct from `0`
  or `''`.
- `LowCardinality(String)` vs `String`, `Map(K, V)` vs native `JSON` I/O, or
  skipping-index selectivity claims without established cardinality,
  `system.parts`, or `EXPLAIN indexes = 1` evidence (route to `needs confirmation`).
- Compression codec tuning (such as `Delta`, `Gorilla`, or `ZSTD` level)
  without measured storage or CPU evidence.
