# ClickHouse Review

Write in the user's language. Attach no severity labels and no invented query
timings, row counts, or part counts. Omit a section that would be empty and say
so in the outcome.

## Outcome

Surviving findings in the workflow's priority order, followed by counts:
findings, tradeoffs, disputed, needs confirmation, unproven, rejected. With
nothing found, say that no ClickHouse schema, query, view, cluster DDL, or
ingestion failures were shown in the sources that were read. When no ClickHouse
DDL, migration, query, config, or client call site was in scope, list the
excluded or unsupported targets and state that no readers were started.

What was reviewed: the PR or local root and revision, pinned ClickHouse
version(s) and deployment mode (`self-managed`, `cloud`, or unstated gaps),
ClickHouse DDL/configs/client sources and cumulative schema reconstructed,
excluded non-ClickHouse targets, lenses used and omitted, `EXPLAIN indexes = 1`,
`system.parts`, or `system.query_log` evidence used, unread files, where
siblings were searched, and files that changed during the review. Nothing was
connected to ClickHouse, executed, or migrated; findings rest on reading.

## Findings

### CH-001: <the failure or risk, where>

**ClickHouse baseline.** Deployment mode (`self-managed` or `cloud`), pinned
ClickHouse version, and config, manifest, or lockfile anchor.

**Mechanism.** The confirmed trace or quotation: numbered steps through
cumulative schema, MVs, cluster configs, SQL, callers, and client library
source with file, lines, and quoted text. For a change review, the link to the
change, or `pre-existing`.

**Basis and impact.** The basis (`written`, `schema`, or `engine`) and the
concrete effect and affected party.

**Safer form.** The minimal version-valid, deployment-valid, and runner-valid
sketch, what it keeps, and one coherent ordered DDL/migration sequence when
multiple findings touch the same table, MV chain, or `Distributed` wrapper.

**Challenge.** What the challenger tested and why the claim stood.

### Schema-evolution fragility

Findings for provable schema-evolution fragility (`SELECT *` on wide MergeTree
tables or inside views/MVs, columnless `INSERT`, positional `ORDER BY 1`/
`GROUP BY 1`, unqualified multi-table columns), compactly at the end of
Findings, one row each: location, quoted line, concrete column-evolution or
Distributed-wrapper breakage, safer form, and that the challenge stood.

## Tradeoffs

### T-001: <the improvement and what it costs>

As for a finding, then the operational or behavior cost the team must weigh
(heavy `EXCHANGE TABLES` backfill or engine rewrite, storage/write overhead
from projections or skipping indexes, `wait_for_async_insert = 1` or
`insert_distributed_sync = 1` latency vs durability, approximate vs exact
state, or client batching latency) and who would notice. When a cheap
behavior-keeping fix was split out, link its `CH-NNN` finding beside this
tradeoff. Report both sides without prescribing the team's choice.

## Disputed

### D-001: <the traced impact beside the documented decision>

The confirmed mechanism and impact beside the prior quoted decision, its stated
reason (verified true on this codebase and ClickHouse baseline), and its
explicitly accepted cost. Report both sides without prescribing the choice.

## Needs your confirmation

Candidates whose static mechanism held except for an unconfirmed ClickHouse
version or deployment mode, live table or part volume, column cardinality,
ingest rate, or pruning/memory behavior. One line each: the location, the
mechanism, and the exact check that settles it (`SELECT version()`,
`EXPLAIN indexes = 1`, `EXPLAIN PLAN`, `system.parts` active part counts per
partition, `system.query_log` `read_rows`/`memory_usage`, or cluster config).

## Outside the scope

Issues and siblings whose safer form touches only code or DDL left out by the
user's narrowing, one line each: location, mechanism, and repeated finding. Not
traced further or challenged.

## Unproven and rejected

One line each: the claim, and the missing step, unread schema/config/client
source, or counter-evidence. These carry no advice.

## Before applying

For whoever applies these findings:

- Verify DDL, MV, projection, and cluster changes on a staging cluster matching
  the production ClickHouse version and deployment (`self-managed` or `cloud`),
  confirming rolling-deploy (`D -> H`) compatibility across producers, MVs, and
  `Distributed` wrappers before dropping or altering columns.
- For key, skipping index, `FINAL`, and `JOIN` changes, capture
  `EXPLAIN indexes = 1` (plus `EXPLAIN PLAN` for joins) and compare
  `system.query_log` (`read_rows`, `read_bytes`, `memory_usage`) on
  representative production-scale data before and after.
- For partitioning, TTL, mutation, and ingestion changes, monitor
  `system.parts` (active parts per partition), `system.mutations` (stuck or
  queued mutations), and `system.metrics` (`DistributedFilesToSend` where
  applicable) under realistic write concurrency before keeping the change.
