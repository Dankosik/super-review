# Workflow

For the orchestrator. Readers and challengers work from
[the contract](contract.md).

## 1. Pin source, baseline, and cumulative schema

1. **Pin the target without modifying the tree.**
   - Local scope: read the working tree and record `HEAD`. For local changes,
     take uncommitted work against `HEAD` or the branch against its merge-base
     with main (when unspecified, branch plus uncommitted work).
   - PR: read files at the head commit and diff from merge-base without
     checking out. Fetch missing PR commits if possible (adds objects only);
     otherwise read via GitHub and note in the report that code outside changed
     files could not be searched.
   - Named branch or ref not checked out: resolve it once to a commit and give
     readers that commit, not the branch name.
   - Before writing the final report on a local tree, re-check `HEAD` and the
     status of scoped files; list any files that changed mid-review.
2. **Pin ClickHouse version, deployment mode, and runtime evidence once.**
   - Inspect deployment and ClickHouse config files (Dockerfiles, Compose, CI,
     Helm/Altinity Operator `ClickHouseInstallation` CRDs, Terraform,
     `config.xml`, `users.xml`, `remote_servers.xml`, migration runner configs),
     client lockfiles (`go.sum`, `Cargo.lock`, JS/TS, JVM, or Python
     lockfiles), and on-disk client source roots (`vendor/`, `GOMODCACHE`,
     `~/.cargo/registry/src`, `node_modules/`, `~/.m2/repository`, virtualenvs).
   - Determine whether the deployment is **self-managed** (OSS/Altinity with
     Keeper/ZooKeeper) or **ClickHouse Cloud** (`SharedMergeTree`/`Shared` DB),
     or note `unstated` when missing.
   - Collect any committed or user-supplied `EXPLAIN indexes = 1`, `EXPLAIN
     PLAN`, `system.parts`, `system.query_log`, `system.mutations`, `SHOW
     CREATE TABLE` dumps, ADRs, or ingest/volume docs. Hand this baseline to
     every reader and challenger as context only, never as a list of suspected
     issues.
3. **Locate ClickHouse sources and cumulative schema.**
   - Identify standalone `.sql` files (ordered migrations, table/MV/projection/
     `Distributed` DDL, named queries, backfills), ClickHouse XML/YAML configs,
     and embedded ClickHouse SQL or ingestion/query call sites in Go,
     TypeScript, Rust, Java, and Python.
   - List non-ClickHouse databases (PostgreSQL, MySQL, SQLite, SQL Server,
     Oracle, BigQuery, Snowflake, DuckDB, NoSQL) as excluded.
   - **Early stop:** When the scope contains no ClickHouse DDL, migration,
     query, config, or client call site, start no readers; report the excluded
     or unsupported targets and stop.

## 2. Select lenses and partition

| Lens | Asks | Selected when the area has |
| --- | --- | --- |
| [storage-keys](lenses/storage-keys.md) | Do MergeTree engine choice, `ORDER BY`/`PRIMARY KEY`, `PARTITION BY`, column types, and skipping indexes match actual write and read physics? | Table DDL, engine definitions, sorting/partition keys, column types/codecs, skipping indexes, or `EXPLAIN indexes = 1` / `system.parts`. |
| [mutations-lifecycle](lenses/mutations-lifecycle.md) | Do updates, deletes, TTLs, and schema/data lifecycle operations avoid part-rewrite storms, projection conflicts, and silent async drift? | `ALTER TABLE ... UPDATE`/`DELETE`, lightweight `DELETE`/`UPDATE`, `TTL`, `DROP`/`DETACH PARTITION`, `MATERIALIZE INDEX`/`PROJECTION`, or `mutations_sync`. |
| [views-projections](lenses/views-projections.md) | Do materialized views, target engines, and projections compute exact incremental state without per-block corruption, missed updates, or backfill gaps? | Incremental or refreshable `MATERIALIZED VIEW`s, `AggregatingMergeTree`/`SummingMergeTree`, `-State`/`-Merge`, `PROJECTION`s, `POPULATE`, or backfills. |
| [queries-distributed](lenses/queries-distributed.md) | Do analytical, deduplicating, and Distributed queries return right results and avoid right-side RAM blowup, N^2 shard amplification, and full-column scans? | `SELECT` queries, `ReplacingMergeTree`/`FINAL`/`argMax`, `JOIN`s, `Distributed` queries, `GLOBAL IN`/`JOIN`, `PREWHERE`, or `system.query_log`. |
| [cluster-ddl](lenses/cluster-ddl.md) | Do cluster topology, replication engines, DDL propagation, and rolling-deploy migrations match the pinned deployment (self-managed vs ClickHouse Cloud)? | `Replicated*`/`SharedMergeTree`/`Distributed` DDL, `ON CLUSTER`, `DatabaseReplicated`, `remote_servers.xml`, `internal_replication`, or rolling schema changes. |
| [ingestion-client](lenses/ingestion-client.md) | Do client producers and query callers batch writes, pick safe formats and async settings, bind parameters safely, and bound memory and timeouts? | Client `INSERT`/batching code, `async_insert`, wire formats (`Native`/`RowBinary`/`JSONEachRow`), `query_params`/parameter binding, or client timeouts/streams. |

