---
name: sql
description: Review PostgreSQL, MySQL or SQLite schemas, migrations, queries, transactions, indexes and database boundaries in a PR or local tree by reading, with SQL Review.
argument-hint: "<PR URL or local scope> [files, lenses, dialect, EXPLAIN plans]"
disable-model-invocation: true
context: fork
agent: super-review:sql-orchestrator
background: false
---

Use SQL Review for this request: $ARGUMENTS

Read `${CLAUDE_PLUGIN_ROOT}/resources/sql-review/SKILL.md`.
Follow its Claude adapter and return the report in this conversation. Accept a
PR, local changes, or explicitly requested whole-project source. For help,
explain usage without starting a review. For an actual review with no
identifiable source, ask only for the missing target; do not reacquire a target
already given.
