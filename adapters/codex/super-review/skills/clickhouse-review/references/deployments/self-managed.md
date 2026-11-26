# Self-managed ClickHouse context

Self-managed ClickHouse (OSS or Altinity builds with ClickHouse Keeper or
ZooKeeper, v24-25+) and ClickHouse Cloud (`SharedMergeTree`) have separate
deployment contexts. Non-ClickHouse databases are listed as excluded, never
reviewed by analogy.

## Where Self-managed ClickHouse projects state their baseline

Server image tag and version in Dockerfiles, Compose (`clickhouse/clickhouse-server:<tag>`,
`altinity/clickhouse-server:<tag>`), CI, Helm values, or Altinity Operator
`ClickHouseInstallation` CRDs. Cluster topology and profiles in `config.xml`,
`remote_servers.xml` (`<shard>`, `<replica>`, `<internal_replication>`,
`<macros>`), `users.xml` (query profiles, `async_insert`, memory limits), and
storage policies (`<storage_configuration>`). Cumulative schema in ordered
migrations, `SHOW CREATE TABLE` dumps, and client lockfiles (`go.sum`,
`Cargo.lock`, JS/TS, JVM, or Python lockfiles).

## Verify in source and baseline

Pin the ClickHouse major.minor version, database engine (`Atomic` vs
`DatabaseReplicated`), `<remote_servers>` topology, effective settings profiles
(`users.xml`/SQL profiles), and client version from workspace files, never from
memory. Check on-disk client source (`vendor/`, `GOMODCACHE`,
`~/.cargo/registry/src`, `node_modules/`, `~/.m2/repository`, `~/.gradle/caches`)
for driver defaults without marking code-visible SQL bugs unproven if caches are
absent. When an unstated version or missing XML config decides a claim, route to
`needs confirmation` or mark the step unproven.

## Questions to settle before claiming

- **`DatabaseReplicated` vs `ON CLUSTER` and Keeper paths**: Inside
  `DatabaseReplicated`, `ON CLUSTER` fails (`ON CLUSTER is not allowed for
  Replicated database`) and argless `Replicated*MergeTree()` uses managed
  Keeper paths, whereas plain `MergeTree` replicates only DDL (not row data).
  In `Atomic` clusters, omitting `ON CLUSTER` hits one node, and explicit paths
  must use `{shard}`/`{uuid}` and `{replica}` macros.
- **Distributed writes and `internal_replication`**: Does `remote_servers.xml`
  set `<internal_replication>true</internal_replication>` for `Replicated*`
  shards (setting `false` duplicates every block)? Does a durable writer insert
  into `Distributed` with default `insert_distributed_sync = 0` (local disk
  `.bin` spool lost on node crash) instead of `= 1` or direct shard writes?
- **Shard-key alignment for stateful engines**: On multi-shard clusters, do
  `Replacing*`, `Summing*`, or `Aggregating*` tables behind a `Distributed`
  table shard by the deduplication/grouping key (or its prefix)? Random
  sharding (`rand()`) splits matching keys across shards so merges and local
  `FINAL` cannot deduplicate them.
- **Self-managed defaults and local/Keeper limits**: Remember self-managed
  defaults: `lightweight_deletes_sync = 2`, non-replicated `MergeTree` sets
  `non_replicated_deduplication_window = 0`, and local/tiered disks
  (`<storage_configuration>`) plus Keeper znodes cap active part counts.
- **Version-gated features on the pinned tag**: Check the pinned server image
  tag before flagging join auto-swap (`query_plan_join_swap_table`), filtered
  projections, lightweight `UPDATE` patch parts, async dedup or join spill
  settings, or native `JSON` versus `Object('json')` (details in each lens).
  Route unstated server versions to `needs confirmation`.

## Self-managed ClickHouse boundaries

- **Finding**: Cheap behavior-keeping fix valid on the pinned self-managed
  ClickHouse version, database engine, `<remote_servers>` topology, and client
  baseline; keeps query semantics, replication integrity, and `D -> H` safety.
- **Tradeoff**: Adds storage or merge work (projections, skipping indexes, MVs),
  trades write latency for durability (`wait_for_async_insert = 1`,
  `insert_distributed_sync = 1`, `insert_quorum`), or requires `EXCHANGE TABLES`
  to rewrite immutable `PARTITION BY`/`PRIMARY KEY` or reordered `ORDER BY`.

## Not a finding in Self-managed ClickHouse

- Omitting explicit Keeper paths in `ReplicatedMergeTree()` when
  `default_replica_path`/`default_replica_name` or `DatabaseReplicated`
  defaults are configured.
- Using `ON CLUSTER` in self-managed `Atomic` multi-node clusters where the
  cluster name is declared in `remote_servers.xml` (only `DatabaseReplicated`
  rejects `ON CLUSTER`).
- Writing directly to shard local `Replicated*MergeTree` tables with
  client-side shard routing instead of inserting through a `Distributed` table.
- Using `Replicated*MergeTree` instead of `SharedMergeTree` on self-managed
  OSS: `SharedMergeTree` is Cloud-only and invalid as a safer form here.
