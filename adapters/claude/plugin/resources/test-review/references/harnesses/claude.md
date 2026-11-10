# Claude Code

`/super-review:tests <PR URL or local scope>` runs the orchestrator in a
separate foreground context. Resolve the skill's files under
`${CLAUDE_PLUGIN_ROOT}/resources/test-review/` and pass absolute paths to
specialists.

Start each specialist as `super-review:test-specialist` through the Agent
tool, in fresh contexts and in parallel calls. Do not use the Agent tool's
worktree isolation. Wait for every result; a missing one is unread coverage.

All roles select `opus` and inherit the session's effort; `high` fits this
review. They have no tools for writing files. The shell is still not a
sandbox, so running nothing from the reviewed project is an instruction to
follow. Bash may also start specialists in another harness the user
explicitly asked for, per [external agents](external.md), in the background
with completion notices.
