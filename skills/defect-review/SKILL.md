---
name: defect-review
description: "Use for an explicitly requested Defect Review: independent readers hunt bugs in Rust source of a PR or local tree by reading it, each bug traced through quoted lines, given a stated basis and tested by an independent challenge."
metadata:
  version: "0.6.0"
---

# Defect Review

**Find bugs.** Find places where the selected source does the wrong thing for
someone: a caller gets a wrong result, a failure is reported as something it
is not, a wait outlives its limit, something started is never ended, one
caller's trouble damages another's work. A finding traces the behavior
through the source, line by quoted line, says what should have happened and
on what basis, and has survived an independent attempt to show it is not a
bug.

A written promise is one basis among several, not a precondition. A document
that describes harmful behavior does not make it right. A suspicion that
cannot be traced is not a finding.

The review reads. It does not clone, copy, build or run the project, fix
what it finds or post comments. Readability, design taste, security and test
quality are other reviews' subjects.

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
[the contract](references/contract.md). Each
challenger gets one reader's claims with their proofs and
[the challenge](references/challenge.md), never the reader's reasoning. You
decide every candidate yourself and deliver
[the report](assets/report-template.md) in the user's language. If agents
cannot be started, say the review is a limited single-reader pass and do not
claim an independent challenge.
