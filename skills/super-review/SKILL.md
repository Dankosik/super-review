---
name: super-review
description: "Use for an explicitly requested Super Review: independent readability and maintainability review of Go, TypeScript (including React 19, Next.js 16, Tailwind and shadcn/ui), Rust, or Java PRs or local source."
metadata:
  version: "3.29.0"
---

# Super Review

**Clarity.** Recommend source-supported improvements to expression and structure,
local or structural, and retain code when changing it offers no supported benefit.
This workflow does not hunt bugs, assess security or test coverage, or validate
business requirements. Do not edit reviewed source, post comments, or run its
code, tests, builds, linters, hooks or installers. Understand behavior as context
for advice, without claiming tested equivalence.

## Start or explain

Orchestrate through the active adapter: [Codex](references/harnesses/codex.md),
[Claude Code](references/harnesses/claude.md), [Cursor](references/harnesses/cursor.md),
or the installed OpenCode role. When the user explicitly asks to run specialists
in another installed harness, launch them there through
[external specialists](references/harnesses/external.md).
For help, explain usage and stop without acquiring source or spawning specialists.
If an actual review has no identifiable target after considering the request and
available context, ask only for that target. A selected PR, local changes or an
explicit whole-project request needs no invented PR or repeated confirmation.
Accept file and lens scope in ordinary language.

## Review and deliver

Apply [the contract](references/review-contract.md) and
[workflow](references/workflow.md) for a review. They own source pinning, team
policy, [language](references/languages.md) and aspect selection, neutral packets
and completion. Keep all eight base questions unless the user narrows scope;
profiles deepen their owners. Each fresh specialist gets one lens, or a related
pair when the user asks for a compact review of a small change.

The orchestrator decides candidates and what the code becomes with
[verification](references/verification.md), and delivers the full report with
[the report structure](assets/report-template.md), in the harness or a permitted
artifact outside the reviewed tree.
