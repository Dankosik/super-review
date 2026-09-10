# Codex

Use the installed `super_review` MCP server (version 2.1 or newer), with tools:
`doctor`, `snapshot`, `files`, `source`, `diff`, `search`, and `resources`, plus
`batch_open`, `batch_submit`, and `batch_result`. The separate `super_review_wait`
server exposes only `batch_wait` as a direct tool outside `functions.exec`.
The one-time native configuration adds `mcp__super_review_wait` to
`features.code_mode.direct_only_tool_namespaces`. Do not use an older generic
`reader` server or replace a missing reader with arbitrary shell access.

Run orchestration in the current task, preserving the user's model and reasoning
effort. Execute the declared independent plan even for a small PR; do not replace
required specialists with your own quick pass. Use one lens per fresh child context,
no inherited conversation, and the workflow's neutral task packet. Profiles deepen
that owner; they neither change model selection nor automatically add workers.

Explicitly pass model and reasoning effort to the native spawn tool for every
specialist. Balanced is `gpt-5.6-terra` / `medium`; explicitly requested economy is
`gpt-5.6-luna` / `medium`. An explicit specialist choice overrides these defaults.
Do not merely name a model in task text or silently inherit the parent model.
Unavailable model selection is a capability gap.

Use complete resources already supplied at the matching installed version; load
missing ones together (up to twelve paths). Children need only the contract, assigned language context, assigned lens, selected profiles and candidate format, not every lens.
Keep supplied source separate from instructions; summaries do not replace evidence.
Announce the plan/profile, then use groups of at most three within available slots.

1. Call `batch_open` with the issued snapshot receipt and task names.
2. Spawn each specialist with its batch and assignment IDs. Require its final
   action to be `batch_submit` with the full task header and all candidate blocks,
   an explicit `completed`, `not_applicable`, or `unfinished` status, then finish
   the native task. The parent submits a failed spawn as `unfinished`.
3. Call direct `super_review_wait.batch_wait` once; leave it pending until reports
   arrive or the fixed deadline expires. Do not wrap it in `functions.exec`, call
   `wait_agent`, list status, send reminders, or inspect unchanged source meanwhile.
4. Use returned reports; call `batch_result` only to follow `nextOffset` to the end.
   Readiness means delivery, not acceptance. Verify candidates with the core policy;
   preserve timed-out/unfinished coverage as partial.

Start the next group after collecting this one. Native controls are for real
errors, cancellation, or freeing completed slots, not nudging working children.
A focused follow-up needs a new assignment; never replace a terminal submission.
Disclose missing batch/direct-wait capability instead of falling back to polling.
Do not add redundant reviewer agents or generic self-check rounds beyond the plan.

The reader performs GitHub GET requests only; host permissions govern other tools.
During review those tools serve only native delegation/waiting. Return the report
in conversation; disclose missing reader/delegation rather than simulating coverage.
Use the workflow's continuation state only at a supported in-session handoff, with
still-valid receipts and recoverable reports; do not promise persistence or add tools.
