# Model profiles

Super Review uses the selected host's native model routing and credentials. It
does not call model APIs or bundle provider access. Report the effective model
and effort when the host exposes them; a requested profile is not proof of use.

| Harness | Orchestrator | Specialists |
| --- | --- | --- |
| Codex | Current task's model and effort | `gpt-6.1-terra` / `high` |
| Claude Code | Session model and effort | Native `sonnet` / `medium` |
| OpenCode | Current primary model and effort | One explicitly selected `provider/model-id`; provider's configured/default effort |
| Cursor IDE | Current Agent chat's selected model/settings | `inherit`; an explicit user subagent choice takes precedence where native per-call selection supports it |

Super Review, Defect Review, Test Review and Performance Review share these
defaults. None of them picks an Opus- or Fable-class model for a child; the
orchestrator runs on whatever the user chose for the session.

## Codex: Terra at high effort

Every child, in every review, gets `gpt-6.1-terra` with `high` reasoning effort as
native spawn arguments. Task size or lens does not change the choice. An explicit
user model or effort for children takes precedence and applies to every child and
continuation in that review. A host that cannot run the selected model must
disclose the gap rather than silently substitute. There is no global Codex
subagent configuration to change.

`gpt-6.1-terra` is the current release's pinned choice, not a moving alias.
Future releases require a deliberate compatibility check. The older
[model study](model-study.md) covers GPT-5.6 and remains historical evidence; it
does not establish GPT-6.1 review quality.

## Claude Code: session model for the orchestrator, Sonnet for children

The review commands and orchestrator roles pin no model or effort, so the
orchestrator runs on the session's model and effort: choose them before starting
a review. Specialists, readers and challengers select the native `sonnet` alias at
`medium` effort in their role definitions. When the user names a model or effort
for them, the orchestrator passes it as the Agent call's `model` and `effort` for
every child; a model native Agent cannot select is handled through
[external specialists](../skills/super-review/references/harnesses/external.md)
or a question before substituting. Use `/status` for the session model and
`/tasks` for running children. Native user/managed settings and model
restrictions retain their precedence. A fallback must be reported.

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
