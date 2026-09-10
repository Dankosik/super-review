---
name: super-review
description: "Review the readability, idiomatic expression, and maintainability of a Go, TypeScript, or Rust pull request or local source through independent specialist passes. Use when the user explicitly asks for Super Review or this focused review workflow."
metadata:
  version: "3.0.0"
---

# Super Review

**Clarity.** Find opportunities to make the implemented solution easier to
understand and maintain. Recommend a change when the resulting code expresses
its concepts and responsibilities better, whether the improvement is local or
structural. Judge the result, not the amount of change or the length of the report.
Retain code when changing it offers no supported improvement.

Review the supplied PR or requested local source without changing its source or posting comments. Do not
run its code, tests, build, linters, hooks, or installers. This is a review of
expression and structure; bug hunting, security assessment, test coverage, and
business validation are separate tasks. Understand behavior to avoid obviously
incompatible advice, without claiming equivalence has been tested.

**Start.** Use the matching adapter: [Codex](references/harnesses/codex.md),
[Claude Code](references/harnesses/claude.md), or the installed OpenCode role.
Accept a PR URL, local changes, or explicitly requested whole-project source.
For help or no identifiable source, explain the launch and ask for the missing
review target. Accept file and lens scope in ordinary language.

**Orchestrate.** Apply [the contract](references/review-contract.md),
[workflow](references/workflow.md), [language routing](references/languages.md),
and [team rules](references/team-rules.md). Use the compact
[aspect catalog](references/aspects.md) to select contextual lenses and profiles
without dropping the eight base questions. Pin source revisions before delegating.
Use the host's source tools and independent child contexts; disclose
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
