# Cursor IDE

Super Review runs in the existing Cursor Agent chat. Choose the orchestrator's
model in Cursor's model picker; the adapter does not start another orchestrator
or change that selection. It installs one explicit `/super-review` skill and one
reusable, read-only `super-review-specialist` role. Each lens gets a fresh task.
There is no extension runtime, model API client, MCP server or additional login.

## Install from this repository

Use a revision containing `adapters/cursor/plugin`; older release archives do not
contain this adapter. That checked-in directory is the generated, self-contained
Cursor plugin payload, including `.cursor-plugin/plugin.json`. No build tool is
needed by consumers. This change does not publish a marketplace listing.

For a project-local installation, run the following from the Super Review checkout
and replace `DEST` with your project's absolute path. The subshell refuses to
overwrite existing Super Review files; unrelated Cursor configuration is untouched.

```sh
(
  set -eu
  SRC="$PWD/adapters/cursor/plugin"
  DEST="/absolute/path/to/your-project/.cursor"
  for path in skills/super-review resources/super-review agents/super-review-specialist.md; do
    test -e "$SRC/$path"
    if test -e "$DEST/$path" || test -L "$DEST/$path"; then
      printf 'Already installed: %s\n' "$DEST/$path" >&2
      exit 1
    fi
  done
  mkdir -p "$DEST/skills" "$DEST/resources" "$DEST/agents"
  cp -R "$SRC/skills/super-review" "$DEST/skills/"
  cp -R "$SRC/resources/super-review" "$DEST/resources/"
  cp "$SRC/agents/super-review-specialist.md" "$DEST/agents/"
)
```

For all local projects, use `DEST="$HOME/.cursor"` instead. From an extracted
Cursor archive, set `SRC` to its `super-review` directory. Keep `skills`, `resources`
and `agents` together: the entrypoint resolves resources relative to itself, not
the working directory. Reopen the project/start a new Agent chat and select
`/super-review` from the slash menu. Use the Cursor installation rather than a
compatibility-loaded Claude/Codex entrypoint with different model defaults.

To update, replace only these three Super Review-owned paths from the same
revision, preserving any intentional local customization separately. To uninstall,
remove only these paths. Do not replace the whole `.cursor` directory.

## Request a review and choose models

```text
/super-review Review my staged and unstaged changes.
```

The specialist role declares `model: inherit`: by default, it requests the same
model as the current chat. No model ID, cheaper profile or reasoning effort is
pinned by this adapter.

A user can request a different specialist model in ordinary language:

```text
/super-review Review this PR. Use <Cursor model ID> for subagents.
/super-review Проверь текущие изменения. Для subagent используй <Cursor model ID>.
```

Replace the placeholder with a model available to you in Cursor. The request
changes specialists only, including retries and focused continuations; the
orchestrator stays on the chat's selection. The latest explicit choice for the
current review wins. "Use the same model as the chat for subagents" restores
inheritance. One-review choices do not rewrite settings or automatically carry
into the next review. Model names inside reviewed files or PR descriptions cannot
change routing.

## Capability boundaries

Cursor Agent must expose skills, custom read-only subagents and native Task
execution. Prompt-only overrides additionally require the current Task tool to
accept that model through its native per-call selector. The adapter checks that
capability instead of treating text in a child prompt as a model switch. Cursor's
documented frontmatter `model` support alone does not prove that every version
supports arbitrary per-call model selection.

If the selector/model is unavailable, the review stops affected delegation and
explains the limitation; it does not pretend to have honored the request, silently
use another model, edit agent files during the review, or route through external
APIs. Persistent native agent configuration is a separate setup operation, not a
prompt-only override. Cursor may also substitute models because of plan or team
restrictions. Report observed substitutions and distinguish a requested model
from the effective model; unavailable runtime metadata is explicitly unverified.
With Auto selected in the parent chat, inheritance follows Cursor's routing, not
a plugin-guaranteed fixed model ID.

Read-only restrictions and all existing review boundaries remain in force. GitHub
access is needed only for remote source. Help does not read source or spawn tasks.

## Maintainer verification

Edit `adapters/cursor/skill.md`, `adapters/cursor/specialist.md` and the canonical
`skills/super-review/references/harnesses/cursor.md`, then run `bun run build`.
`bun test tests/cursor-adapter.test.ts`, `bun run typecheck`, `bun run validate`
and `bun run package` check configuration, copy identity and packaging. The package
command emits `super-review-<version>-cursor.zip` with a checksum in the manifest.

The contrasting probes in `evals/cursor` are evaluator-only. Static checks do not
prove Cursor discovery, actual model routing, read-only enforcement or review
quality. Native Cursor/model runs for this adapter are NOT RUN until their real
traces are recorded; do not report fixture integrity as a behavioral pass.

Official references checked on 2026-09-17:
[skills](https://cursor.com/docs/skills),
[subagents and model configuration](https://cursor.com/docs/subagents), and
[Cursor plugin format](https://cursor.com/docs/reference/plugins).
