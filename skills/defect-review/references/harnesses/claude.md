# Claude Code

`/super-review:defects <PR URL or local scope>` runs the orchestrator in a
separate foreground context. Resolve the skill's files under
`${CLAUDE_PLUGIN_ROOT}/resources/defect-review/` and pass absolute paths to
children.

Start each reader as `super-review:defect-specialist` and each challenger as
`super-review:defect-challenger` through the Agent tool, in fresh contexts
and in parallel calls. A challenger is never a continuation of the reader
whose claims it tests. Do not use the Agent tool's worktree isolation. Wait
for every result; a missing one is unread coverage.

All roles select `opus` and inherit the session's effort; `high` fits this
review. They have no tools for writing files. The shell is still not a
sandbox, so running nothing from the reviewed project is an instruction to
follow. Bash may also start agents in another harness the user explicitly
asked for, per [external agents](external.md). The command runs you as a
forked turn that ends at your first reply without a tool call, and the
processes you started end with it; their completion notices do not reach
you. Wait for them in foreground Bash calls of up to ten minutes each.
