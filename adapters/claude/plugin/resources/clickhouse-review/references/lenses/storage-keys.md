# Storage and keys

**Do MergeTree engine choice, `ORDER BY`/`PRIMARY KEY`, `PARTITION BY`, column
types, and skipping indexes match actual write and read physics?**

## Expect

- `PARTITION BY` uses coarse, low-cardinality boundaries (such as monthly or
  daily time buckets) so inserts do not explode part counts or exceed
  `max_partitions_per_insert_block`.
- `ORDER BY` (and any `PRIMARY KEY` prefix) aligns with hot equality, range,
  and grouping predicates from low to high cardinality without forcing full
  table scans.
- MergeTree family engine choice (`Replacing*`, `Summing*`, `Aggregating*`) and
  column types match real domain semantics without silent truncation or
  dictionary bloat.
- Data skipping indexes use granule-scaled `GRANULARITY` (not row counts),
  match predicate types, and materialize over historical parts when added late.

## Look for

Inspect cumulative table DDL, `ALTER TABLE` history, `SHOW CREATE TABLE` dumps,
hot query predicates, `system.parts`, and `EXPLAIN indexes = 1` outputs.

- **Over-partitioning and part explosion**: `PARTITION BY` on high-cardinality
  columns (`user_id`, UUID, raw timestamp) creating thousands of tiny parts,
  breaking merges (`TOO_MANY_PARTS`), or failing `max_partitions_per_insert_block`.
- **Misaligned `ORDER BY` / `PRIMARY KEY`**: leading high-cardinality or
  unfiltered columns blocking prefix range scans on hot queries; `PRIMARY KEY`
  not a prefix of `ORDER BY`; `Nullable` key columns adding null-bitmap cost
  without documented need.
- **Engine semantics mismatch**: `ReplacingMergeTree` lacking a deterministic
  `version` column on multi-threaded writes or receiving updates across
  partitions; `SummingMergeTree` silently dropping rows whose summed columns
  cancel to `0` or putting summed metrics inside `ORDER BY`.
- **Broken skipping indexes**: `GRANULARITY` set as a row count (such as `8192`
  meaning `8192 * 8192` rows per block instead of `1`-`4` granules); `ADD INDEX`
  without `MATERIALIZE INDEX` expecting pruning on old parts; `minmax`/`set`
  used on uncorrelated high-cardinality keys.
- **Lossy or bloated types**: `Float64` storing exact monetary totals instead
  of `Decimal`/integer minor units; `String` encoding dates/UUIDs/enums used in
  ranges; `LowCardinality` applied to high-cardinality IDs; deprecated
  `Object('json')` instead of native `JSON` where the pinned version supports it.

## Not a finding

- Omitting `PARTITION BY` on small or medium tables: unpartitioned MergeTree
  tables merge cleanly and avoid unnecessary part splitting.
- `Nullable(T)` when SQL `NULL` carries real domain meaning distinct from `0`
  or `''`.
- `LowCardinality(String)` vs `String`, or skipping-index selectivity claims,
  without established cardinality, `system.parts`, or `EXPLAIN indexes = 1`
  evidence (route to `needs confirmation`).
- Compression codec tuning (such as `Delta`, `Gorilla`, or `ZSTD` level)
  without measured storage or CPU evidence.
