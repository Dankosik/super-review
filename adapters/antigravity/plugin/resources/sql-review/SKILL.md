---
name: sql-review
description: "Explicit SQL Review of PostgreSQL, MySQL, or SQLite schemas, migrations, queries, transactions, indexes, and database boundaries in PRs or local source by reading, or help using that review."
disable-model-invocation: true
metadata:
  version: "0.2.0"
---

# SQL Review

**Does this SQL and schema hold up on correctness, safe evolution, concurrency,
and indexable execution?** Find places where database schemas, migrations,
queries, transactions, indexes, or application database boundaries can corrupt
data, return wrong results, block live traffic, break rolling deploys, race
under concurrency, amplify scans or round trips, or fail on schema evolution.
A finding traces or quotes the mechanism under the project's pinned dialect and
version baseline, states its basis and concrete impact, gives a minimal safer
form valid for that baseline, and survives an independent challenge.

Supported dialects: PostgreSQL, MySQL (InnoDB primary baseline), and SQLite.
Supported sources: standalone `.sql` files (migrations, views, routines,
triggers, named queries, backfills), declarative and ORM schemas, and embedded
SQL or database call sites in Go, TypeScript, Rust, and Java. Unsupported
dialects (SQL Server/T-SQL, Oracle, ClickHouse, BigQuery, Snowflake, DuckDB,
and NoSQL stores) are excluded and listed, never reviewed by analogy.

Cosmetic SQL style and formatting, broad security or compliance audits, general
code readability, non-database logic bugs, and test quality are out of scope.
Concrete source-provable SQL contract failures whose harm is security stay in
scope: broken parameterization (SQL injection), unallowlisted dynamic SQL
identifiers, broken declared row-level security or tenant isolation,
`SECURITY DEFINER` routines without a pinned `search_path`, and unbounded
`UPDATE` or `DELETE` statements missing a `WHERE` clause.

The review reads. It never connects to a database, runs database CLIs, applies
migrations, executes queries, builds or runs project code, edits files, or
posts comments. User-supplied or committed `EXPLAIN` plans and schema dumps are
evidence.

## Run

For help, explain usage and stop. If no target can be identified from the
request, ask only for that. Otherwise orchestrate through the active adapter,
[Claude Code](references/harnesses/claude.md),
[Codex](references/harnesses/codex.md),
[Antigravity](references/harnesses/antigravity.md), or
[OpenCode](references/harnesses/opencode.md), following
[the workflow](references/workflow.md). When the user explicitly asks to run
agents in another installed harness, such as OpenCode, start them there through
[external agents](references/harnesses/external.md).

Each reader gets one lens, or a safe pair for a small change, and
[the contract](references/contract.md). Each challenger gets one reader's
claims with their proofs and [the challenge](references/challenge.md), never
the reader's reasoning. You decide every candidate yourself and deliver
[the report](assets/report-template.md) in the user's language. If agents
cannot be started, say the review is a limited single-reader pass and do not
claim an independent challenge.
