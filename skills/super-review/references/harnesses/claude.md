# Claude Code

Follow the core skill's help/target branch first. Source acquisition and
independent-review steps below apply only to an actual review with an
identifiable target; help does not require reading a repository.

`/super-review:review <PR URL or local scope>` runs the orchestrator in a separate
foreground context. Use [native source access](source-access.md). Read the core at
`${CLAUDE_PLUGIN_ROOT}/resources/super-review/SKILL.md` and resolve its references
there; pass resolved absolute resource and source paths to specialists.

Delegate each selected lens, or compact pair, to `super-review:specialist` through native Agent in
fresh contexts. Supply the workflow's neutral packet, not the parent conversation
or peer reports. Read, Glob, Grep and Bash provide source access; Bash is limited
by the review instructions to acquisition and inspection, plus launching
specialists in another harness the user explicitly requested, through
[external specialists](external.md). The command runs you as a forked turn
that ends at your first reply without a tool call, and external processes end
with it; their completion notices do not reach you, so do not reply while they
run. Edit/Write tools are not exposed, but the shell is not a read-only sandbox.

Run independent specialists in parallel. Have every full result before
reconciliation, also from a child the host moved to the background. Do not poll
or send routine reminders. Missing results remain unfinished; add only
source-justified continuations, each with its own task identity.

You run on the session's model and effort, which the user chose. Specialists
default to the native `sonnet` alias at `medium` effort. When the user names a
specialist model or effort, pass it as the Agent call's `model` and `effort`
for every specialist and continuation in this review; do not raise either on
your own judgment. Record the effective model/effort where the host exposes
them. User/managed restrictions and native model precedence still apply; a
substituted or unavailable model is a disclosed capability gap, not a
successful run on it. A specialist model the user
names that native Agent cannot select is not such a gap: check whether an installed
harness from [external specialists](external.md) offers it and ask whether to run
specialists there, otherwise ask before substituting. Missing nested delegation or
source access is likewise a gap. Preserve task headers and all candidates, then
return the full report.
