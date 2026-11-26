# SQL Review

Write in the user's language. Attach no severity labels and no invented query
timings or row counts. Omit a section that would be empty and say so in the
outcome.

## Outcome

Surviving findings in the workflow's priority order, followed by counts:
findings, tradeoffs, disputed, needs confirmation, unproven, rejected. With
nothing found, say that no SQL or schema failures were shown in the sources
that were read. When no supported SQL, schema, migration, or database call site
was in scope, list the excluded or unsupported targets and state that no
readers were started.

What was reviewed: the PR or local root and revision, pinned dialect(s) and
version baseline(s) (or unstated gaps), SQL sources and cumulative schema
reconstructed, excluded or unsupported dialects, lenses used and omitted,
`EXPLAIN` plans or cardinality docs used, unread files, where siblings were
searched, and files that changed during the review. Nothing was connected to a
database, executed, or migrated; findings rest on reading.

## Findings

### S-001: <the failure or risk, where>

**Dialect baseline.** Dialect, pinned version, and config or lockfile anchor.

**Mechanism.** The confirmed trace or quotation: numbered steps through
cumulative schema, SQL, callers, and driver source with file, lines, and quoted
text. For a change review, the link to the change, or `pre-existing`.

**Basis and impact.** The basis (`written`, `schema`, or `engine`) and the
concrete effect and affected party.

**Safer form.** The minimal dialect-, version-, and runner-valid sketch, what it
keeps, and when multiple findings touch the same table, migration, or query, one
coherent ordered migration sequence confirming they apply cleanly together.

**Challenge.** What the challenger tested and why the claim stood.

### Schema-evolution fragility

Findings for provable schema-evolution fragility (per the `queries` lens),
compactly at the end of Findings, one row each: location, quoted line, concrete
column-evolution breakage, safer form, and that the challenge stood.

## Tradeoffs

### T-001: <the improvement and what it costs>

As for a finding, then the cost or behavior change the team must weigh (index
write overhead, multi-step deploy, isolation retry cost, API pagination change)
and who would notice. Report both sides without prescribing the team's choice.

## Disputed

### D-001: <the traced impact beside the documented decision>

The confirmed mechanism and impact beside the prior quoted decision, its stated
reason, and its accepted cost. Report both sides without prescribing the choice.

## Needs your confirmation

Candidates whose static mechanism held except for an unconfirmed dialect
version, migration runner tx mode, live-traffic or maintenance window, live
table size or cardinality, or runtime query plan. One line each: the location,
the mechanism, and the exact check that settles it (server version, runner
config, table cardinality, or `EXPLAIN (ANALYZE, BUFFERS)` / `EXPLAIN QUERY
PLAN` output).

## Outside the scope

Issues and siblings whose safer form touches only code or schema left out by
the user's narrowing, one line each: location, mechanism, and repeated finding.
Not traced further or challenged.

## Unproven and rejected

One line each: the claim, and the missing step, unread schema/driver source, or
counter-evidence. These carry no advice.

## Before applying

For whoever applies these findings:

- Verify DDL and migration changes on a staging copy with representative data
  and concurrency, with an explicit lock timeout and rollback or forward-fix
  plan, and confirm rolling-deploy (`D -> H`) compatibility across old and new
  application versions.
- For indexing and query-plan changes, capture `EXPLAIN` output (`EXPLAIN
  (ANALYZE, BUFFERS)` on PostgreSQL, `EXPLAIN ANALYZE` or `EXPLAIN FORMAT=TREE`
  on MySQL, `EXPLAIN QUERY PLAN` on SQLite) on representative data volumes
  before and after, and keep an index only when the plan and write overhead
  justify it.
- Keep existing tests passing and add targeted regression tests covering NULL
  boundaries, concurrent writes or retries, and constraint enforcement.
