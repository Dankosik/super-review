---
name: clickhouse-review
description: "Explicit ClickHouse Review of MergeTree schemas, parts, mutations, materialized views, projections, columnar and Distributed queries, cluster DDL, and client ingestion in PRs or local source by reading, or help using that review."
disable-model-invocation: true
metadata:
  version: "0.2.0"
---

# ClickHouse Review

**Does this ClickHouse schema, query, view, cluster DDL, or ingestion path
respect MergeTree physics, cluster topology, and columnar execution?** Find
places where MergeTree tables, partitions, skipping indexes, mutations, TTLs,
materialized views, projections, analytical or Distributed queries, cluster
DDL, or client writers can lose or corrupt data, trigger part or mutation
storms, exhaust memory on joins or distributed fan-out, return unmerged or
wrong results, break cluster replication, or fail on schema evolution. A
finding traces or quotes the mechanism under the project's pinned ClickHouse
version and deployment baseline, states its basis and concrete impact, gives a
minimal safer form valid for that baseline, and survives an independent
challenge.

Supported deployments: Self-managed ClickHouse (OSS/Altinity with ClickHouse
Keeper or ZooKeeper, v24-25+) and ClickHouse Cloud (`SharedMergeTree` and
`Shared` database). Supported sources: standalone `.sql` files (DDL,
migrations, views, materialized views, projections, named queries, backfills),
ClickHouse server and cluster configs (`config.xml`, `users.xml`,
`remote_servers.xml`, Helm/Kubernetes operator CRDs, Terraform), and embedded
ClickHouse SQL or client ingestion/query code in Go, TypeScript, Rust, Java,
and Python. Non-ClickHouse databases (PostgreSQL, MySQL, SQLite, SQL Server,
Oracle, BigQuery, Snowflake, DuckDB, and NoSQL stores) are excluded and listed,
never reviewed by analogy.

Cosmetic SQL formatting, broad security or compliance audits, general
host-language readability, non-ClickHouse logic bugs, and test quality are out
of scope. Concrete source-provable ClickHouse boundary failures whose harm is
security stay in scope: broken query parameterization (SQL injection),
unallowlisted dynamic identifiers, and unbounded destructive `DELETE`,
`ALTER TABLE ... DELETE`, or `DROP`/`TRUNCATE` statements.

The review reads. It never connects to a ClickHouse cluster, runs ClickHouse
CLIs, executes HTTP queries, applies migrations, builds or runs project code,
edits files, or posts comments. User-supplied or committed `EXPLAIN indexes = 1`,
`EXPLAIN PLAN`, `system.parts`, `system.query_log`, `system.mutations`, and
`SHOW CREATE TABLE` outputs are evidence.

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
