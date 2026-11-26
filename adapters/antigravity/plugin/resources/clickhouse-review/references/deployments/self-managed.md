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
`DatabaseReplicated`), `<remote_servers>` topology, `<users>` profile settings,
and client library version from workspace files, never from memory. Inspect
locked client source already on disk (`vendor/`, `GOMODCACHE`,
`~/.cargo/registry/src`, `node_modules/`, `~/.m2/repository`) before claiming
batching, wire format, or parameter-binding behavior. When an unstated version
or missing XML config decides a claim, route to `needs confirmation` or mark
the step unproven.

## Questions to settle before claiming

- **DatabaseReplicated vs `ON CLUSTER` and Keeper paths**: Inside
  `DatabaseReplicated`, `ON CLUSTER` fails (`ON CLUSTER is not allowed for
  Replicated database`) and argless `Replicated*MergeTree()` uses managed
  Keeper paths, whereas plain `MergeTree` replicates only DDL (not row data).
  In `Atomic` clusters, omitting `ON CLUSTER` hits only one node, and explicit
  paths must use `{shard}`/`{uuid}` and `{replica}` macros.
- **Distributed writes and `internal_replication`**: Does `remote_servers.xml`
  set `<internal_replication>true</internal_replication>` for shards backed by
  `ReplicatedMergeTree`? Setting `false` duplicates every inserted block across
  replicas. Does a durable producer insert into `Distributed` with default
  `insert_distributed_sync = 0` (async local disk `.bin` spool risking loss on
  node crash) instead of `insert_distributed_sync = 1` or direct shard writes?
- **Version-gated optimizer and DDL mechanics**: Check the pinned server
  version before claiming `INNER JOIN` right-side bloat
  (`query_plan_join_swap_table = 'auto'`), slow `FINAL` (needs `EXPLAIN`/
  query-log proof), filtered projections (`PROJECTION ... WHERE`), lightweight
  `UPDATE` patch parts (`enable_block_number_column`/`enable_block_offset_column`),
  or native `JSON` type versus deprecated `Object('json')`.
- **Parts, mutations, and local/tiered disks**: Check `PARTITION BY` cardinality
  and `max_partitions_per_insert_block` (default 100) alongside client batching
  or `async_insert` for `TOO_MANY_PARTS` (`parts_to_delay_insert`/
  `parts_to_throw_insert`). Verify `TTL` policies set `ttl_only_drop_parts = 1`
  when aligned with partitions, and check `lightweight_mutation_projection_mode`
  when lightweight deletes meet projections.
- **Shard-key alignment for stateful engines**: On multi-shard clusters, do
  `ReplacingMergeTree`, `SummingMergeTree`, or `AggregatingMergeTree` tables
  behind a `Distributed` table shard by the deduplication/grouping key (or a
  prefix of it)? Random sharding (`rand()`) splits matching keys across shards
  so neither merges nor local `FINAL` deduplicate them.

## Self-managed ClickHouse boundaries

- **Finding**: Valid on the pinned self-managed ClickHouse version, database
  engine, `<remote_servers>` topology, and client baseline; keeps query
  semantics, replication integrity, and `D -> H` rolling compatibility.
- **Tradeoff**: Adds storage or merge overhead (projections, skipping indexes,
  MVs), increases write latency for durability (`wait_for_async_insert = 1`,
  `insert_distributed_sync = 1`, `insert_quorum`), or requires `EXCHANGE TABLES`
  to change immutable `ORDER BY`/`PARTITION BY`.

## Not a finding in Self-managed ClickHouse

- Omitting explicit ZooKeeper path arguments in `ReplicatedMergeTree()` when
  `default_replica_path`/`default_replica_name` or `DatabaseReplicated`
  defaults are configured.
- Claiming `FINAL` is unconditionally slow or claiming monotonic primary-key
  functions (`toDate`, `toYYYYMM`, `toStartOfHour`) defeat index pruning
  without `EXPLAIN indexes = 1` or `system.query_log` evidence.
- Flagging `INNER JOIN` table order on versions with `query_plan_join_swap_table
  = 'auto'` without `EXPLAIN PLAN` or an explicit `'false'` setting.
- Deploying `SharedMergeTree` is invalid on OSS; do not propose it as a safer
  form for self-managed clusters.
