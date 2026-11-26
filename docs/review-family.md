# The review family

This repository holds six reviews. Each asks one question, and each is a
skill, not a runtime. All six read the code and run nothing.

| Review | Question | Object |
| --- | --- | --- |
| Super Review | Is the code easy to read and change? | How the code is expressed |
| Defect Review | Where does the code do the wrong thing? | Bugs in production code |
| Test Review | Would the tests notice a plausible mistake? | Promised behavior no test pins |
| Performance Review | Where does the code do work it does not need, on a path that runs often? | Unneeded work on hot paths |
| SQL Review | Does this SQL and schema hold up on correctness, safe evolution, concurrency, and indexable execution? | OLTP SQL schemas, migrations, queries, transactions, indexes, and DB boundaries |
| ClickHouse Review | Does this ClickHouse schema, query, view, cluster DDL, or ingestion path respect MergeTree physics, cluster topology, and columnar execution? | ClickHouse MergeTree schemas, parts, mutations, MVs/projections, columnar/Distributed queries, cluster DDL, and client ingestion |

## Why separate reviews

Each question needs a different kind of judgment, and mixing them in one
reader degrades all of them. That was observed before this family existed:
when bug reports entered Super Review's results, its readability advice got
worse. The separation that matters is at the level of one reader's task. One
reader gets one question.

Speed is its own question for the same reason. Slow code is not a bug, and
fast code that reads badly is not a performance finding. A reader hunting
bugs who also weighs cost starts calling slow code wrong; a reader tuning a
loop starts trading clarity for work that never mattered.

The standard of evidence differs too. A readability recommendation is
accepted on net benefit. A bug, a test gap or a performance finding is
accepted on a proof that someone else can check line by line.

## How the newer reviews work

```
identify source -> independent readers -> proof by trace
                -> independent challenge -> orchestrator checks -> report
```

- **Identify the source.** The review reads the working tree, or the commits
  of a PR through Git and GitHub. It does not clone, copy or check out
  anything. A branch the user names is pinned to one commit. Every agent
  reads what it reviews in full; how it reads is its own choice.
- **Independent readers.** Each reader gets one lens and reads the code
  itself. Readers overlap on purpose. An earlier design considered building
  one shared ledger of promises and checking each entry; it was rejected
  because whatever the ledger's author missed would be invisible to every
  check. Bugs live disproportionately in what nobody wrote down. Duplicates
  are merged at collection; that cost is accepted.
- **Proof by trace.** A claim is a path through the source that anyone can
  follow: for a bug, the trigger, each step as a quoted line, and what the
  affected party observes. For a test gap, a described mistake (a mutant,
  never applied), why each test that reaches that code still passes, and the
  check that would tell the mistake from the original. For a performance
  finding, why the path runs often, the work it does per unit as quoted
  lines with what multiplies it, and a cheaper form that keeps behavior.
- **Independent challenge.** In Defect Review, Performance Review, SQL Review
  and ClickHouse Review a second agent, which has not seen the reader's
  reasoning, follows the claim through the source itself and tries to show it
  is wrong. None of these reviews runs code or connects to a database, so this
  is what holds false positives down: bugs that are not bugs, savings on cold
  code, SQL advice that fails on the project's dialect baseline, and ClickHouse
  folklore that contradicts the pinned version, deployment topology, or
  `EXPLAIN indexes = 1` / `system.parts` / `system.query_log` evidence.
- **The orchestrator checks.** It opens every quoted line, walks each trace,
  and treats the challenger's verdict as an argument to verify.

## How Performance Review shows a cost

