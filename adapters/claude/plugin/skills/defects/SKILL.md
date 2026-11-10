---
name: defects
description: Hunt bugs in Rust source of a PR or local tree by reading it, with Defect Review.
argument-hint: "<PR URL or local scope> [files, lenses]"
disable-model-invocation: true
context: fork
agent: super-review:defect-orchestrator
model: opus
background: false
---

Use Defect Review for this request: $ARGUMENTS

Read `${CLAUDE_PLUGIN_ROOT}/resources/defect-review/SKILL.md` using Read.
Follow its Claude adapter and return the report in this conversation. Accept a
PR, local changes, or explicitly requested whole-project source. For help, explain
usage without starting a review. For an actual review with no identifiable source,
ask only for the missing target; do not reacquire a target already given.
