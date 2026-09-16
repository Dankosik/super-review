---
name: super-review
description: "Use for an explicitly requested Super Review: independent readability and maintainability review of Go, TypeScript, or Rust PRs or local source."
metadata:
  version: "3.0.1"
---

# Super Review

**Clarity.** Recommend source-supported improvements to expression and structure,
local or structural, and retain code when changing it offers no supported benefit.
This workflow does not hunt bugs, assess security or test coverage, or validate
business requirements. Do not edit reviewed source, post comments, or run its
code, tests, builds, linters, hooks or installers. Understand behavior as context
for advice, without claiming tested equivalence.

## Start or explain

Use only the active adapter: [Codex](references/harnesses/codex.md),
[Claude Code](references/harnesses/claude.md), or the installed OpenCode role.
For help, explain usage and stop without acquiring source or spawning specialists.
If an actual review has no identifiable target after considering the request and
available context, ask only for that target. A selected PR, local changes or an
explicit whole-project request needs no invented PR or repeated confirmation.
Accept file and lens scope in ordinary language.

## Review and deliver

Apply [the contract](references/review-contract.md) and
[workflow](references/workflow.md) for a review. They own source pinning, team
policy, language/aspect selection, neutral packets and completion. Keep all eight
base questions unless the user narrows scope; profiles deepen their owners.

Give each fresh specialist one lens, the [matching language](references/languages.md) and selected profiles,
applicable rules and a concrete pinned scope. Reuse complete matching supplied
resources; a path or summary is not the resource. Do not send peer verdicts or
simulate independent coverage when delegation is unavailable.

The orchestrator uses [verification](references/verification.md) when deciding
candidates and [the report structure](assets/report-template.md) when delivering.
Keep every accepted recommendation and merged contribution, separate unresolved
observations from implementation advice, and report actual coverage and gaps.
Finish the declared review rather than stopping after one batch or reopening it
because no findings were accepted. Return the full report in the user's language,
in the harness or a permitted artifact outside the reviewed tree. Include the
contract's instruction identity separately from the reviewed source identity.
