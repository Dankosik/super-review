# Version 3: native completion

Version 3 uses host agent notifications, blocking waits and full-result reads.
The plugin supplies no barrier, deadlines, receipts or completion server.
The following is retained historical evidence for 2.x and is not setup guidance.

# Completion waiting

Super Review 2.1 moves waiting out of the orchestrator's repeated model turns.
Workers still use native independent contexts and the selected specialist model.
The orchestrator still verifies their candidates. Only the coordination changes.

## Codex: one direct call per group

The orchestrator opens a group of up to three assignments on its issued source
snapshot, starts the native specialists, and calls `super_review_wait.batch_wait`
once. Each specialist submits its full terminal report through
`super_review.batch_submit`, then finishes its native task. The pending wait
returns all reports together, or returns missing coverage at the fixed deadline.

The Node server uses filesystem events and a deadline timer. It has no model
client, interval polling, subprocess scheduler, or alternate agent runtime.
Notifications from individual children do not complete the group wait.

There are two native MCP servers. `super_review` supplies the source reader and
assignment operations; `super_review_wait` supplies only `batch_wait`. Keeping
only the wait outside code mode preserves batched source reads.

### One-time host setting

Codex's `functions.exec` wrapper can yield before a nested tool completes. A
long MCP timeout alone does not prevent that early return. To eliminate those
wrapper turns, add this namespace to Codex's direct-call list:

```toml
[features.code_mode]
direct_only_tool_namespaces = ["mcp__super_review_wait"]
```

Preserve any existing entries in this list and any existing settings in the
table. The native package includes `scripts/configure-codex.mjs`; from its
installed root or a source checkout, run:

```sh
node scripts/configure-codex.mjs --check
node scripts/configure-codex.mjs --apply
```

The helper uses Codex's native configuration API, preserves existing namespace
entries and settings, and rejects concurrent configuration changes. It changes
only the code-mode routing entry. It does not choose a model, effort, provider,
permission policy, or marketplace. Start a new Codex task afterward. Plugin
installation alone cannot declare this host setting.

For a single CLI session without a persistent change:

```sh
codex -c 'features.code_mode.direct_only_tool_namespaces=["mcp__super_review_wait"]' \
  '$super-review Review https://github.com/OWNER/REPO/pull/123'
```

This native setting is documented in the [Codex configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference).
The tested implementation is Codex CLI 0.153.4; its
[tool-exposure code](https://github.com/openai/codex/blob/rust-v0.153.4/codex-rs/core/src/tools/spec_plan.rs)
removes matching namespaces from code-mode exposure and exposes them directly.
The plugin's wait server declares a 660-second tool timeout through Codex's
native MCP configuration. The portable root manifest does not carry that timeout;
install the author-catalog entry or the native Codex ZIP.

### Completion, failure, and cancellation

Each group has a fixed ten-minute deadline from creation. There is no short
timeout parameter on `batch_wait`. A failed spawn or unfinished specialist is
recorded explicitly. Missing submissions at the deadline remain missing, and
late submissions cannot change that outcome. A ready group means its reports
arrived; it does not mean the orchestrator accepted their recommendations or
that the native child has finished its final acknowledgement.

Repeated identical submissions are idempotent; conflicting replacements are
rejected. Reports are limited to 64 KiB. The wait returns a bounded first window
and explicit continuation offsets, which the orchestrator follows to retain all
candidates. The limit is an error boundary, not permission to truncate findings.
Windows are bounded by serialized UTF-8 bytes, including non-ASCII text. A host
with a lower custom output limit can still truncate a response; disclose that
gap instead of inferring that an unread report is complete.

Cancelling the pending MCP call releases its watcher and timer. Native child
cancellation remains the harness's responsibility. Failed or timed-out groups
produce partial review coverage. Real errors and user cancellation can require
native agent controls; routine status polls and reminders are excluded from the
workflow. This plugin does not remove the host's native tools globally.

Coordination records use a private temporary directory, mode 0700, with mode
0600 files on Unix. They contain the snapshot ID, assignment IDs, deadlines, and
reports. Records expire after 24 hours; opening a new group cleans up valid
expired groups. See [privacy](../PRIVACY.md).

## Claude Code

Use foreground native Agent calls, grouped in one parallel tool turn when the
harness supports it. In current interactive fork mode, Claude can force Agent
calls into the background even when the prompt asks for foreground execution.
For deterministic foreground behavior, launch the review session with:

```sh
CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1 claude
```

Then invoke `/super-review:review <PR URL>`. This environment setting applies to
that Claude process, including its other tasks; it does not persist in global
settings. The plugin cannot enforce it through plugin `settings.json`, whose
supported keys do not include `env`. Non-interactive `claude -p` normally has
fork mode off, but the explicit environment setting is the predictable route.
These precedence rules are documented in [Claude's subagent guide](https://code.claude.com/docs/en/sub-agents#run-subagents-in-foreground-or-background)
and [plugin settings reference](https://code.claude.com/docs/en/plugins-reference).

The command still runs its orchestrator in a separate foreground context.
Specialists remain Sonnet/medium. If the host forces background execution,
the adapter discloses the changed guarantee instead of claiming an equivalent
blocking wait.

## OpenCode

The primary review agent submits independent native Task calls with
`background: false` and waits for their results. OpenCode 1.18.29's
[Task implementation](https://github.com/anomalyco/opencode/blob/v1.18.29/packages/opencode/src/tool/task.ts)
holds the foreground call until completion, error, cancellation, or explicit
promotion to background. Promotion changes the guarantee and must be disclosed.
No additional MCP result store is needed for this native path.

## Evidence and cost limits

The [validation record](validation.md) separates source-level mechanics, native
transport tests, actual Codex reviews, and Claude's synthetic routing probe.
Removing model turns spent waiting removes their token cost. Total review cost
also includes preparation, dispatch, source reads, candidate verification,
worker submissions, and cache behavior. One clean PR cannot establish a fixed
percentage saving or equivalent finding recall.
