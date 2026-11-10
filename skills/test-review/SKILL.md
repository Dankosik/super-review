---
name: test-review
description: "Use for an explicitly requested Test Review: would the tests of Rust source in a PR or local tree fail if a plausible bug appeared, decided by reading, with each finding shown by a mistake no test would catch and the check that would catch it, or by a quoted team rule."
metadata:
  version: "0.3.0"
---

# Test Review

**Tests that would notice.** Find promised behavior that the tests do not pin
down: a small, plausible mistake in the code that breaks a written promise
while every existing test would still pass. A finding carries the mistake as
a diff (the mutant), why each test that reaches that code still passes with
it, and a witness: the check that holds for the original code and fails for
the mutant. A suspicion that tests are weak, without that proof, is not a
finding.

The review reads. It does not clone, copy, build or run the project, and a
mutant is never applied. It does not measure coverage, fix the tests or post
comments. Defects in production code, readability and security are other
reviews' subjects.

## Run

For help, explain usage and stop. If no target can be identified from the
request, ask only for that. Otherwise orchestrate through the active
adapter, [Claude Code](references/harnesses/claude.md) or
[Codex](references/harnesses/codex.md), following
[the workflow](references/workflow.md).

Each specialist gets one question and [the contract](references/contract.md).
You decide every candidate yourself and deliver
[the report](assets/report-template.md) in the user's language. If agents
cannot be started, say the review is a limited single-reader pass.
