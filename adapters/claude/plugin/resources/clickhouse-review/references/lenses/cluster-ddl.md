# Cluster DDL and topology

**Do cluster topology, replication engines, DDL propagation, and
rolling-deploy migrations match the pinned deployment (self-managed vs
ClickHouse Cloud)?**

## Expect

- DDL propagation matches the deployment: `ON CLUSTER` in self-managed `Atomic`
  clusters, no `ON CLUSTER` inside `DatabaseReplicated` or ClickHouse Cloud
  `Shared` databases, and no `SharedMergeTree` syntax on self-managed OSS.
- Replicated and `Distributed` configurations align: `internal_replication =
  true` for `ReplicatedMergeTree` shards, durable writes avoid unguarded async
  `Distributed` spools, and sharding keys align with deduplication/merge keys.
- Rolling-deploy (`D -> H`) schema changes keep old and new producers,
  dependent materialized views, and `Distributed` wrappers compatible.

## Look for

Inspect ordered migrations, `CREATE`/`ALTER`/`DROP` DDL, `remote_servers.xml`,
`config.xml`, Helm/operator CRDs, Terraform manifests, and MV/Distributed links.

- **Deployment and DDL propagation mismatches**: `ON CLUSTER` inside
  `DatabaseReplicated` (fails with `ON CLUSTER is not allowed for Replicated
  database`); missing `ON CLUSTER` in self-managed `Atomic` multi-node DDL;
  hardcoded `ON CLUSTER`, manual Keeper paths, or redundant `Distributed`
  wrappers in ClickHouse Cloud; `SharedMergeTree` DDL targeting OSS.
- **Replication and sharding topology bugs**: non-replicated `MergeTree` on
  multi-replica self-managed shards (including inside `DatabaseReplicated`,
  which replicates DDL but not plain `MergeTree` data); hardcoded replica names
  instead of `{shard}`/`{uuid}`/`{replica}` macros; `internal_replication =
  false` on `ReplicatedMergeTree` shards (duplicating blocks); random sharding
  (`rand()`) splitting `ReplacingMergeTree`/`AggregatingMergeTree` keys.
- **Async `Distributed` write loss**: durable writers inserting through a
  `Distributed` table with default `insert_distributed_sync = 0` on ephemeral
  nodes/pods, spooling `.bin` files to local disk that vanish on crash or stall
  silently in `DistributedFilesToSend`.
- **Rolling-deploy (`D -> H`) and wrapper drift**: altering or dropping columns
  on a local table without updating dependent `Distributed` wrappers or
  `MATERIALIZED VIEW` target tables; dropping or renaming columns while old
  producers still insert them.
- **Key-mutability DDL failures**: `PARTITION BY`, `PRIMARY KEY`, and sort
  directions on retained columns are immutable; `MODIFY ORDER BY` permits only
  appending brand-new `ADD COLUMN`s without `DEFAULT`/`MATERIALIZED`/`ALIAS` in
  the same `ALTER`. Reordering, removing, or adding existing columns fails
  in-place and requires expand-and-swap (`EXCHANGE TABLES`, a `tradeoff`).

## Not a finding

- Plain `ENGINE = MergeTree` (or `ReplacingMergeTree`, `AggregatingMergeTree`)
  without `ON CLUSTER` on ClickHouse Cloud (`SharedMergeTree` conversion and
  `Shared` DB replication are automatic).
- Argless `ReplicatedMergeTree()` when `default_replica_path`/
  `default_replica_name` or `DatabaseReplicated` defaults are configured in the
  pinned server config.
- Appending a brand-new defaultless `ADD COLUMN` to `ORDER BY` in the same
  `ALTER TABLE`, or `EXCHANGE TABLES` atomic swap on `Atomic`, `Replicated`, or
  `Shared` databases.
- Writing directly to shard local tables (with client-side routing) instead of
  through a `Distributed` table.
