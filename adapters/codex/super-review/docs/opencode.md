# OpenCode

Extract the versioned OpenCode ZIP and use its `super-review` launcher, or set
`OPENCODE_CONFIG_DIR` to that extracted directory and run `/super-review`.
The launcher preserves the caller's current directory for local review. It
works with OpenCode 1 and 2. On OpenCode 2 it starts a private server
(`--standalone`), because the shared background service ignores the launcher's
environment. There `OPENCODE_CONFIG_DIR` replaces the global config directory,
so the launcher passes your global `opencode.json` as `OPENCODE_CONFIG` to keep
models and providers; global agents, commands and plugins are not loaded. It
selects the review agent through `default_agent`, since OpenCode 2's TUI has no
`--agent` flag.
Agents and permissions in the reviewed repository's `.opencode` are not loaded
(`OPENCODE_DISABLE_PROJECT_CONFIG=1`), so a role there cannot replace or widen
the review roles. Running `/super-review` without the launcher on OpenCode 2
lacks these protections.

Choose a specialist model using `SUPER_REVIEW_SPECIALIST_MODEL=provider/model-id`
or the existing configuration file at
`~/.config/super-review/opencode-specialist-model`. The orchestrator keeps its
configured model. The adapter adds no runtime dependency or custom tool.

Native read, glob, grep and Bash tools inspect source. The primary role can
invoke only `super-review-specialist`; the specialist cannot delegate. Both omit
edit/write tools, but Bash is not a read-only sandbox. The skill limits it to
source acquisition and inspection. Native task results carry full review reports.

An orchestrator in another harness can run these specialists through
`opencode run` with the same environment when the user asks for OpenCode
subagents; see `references/harnesses/external.md`.

Use a new versioned directory when updating. No provider credentials are bundled
or copied by the package. Host access and model configuration remain yours.
