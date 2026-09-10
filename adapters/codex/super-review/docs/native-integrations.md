# Native integrations

Version 3 installs instructions and native agent configuration only. There is no
Node bridge, MCP connection, custom result store or post-install setup script.
The selected host supplies file reading/search, Git/GitHub access and independent
agent execution. Local reviews can run without network access.

## Codex

```sh
codex plugin marketplace upgrade dankosik-skills
codex plugin add super-review@dankosik-skills
```

Use Super Review in a new task after updating. Native child notifications or
blocking agent waits collect the complete specialist reports. Existing tasks may
retain their earlier tool/context configuration until they finish.

For removal:

```sh
codex plugin remove super-review@dankosik-skills
```

## Claude Code

```sh
claude plugin marketplace update dankosik-skills
claude plugin update super-review@dankosik-skills
```

Use `/super-review:review <PR URL or local scope>` in a new session. The command
forks into the orchestrator, which uses native Agent and file/search/Bash tools.
Specialists use the same source tools without Agent. Their model remains
Sonnet/medium, and the orchestrator inherits the session's selection.

For removal:

```sh
claude plugin uninstall super-review@dankosik-skills
```

## Migration from 2.x

Upgrade the author catalog as well as the installed plugin: catalog entries pin
exact release commits. Replacing the package removes its MCP declarations.
If you separately registered Super Review servers in user configuration, remove
only those registrations. Preserve every unrelated MCP server.

The old setup script could add `mcp__super_review_wait` to Codex's
`features.code_mode.direct_only_tool_namespaces`. Remove only that value; preserve
other entries and the surrounding code-mode settings. The old script is no longer
shipped. No replacement setting or cachebuster is needed for the new release.

Old running sessions may retain server processes until they close. Do not kill
unrelated Node or Codex processes. Start a new task to use the new package.

## Scope and permissions

Review policy prohibits source edits, execution of project code/tests/builds and
external writes. Shell access is now native and is **not** a read-only sandbox.
Claude and OpenCode roles omit edit/write tools but have shell access for source
inspection. Apply host sandbox/approval settings when an enforced boundary is
needed. This is a deliberate change from the old fixed-command source reader.

Committed source is read by SHA; working source is identified by a shared copy
and file hashes or verified matching reads. Review copies may contain private
source, and host history may contain excerpts. No plugin process stores results.

## Direct project catalog

A prepared checkout can be registered separately for development:

```sh
codex plugin marketplace add /absolute/path/to/super-review
codex plugin add super-review@super-review
```

Avoid installing both author and project copies in ordinary use. The author
catalog pins a release; the project catalog follows its prepared local package.
