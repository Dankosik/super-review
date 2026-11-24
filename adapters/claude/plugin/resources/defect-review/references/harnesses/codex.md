# Codex

Orchestrate in the current task, keeping the user's model and effort. In
non-interactive `codex exec` runs, load `SKILL.md`, the contract, and the
workflow in full before spawning any child, and never probe external harness
CLIs (such as OpenCode) or auxiliary launchers unless explicitly requested.

Start each reader and each challenger as a fresh native child with no
inherited conversation. Spawn it as the default agent: omit `agent_type`,
because a role from the reviewed repository or the user's library would
replace this review's instructions. Repeat the result format in the task. A
challenger is never the reader whose claims it tests.

Pass `gpt-6.1-terra` with `high` reasoning effort for every child unless the
user names another model or effort; then pass that for every child. An
unavailable model or child facility is a gap to report, not a reason to
substitute silently. The review needs read access
only.

Wait for every result; a missing one is unread coverage.
