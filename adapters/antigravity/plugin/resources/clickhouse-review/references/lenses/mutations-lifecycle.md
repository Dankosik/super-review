# Mutations and lifecycle

**Do updates, deletes, TTLs, and schema/data lifecycle operations avoid
part-rewrite storms, projection conflicts, and silent async drift?**

## Expect

- Hot write paths avoid row-by-row or frequent `ALTER TABLE ... UPDATE`/`DELETE`
  mutations that rewrite multi-gigabyte parts and starve the background merge
  pool.
- Callers do not assume immediate read-after-write visibility after async
  mutations (`mutations_sync = 0`).
- Selective lightweight deletes/updates respect version prerequisites, key
  immutability, and projection compatibility (`lightweight_mutation_projection_mode`).
- Retention and bulk purges drop whole partitions (`DROP PARTITION` or
  `ttl_only_drop_parts = 1`) rather than scrubbing individual rows across parts.

## Look for

Inspect migration SQL, retention/TTL rules, scheduled jobs, `system.mutations`
evidence, and client code issuing `UPDATE`, `DELETE`, or `ALTER TABLE`.

- **Mutation rewrite storms**: `ALTER TABLE ... UPDATE` or `ALTER TABLE ...
  DELETE` called per request, per Kafka message, or in tight loops against live
  MergeTree tables, rewriting whole parts per call and stalling background
  merges.
- **Silent async mutation drift**: code executing `ALTER TABLE ... UPDATE`/
  `DELETE` under default `mutations_sync = 0` and immediately querying the
  mutated state or chaining dependent steps assuming completion.
- **Misused lightweight updates and deletes**: using lightweight `UPDATE` patch
  parts on bulk >10% table rewrites, attempting to update primary or partition
  key columns, omitting `enable_block_number_column`/`enable_block_offset_column`,
  or running lightweight deletes on tables with incompatible projections.
- **Partial-part TTL rewrites**: `TTL` expiration rules on time-partitioned
  retention tables omitting `ttl_only_drop_parts = 1` (causing continuous
  background rewrite mutations) or misaligned with `PARTITION BY`.
- **Unbounded destructive lifecycle operations**: `DELETE FROM` or `ALTER TABLE
  ... DELETE` missing a bounded filter (for example `WHERE 1`), or wiping whole
  time ranges via row deletes instead of `ALTER TABLE ... DROP PARTITION`.

## Not a finding

- Scheduled, low-frequency bulk compliance purges (such as nightly or weekly
  GDPR `ALTER TABLE ... DELETE` batches) when documented as offline/bounded.
- Lightweight `UPDATE` patch parts on a supporting pinned version configured
  with block-number and block-offset columns for selective (<= ~10%) non-key
  edits.
- Metadata-only `ALTER TABLE ... DROP PARTITION` / `DETACH PARTITION` for
  whole-window retention cleanup.
- `ALTER TABLE ... UPDATE` / `DELETE` when explicitly accepted by a prior ADR
  for low-churn tables (`disputed`).
