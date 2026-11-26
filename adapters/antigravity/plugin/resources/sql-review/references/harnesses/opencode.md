# OpenCode

`/sql-review <PR URL or local scope>` runs the `sql-review` agent in the
current session. Resolve the skill's files at its discovered installation path
and pass absolute paths to children.

Start each reader as `sql-reader` and each challenger as `sql-challenger`
through the Task tool, in fresh contexts and in parallel calls. A challenger is
never a continuation of the reader whose claims it tests. Wait for every
result; a missing one is unread coverage.

Readers and challengers use the specialist model the launcher or
`SUPER_REVIEW_SPECIALIST_MODEL` selects; the orchestrator keeps the session's
model. No role has tools for writing files. The shell is still not a sandbox,
so never connecting to a database, running database CLIs, applying migrations,
or executing project code is an instruction to follow.
