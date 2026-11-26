# Google Antigravity

The native plugin provides `/super-review`, `/defect-review`, `/test-review`,
`/perf-review`, `/sql-review` and `/clickhouse-review` in the Antigravity App
and CLI. The first four skills cover Go, TypeScript, Rust and Java
(readability, bugs, tests and performance); SQL Review covers PostgreSQL, MySQL
and SQLite; ClickHouse Review covers ClickHouse MergeTree schemas, parts,
mutations, views, projections, Distributed queries, cluster DDL and client
ingestion. Each keeps its own contract and report format.

## Install

From a checkout containing `adapters/antigravity/plugin`, run:

```sh
agy plugin validate --strict ./adapters/antigravity/plugin
agy plugin install ./adapters/antigravity/plugin
agy plugin list --json
```

The checked-in plugin is generated and self-contained; consumers need no Bun or
build step. From `super-review-<version>-antigravity.zip`, extract it and install
the extracted `super-review` directory instead. Older releases do not include
this archive. Start a new conversation after installation. Install this payload,
not the repository root's manifest for other harnesses. No public Antigravity
Marketplace listing is implied. Installation is an explicit user setup action;
a review does not install or rewrite configuration.

```text
/super-review Review my staged and unstaged changes.
/defect-review Проверь этот Rust PR на ошибки.
/test-review Review the tests for this Rust module.
/perf-review Review the hot paths in this Rust module.
/sql-review Review these PostgreSQL migrations and queries.
/clickhouse-review Review these MergeTree tables, MVs and client writers.
```

Antigravity discovers skills automatically as well as through slash commands.
The descriptions and entrypoints require an explicit request for the named
review; generic code-review requests do not select a review family member.
There is no assumed `disable-model-invocation` frontmatter support. Help explains
usage without reading source or launching agents.

## Native execution and boundaries

The current chat orchestrates and keeps its model and effort. Ten custom roles
provide independent specialists/readers and separate defect, performance, SQL
and ClickHouse challengers. Each uses `model: inherit`, `mainAgent: false`,
`subagent: true`, `commandExecutionPolicy: off`, and only `view_file` and
`grep_search` in its tool allowlist. No shell, editor, delegation tool or MCP
server is configured for a child. The parent uses native read-only inspection
for source acquisition and passes exact resource paths and revision contents as
needed. There is no custom runtime, API client or extra model login.

`invoke_subagent` must support the installed custom roles and fresh contexts.
Use the existing workspace, avoiding branch/worktree creation. An idle agent
retains context when messaged; a challenge needs a fresh invocation. Collect full
results, not lifecycle statuses. The shared workflow controls coverage and
concurrency. Built-in `research`/`self`, `/boost` and `/swarm` are different roles
and workflows and do not substitute for these reviewers.

## Select the worker model

The default for all specialists, readers and challengers is **Gemini 4 Hydrogen
with High reasoning**, slug `gemini-4-hydrogen-high`. The current chat's model
and effort remain the user's choice. An explicit user specialist model/effort
overrides the default for the current review and its continuations.

CLI 1.5.9 accepts model tiers in role frontmatter and rejects the Hydrogen slug,
so roles retain `model: inherit`. On that host, select **Gemini 4 Hydrogen High**
in the App model picker before reviewing, or launch a CLI chat with:

```sh
agy models
agy --model gemini-4-hydrogen-high
```

The model must appear in your host's available list. A chat already using
Hydrogen High can delegate through native inheritance. From another parent,
the adapter requires a live native child selector that explicitly supports
Hydrogen High; the current CLI's documented tier-only configuration does not
provide that guarantee. A missing capability stops affected launches for a user
choice. The adapter never switches the parent itself or silently uses Flash,
Pro, an arbitrary inherited model or an Orchestrator (Neon/Carbon/Argon)
composite. A child prompt cannot select a model. An explicit user request may
route specialists to another installed harness (such as read-only local
`codex exec`); follow `references/harnesses/external.md`.

This choice is the Google counterpart to our Sonnet/medium and Terra/high worker
profiles by intended role, without a claim of equal review quality. The research
and native configuration probe are in
[selection evidence](https://github.com/Dankosik/super-review/blob/main/docs/antigravity-model-selection.md).
Report requested selection separately from exposed effective identity; missing
runtime identity is unverified, and a reported mismatch stops further launches.

These instructions target App/CLI custom subagents. Legacy IDE skill discovery
alone does not establish custom-role execution: when independent agents are
unavailable, disclose the limitation as the selected skill requires. Tool
allowlists do not establish that the parent is sandboxed or prove runtime
enforcement in every Antigravity version.

## Maintainer evidence

Edit `adapters/antigravity/*.md`, `adapters/antigravity/agents/*.md` and the six
canonical `references/harnesses/antigravity.md` files; regenerate with
`bun run build`. Build, validation, package tests and native
`agy plugin validate --strict adapters/antigravity/plugin` check delivery and
configuration. Packaging emits `super-review-<version>-antigravity.zip` with its
checksum. Evaluator-only contrasting inputs live in `evals/antigravity`.

Native validation with local CLI 1.5.9 is distinct from a model run. End-to-end
discovery, tool enforcement, delegation, model routing and review quality are
NOT RUN until actual native traces are recorded. No quality or speed improvement
is claimed from package checks.

Official references checked on 2026-11-15:
[plugin manifest, components and validation](https://antigravity.google/docs/build-plugins),
[skills and slash commands](https://antigravity.google/docs/skills), and
[custom roles, tools, model tiers and lifecycle](https://antigravity.google/docs/subagents).
