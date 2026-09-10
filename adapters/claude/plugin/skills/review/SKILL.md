---
name: review
description: Review the readability and maintainability of a Go, TypeScript, or Rust pull request with Super Review.
argument-hint: "<PR URL> [scope or review aspects]"
disable-model-invocation: true
context: fork
agent: super-review:orchestrator
model: inherit
background: false
---

Use Super Review for this request: $ARGUMENTS

Load the installed core with the reader's `resources` tool, path `SKILL.md`.
Follow that skill and the Claude Code adapter reference. Return the report in
this conversation. If the user asks for help or supplies no PR, explain the
command, run the reader's `doctor` check, and request the missing PR URL.
