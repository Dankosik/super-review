# Google Antigravity

Orchestrate in the current Antigravity App or CLI chat. Resolve this skill's
installed files and pass absolute resource paths with the workflow's packet.
Use `invoke_subagent` with `defect-reader` for readers and `defect-challenger`
for challenges, each in a fresh context on the existing workspace (`inherit`).
A challenger receives the claims and proofs, never the reader's reasoning or
conversation. Messaging an idle reader retains its context and is no challenge.
Run within the workflow's concurrency limit and available host slots.

Both roles allow only `view_file` and `grep_search`: no shell, writing or
delegation tools or MCP servers are configured. The parent acquires source
read-only as the workflow allows, without cloning, copying or checking out the
project. Give children revision-specific contents where their tools cannot read
the selected commit; unavailable source is unread coverage.

The parent keeps its selected model and effort; children use `model: inherit`.
An explicit user specialist choice needs a supported native selector and host
mapping (`inherit`, `flash` and `pro` are documented tiers). A prompt cannot
select a model. Stop affected launches for an unavailable choice and ask for a
supported one; never silently substitute or edit roles during the review. Keep
the choice for continuations of this review. Record actual model identity only
where native metadata provides it; otherwise it is unverified.

Collect every complete final result, matched to its task; a lifecycle status
alone is not a result. Missing results are unread coverage. Without independent
custom agents, report a limited single-reader pass and no independent challenge.
Built-in agents or `/swarm` and `/boost` do not replace these roles.
