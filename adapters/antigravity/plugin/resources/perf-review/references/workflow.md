# Workflow

For the orchestrator. Readers and challengers work from
[the contract](contract.md).

## 1. Pin source and gather context

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
2. **Locate load evidence, manifests, and local source roots once.**
   - Load evidence: repo benchmarks, load/latency/throughput docs, and any
     user-supplied profile, flamegraph, or benchmark output.
   - Manifests: build and dependency baseline manifests (crate and workspace
     `Cargo.toml` and `Cargo.lock`, `go.mod`/`go.sum`,
     `package.json`/`tsconfig.json` and lockfile, or `pom.xml`/Gradle manifests)
     plus any on-disk dependency or standard library source root already present
     (`vendor/`, `~/.cargo/registry/src`, installed Rust `rust-src` /
     `rust-docs`, `node_modules/`, `GOMODCACHE`/`GOROOT`).
   - Hand both lists to every reader and challenger as context only, never as a
     list of hot paths or suspected waste. Read-only semantic navigation (LSP,
     `ast-grep`, symbol indexes) may locate callers and dispatch targets; read
     every trace step in full source before citing it.
3. **For whole-project source, also locate where work enters the program.**
   - Find handlers, route/page renders, interactive UI event or animation-frame
     paths, stream/message consumers, CLI dispatch loops, scheduled jobs,
     library public entries, benchmark targets, and supplied profile frames.
   - Readers get the packages and modules those entries reach; list entries and
     unreached code in the report. (For PR or local changes, scope stays the
     change.)
   - **Early stop:** When no entry in the scope runs per unit of work (startup,
     wiring, and shutdown only), start no readers; report the entries, how
     often each runs, and where per-unit work runs instead. Code registered to
     run per unit (handlers, jobs) counts as per-unit work.

## 2. Select lenses and partition

| Lens | Asks | Selected when the area has |
| --- | --- | --- |
| [complexity](lenses/complexity.md) | Does the work grow with the input faster than the result needs? | Loops, searches, sorts, collections, per-row renders, growing-stream parses or parallel iterators over caller-sized input. |
| [allocation](lenses/allocation.md) | Does each unit allocate, copy or initialize more than it keeps or reads? | Owned values, clones, per-frame scratch storage, copied buffers, fresh subscriber values or fixed-capacity storage built per unit. |
| [async](lenses/async.md) | Does async code keep the executor free and run independent waits together? | `async` code, route loaders/Server Components, fetch chains, frame/timer loops, spawned tasks, async locks. |
| [io](lenses/io.md) | Does each unit cost more round trips, system calls or connections than it needs? | Database, network, file, IPC, browser storage, server-to-client serialization or DOM layout/style calls. |
| [contention](lenses/contention.md) | Do concurrent callers wait on each other more than the shared state requires? | Locks, atomics, channels, cross-tab locks or pools shared across requests, tabs, workers or threads. |
| [repeated-work](lenses/repeated-work.md) | Is work that gives the same answer every time done again on each pass? | Compilation, parsing, config/env reads, barrel init, coarse UI subscriptions, per-row setup or invariant derivations on a hot path. |

Select every lens whose signal is present and state which were omitted and why
(never drop a lens just because a change is small).

Assign one lens per reader. For a small change (~300 changed lines or fewer in
one package) or a whole package of ~1,000 lines, pair related lenses instead:
complexity with allocation,
async with contention, io with repeated-work. Each paired reader runs both full
passes and reports coverage separately. Partition mixed-language scopes by
language, and split large scopes along vertical call spines
(`entry -> domain -> store`) when one reader cannot read all files in full.
Readers overlap on purpose; you merge their outputs.

## 3. Run fresh readers

Start each reader in a fresh context with no conversation history and no peer
results. Supply: target and pinned revision, assigned lens or pair, exact files
(plus the diff with removed lines inline when readers lack Git/shell access),
located load evidence, manifests and on-disk source roots, entries (for whole
projects), and paths to [the contract](contract.md), its lens, the matching
language context ([Go](languages/go.md), [TypeScript](languages/typescript.md),
[Rust](languages/rust.md) or [Java](languages/java.md)), and
[the result format](../assets/finding-template.md). Never supply suspected
waste, prior findings, decisions to respect, or severity.

