# Claude Code

Follow the core skill's help/target branch first. Source acquisition and
independent-review steps below apply only to an actual review with an
identifiable target; help does not require reading a repository.

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

The command, orchestrator, and specialists select the native `opus` alias, which
resolves according to the configured provider and may need an explicit native
provider mapping to reach its newest Opus. They inherit the session's effort:
choose `medium` for a bounded review, `high` for ambiguous
cross-file contracts or preservation constraints, and `xhigh` only when those
questions remain unusually difficult. Set the session effort before starting a
review; the native specialist role does not vary effort per lens. Record the
effective model/effort where the host exposes them. User/managed restrictions and
native model precedence still apply; a substituted or unavailable Opus is a
disclosed capability gap, not a successful Opus run. Missing nested delegation or
source access is likewise a gap. Preserve task headers and all candidates, then
return the full report.