Select every lens whose signal is present and state which were omitted and why
(never drop a lens just because a change is small).

Assign one lens per reader. For a small change (~300 changed lines or fewer in
one area) or a small self-contained ClickHouse module, pair related lenses
while keeping query semantics and client ingestion isolated: pair
`storage-keys` with `mutations-lifecycle`, pair `views-projections` with
`cluster-ddl`, keep `queries-distributed` solo, and keep `ingestion-client`
solo (at most four readers). Each paired reader runs both full passes and
reports coverage separately. Partition mixed self-managed and Cloud targets by
deployment, and split large scopes along database/pipeline boundaries when one
reader cannot read all scoped files plus relevant migration history in full.
Readers overlap on purpose; you merge their outputs.

## 3. Run fresh readers

Start each reader in a fresh context with no conversation history and no peer
results. Supply: target and pinned revision, assigned lens or pair, exact
files, ordered migration and schema snapshot paths (plus the `D..H` diff with
removed lines inline, cumulative schema snapshot, cluster configs, and needed
client library excerpts when readers lack Git/shell access), pinned ClickHouse
version and deployment baseline, located `EXPLAIN indexes = 1` / `system.parts`
/ `system.query_log` / capacity docs, and paths to
[the contract](contract.md), its assigned lens(es), the matching deployment
context ([Self-managed](deployments/self-managed.md) or
[ClickHouse Cloud](deployments/cloud.md), or both when deployment is unstated
or hybrid), and [the result format](../assets/finding-template.md). Never
supply suspected issues, prior findings, decisions to respect, or severity.

Run up to eight agents concurrently unless the user overrides the limit,
honoring explicit user model/effort overrides through native configuration. If
a reader leaves files in its scope unread, dispatch one fresh retry for that
lens with only the unread files; anything still unread goes in the report.

## 4. Merge and challenge

Merge candidates with the same root cause across readers, preserving each
traced mechanism. Before launching challengers, run a cross-seam pass across
partition boundaries: check client ingestion calls against table `PARTITION BY`
and `async_insert` profiles, check `ALTER` migrations against dependent
materialized views and `Distributed` wrapper tables, and check queries against
table `ORDER BY`, `ReplacingMergeTree` versions, and `remote_servers.xml`
sharding keys. Add any traced candidate you find to the matching lens's
challenge.

Send every traced or quoted candidate to a fresh challenger (one per reader
task; a merged candidate goes to one challenger). Give it the same materials,
lens included, plus [the challenge](challenge.md), and for each candidate only
location, ClickHouse baseline, mechanism, basis, impact, and safer form. Strip
the reader's reasoning, notes, and confidence. Never ask a challenger to finish
an incomplete trace: complete a missing step from source yourself first, or
mark the candidate unproven.

## 5. Decide

You own every decision. Confidence, tone, or agreement between agents is not
evidence.

- **Walk each trace yourself.** Confirm every quoted line against the
  cumulative schema, pinned ClickHouse version and deployment, server configs,
  and locked client library source. Any step resting on unread migrations,
  configs, or client source is unproven; read missing local files yourself
  without rewriting the claim.
- **Check version, deployment, and runtime evidence.** Verify the safer form on
  the pinned version and deployment (`self-managed` vs `cloud`), walking `NULL`/
  default, empty-block, retry-deduplication, tombstone, cross-partition, and
  `D -> H` cases. Route claims waiting only on unstated version/deployment,
  volume, cardinality, ingest rate, or `EXPLAIN indexes = 1` / `system.parts` /
  `system.query_log` output to `needs confirmation`.
