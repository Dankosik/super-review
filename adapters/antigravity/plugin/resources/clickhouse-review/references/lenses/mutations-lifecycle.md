# Mutations and lifecycle

**Do updates, deletes, TTLs, and schema/data lifecycle operations avoid
part-rewrite storms, projection conflicts, and silent async drift?**

## Expect

- Hot write paths avoid row-by-row or frequent `ALTER TABLE ... UPDATE`/`DELETE`
  mutations that rewrite multi-gigabyte parts and starve the background merge
  pool.
- Callers do not assume immediate read-after-write visibility after async
  mutations (`mutations_sync = 0`) and distinguish `mutations_sync` from
  `lightweight_deletes_sync`.
- Selective lightweight deletes and updates respect pinned version support,
  engine and key immutability, block-tracking table settings, and table-level
  `lightweight_mutation_projection_mode`.
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
  mutated state or chaining steps; distinguish `mutations_sync` (default `0`)
  from `lightweight_deletes_sync` (`2` self-managed, `1` Cloud).
- **Static lightweight update failures**: lightweight `UPDATE` attempting to
  modify primary or partition key columns, targeting unsupported engines
  (`Summing*`/`Aggregating*`/`Graphite*` or `UNIQUE KEY`), or omitting required
  `enable_block_number_column` and `enable_block_offset_column` table settings.
- **Bulk patch parts and projection conflicts**: lightweight `UPDATE` patch
  parts (experimental in `25.5`, default-on in `25.8+`) degrade on bulk (`>10%`)
  rewrites (`needs confirmation` or `tradeoff` unless `WHERE` is statically
  bulk/unbounded) and bypass projections while patch parts exist; lightweight
  deletes on tables with projections require table-level
  `lightweight_mutation_projection_mode` (query-level setting is obsolete).
- **Partial-part TTL rewrites**: `TTL` expiration rules on time-partitioned
  retention tables omitting `ttl_only_drop_parts = 1` (causing continuous
  background rewrite mutations) or misaligned with `PARTITION BY`.
- **Unbounded destructive lifecycle operations**: `DELETE FROM` or `ALTER TABLE
  ... DELETE` missing a bounded filter (for example `WHERE 1`), or wiping whole
  time ranges via row deletes instead of `ALTER TABLE ... DROP PARTITION`.

## Not a finding

- Scheduled, low-frequency bulk compliance purges (such as nightly or weekly
  GDPR `ALTER TABLE ... DELETE` batches) when documented as offline/bounded.
- Selective non-key lightweight `UPDATE` patch parts on a supporting pinned
  version (`25.8+` default-on) configured with `enable_block_number_column` and
  `enable_block_offset_column` table settings.
- Metadata-only `ALTER TABLE ... DROP PARTITION` / `DETACH PARTITION` for
  whole-window retention cleanup.
- `ALTER TABLE ... UPDATE` / `DELETE` when explicitly accepted by a verified
  prior ADR for low-churn tables (`disputed`).