Run up to eight agents concurrently unless the user overrides the limit,
honoring explicit user model/effort overrides through native configuration. If
a reader leaves files in its scope unread, dispatch one fresh retry for that
lens with only the unread files; anything still unread goes in the report.

## 4. Merge and challenge

Merge candidates with the same root cause across readers, preserving each
cost's trace. Before launching challengers, run a cross-seam pass across shard
boundaries for cross-module repackaging, N+1 calls behind interfaces, and
caches/batches/indexes removed in a change whose callers lived in another
partition; add any traced candidate you find to the matching lens's challenge.

Send every traced candidate to a fresh challenger (one per reader task; a
merged candidate goes to one challenger). Give it the same
materials, lens included, plus [the challenge](challenge.md), and for each
candidate only location, hot path, cost trace, cheaper form, and resource.
Strip the reader's reasoning, notes, and confidence. Never ask a challenger to
finish an incomplete trace: complete a missing step from source yourself first,
or mark the candidate unproven.

## 5. Decide

You own every decision. Confidence, tone, or agreement between agents is not
evidence.

- **Walk each trace yourself.** Confirm every quoted line, each step's work per
  unit, that the multiplier reaches this code, and that counts or per-operation
  costs follow from the trace. Any step resting on unread source or docs
  (including stdlib/runtime) is unproven; read missing local source yourself,
  without rewriting the trace into a different claim.
- **Check the hot path.** Require a source, document, measurement, or user
  basis; looking central is not a basis.
- **Check the cheaper form.** Walk empty, single, duplicate, halfway-failure,
  dropped-future, and cancelled-context inputs. Confirm it builds within the
  project's language, runtime, feature, and target baseline, and name every
  change. If you see a strictly cheaper behavior-keeping form, check it the
  same way (yourself or via challenger).
- **Check findings on one path together.** Walk combined forms on the same
  function or path; resolve conflicts or give a combined behavior-keeping form.
- **Weigh the challenge as an argument, not a ruling.** Verify quoted
  counter-evidence on `falls`, reject optimizer speculation without a profile,
  benchmark, or documented guarantee, reject an unbacked `stands`, and require
  named changes and affected parties on `tradeoff`.
- **Settle disagreements.** Settle facts from source; when facts agree and
  acceptability of a behavior change is contested, classify as `tradeoff`.

| Outcome | When |
| --- | --- |
| finding | Hot path shown, cost trace confirmed, cheaper form keeps behavior, saving is not hidden, and challenge stood (or `falls` refuted). |
| tradeoff | As a finding, but the cheaper form changes something the team must weigh. |
| unproven | Missing trace step, missing hot-path basis, or no challenge run. |
| rejected | Not hot, work not done, cheaper form breaks relied-on behavior, saving hidden by dominant cost, or out of scope. |

Rank surviving findings by work removed per unit: a change of complexity class
first, then a round trip, system call or blocking wait per element, then an
allocation or copy per element, then constant work per request (larger
multiplier first within a class; constant work reported compactly). Candidates
unproven solely for want of hotness evidence become questions to the user.
Finish deciding, ranking, and checking siblings before drafting the report.

## 6. Check siblings and report

Search the repository for siblings of each surviving finding (same compilation,
query-per-item, copy, or read/write cache pattern elsewhere). Give in-scope
siblings to one fresh reader with that finding's lens, the finding as pattern,
and those files (the sole task that receives a known finding); each sibling
still needs its own hot path, trace, challenge, and decision (pre-existing if
outside the change). A sibling in code the user's narrowing left out gets no
reader or challenge: list it in one line with location and repeated finding.

Deliver [the report template](../assets/report-template.md) with every
surviving finding and tradeoff (never truncate to fit length). A reader
returning nothing is unread coverage, not a clean pass. Zero findings is a
valid outcome: state what was read without claiming the code is fast.
