# Results

Compact Markdown. Evidence, not a transcript of reasoning. Quote only code,
schema, migration, and config lines you read. No invented timings or row
counts, no database execution, no edits, and no cosmetic SQL style remarks.

## Reader result

- Lens, dialect and pinned version baseline (or `unstated`), and scope.
- Read: SQL files, ordered migrations and cumulative schema sources, ORM or
  declarative schemas, callers, and driver source consulted; `EXPLAIN` plans or
  cardinality docs used. What in scope you could not read.
- Outside the scope: one line for each issue whose safer form changes only code
  or schema outside the user's narrowed scope, with location and mechanism.

With no candidates, say so.

### <number>. <the failure or risk, where>

- Location: path, SQL object or symbol, and lines. For a change review, how the
  change introduces or exposes it, or `pre-existing`.
- Dialect baseline: dialect, pinned version (or `unstated`), and the config or
  lockfile lines establishing it.
- Mechanism: `traced` (numbered steps through cumulative schema, SQL, callers,
  and driver source, each with path, lines, quoted text, and engine effect;
  where you looked for existing guards, constraints, or indexes), `quoted`
  (two contradicting declarations or rules), or `none` with the missing step.
- Basis: `written` (quoted repo rule/doc with path and lines), `schema`
  (declared constraint, type, RLS policy, ORM model, or `D -> H` contract), or
  `engine` (documented rule of the pinned dialect and version).
- Impact: concrete data corruption, wrong result, lock or downtime outage,
  concurrency anomaly, scan or round-trip amplification, broken isolation or
  parameter boundary, or schema-evolution fragility, and who observes it.
- Safer form: minimal dialect-valid and version-valid SQL, migration, or
  boundary sketch; what it keeps (results, `NULL` and collation semantics,
  rolling-deploy `D -> H` safety, errors, transaction boundaries); and any
  tradeoff or behavior change.

## Challenger result

### <number>. `stands` | `falls` | `tradeoff` | `disputed` | no verdict

- Dialect and mechanism: where your own walk through cumulative schema, SQL,
  callers, driver source, and pinned dialect version ended, and the line that
  breaks the claim if one does.
- Trigger and runtime: upstream guards, constraints, session or pooler config,
  or whether the claim rests on unconfirmed table size, cardinality, or planner
  behavior lacking `EXPLAIN` evidence.
- Safer form: validity on the pinned dialect and version, boundary inputs,
  rolling-deploy safety, and any cost or behavior change.
- Intent and scope: prior documented rationale accepting the shown cost, or any
  `Not a finding` guard that covers the claim.
- Decides it: the one piece of evidence behind the verdict.
