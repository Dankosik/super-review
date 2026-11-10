# OpenCode

`/test-review <PR URL or local scope>` runs the `test-review` agent in the
current session. Resolve the skill's files at its discovered installation path
and pass absolute paths to specialists.

Start each specialist as `test-reader` through the Task tool, in fresh
contexts and in parallel calls. Wait for every result; a missing one is
unread coverage.

Specialists use the model the launcher or `SUPER_REVIEW_SPECIALIST_MODEL`
selects; the orchestrator keeps the session's model. No role has tools for
writing files. The shell is still not a sandbox, so running nothing from the
reviewed project is an instruction to follow.
