# Claude Code

`/super-review:review <PR URL>` runs the orchestrator in a separate foreground
context, keeping the coding conversation focused. The orchestrator has the reader
and Agent; specialists have only source tools. Neither has shell/file-edit tools.

Use `super-review:specialist` through Agent for each selected lens. The reader's
namespace is `mcp__plugin_super-review_reader__`; use that installed reader, not
an inline duplicate. The session shares its connection. Supply the workflow's
neutral task packet. Reuse complete matching resources already in the receiving
context; batch only missing ones in `resources`. Each child needs the contract,
Applicable language context, candidate format, assigned lens and only selected owner profiles.
References and summaries are not full source. Return the full report to the caller.

Invoke specialists in the foreground (`run_in_background: false`), grouping
independent Agent calls when native parallel calls are available. Leave calls
pending until reports return; do not poll status or send reminders. If the host
forces background execution, disclose the changed guarantee rather than claiming
foreground waiting. Interactive fork mode requires the parent process to start
with `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1`; the plugin cannot set it itself.

Delegate exactly the selected tasks and source-justified continuations, not extra
explorers/verifiers because a model prefers more delegation. Conversely, do not
skip required independent passes for a small PR. The parent's candidate verification
and cross-lens reconciliation are required; repeated generic self-review is not.

The orchestrator inherits the session model and effort. Specialists use native
`sonnet` at `medium`; do not substitute the parent model. User/managed overrides
keep native precedence. Report the selected profile with coverage. Missing reader,
failed child, or unavailable nested delegation is a gap, not permission to switch
to a broader agent. Preserve task headers when collecting results. Use the workflow's
continuation state only for a supported in-session handoff, never as a promise of
cross-session recovery or authorization for extra storage/tools.
