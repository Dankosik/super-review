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
2. **Pin dialect, engine version, and database evidence once.**
   - Inspect deployment and DB config files (Dockerfiles, Compose, CI,
     Terraform/Helm, `postgresql.conf`, `pgbouncer.ini`, `my.cnf`, migration
     and ORM configs), driver lockfiles (`Cargo.lock`, `go.sum`, JS/TS or JVM
     lockfiles), and on-disk driver source roots (`vendor/`,
     `~/.cargo/registry/src`, `node_modules/`, `GOMODCACHE`, `~/.m2/repository`).
   - Collect any committed or user-supplied `EXPLAIN` outputs, schema dumps,
     ADRs, or table-size/SLO docs. Hand this baseline to every reader and
     challenger as context only, never as a list of suspected issues.
3. **Locate SQL sources and cumulative schema.**
   - Identify standalone `.sql` files (migrations in execution order, views,
     routines, triggers, named queries, backfills), declarative/ORM schemas,
     and embedded SQL or DB call sites in Go, TypeScript, Rust, and Java.
   - List unsupported dialects (SQL Server/T-SQL, Oracle, ClickHouse, BigQuery,
     Snowflake, DuckDB, NoSQL) as excluded.
   - **Early stop:** When the scope contains no SQL, schema, migration, or
     database call site in a supported dialect, start no readers; report the
     excluded or unsupported targets and stop.

## 2. Select lenses and partition

| Lens | Asks | Selected when the area has |
| --- | --- | --- |
| [schema](lenses/schema.md) | Does the schema enforce data integrity, sound types, and clean relational boundaries? | Table/view/routine DDL, declarative or ORM schemas, RLS policies, or type/constraint definitions. |
| [migrations](lenses/migrations.md) | Can every migration run safely against live data and rolling deploys without outage or corruption? | Schema or data migrations, DDL alters, backfills, down migrations, or rolling-deploy schema changes. |
| [queries](lenses/queries.md) | Do queries return right results across NULLs, joins, aggregation, and schema evolution? | SQL queries, views, CTEs, subqueries, ORM query builders, pagination, or bulk `UPDATE`/`DELETE` statements. |
| [transactions](lenses/transactions.md) | Do transactions, locking, and concurrency control prevent races, deadlocks, and long locks? | Transactions, explicit locks, isolation settings, upserts, read-modify-write paths, queues, or session state. |
| [indexing](lenses/indexing.md) | Do indexes match actual predicates, joins, and sort orders without unneeded write or scan blowup? | Index definitions, filtered/joined/sorted queries, foreign-key relations, or `EXPLAIN` plans. |
| [app-boundary](lenses/app-boundary.md) | Do application callers bind parameters, manage connections/pools, batch I/O, and handle DB errors safely? | Embedded SQL, dynamic query builders, ORM/driver calls, pool/cursor/row handling, timeouts, or DB error mappers. |

Select every lens whose signal is present and state which were omitted and why
(never drop a lens just because a change is small).

Assign one lens per reader. For a small change (~300 changed lines or fewer in
one area) or a small self-contained schema module, pair related lenses without
mixing correctness hunting and indexing/performance in one reader: pair
`schema` with `migrations`, pair `queries` with `transactions`, keep `indexing`
solo, and keep `app-boundary` solo (at most four readers). Each paired reader
runs both full passes and reports coverage separately. Partition mixed-dialect
scopes by dialect, and split large scopes along schema/domain boundaries when
one reader cannot read all scoped files plus relevant migration history in full.
Readers overlap on purpose; you merge their outputs.

## 3. Run fresh readers

Start each reader in a fresh context with no conversation history and no peer
results. Supply: target and pinned revision, assigned lens or pair, exact
files, ordered migration and schema snapshot paths (plus the `D..H` diff with
removed lines inline, cumulative schema snapshot, baseline config, and needed
driver excerpts when readers lack Git/shell access), pinned dialect/version
baseline, located `EXPLAIN`/cardinality docs, and paths to
[the contract](contract.md), its assigned lens(es), the matching dialect
context ([PostgreSQL](dialects/postgresql.md), [MySQL](dialects/mysql.md), or
[SQLite](dialects/sqlite.md)), and
[the result format](../assets/finding-template.md). Never supply suspected
issues, prior findings, decisions to respect, or severity.

Run up to eight agents concurrently unless the user overrides the limit,
honoring explicit user model/effort overrides through native configuration. If
a reader leaves files in its scope unread, dispatch one fresh retry for that
lens with only the unread files; anything still unread goes in the report.

