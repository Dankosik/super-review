---
name: test-review
description: "Explicit Test Review of Go, TypeScript, Rust, or Java tests in PRs or local source by reading, or help using that review."
disable-model-invocation: true
metadata:
  version: "0.15.1"
---

# Test Review

**Tests that would notice.** Find promised behavior that the tests do not pin
down: a small, plausible mistake in the code that breaks a promise while every
existing test would still pass. A finding carries the mistake as a diff (the
mutant), why each test that reaches that code still passes with it, and a
witness: the check that holds for the original code and fails for the mutant.

The review reads. It does not clone, copy, build or run the project, and a
mutant is never applied. It does not measure coverage, fix the tests or post
comments. Defects in production code, readability and security are other
reviews' subjects.

## Run

For help, explain usage and stop. If no target can be identified from the
request, ask only for that. Otherwise orchestrate through the active
adapter, [Claude Code](references/harnesses/claude.md),
[Codex](references/harnesses/codex.md), [Antigravity](references/harnesses/antigravity.md) or
[OpenCode](references/harnesses/opencode.md), following
[the workflow](references/workflow.md). When the user explicitly asks to run
agents in another installed harness, such as OpenCode, start them there
through [external agents](references/harnesses/external.md).

Each specialist gets one question and [the contract](references/contract.md).
You decide every candidate yourself and deliver
[the report](assets/report-template.md) in the user's language. If agents
cannot be started, say the review is a limited single-reader pass.