- **Check findings on the same table, view, pipeline, or query together.**
  Confirm proposed keys, skipping indexes, MVs, and client settings stay
  compatible and do not duplicate work.
- **Weigh the challenge as an argument, not a ruling.** Verify quoted
  counter-evidence on `falls` (when `falls` rests only on unconfirmed server
  version, deployment mode, volume, cardinality, ingest rate, or missing
  `EXPLAIN indexes = 1` / `system.parts` / `system.query_log` while the static
  mechanism holds, route to `needs confirmation`); reject unbacked `stands`,
  verify documented rationale on `disputed`, and name both sides on `tradeoff`.

| Outcome | When |
| --- | --- |
| finding | Mechanism confirmed on pinned ClickHouse version/deployment, valid safer form keeps semantics, and challenge stood (or `falls` refuted). |
| tradeoff | Confirmed failure whose safer form carries a real operational or behavior cost the team must weigh. |
| disputed | Confirmed impact backed by a prior documented choice whose reason holds and whose cost was accepted. |
| needs confirmation | Static mechanism holds except for an unconfirmed ClickHouse version/deployment, table/part volume, cardinality, ingest rate, or `EXPLAIN indexes = 1` / `system.parts` / `system.query_log` output. |
| unproven | Missing trace step, unread schema/migration/config/client source, or no challenge run. |
| rejected | Mechanism false on this ClickHouse version/deployment, prevented upstream, safer form invalid or breaks relied-on behavior, or out of scope. |

Rank surviving findings by impact class:
1. Data loss, silent corruption, or broken security boundary (MV per-block
   corruption, `POPULATE` gap, `wait_for_async_insert = 0` or
   `insert_distributed_sync = 0` durable-write drop, `internal_replication =
   false` duplication, SQL injection, unallowlisted identifier, unbounded
   destructive delete/drop).
2. Cluster or ingestion outage (`TOO_MANY_PARTS` from high-cardinality
   `PARTITION BY` or unbatched inserts, mutation rewrite storm, OOM right-side
   `JOIN`, N^2 distributed query fan-out, invalid `ON CLUSTER` or engine DDL
   for the pinned deployment, `D -> H` MV/Distributed break).
3. Wrong analytical or deduplicated result (`ReplacingMergeTree` read without
   `FINAL`/`argMax`, `max(is_deleted)` tombstone bug, cross-partition
   `do_not_merge_across_partitions_select_final = 1`, `join_use_nulls = 0`
   broken `IS NULL` anti-join, `SummingMergeTree` zero-sum drop, non-deterministic
   `ANY JOIN` or unordered `LIMIT`).
4. Provable scan, part, or parse amplification (non-monotonic predicate
   defeating primary key, broken skipping index `GRANULARITY` or missing
   `MATERIALIZE INDEX`, `TTL` partial-part rewrites, wide `SELECT *` I/O,
   unbounded text-format parsing on high-volume ingest).
5. Provable schema-evolution fragility (reported compactly at the end of
   Findings).

Finish deciding, ranking, and checking siblings before drafting the report.

## 6. Check siblings and report

Search the repository for siblings of each surviving finding (same
high-cardinality `PARTITION BY`, row-by-row `ALTER TABLE ... UPDATE`/`DELETE`,
MV without `-State`/`-Merge`, `ReplacingMergeTree` read without `FINAL`/
`argMax`, `join_use_nulls = 0` `IS NULL` anti-join, non-`GLOBAL` distributed
subquery, unbatched single-row insert, `wait_for_async_insert = 0`, or
unparameterized interpolation elsewhere). Give in-scope siblings to one fresh
reader with that finding's lens, the finding as pattern, and those files (the
sole task that receives a known finding); each sibling still needs its own
trace, challenge, and decision (`pre-existing` if outside the change). A sibling
in code the user's narrowing left out gets no reader or challenge: list it in
one line with location and repeated finding.

Deliver [the report template](../assets/report-template.md) with every
surviving finding, tradeoff, disputed item, and confirmation question (never
truncate to fit length). A reader returning nothing is unread coverage, not a
clean pass. Zero findings is a valid outcome: state what was read without
claiming the ClickHouse schema, queries, or pipelines are defect-free.
