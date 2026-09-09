# Codex

Use the installed Super Review reader MCP tools: `doctor`, `snapshot`, `files`,
`source`, `diff`, `search`, and `resources`. Their namespace may be qualified by
the plugin. Do not replace a missing reader with arbitrary shell access.

Run the orchestration in the current task. Use Codex's native subagent tools for
fresh independent contexts, one selected lens each. Include the source receipt,
policy, scope, and resource paths in every task. Wait for actual completion;
close completed children when needed to free the available slots. Keep model
and reasoning effort of the orchestrator exactly as selected for the current task.

For every specialist, explicitly pass both model and reasoning effort to the
native spawn tool. The default balanced profile is `gpt-5.6-terra` with `medium`.
If the user explicitly requests the economy profile, use `gpt-5.6-luna` with
`medium`. An explicit user choice for specialists overrides these defaults.
Start a fresh context without copying the parent conversation. Do not merely
name the model in the task text or silently fall back to the parent model.
Report unavailable model selection as a capability gap.

Load shared resources together (the reader accepts up to twelve paths). After
dispatch, wait for results with a 60-second wait rather than repeated short
polls; completion wakes the wait early. Do not reread unchanged source while
waiting. Announce actual batch progress and the chosen specialist profile.

The reader performs GitHub GET requests only. Codex's host permissions still
govern its other tools; this skill does not turn the whole task into a sandbox.
During this review, use those other tools only for native delegation and waiting.
Return the report in the conversation. If the requested delegation or reader is
unavailable, disclose the missing capability; do not simulate a complete review.
