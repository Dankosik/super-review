# Codex

Use the installed `super_review` MCP server (version 2.1 or newer), with tools: `doctor`, `snapshot`, `files`,
`source`, `diff`, `search`, and `resources`. It also exposes `batch_open`, `batch_submit`, and `batch_result`.
The separate `super_review_wait` server exposes only `batch_wait` and must be a
direct tool, outside `functions.exec`. The one-time native configuration adds
`mcp__super_review_wait` to `features.code_mode.direct_only_tool_namespaces`.
Do not use an older generic `reader` server when multiple versions are present. Do not replace a missing reader with arbitrary shell access.

Run the orchestration in the current task. Keep the orchestrator's model and
reasoning effort exactly as selected by the user. Use native fresh child contexts,
one selected lens each, with the pinned source, policy, scope, and resource paths.

For every specialist, explicitly pass both model and reasoning effort to the
native spawn tool. The default balanced profile is `gpt-5.6-terra` with `medium`.
If the user explicitly requests the economy profile, use `gpt-5.6-luna` with
`medium`. An explicit user choice for specialists overrides these defaults.
Start a fresh context without copying the parent conversation. Do not merely
name the model in the task text or silently fall back to the parent model.
Report unavailable model selection as a capability gap.

Load shared resources together (up to twelve paths). Announce the plan and worker
profile, then use groups of at most three tasks within the available child slots.

1. Call `batch_open` with the issued snapshot receipt and the group's task names.
2. Spawn each specialist with its batch ID and assignment ID. Require its final
   action to be `batch_submit` with the full candidate report and an explicit
   `completed`, `not_applicable`, or `unfinished` status, then finish the native
   task. A failed spawn is submitted as `unfinished` by the parent.
3. Call the direct `super_review_wait.batch_wait` tool once. It stays pending until every report arrives or the
   fixed group deadline expires. Do not invoke it through `functions.exec`: that
   wrapper can return control early and cause extra model turns. Do not call `wait_agent`,
   list status, send reminders, or inspect unchanged source while it is pending.
4. Use the reports returned by the wait. Call `batch_result` only for reports
   with a `nextOffset`, following it to the end, and verify candidates normally.
   A ready group means reports arrived, not that their
   recommendations were accepted. Keep timed-out or unfinished coverage partial.

Continue with the next group after these reports are available. Use native agent
controls only to handle a real error, user cancellation, or free completed slots;
do not restart or prompt a working child just to obtain progress. If the batch
tools or direct long-running call are unavailable, disclose the missing integration
instead of silently falling back to polling.

The reader performs GitHub GET requests only. Codex's host permissions still
govern its other tools; this skill does not turn the whole task into a sandbox.
During this review, use those other tools only for native delegation and waiting.
Return the report in the conversation. If the requested delegation or reader is
unavailable, disclose the missing capability; do not simulate a complete review.
