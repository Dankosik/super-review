# ClickHouse Cloud context

ClickHouse Cloud (`SharedMergeTree` on disaggregated object storage with
`Shared` catalog/database) and self-managed ClickHouse have separate deployment
contexts. Non-ClickHouse databases are listed as excluded, never reviewed by
analogy.

## Where ClickHouse Cloud projects state their baseline

Cloud service definitions in Terraform (`clickhouse_service`), Kubernetes
configs, CI/deployment manifests, connection endpoints (`*.clickhouse.cloud`,
port 8443/9440), and ops docs stating ClickHouse Cloud tier or release channel.
Query profiles and settings in SQL/client options (`async_insert`,
`wait_for_async_insert`, `max_execution_time`, `join_use_nulls`). Cumulative
schema in ordered migrations, `SHOW CREATE TABLE` dumps, and locked client
manifests (`go.sum`, `Cargo.lock`, JS/TS, JVM, or Python lockfiles).

## Verify in source and baseline

Confirm from workspace manifests or docs that the target runs on ClickHouse
Cloud (`SharedMergeTree`) rather than a self-managed cluster before applying
Cloud DDL rules. Inspect locked client library source already on disk
(`vendor/`, `GOMODCACHE`, `~/.cargo/registry/src`, `node_modules/`,
`~/.m2/repository`) before claiming wire format, streaming, compression, or
parameter-binding behavior. When deployment mode or ClickHouse Cloud release
behavior is unstated and decides the claim, route to `needs confirmation`.

## Questions to settle before claiming

- **Automatic `SharedMergeTree` and legacy cluster DDL**: ClickHouse Cloud
  transparently converts standard `MergeTree` (and argless
  `ReplicatedMergeTree()`) to `SharedMergeTree` and replicates DDL through the
  `Shared` database. Do migrations hardcode `ON CLUSTER`, manual ZooKeeper
  paths in `ReplicatedMergeTree('/clickhouse/tables/{shard}/...', '{replica}')`,
  or a redundant `Distributed` wrapper for single-service compute scaling?
- **Object-storage small-part amplification and `async_insert`**: On
  `SharedMergeTree`, unbatched inserts create remote object-storage parts and
  Keeper metadata entries. Check whether small writes batch client-side or use
  `async_insert = 1` with `wait_for_async_insert = 1`; flag
  `wait_for_async_insert = 0` on durable pipelines and retries missing
  `async_insert_deduplicate = 1` (or `deduplicate_insert`) + `insert_deduplication_token`.
- **Partitioning, skipping indexes, and object-storage read amplification**:
  Does high-cardinality `PARTITION BY` explode active parts across S3/GCS, or
  does `SELECT *` on wide tables pull unnecessary column objects over the
  network? Check skipping index `GRANULARITY` (in granules, not rows) and
  `MATERIALIZE INDEX` on existing parts before assuming pruning; require
  `EXPLAIN indexes = 1` or `system.query_log` for selectivity claims.
- **Mutations, lightweight updates, and TTLs**: Heavy `ALTER TABLE ... UPDATE`/
  `DELETE` rewrites whole object-storage parts. Verify whether selective updates
  use versioned `ReplacingMergeTree` (or Cloud-supported lightweight update
  patch parts with required block-tracking table settings), and verify time-based
  retention uses `ttl_only_drop_parts = 1` aligned with `PARTITION BY`.
- **Stateless compute scaling, `JOIN` RAM, and query guardrails**: Even on
  elastic Cloud replicas, hash-join right sides and unbounded `GROUP BY` still
  exhaust per-replica RAM. Check `join_use_nulls` (default 0), `join_algorithm`
  fallbacks (`grace_hash`/`full_sorting_merge`) for large joins, `ReplacingMergeTree`
  `FINAL`/`argMax` correctness, and `max_execution_time`/`max_memory_usage` on
  user-facing queries.

## ClickHouse Cloud boundaries

- **Finding**: Valid on ClickHouse Cloud (`SharedMergeTree` and `Shared` DB)
  without self-managed `ON CLUSTER` or Keeper-path syntax; keeps query results,
  durability, and rolling-deploy `D -> H` compatibility.
- **Tradeoff**: Adds storage/merge work (projections, skipping indexes, MVs),
  trades write latency for durability (`wait_for_async_insert = 1`), or moves
  to client-side batching / binary formats at integration complexity cost.

## Not a finding in ClickHouse Cloud

- Plain `ENGINE = MergeTree` (or `ReplacingMergeTree`, `AggregatingMergeTree`)
  without `Replicated*` prefix or `ON CLUSTER`: ClickHouse Cloud transparently
  backs it with `SharedMergeTree` and replicates DDL automatically.
- Omitting a `Distributed` table wrapper when all queries run against one
  ClickHouse Cloud service scaling compute over shared object storage.
- Using `async_insert = 1` with `wait_for_async_insert = 1` for concurrent
  microservice writers instead of forcing a separate external batching queue.
- Claiming `FINAL` or skipping-index slowness without `EXPLAIN indexes = 1`,
  `system.parts`, or `system.query_log` evidence.
