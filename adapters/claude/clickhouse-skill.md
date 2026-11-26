---
name: clickhouse
description: Review ClickHouse MergeTree schemas, parts, mutations, materialized views, projections, columnar and Distributed queries, cluster DDL and client ingestion in a PR or local tree by reading, with ClickHouse Review.
argument-hint: "<PR URL or local scope> [files, lenses, deployment, EXPLAIN/system.* evidence]"
disable-model-invocation: true
context: fork
agent: super-review:clickhouse-orchestrator
background: false
---

Use ClickHouse Review for this request: $ARGUMENTS

Read `${CLAUDE_PLUGIN_ROOT}/resources/clickhouse-review/SKILL.md`.
Follow its Claude adapter and return the report in this conversation. Accept a
PR, local changes, or explicitly requested whole-project source. For help,
explain usage without starting a review. For an actual review with no
identifiable source, ask only for the missing target; do not reacquire a target
already given.
