# Results

Compact Markdown. Evidence, not a transcript of reasoning. Quote only code,
schema, migration, and config lines you read. No invented timings or row
counts, no database execution, no edits, and no cosmetic SQL style remarks.

## Reader result

- Lens, dialect and pinned version baseline (or `unstated`), migration runner
  tx mode (or `unstated`), and scope.
- Read: SQL files, ordered migrations and cumulative schema sources, ORM or
  declarative schemas, callers, and driver source consulted; `EXPLAIN` plans or
  cardinality docs used. What in scope you could not read.
- Outside the scope: one line for each issue whose safer form changes only code
  or schema outside the user's narrowed scope, with location and mechanism.

Include runtime-dependent candidates with their static mechanism and settling
check so the orchestrator can route them to `needs confirmation`. With no
candidates, say so.

### <number>. <the failure or risk, where>

- Location: path, SQL object or symbol, and lines. For a change review, how the
  change introduces or exposes it, or `pre-existing`.
- Dialect baseline: dialect, pinned version and runner tx mode (or `unstated`),
  and the config or lockfile lines establishing them.
- Mechanism: `traced` (numbered steps through cumulative schema, SQL, callers,
  and driver source, each with path, lines, quoted text, and engine effect;
  where you looked for existing guards, constraints, or indexes), `quoted`
  (two contradicting declarations or rules), or `none` with the missing step.
- Basis: `written`, `schema`, or `engine` (quoted anchor or pinned rule).
- Impact: concrete effect and who observes it (per contract).
- Confirmation (if runtime-dependent): exact settling check (unstated version,
  runner tx mode, live-traffic/maintenance window, table size/cardinality, or
  `EXPLAIN` output); omit when statically proven.
- Safer form: minimal working dialect-, version-, and runner-valid sketch; what
  it keeps (results, `NULL`/collation semantics, `D -> H` safety, errors, tx
  boundaries); any tradeoff or safe/tradeoff split.

## Challenger result

### <number>. `stands` | `falls` | `tradeoff` | `disputed` | no verdict

- Dialect and mechanism: where your own walk through cumulative schema, SQL,
  callers, driver source, and pinned dialect version ended, and the line that
  breaks the claim if one does.
- Trigger and runtime: upstream guards, constraints, session or pooler config;
  never require `EXPLAIN` or table size for statically provable bugs, and name
  the missing check only for genuinely runtime-dependent claims.
- Safer form: validity on the pinned dialect, version, and runner tx mode,
  boundary inputs, rolling-deploy safety, and any cost or behavior change.
- Intent and scope: prior documented rationale accepting the shown cost, or any
  `Not a finding` guard that covers the claim.
- Decides it: the one piece of evidence behind the verdict.
