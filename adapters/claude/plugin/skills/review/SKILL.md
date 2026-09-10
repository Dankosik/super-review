---
name: review
description: Review readability and maintainability of Go, TypeScript, or Rust PRs or local source with Super Review.
argument-hint: "<PR URL or local scope> [review aspects]"
disable-model-invocation: true
context: fork
agent: super-review:orchestrator
model: inherit
background: false
---

Use Super Review for this request: $ARGUMENTS

Read `${CLAUDE_PLUGIN_ROOT}/resources/super-review/SKILL.md` using Read.
Follow its Claude adapter and return the report in this conversation. Accept a
PR, local changes, or explicitly requested whole-project source. With no identifiable
source or a help request, explain the command and ask for the review target.
