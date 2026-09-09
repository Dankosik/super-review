# Claude Code

The plugin command is `/super-review:review <PR URL>`. It runs the orchestrator
in a separate foreground context so the user's coding conversation stays focused.
The orchestrator has the reader and Agent; specialists have only source-reading
tools. Neither review role has shell or file-edit tools.

Use `super-review:specialist` through Agent for each selected lens. The reader's
MCP namespace is `mcp__plugin_super-review_reader__`; use the installed tools,
not an inline duplicate server. The session shares its reader connection.
Load common resources in one `resources` call and only the assigned lens for a
specialist. Return the full report to the invoking conversation.

Leave model and effort selection to the user's Claude Code configuration. A
missing reader, failed child, or unavailable nested delegation is a coverage
gap, not permission to use a different agent or pretend completion.