A performance finding has four parts. The **hot path**: where the code is
reached from and why it runs often, measured against the program's unit of
work (a request, a message, one run of a command-line tool), on the evidence
of the source, a document or benchmark in the repository, a profile or the
user's words. The **cost trace**: the work done
for one unit as quoted lines, into callees and dependencies at their locked
versions, and what multiplies it, written as a count ("one `String`
allocation per row × rows in the request"), never as invented milliseconds.
The **cheaper form**: a sketch and what it keeps, results, order, errors,
drop/cleanup timing, concurrency and `Send`/`Sync` bounds, the public API, and
that it builds for the project's language, runtime and dependency baseline
(`Cargo.toml`, `go.mod`, `tsconfig.json`/`package.json`, or `pom.xml`/Gradle). The **resource**: what is
saved, as counts per unit before and after (`3 → 1 allocations per
request`), or, when the same operations get cheaper, the count with what one
operation costs on each side and the basis for it, set beside the path's
dominant cost for that resource.

Lenses divide unneeded work by where it lives: complexity, allocation,
async, I/O, contention and repeated work. A cheaper form that changes
something the team must weigh is a tradeoff, shown with both sides,
including a batch or overlap that buys throughput with latency or changes
what has happened when something fails. When removing a whole cost is a
tradeoff, the part a behavior-keeping form removes is a finding of its own.
For a whole project the review
starts from where work enters the program and reports the entries it used;
when none of them runs per unit of work, it says where that work runs and
starts no readers. Findings on one path are checked applied together. A
cost in code the user's narrowing left out is named in one line and not
traced, so reviews of neighboring packages do not trace and change the same
code. A candidate that waits only on whether its path is hot becomes a
question to the user. Because reading shows work removed, not time saved,
the report ends with what to do before applying anything: check the
predicted counts first, then measure time where the saving is time, in the
way the saved resource demands, and keep a change only if the gain shows.

## How SQL Review proves a database failure

SQL Review checks PostgreSQL, MySQL (InnoDB primary baseline), and SQLite
across standalone `.sql` files, declarative/ORM schemas, and embedded SQL or DB
call sites in Go, TypeScript, Rust, and Java. A finding requires four checkable
parts plus survival of an independent four-line challenge: a traced or quoted
**mechanism** grounded in the reconstructed cumulative schema and pinned
dialect/version baseline; a **basis** (`written`, `schema`, or `engine`); a
concrete **impact**; and a minimal **safer form** valid on that baseline.

Unlike Defect Review, which forbids designing fixes, SQL Review requires a
safer form as part of the proof. In SQL and DDL, dialect and version rules
decide whether an issue is actually preventable without a tradeoff: MySQL lacks
`IS DISTINCT FROM` and transactional DDL, PostgreSQL 18 adds lock-safe
`NOT NULL NOT VALID` and B-tree skip scans while earlier versions require a
`NOT VALID` `CHECK` constraint, `ADD FOREIGN KEY ... NOT VALID` still takes
`SHARE ROW EXCLUSIVE` on both parent and child tables, and SQLite ignores
`PRAGMA foreign_keys = ON` inside a transaction. Checking a minimal safer form
against the pinned baseline separates real findings from dialect-invalid advice
and genuine engineering tradeoffs (write amplification, multi-step
expand-and-contract deploys, isolation retries).

Boundary with sibling skills:

- **Super Review (`skills/super-review/references/rust/sqlx.md`):** owns
  application-code readability and maintainability at persistence boundaries
  (such as `sqlx` `FromRow` derives, `Executor` vs `&mut Conn`, and error
  translation), never schema integrity, DDL lock safety, or query plans.
- **Defect Review (`skills/defect-review/references/languages/go.md`):** owns
  general host-language runtime bugs (including Go iterator patterns such as
  `sql.Rows.Err()` alongside `bufio.Scanner.Err()`), never cumulative SQL
  schema reconstruction or dialect engine semantics.
- **Performance Review (`skills/perf-review/references/lenses/io.md`,
  `skills/perf-review/references/languages/java.md`):** owns hot-path host I/O
  counts (N+1 round trips, JDBC batching, ORM over-hydration, locks held across
  network calls), while explicitly leaving database query plans and schema or
  index design to supplied `EXPLAIN` output or SQL Review.
- **SQL Review (`skills/sql-review/`):** owns OLTP database correctness,
  migration and rolling-deploy safety, SQL query semantics and provable
  schema-evolution fragility, DB transactions and locking, index alignment, and
  SQL-specific boundary safety (parameterization, identifier allowlists,
  pooler/session state, DB error handling) for PostgreSQL, MySQL, and SQLite
  without touching cosmetic SQL formatting or general application readability.
- **ClickHouse Review (`skills/clickhouse-review/`):** owns ClickHouse
  MergeTree storage physics (`ORDER BY`/`PRIMARY KEY`, `PARTITION BY`, parts,
  skipping indexes), mutations and TTL lifecycle, incremental/refreshable
  materialized views and projections, columnar and `Distributed` query
  semantics (`FINAL`/`argMax`, `join_use_nulls`, right-side `JOIN` RAM,
  `GLOBAL IN`/`JOIN`), cluster DDL (`DatabaseReplicated` vs `ON CLUSTER`,
  `SharedMergeTree`), and client ingestion boundaries (`async_insert`, wire
  formats, `{name:Type}` parameters) without importing OLTP B-tree, foreign
  key, or row-lock assumptions.

## How ClickHouse Review proves a MergeTree or cluster failure

ClickHouse Review stays strictly separate from OLTP SQL Review because
ClickHouse physics invert many OLTP defaults: tables store immutable sorted
parts rather than mutable heap pages, primary keys are sparse granule indexes
instead of uniqueness-enforcing B-trees, `ALTER TABLE ... UPDATE`/`DELETE`
rewrites whole parts asynchronously instead of taking row locks, incremental
materialized views trigger only per inserted block rather than maintaining full
relational views, `LEFT JOIN` fills unmatched columns with type defaults unless
`join_use_nulls = 1`, and self-managed `ON CLUSTER` / `ReplicatedMergeTree`
rules invert under `DatabaseReplicated` and ClickHouse Cloud `SharedMergeTree`.

A finding requires the same four checkable parts plus survival of an
independent four-line challenge: a traced or quoted **mechanism** grounded in
the cumulative schema, cluster configs, client source, and pinned ClickHouse
version and deployment (`self-managed` vs `cloud`); a **basis** (`written`,
`schema`, or `engine`); a concrete **impact**; and a minimal **safer form**
valid for that ClickHouse version and deployment. User-supplied or committed
`EXPLAIN indexes = 1`, `EXPLAIN PLAN`, `system.parts`, and `system.query_log`
outputs serve as passive evidence without connecting to a cluster; claims
waiting on unconfirmed version, deployment, volume, cardinality, ingest rate,
or pruning route to `Needs your confirmation`.

## Why nothing is run

Earlier versions of Defect Review and Test Review built the project in a
disposable copy and proved each finding by a failing test or a surviving
mutant. That was dropped. The machinery was most of the instructions and
most of the cost: pinning and copying source, a baseline run, a private
build directory per agent, a rerun protocol, write permissions for every
role, rules about forks and credentials. The first run spent about 2.5
million subagent tokens and hit a shared build directory that made one agent
run another's tests. Meanwhile the defects that motivated these reviews had
been found by reading.

What this gives up: a trace can be wrong in a way only a run would expose,
most often a misread dependency or runtime behavior. Each contract answers
that by requiring every step to quote code that was read, including the
dependency at its locked version, and by making an unread step an unproven
candidate. A finding's reader can confirm it by opening the lines.

Performance Review gives up the most, since a benchmark is the usual proof
of speed. It counts the work the code's semantics require instead, and it
does not argue about what the optimizer does: such a claim, from either
side, needs a profile, a benchmark or a documented guarantee. A profile or
benchmark output the user supplies is evidence, because using it runs
nothing. The one measurement the finding needs is left to whoever applies
it.

## What is shared and what is not

No skill depends on another at run time. A user can install one alone.
Everything that carries a review's judgment stays in that review: its
contract, lenses or questions, challenge, templates and roles.
The six share only the plugin they ship in.

## Decisions

| Decision | Chosen | Instead of | Reason |
| --- | --- | --- | --- |
| How a finding is proven | A trace through quoted lines, by reading | Building the project and running a test or a mutant | The run machinery cost more than it found; reading found the defects that started this work |
| Reading what is reviewed | In full, at the pinned revision; a part the agent did not see is not read until it finishes it; how to read is the agent's choice | A prescribed read command; a snapshot copied outside the tree | In real runs about half the whole-file reads were cut by the shell tool, and readers reported the rest as unread instead of reading it. The instruction states the goal; the agent knows its tools |
| Unit of work for readers | One lens over the whole scope, independent readers | A ledger of promises checked entry by entry | Recall on what nobody wrote down matters more than exact coverage counts |
| Small changes in Defect Review | Related lenses paired, four readers | Eight readers and up to eight challengers for fifty changed lines | Cost should follow the size of the change; whether pairing costs attention is unverified |
| Waiting in real time in tests | A finding when a rule forbids it, when the bound is as tight as the work, or when the test can pass with nothing done | Reporting every sleep or timed poll; or none without a team rule | A generous bound around observable state fails no one; a tight one, or a sleep that proves nothing, does |
| What makes a bug | A traced effect, a stated expectation with its basis, and survival of a challenge | A quoted written promise as a precondition | A documented bug is still a bug; requiring a quotation turned real defects into "documented behavior" |
| Holding false positives down | Checkable traces plus an independent challenger | The written-promise gate; or "obvious failures only" | The gate hides bugs; obvious-only misses wrong classification and failure isolation |
| Documented behavior that harms | Reported as `disputed` with both sides when the document gives a reason that holds | Dropped as intended; or reported as a plain bug | The team made a tradeoff and should see its cost, not be told it is a defect |
| Test Review's mutants | Must break a written promise | Any change a bug hunter would call a bug | The check that would catch the mistake needs an oracle nobody disputes; unwritten bugs are Defect Review's subject |
| Challenger in Test Review | None; the orchestrator searches for a test the specialist missed | A second agent per question | The one way a test-gap claim fails is an overlooked test, and that is a search, not a debate |
| Size of the instructions | One contract per review, a workflow for the orchestrator, lenses or questions | Separate files for proof, verification, expectations and coverage bookkeeping | A capable reader needs the bar and where bugs live, not a procedure for recording its own work |
| What makes a performance finding | A hot path with its basis, a cost trace, a cheaper form with the same behavior, the resource saved | Patterns known to be slow, reported wherever they appear | A clone that runs once costs nothing; advice without a hot path is churn |
| What makes a path hot | Running per unit of the program's work: a request, a message, one run of a command-line tool with its startup; an error path when real input takes it routinely | A fixed list of cold places: startup, connections, error paths | A tool that scripts call thousands of times spends its life starting up; a parse that fails on half the tokens is the main path |
| Whole-project scope in Performance Review | Start from where work enters the program and review what the entries reach; report the entries and what was not reached | Every reader reading every file and finding entries again | Hotness starts at an entry; the list in the report shows a missed entry, unlike a ledger nobody sees |
| A scope with no per-unit work | No readers; the report lists the entries, how often each runs and where per-unit work runs | Readers on startup, wiring and shutdown | Such code is not hot for per-unit work; a real run started twelve readers there and found nothing |
| A hot path nobody has established | A question to the user, in its own report section | Buried among unproven candidates | One sentence or a profile from the user settles it |
| How a cost is shown | Work per unit times its multiplier, read from the source and from dependencies at their locked versions | Running benchmarks or profilers; estimated milliseconds | A count can be checked by opening the lines; an invented timing cannot be checked at all |
| Profiles and benchmark output | Evidence when the user supplies them or the repository commits them | Ignored because the review runs nothing | They are the best evidence that a path is hot, and using them runs nothing |
| Claims about code generation | Count work the semantics require; an optimizer claim either way needs a profile, a benchmark or a documented guarantee | Readers and challengers arguing about what the compiler does | Neither side reads the compiler's output, so such a claim decides nothing alone |
| A cheaper form that changes something | A `tradeoff` with both sides: public API, `unsafe`, a new dependency, staleness, notably harder reading | Dropped; or recommended as a plain speedup | The saving is real and its cost is the team's to weigh, as with disputed bugs |
| Throughput against latency | A batch, buffer, overlap or parallel split that buys one with the other, or starts work an earlier failure would have stopped, is a tradeoff | Batching, concurrency and parallelism as plain gains | They change what a caller waits for and what has happened when something fails |
| Where a cheaper form must build | Within the project's language, runtime, dependency and feature baseline (`Cargo.toml`, `go.mod`, `tsconfig.json`/`package.json`, `pom.xml`/Gradle) | Any current compiler or runtime | Advice that does not build for the project saves nothing |
| Neighboring costs | Memory footprint, build profiles, the global allocator and compile time are out of scope; a database's plan and cache behavior need a plan or a profile | Left to each reader | Each run would otherwise draw the line differently |
| Constant work per request | Reported compactly, one row each with its quoted line | A full section per finding | They are the most numerous and each saves the least; the reader should reach the larger findings first |
| A saving beside a larger cost | Reported with the dominant cost for the same resource; rejected only when that cost bounds the resource whatever the saving does | Rejected whenever something else on the path is slower or the saving is small | A network wait dominates a request's latency, not the CPU spent per request; CPU and allocations add up across requests, and real runs dropped a hash that took two thirds of a cache hit as too small beside the call |
| Hashing on a hot path | A faster hasher where only the program decides which keys enter the table: keys it assigns, a table filled at startup, entries added after their key is verified; the default where outside input decides | The default wherever the looked-up key comes from a request | Flooding needs colliding keys in the table; real runs passed over SipHash of a whole service token on every call into a table that admits only verified tokens |
| An operation made cheaper at the same count | The count, what one operation does on each side, and the basis for its cost: both implementations' source or a benchmark one publishes; whoever applies it times that operation first | Counts alone | A faster hasher keeps every count, so counts alone would call its saving a missing step |
| Storage initialized beyond what is read | Counted as work: a table or buffer filled to its capacity per unit and read to a length | Only allocations and copies counted | A span with two fields initialized 192 table entries; filling only the used ones made creating it 405 → 335 ns in the template's measurement |
| A cost whose full removal is a tradeoff | The part a behavior-keeping form removes is a finding of its own, beside the tradeoff for the rest | One tradeoff for the whole cost | A reader folded filling only the used entries into a per-thread buffer that holds memory on every thread, and the free part was reported only as a tradeoff |
| Order of performance findings | By work removed per unit: complexity class, then I/O or a wait per element, then allocation per element, then constant work | Severity labels or estimated speedups | The order follows from the trace; a percentage would be invented |
| Challenger in Performance Review | An independent challenger on four lines: not hot, no cost, changed behavior, dominated | None, as in Test Review | A performance claim fails in several independent ways, and each takes reading, not one search |
| Who measures a performance finding | Whoever applies it: first the counts per unit the finding predicts, then time where the saving is time, on an otherwise idle machine; keeping it only if the gain shows | The review, by benchmarks; or one microbenchmark for every kind of finding | Reading proves work removed, not time saved; a count does not depend on machine load, timings on a busy machine varied twofold between runs, and a single-threaded benchmark shows nothing about contention or round trips |
| Findings on one path | Checked applied together | Each checked alone | Two real findings each kept behavior, and together let a stopped request start work |
| Costs outside a narrowed scope | One line with the location, not traced or challenged | A reader and a challenger for each, as for siblings in scope | Parallel reviews of neighboring packages traced the same code and then changed it in conflicting branches |
| Small changes in Performance Review | Lenses paired, three readers: complexity with allocation, async with contention, I/O with repeated work | Six readers for a small change | As in Defect Review; whether pairing costs attention is unverified |
| Small changes in Super Review | One lens per specialist by default; related pairs (six at most) only when the user asks for a compact review of a small change | Pairing by default, as in Defect and Performance Review | Super Review rests on one reader per question; pairing becomes the default only after a comparison shows no lens loses annotated improvements |
| Large scopes in Super Review | Split a lens by area when its files are more than one specialist can read in full; announce the task count, and ask before a whole-project review starts more than forty | Coherent areas left to judgment, no bound on task count | A specialist that skims loses lines; a whole project could otherwise start an unbounded number of tasks |
| Safer form in SQL Review | Required as the fourth part of every finding, verified against the pinned dialect, version, and rolling-deploy baseline | Forbidding fixes, as in Defect Review | Dialect and version rules determine whether an alternative exists without breaking semantics or creating a tradeoff; an invalid SQL sketch exposes a flawed claim |
| Small changes in SQL Review | Pair `schema` + `migrations` and `queries` + `transactions`, keeping `indexing` solo and `app-boundary` solo (four readers at most) | Mixing bug/correctness and indexing/performance in one reader | Keeps correctness judgment separate from performance/index judgment in each reader window |
| Runtime-dependent SQL claims | Route claims lacking server version, table size, cardinality, or `EXPLAIN` proof to `needs confirmation` | Static findings about skip scans, HOT updates, or index selectivity from folklore | Modern engines (PG 18, MySQL 8.0.13+, analyzed SQLite) decorrelate semi-joins and run skip scans; static guesses create false positives |
| Security seam in SQL Review | Exclude broad security/compliance audits; keep source-provable SQL contract failures (SQLi, unallowlisted dynamic identifiers, broken declared RLS/tenant isolation, `SECURITY DEFINER` missing pinned `search_path`, unbounded `UPDATE`/`DELETE`) | Blanket security exclusion; or full security audit | These failures are directly provable from SQL and schema source without guessing threat models or auth architecture |
| ClickHouse as its own review skill | Separate `clickhouse-review` skill built around MergeTree, parts, mutations, MVs/projections, Distributed queries, cluster DDL, and client ingestion | Adding ClickHouse as a fourth dialect inside OLTP `sql-review` | ClickHouse physics invert OLTP defaults (no B-tree unique constraints or row-lock transactions; sparse granule keys, immutable parts, per-block MV triggers, `join_use_nulls = 0`, `SharedMergeTree`); sharing lenses dilutes both reviews |
| Small changes in ClickHouse Review | Pair `storage-keys` + `mutations-lifecycle` and `views-projections` + `cluster-ddl`, keeping `queries-distributed` solo and `ingestion-client` solo (four readers at most) | Mixing query correctness, client ingestion, and storage/DDL in one reader | Keeps analytical query semantics and ingestion/client boundaries isolated in their own reader windows |
| Data-dependent ClickHouse claims | Route claims lacking server version, deployment mode, volume, cardinality, ingest QPS, or `EXPLAIN indexes = 1` / `system.parts` / `system.query_log` evidence to `needs confirmation` | Static folklore against `FINAL`, `LowCardinality`, monotonic primary-key functions, or 24.12+/25.8+ join auto-swap | Modern ClickHouse (24-25+ parallel `FINAL`, 24.12+/25.8+ `query_plan_join_swap_table`, monotonic range pruning, 25.8+ lightweight update patch parts) makes static guesses high-false-positive |

## What a model run is for

Fixture tests in this repository check packaging and instruction integrity.
They cannot show that a review finds bugs or waste. A review of a real
repository can. It is a check the maintainer chooses to spend on after a
design change, not a step in writing instructions.
