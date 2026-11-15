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

The orchestrator runs on the session's model and effort, which the user
chose. The other roles default to `sonnet` at `medium` effort; when the user
names a model or effort for agents, pass it as the Agent call's `model` and
`effort` for each of them, and do not raise either on your own judgment. No role has a tool for writing files. The shell is still not a
sandbox, so running nothing from the reviewed project is an instruction to
follow. Bash may also start agents in another harness the user explicitly
asked for, per [external agents](external.md). The command runs you as a
forked turn that ends at your first reply without a tool call, and the
processes you started end with it; their completion notices do not reach
you, so do not reply while they run.
