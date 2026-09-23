# Model profiles

Super Review uses the selected host's native model routing and credentials. It
does not call model APIs or bundle provider access. Report the effective model
and effort when the host exposes them; a requested profile is not proof of use.

| Harness | Orchestrator | Specialists |
| --- | --- | --- |
| Codex | Current task's model and effort | `gpt-6-luna` / `medium` for a bounded local question with complete context; `gpt-6-sol` / `medium` otherwise |
| Claude Code | Native `opus`; session effort | Native `opus`; session effort |
| OpenCode | Current primary model and effort | One explicitly selected `provider/model-id`; provider's configured/default effort |
| Cursor IDE | Current Agent chat's selected model/settings | `inherit`; an explicit user subagent choice takes precedence where native per-call selection supports it |

## Codex: select for the assigned question

Choose after pinning the source and building the area/lens assignment. Luna is
appropriate only when the relevant declarations and callers are available and
the answer stays within a local expression or responsibility. Examples include a
local name whose vocabulary and uses are known, or duplication whose two owners
and change relationship are already established. Sol handles cross-file API or
compatibility questions, ownership and lifecycle, observable effects, conflicting
policy, missing context, or an area whose complexity is uncertain. The same lens
can use either model on different source. Do not reduce coverage, the eight base
questions, source reading, or verification to justify Luna.

Pass the selected model and `medium` effort to each native child. An explicit user
specialist model or effort choice takes precedence. Reassess a focused
continuation if new evidence changes its scope, and record both task identities
and their actual models. A host that cannot run the selected model must disclose
the gap rather than silently substitute. There is no global Codex subagent
configuration to change.

These GPT-6 IDs are the current release's pinned choices, not moving aliases.
Future releases require a deliberate compatibility and quality check. The older
[model study](model-study.md) covers GPT-5.6 and remains historical evidence; it
does not establish GPT-6 review quality or parity between Sol and Luna.

## Claude Code: Opus with session effort

The review command, orchestrator, and specialist role all select `opus`.
On the direct Anthropic API with Claude Code 2.1.280 or later, that alias
currently resolves to Claude Opus 5.5. Other providers have their own alias
mapping, which can lag behind their newest available Opus. If necessary, map
`ANTHROPIC_DEFAULT_OPUS_MODEL` to that provider's Opus 5.5 ID in native Claude
Code configuration. Inspect the effective model rather than assuming 5.5.

The roles do not pin effort, so select it in the Claude Code session before
starting the review: `medium` for bounded work, `high` for ambiguous cross-file
contracts or preservation constraints, and `xhigh` for unusually difficult cases.
The native specialist role inherits that session effort; it cannot select a
different effort per lens through the current Agent call. Use `/status` for the
session model and `/tasks` for running specialists. Native user/managed settings
and model restrictions retain their precedence. A fallback must be reported.

## OpenCode and Cursor

OpenCode supports multiple providers. To avoid changing provider or billing
implicitly, save one specialist model from your configured provider:

```sh
mkdir -p "${XDG_CONFIG_HOME:-$HOME/.config}/super-review"
printf '%s\n' 'YOUR_PROVIDER/YOUR_MODEL_ID' > \\
  "${XDG_CONFIG_HOME:-$HOME/.config}/super-review/opencode-specialist-model"
```

Use an actual model ID from `opencode models`. An environment variable overrides
that file for one launch: `SUPER_REVIEW_SPECIALIST_MODEL=provider/model-id`.
The launcher passes the selection through native OpenCode configuration. It
refuses to launch without a selection. If running OpenCode directly rather than
through the launcher, set that environment variable yourself.

For Cursor, leave specialists on the chat model or request an override directly:

```text
/super-review Review my local changes. Use <Cursor model ID> for subagents.
/super-review Проверь этот PR. Для subagent используй <Cursor model ID>.
```

The override applies to all specialists and continuations in that review, not the
orchestrator. An explicit return to the parent's model restores `inherit`; a new
review defaults to inheritance unless the user carries the choice forward.
The adapter checks the exposed native Task selector, applies a supported choice
in launch configuration, and reports unsupported selection or observed fallback
instead of silently substituting. A prompt cannot itself change a model or
bypass Cursor's plan/admin restrictions. See [Cursor setup and capability limits](cursor.md).
Native end-to-end Cursor model routing has not been measured by this project.
