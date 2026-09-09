---
name: super-review
description: "Review the readability, idiomatic expression, and maintainability of a Go pull request through independent specialist passes. Use when the user explicitly asks for Super Review or this focused review workflow."
metadata:
  version: "2.1.0"
---

# Super Review

**Clarity.** Recommend changes that make the implemented solution easier to
read or maintain. A shorter function, another interface, or a longer report is
not an improvement by itself. Leaving clear code alone is a successful result.

Review the supplied PR without changing its source or posting comments. Do not
run its code, tests, build, linters, hooks, or installers. This is a review of
expression and structure; bug hunting, security assessment, test coverage, and
business validation are separate tasks. Understand behavior to avoid obviously
incompatible advice, without claiming equivalence has been tested.

**Start.** Use the matching adapter: [Codex](references/harnesses/codex.md),
[Claude Code](references/harnesses/claude.md), or the installed OpenCode role.
For help or a missing PR URL, explain the launch and check the available reader;
do not start specialist work. Accept file and lens scope in ordinary language.

**Orchestrate.** Read [the contract](references/review-contract.md) and
[workflow](references/workflow.md), then [Go context](references/languages/go.md)
and [team rules](references/team-rules.md). Pin the PR's source revisions before
delegating. Use the installed adapter's source tools and independent child
contexts; the adapter must identify any unavailable capability.

Assign one lens and a concrete scope to each specialist. Specialists read the
contract, Go context, assigned lens, and candidate format, with the effective
rules supplied in the task. Each judges its question independently, including
whether leaving the code alone is better; it does not repeat the whole review.
Read [verification](references/verification.md)
when evaluating their candidates. Keep every accepted recommendation, including
ones merged into a shared change.

**Deliver.** Lead with the outcome. Use [the report structure](assets/report-template.md) in the user's
language. Bind paths and locations to the pinned revision. Separate completed
coverage from exclusions and unfinished work. Report partial work as partial;
never replace missing specialists with imagined independent reviews. Give the
full report in the harness, or a permitted output artifact outside the reviewed
source tree. Read this skill's version from its metadata and include it.
