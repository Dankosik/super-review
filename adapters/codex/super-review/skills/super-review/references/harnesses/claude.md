# Claude Code

`/super-review:review <PR URL or local scope>` runs the orchestrator in a separate
foreground context. Use [native source access](source-access.md). Read the core at
`${CLAUDE_PLUGIN_ROOT}/resources/super-review/SKILL.md` and resolve its references
there; pass resolved absolute resource and source paths to specialists.

Delegate each selected lens to `super-review:specialist` through native Agent in
fresh contexts. Supply the workflow's neutral packet, not the parent conversation
or peer reports. Read, Glob, Grep and Bash provide source access; Bash is limited
by the review instructions to acquisition and inspection. Edit/Write tools are
not exposed, but the shell is not a read-only sandbox.

Prefer foreground calls (`run_in_background: false`) and native parallel calls
for independent tasks. If the host runs a child in the background, use its native
completion/result facility and wait for every full result before reconciliation.
Do not poll or send routine reminders. Missing results remain unfinished; add only
source-justified continuations, each with its own task identity.

The orchestrator inherits the session model and effort. Specialists use native
`sonnet` at `medium`; explicit user/managed overrides keep native precedence.
Missing nested delegation or source access is a gap, not a simulated independent
pass. Preserve task headers and all candidates, then return the full report.
