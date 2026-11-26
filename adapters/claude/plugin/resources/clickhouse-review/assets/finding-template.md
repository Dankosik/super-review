# Results

Compact Markdown. Evidence, not a transcript of reasoning. Quote only DDL, SQL,
config, and client code lines you read. No invented timings, row counts, or
part counts, no cluster execution, no edits, and no cosmetic SQL style remarks.

## Reader result

- Lens, deployment mode (`self-managed`, `cloud`, or `unstated`), pinned
  ClickHouse version (or `unstated`), and scope.
- Read: `.sql` DDL and ordered migrations, cumulative schema snapshots, MVs,
  projections, server/cluster configs (`config.xml`, `users.xml`,
  `remote_servers.xml`, Helm/Terraform), client callers and driver source
  consulted; `EXPLAIN indexes = 1`, `EXPLAIN PLAN`, `system.parts`, or
  `system.query_log` outputs used. What in scope you could not read.
- Outside the scope: one line for each issue whose safer form changes only code
  or DDL outside the user's narrowed scope, with location and mechanism.

With no candidates, say so.

### <number>. <the failure or risk, where>

- Location: path, table/view/query or symbol, and lines. For a change review,
  how the change introduces or exposes it, or `pre-existing`.
- ClickHouse baseline: deployment (`self-managed` or `cloud`), pinned version
  (or `unstated`), and the config, manifest, or lockfile lines establishing it.
- Mechanism: `traced` (numbered steps through cumulative schema, MVs, cluster
  configs, SQL, callers, and client library source, each with path, lines,
  quoted text, and engine effect; where you looked for existing profiles,
  batching, or guards), `quoted` (two contradicting declarations or rules), or
  `none` with the missing step.
- Basis: `written` (quoted repo rule/doc with path and lines), `schema`
  (declared engine, `ORDER BY`/`PARTITION BY`, column type, MV target, cluster
  topology, or `D -> H` contract), or `engine` (documented rule of the pinned
  ClickHouse version and deployment).
- Impact: concrete data loss or silent corruption, wrong or unmerged result,
  `TOO_MANY_PARTS` or mutation storm, OOM join or distributed fan-out outage,
  cluster DDL/replication failure, scan/part amplification, broken parameter
  boundary, or schema-evolution fragility, and who observes it.
- Safer form: minimal version-valid and deployment-valid ClickHouse DDL, SQL,
  config, or client sketch; what it keeps (query results, deduplication/state
  semantics, durability, rolling-deploy `D -> H` safety, client API shapes);
  and any tradeoff or behavior change.

## Challenger result

### <number>. `stands` | `falls` | `tradeoff` | `disputed` | no verdict

- Version, deployment, and mechanism: where your own walk through cumulative
  schema, cluster configs, SQL, client code, and pinned ClickHouse baseline
  ended, and the line that breaks the claim if one does.
- Trigger and runtime evidence: upstream batching, `users.xml`/query settings,
  allowlists, partition alignment, or whether the claim rests on unconfirmed
  volume, cardinality, ingest QPS, or pruning lacking `EXPLAIN indexes = 1`,
  `system.parts`, or `system.query_log`.
- Safer form: validity on the pinned ClickHouse version and deployment,
  boundary inputs (`NULL`/defaults, retries, tombstones, `D -> H`), and any
  operational cost or behavior change.
- Intent and scope: prior documented rationale accepting the shown cost, or any
  `Not a finding` guard that covers the claim.
- Decides it: the one piece of evidence behind the verdict.
