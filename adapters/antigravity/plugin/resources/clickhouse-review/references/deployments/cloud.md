# ClickHouse Cloud context

ClickHouse Cloud (`SharedMergeTree` on disaggregated object storage with
`Shared` catalog/database) and self-managed ClickHouse have separate deployment
contexts. Non-ClickHouse databases are listed as excluded, never reviewed by
analogy.

## Where ClickHouse Cloud projects state their baseline

Cloud service definitions in Terraform (`clickhouse_service`), Kubernetes
configs, CI/deployment manifests, connection endpoints (`*.clickhouse.cloud`,
port 8443/9440), and ops docs stating ClickHouse Cloud tier or release channel.
Query profiles and settings in SQL (`CREATE SETTINGS PROFILE`, not XML
`users.xml`/`config.xml`) and client options (`async_insert`,
`wait_for_async_insert`, `max_execution_time`, `join_use_nulls`). Cumulative
schema in ordered migrations, `SHOW CREATE TABLE` dumps, and locked client
manifests (`go.sum`, `Cargo.lock`, JS/TS, JVM, or Python lockfiles).

## Verify in source and baseline

Confirm from workspace manifests or docs that the target runs on ClickHouse
Cloud (`SharedMergeTree` and `Shared` DB) rather than a self-managed cluster
before applying Cloud DDL rules. Inspect locked client source on disk
(`vendor/`, `GOMODCACHE`, `~/.cargo/registry/src`, `node_modules/`,
`~/.m2/repository`, `~/.gradle/caches`) for driver defaults without marking
code-visible SQL or setting failures unproven if caches are absent. When
deployment mode or Cloud release channel behavior is unstated and decides the
claim, route to `needs confirmation`.

## Questions to settle before claiming

- **Automatic `SharedMergeTree` and legacy cluster DDL**: ClickHouse Cloud
  converts plain `MergeTree` (and argless `ReplicatedMergeTree()`) to
  `SharedMergeTree` and replicates DDL through the `Shared` database. Do
  migrations hardcode `ON CLUSTER`, manual ZooKeeper paths in `Replicated*`, or
  a redundant `Distributed` wrapper for single-service compute scaling?
- **Object-storage small-part and rewrite amplification**: On `SharedMergeTree`,
  unbatched inserts and heavy mutations amplify S3/GCS object writes and Keeper
  metadata. Check client batching or `async_insert = 1` with
  `wait_for_async_insert = 1`, plus version-valid async deduplication and unique
  per-partition deduplication tokens on retries (per `ingestion-client`).
- **Cloud defaults and managed ingestion**: On Cloud, `lightweight_deletes_sync`
  defaults to `1` (vs `2` self-managed), and ClickPipes is preferred over
  self-managed `Kafka` engine tables for managed streaming ingest. Elastic
  stateless replicas still bound per-replica RAM on hash joins and `GROUP BY`.
- **Cloud release-channel gating**: Confirm the pinned Cloud release or channel
  before relying on version-gated features (`deduplicate_insert`, external join
  spill settings, filtered projections, lightweight `UPDATE` patch parts); route
  unconfirmed release behavior to `needs confirmation`.
- **`SharedMergeTree` durability and read-after-write**: `SharedMergeTree`
  commits parts to shared object storage and Keeper metadata, so `insert_quorum`
  is N/A. For cross-replica read-after-write consistency, prefer sticky
  sessions; `select_sequential_consistency` or `SYSTEM SYNC REPLICA ...
  LIGHTWEIGHT` add Keeper load (`tradeoff`).

## ClickHouse Cloud boundaries

- **Finding**: Cheap behavior-keeping fix valid on ClickHouse Cloud
  (`SharedMergeTree` and `Shared` DB) without `ON CLUSTER` or Keeper-path
  syntax; keeps query results, durability, and `D -> H` rolling compatibility.
- **Tradeoff**: Adds object-storage or merge work (projections, skipping
  indexes, MVs), requires `EXCHANGE TABLES` backfill rebuilds, trades write
  latency for durability (`wait_for_async_insert = 1`), or moves to client
  batching / ClickPipes / binary formats at integration cost.

## Not a finding in ClickHouse Cloud

- Plain `ENGINE = MergeTree` (or `ReplacingMergeTree`, `AggregatingMergeTree`)
  without `Replicated*` prefix or `ON CLUSTER`: ClickHouse Cloud transparently
  backs it with `SharedMergeTree` and replicates DDL automatically.
- Omitting a `Distributed` table wrapper when all queries run against one
  ClickHouse Cloud service scaling compute over shared object storage.
- Using `async_insert = 1` with `wait_for_async_insert = 1` for concurrent
  microservice writers instead of forcing a separate external batching queue.
- Omitting `insert_quorum` or XML server configs (`users.xml`, `config.xml`)
  on ClickHouse Cloud (`SharedMergeTree` commits via Keeper/object storage;
  profiles use SQL `CREATE SETTINGS PROFILE`).
