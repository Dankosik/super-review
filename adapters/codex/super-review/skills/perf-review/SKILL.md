---
name: perf-review
description: "Use for an explicitly requested Performance Review: independent readers find work that Rust source of a PR or local tree does not need on a path that runs often, each cost traced through quoted lines to a cheaper form with the same behavior and tested by an independent challenge."
metadata:
  version: "0.3.1"
---

# Performance Review

**Find work the code does not need where it runs often.** Find places where
a path that runs per request, per element or inside a loop does more than
its result needs: a pass that makes the work quadratic, an allocation or
copy per element, a round trip per item, a blocking call on the async
executor, a lock that makes callers queue, work repeated that gives the same
answer every time. A finding shows why the path is hot, traces the work for
one unit through the source line by quoted line, gives a cheaper form with
the same observable behavior and names the resource it saves, and has
survived an independent attempt to show it saves nothing.

Speed only: latency, throughput, CPU, allocations and copies, waiting on
locks and I/O. Slow code is not a bug, and fast code that reads badly is not
a finding here. Readability, bugs, security and tests are other reviews'
subjects.

The review reads. It does not clone, copy, build or run the project, its
benchmarks or a profiler, change what it finds or post comments. A profile,
flamegraph or benchmark output the user supplies is evidence.

## Run

For help, explain usage and stop. If no target can be identified from the
request, ask only for that. Otherwise orchestrate through the active
adapter, [Claude Code](references/harnesses/claude.md),
[Codex](references/harnesses/codex.md) or
[OpenCode](references/harnesses/opencode.md), following
[the workflow](references/workflow.md). When the user explicitly asks to run
agents in another installed harness, such as OpenCode, start them there
through [external agents](references/harnesses/external.md).

Each reader gets one lens, or a related pair for a small change, and
[the contract](references/contract.md). Each challenger gets one reader's
claims with their proofs and [the challenge](references/challenge.md), never
the reader's reasoning. You decide every candidate yourself and deliver
[the report](assets/report-template.md) in the user's language. If agents
cannot be started, say the review is a limited single-reader pass and do not
claim an independent challenge.