## 4. Merge and challenge

Merge candidates with the same root cause across readers, preserving each
traced mechanism. Before launching challengers, run a cross-seam pass across
partition boundaries: check changed queries against migrations/indexes in other
directories, check schema changes against application callers and ORMs for
rolling-deploy (`D -> H`) compatibility, and check transaction boundaries
across service/repository layers. Add any traced candidate you find to the
matching lens's challenge.

Send every traced or quoted candidate to a fresh challenger (one per reader
task; a merged candidate goes to one challenger). Give it the same materials,
lens included, plus [the challenge](challenge.md), and for each candidate only
location, dialect baseline, mechanism, basis, impact, and safer form. Strip the
reader's reasoning, notes, and confidence. Never ask a challenger to finish an
incomplete trace: complete a missing step from source yourself first, or mark
the candidate unproven.

## 5. Decide

You own every decision. Confidence, tone, or agreement between agents is not
evidence.

- **Walk each trace yourself.** Confirm every quoted line against the
  cumulative schema, pinned dialect/version baseline, and locked driver source.
  Any step resting on unread migrations, configs, or driver source is unproven;
  read missing local files yourself without rewriting the claim.
- **Check dialect validity and runtime evidence.** Verify the safer form is
  valid syntax and safe locking behavior on the pinned dialect and version, and
  walk `NULL`, empty, duplicate, rollback, and rolling-deploy `D -> H` cases.
  Route claims waiting only on an unstated engine version, table cardinality,
  maintenance window, or `EXPLAIN` plan to `needs confirmation`.
- **Check findings on the same table, migration, or query together.** Confirm
  proposed indexes do not duplicate each other and combined DDL/query edits
  stay compatible.
- **Weigh the challenge as an argument, not a ruling.** Verify quoted
  counter-evidence on `falls` (when `falls` rests only on unconfirmed server
  version, scale, cardinality, or missing `EXPLAIN` while the static mechanism
  holds, route to `needs confirmation`), reject unbacked `stands`, verify prior
  documented rationale and accepted cost on `disputed`, and name both sides on
  `tradeoff`.

| Outcome | When |
| --- | --- |
| finding | Mechanism confirmed on pinned dialect/version, valid safer form keeps semantics, and challenge stood (or `falls` refuted). |
| tradeoff | Confirmed failure whose safer form carries a real cost or behavior change the team must weigh. |
| disputed | Confirmed impact backed by a prior documented choice whose reason holds and whose cost was accepted. |
| needs confirmation | Static mechanism holds except for an unconfirmed dialect version, table size/cardinality, maintenance window, or `EXPLAIN` plan. |
| unproven | Missing trace step, unread schema/migration/driver source, or no challenge run. |
| rejected | Mechanism false on this dialect/version, prevented upstream, safer form invalid or breaks relied-on behavior, or out of scope. |

Rank surviving findings by impact class:
1. Data loss, silent corruption, or broken security/isolation contract (SQL
   injection, unallowlisted identifier, broken RLS/tenant boundary, unbounded
   write).
2. Production outage or lock queue (blocking DDL, rolling-deploy `D -> H`
   break, deadlock, transaction held across external I/O).
3. Wrong query result or concurrent anomaly (`NULL`/join/aggregation bug, lost
   update, non-deterministic mutation or pagination).
4. Provable scan or round-trip amplification (non-sargable predicate defeating
   an index, missing index on established scale, N+1 or unbounded query).
5. Provable schema-evolution fragility (reported compactly at the end of
   Findings).

Finish deciding, ranking, and checking siblings before drafting the report.

## 6. Check siblings and report

Search the repository for siblings of each surviving finding (same unsafe DDL
lock, missing `WHERE`, `NOT IN` nullable subquery, non-sargable filter,
unparameterized interpolation, or N+1 loop elsewhere). Give in-scope siblings
to one fresh reader with that finding's lens, the finding as pattern, and those
files (the sole task that receives a known finding); each sibling still needs
its own trace, challenge, and decision (`pre-existing` if outside the change).
A sibling in code the user's narrowing left out gets no reader or challenge:
list it in one line with location and repeated finding.

Deliver [the report template](../assets/report-template.md) with every
surviving finding, tradeoff, disputed item, and confirmation question (never
truncate to fit length). A reader returning nothing is unread coverage, not a
clean pass. Zero findings is a valid outcome: state what was read without
claiming the SQL or schema is defect-free.
