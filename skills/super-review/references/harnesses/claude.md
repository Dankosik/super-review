# Claude Code

The plugin command is `/super-review:review <PR URL>`. It runs the orchestrator
in a separate foreground context so the user's coding conversation stays focused.
The orchestrator has the reader and Agent; specialists have only source-reading
tools. Neither review role has shell or file-edit tools.

Use `super-review:specialist` through Agent for each selected lens. The reader's
MCP namespace is `mcp__plugin_super-review_reader__`; use the installed tools,
not an inline duplicate server. The session shares its reader connection.
Load common resources in one `resources` call. Each specialist reads the assigned
lens and only selected owner profiles alongside the contract, Go context, and
candidate format. Return the full report to the invoking conversation.

Invoke specialists in the foreground (`run_in_background: false`) and submit a
small group of independent Agent calls together when native parallel calls are
available. Keep those calls pending until their reports return. Do not start a
status-polling or reminder loop. Foreground calls provide the completion boundary;
if the harness forces background execution, disclose that limitation instead of
claiming the same waiting behavior.

For guaranteed foreground execution in interactive fork mode, the Claude process
must start with `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1`. The plugin cannot set
this parent-process environment variable. If foreground selection is unavailable,
explain this session setup requirement; do not simulate blocking by polling.

The orchestrator inherits the user's session model and effort. Specialists use
the native `sonnet` model selection at `medium` effort; do not override them
with the orchestrator's model. User or managed harness overrides retain their
native precedence. Report the selected specialist profile with coverage. A
missing reader, failed child, or unavailable nested delegation is a coverage
gap, not permission to use a different agent or pretend completion.
