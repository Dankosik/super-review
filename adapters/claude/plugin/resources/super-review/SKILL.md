---
name: super-review
description: "Explicit Super Review of Go, TypeScript, Rust, or Java PRs or local source for readability and maintainability, or help using that review."
disable-model-invocation: true
metadata:
  version: "3.36.3"
---

# Super Review

**Clarity.** Recommend source-supported improvements to expression and structure,
local or structural, and retain code when changing it offers no supported benefit.
Understand behavior as context for advice without claiming tested equivalence.
The review reads only: never edit reviewed source, post comments, or run project
code, tests, builds, linters, hooks, or installers. Bugs, security, test
coverage, and business requirements belong to separate reviews.

## Start or explain

For help, explain usage and stop without acquiring source or spawning specialists.
For a review with no identifiable target in the request or active context, ask
only for that target; reuse a supplied PR, local changes, or an explicit
whole-project target without asking again, and accept file and lens scope in
ordinary language.

Orchestrate through the active adapter: [Codex](references/harnesses/codex.md),
[Claude Code](references/harnesses/claude.md), [Cursor](references/harnesses/cursor.md),
[Antigravity](references/harnesses/antigravity.md),
or the installed OpenCode role. When the user explicitly asks to run specialists
in another installed harness, launch them there through
[external specialists](references/harnesses/external.md).

## Review and deliver

Follow [the contract](references/review-contract.md) and
[workflow](references/workflow.md) for source pinning, team policy,
[language](references/languages.md) and aspect selection, neutral task packets,
and completion. Keep all eight base questions unless the user narrows scope;
profiles deepen their owner lens. Give each fresh specialist one lens, or a
related pair only when the user explicitly asks for a compact review of a small
change.

Decide every candidate and what the code becomes with
[verification](references/verification.md), then deliver the complete report
using [the report structure](assets/report-template.md) in the harness or a
permitted artifact outside the reviewed tree.
