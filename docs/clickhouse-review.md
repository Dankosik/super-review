# ClickHouse Review

ClickHouse Review checks MergeTree schemas, parts, mutations, materialized
views, projections, columnar and `Distributed` queries, cluster DDL, and client
ingestion by reading. It is one of six reviews in this repository;
[the family design](review-family.md) explains how they relate, why ClickHouse
Review stays separate from OLTP SQL Review, and why none of them executes
project code or connects to a database.

## Supported deployments and sources

- **Deployments (v1):** Self-managed ClickHouse (OSS/Altinity on ClickHouse
  Keeper or ZooKeeper, v24-25+) and ClickHouse Cloud (`SharedMergeTree` and
  `Shared` database).
- **Excluded databases:** PostgreSQL, MySQL, SQLite, SQL Server, Oracle,
  BigQuery, Snowflake, DuckDB, and NoSQL stores are excluded and listed, never
  reviewed by analogy.
- **ClickHouse sources:** standalone `.sql` files (DDL, ordered migrations,
  materialized views, projections, `Distributed` wrappers, named queries,
  backfills), ClickHouse server/cluster configs (`config.xml`, `users.xml`,
  `remote_servers.xml`, Helm/Altinity Operator CRDs, Terraform), and embedded
  ClickHouse SQL or client ingestion/query code in Go, TypeScript, Rust, Java,
  and Python.

## Six lenses

| Lens | Focus |
| --- | --- |
| `storage-keys` | MergeTree engine choice (`Replacing*`, `Summing*`, `VersionedCollapsing*`), `PARTITION BY` cardinality and explicit timezones, `ORDER BY`/`PRIMARY KEY` alignment, valid type wrappers (`LowCardinality(Nullable(T))`), and skipping index `GRANULARITY` (granules, not rows) and materialization. |
| `mutations-lifecycle` | Frequent `ALTER TABLE ... UPDATE`/`DELETE` rewrite storms, async `mutations_sync` vs `lightweight_deletes_sync` drift, 25.8+ lightweight update patch-part constraints, table-level `lightweight_mutation_projection_mode`, and `ttl_only_drop_parts` retention. |
| `views-projections` | Incremental MV per-block trigger physics, `AggregatingMergeTree` `-State`/`-Merge` and `SimpleAggregateFunction`, `POPULATE` gaps, implicit `.inner` storage, multi-MV retry dedup (`deduplicate_blocks_in_dependent_materialized_views`), MV `JOIN` asymmetry, refreshable MVs, and `deduplicate_merge_projection_mode`. |
| `queries-distributed` | 1-arg vs 2-arg `ReplacingMergeTree` `FINAL`/`argMax` tombstones, `join_use_nulls = 0` outer joins, `ARRAY JOIN` empty-array drops, right-side `JOIN` RAM and 24.12+/25.8+ auto-swap, `GLOBAL IN`/`JOIN` vs N^2 fan-out, dictionary layouts/`dictGet`, monotonic pruning, wide `SELECT *`. |
| `cluster-ddl` | `DatabaseReplicated` vs `ON CLUSTER`, Keeper path macros, `internal_replication`, `insert_distributed_sync`, sharding-key alignment, ClickHouse Cloud `SharedMergeTree`, `MODIFY ORDER BY` mutability rules, and rolling-deploy (`D -> H`) MV/`Distributed` safety. |
| `ingestion-client` | Client batching vs `TOO_MANY_PARTS`, `async_insert` durability and version-valid dedup (`async_insert_deduplicate` vs 26.2+ `deduplicate_insert`, per-partition `insert_deduplication_token`), `Native`/`RowBinary` vs `JSONEachRow`, `Kafka`/`Buffer` engines, `{name:Type}` parameters, and stream/batch lifecycle. |

For a small change (~300 changed lines or fewer in one area), related lenses
are paired while keeping query semantics and client ingestion isolated:
`storage-keys` + `mutations-lifecycle`, `views-projections` + `cluster-ddl`,
`queries-distributed` solo, and `ingestion-client` solo (at most four readers).

## Proof bar and independent challenge

A finding requires four checkable parts plus survival of an independent
challenge:

1. **Mechanism, traced or quoted** against the reconstructed cumulative schema,
   ordered migrations, cluster configs, dependent MVs/`Distributed` wrappers,
   client library source, and pinned ClickHouse version and deployment baseline.
2. **Expectation and basis** (`written`, `schema`, or `engine`).
3. **Concrete impact** (data loss or silent corruption, `TOO_MANY_PARTS` or
   mutation storm, OOM join or N^2 distributed fan-out, wrong/unmerged result,
   cluster DDL failure, scan/part amplification, broken parameter boundary, or
   provable schema-evolution fragility).
4. **Minimal safer form** valid for the pinned ClickHouse version, deployment
   (`self-managed` vs `cloud`), migration runner, and client library baseline.

An independent challenger receives each claim without the reader's reasoning
and attacks it on four lines: ClickHouse version/deployment mechanism,
trigger/data-dependent evidence (never dismissing statically provable
correctness, replication, boundary, or `D -> H` bugs for lacking `EXPLAIN` or
`system.parts`), safer-form executability and safe/tradeoff splits, and prior
documented intent (rejecting false-premise ADRs from `disputed`) or `Not a
finding` guards. The orchestrator walks every trace against cumulative schema
up to `HEAD`, emits one coherent ordered DDL sequence per table or pipeline,
and decides each candidate as `finding`, `tradeoff`, `disputed`,
`needs confirmation`, `unproven`, or `rejected`.

## Scope boundaries

- **Style excluded; fragility included:** cosmetic SQL formatting and alias
  taste are out of scope. Provable schema-evolution fragility (wide `SELECT *`,
  columnless `INSERT`, positional `ORDER BY 1`/`GROUP BY 1`, unqualified
  multi-table columns) stays in scope in `queries-distributed` and is reported
  compactly at the end of Findings.
- **Security seam:** broad security/compliance audits stay out of scope.
  Concrete source-provable ClickHouse boundary failures whose harm is security
  stay in scope: broken parameterization (SQL injection), unallowlisted
  dynamic identifiers, and unbounded destructive `DELETE`/`ALTER TABLE ...
  DELETE`/`DROP`/`TRUNCATE`.
- **Static proof vs runtime confirmation:** ClickHouse Review never connects to
  ClickHouse or runs ClickHouse CLIs. Claims depending on unconfirmed server
  versions, deployment mode, table/part volume, column cardinality, ingest QPS,
  `FINAL` cost, or skipping-index selectivity route to `Needs your confirmation`
  with the exact check (`EXPLAIN indexes = 1`, `EXPLAIN PLAN`, `system.parts`,
  `system.query_log`, or server config). User-supplied or committed outputs are
  evidence.

## Current limits

- Available in Claude Code (`/super-review:clickhouse`), Codex
  (`$clickhouse-review`), OpenCode (`/clickhouse-review`), and Google
  Antigravity (`/clickhouse-review`). Cursor ships Super Review only.
- Deployment contexts cover Self-managed ClickHouse (v24-25+) and ClickHouse
  Cloud (`SharedMergeTree`).
- Version 0.2.0 has no live model evaluation runs yet; contrasting fixture
  packets in `evals/clickhouse-review/` are `NOT RUN`.
