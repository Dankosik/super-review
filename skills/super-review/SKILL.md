---
name: super-review
description: "Review the readability, idiomatic expression, and maintainability of a Go or Java pull request through independent specialist passes. Use when the user explicitly asks for Super Review or this focused review workflow."
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

**Orchestrate.** Apply [the contract](references/review-contract.md),
[workflow](references/workflow.md), [language routing](references/languages/index.md),
and [team rules](references/team-rules.md). Use the compact
[aspect catalog](references/aspects.md) to select contextual lenses and profiles
without dropping the eight base questions. Pin source revisions before delegating.
Use the installed adapter's source tools and independent child contexts; disclose
unavailable capabilities.

Give each specialist one lens, selected owner profiles, effective rules, and a
concrete scope. Supply neutral context using the workflow's task packet.
Complete resources already supplied in that context need not be fetched again;
references and summaries alone do not replace them. Specialists investigate
their question, not the whole review, and return evidence-backed observations.
The orchestrator owns [verification](references/verification.md), final acceptance,
and reconciliation. Keep every accepted recommendation, including merged ones.

**Deliver.** Lead with the outcome. Use [the report structure](assets/report-template.md)
in the user's language. Bind paths and locations to the pinned revision. Separate
completed coverage from exclusions and unfinished work. Never replace missing
specialists with imagined independent reviews. Give the full report in the harness,
or a permitted artifact outside the reviewed source tree. Include this skill's
[instruction identity](references/review-contract.md#instruction-identity), including
its metadata version and any provenance limit. An unresolved observation is not an
instruction to implement.
