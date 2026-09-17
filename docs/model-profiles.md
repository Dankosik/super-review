# Model profiles

The orchestrator keeps the model and reasoning effort selected by the user.
Specialist selection is adapter-specific: Codex and Claude use the profiles below,
OpenCode requires an explicit choice, and Cursor defaults to native inheritance.
Model access still comes from the harness; there are no publisher credentials or
model HTTP clients.

| Harness | Orchestrator | Specialists |
| --- | --- | --- |
| Codex, balanced default | Current task's model and effort | `gpt-5.6-terra`, `medium` |
| Codex, explicit economy profile | Current task's model and effort | `gpt-5.6-luna`, `medium` |
| Claude Code | `inherit`, no effort override | Native `sonnet` selection, `medium` |
| OpenCode | Current primary model and effort | One explicitly selected `provider/model-id`; provider's configured/default effort |
| Cursor IDE | Current Agent chat's selected model/settings | `inherit`; an explicit user subagent choice takes precedence where native per-call selection supports it |

For Codex, request economy mode in ordinary language:

```text
$super-review Review <PR URL> using the economy specialist profile.
```

An explicit user selection for specialists takes precedence over the Codex
profiles. Each child receives the chosen model and effort as native spawn
arguments, plus a fresh context. Changing global Codex subagent defaults is not
needed. If model selection is unavailable, the review discloses that gap rather
than silently using the more expensive parent model.

Claude's `sonnet` alias resolved to `claude-sonnet-5` in the tested CLI. The alias
can follow the user's provider and future model updates; it is not an immutable
quality guarantee. User/managed overrides retain their native precedence.
In particular, older Claude versions let `CLAUDE_CODE_SUBAGENT_MODEL` override
`model: inherit` as well; leave it unset for our inherited-orchestrator contract.
Native nested routing was verified against a local synthetic endpoint. Sonnet's
actual recommendation quality has not yet been evaluated in this project.

OpenCode supports multiple providers. To avoid choosing a different provider or
billing path implicitly, save one specialist model from your configured provider:

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

## Why balanced is the Codex default

Terra and Luna both passed the small offline screen and completed a scoped real
PR review. That does not establish parity on difficult repository discovery,
missing evidence, or complex ownership. Terra is the conservative initial choice
for the full set of lenses; economy mode makes the cheaper option explicit.
No evidence here supports assigning a different model to each lens yet.

A strong orchestrator can reject poor suggestions, but cannot reliably recover
an opportunity that a specialist never noticed. We retain independent passes,
source verification, and honest incomplete coverage in both profiles. A small
model is not permission to skip required context or silently report a clean lens.

The [model study](model-study.md) records actual outputs, usage, rates, and limits.
