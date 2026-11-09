<!-- model: claude-sonnet-5-5; arm: baseline; input: RD49; tool: native Claude Code subagent, fresh context -->
## Task result: RD49

- Snapshot: whole-project snapshot of the supplied packet (crate `rust-depth-49`, `src/lib.rs`); no PR or B/H/D.
- Instructions: `content identity unverified`.
- Assignment: lens `control-flow` (rule `rust.flow.show-main-path`), no profiles, scope is all supplied production declarations and uses. The module is private and unreleased, with no team override.
- Status: completed
- Inspected evidence: `Cargo.toml` (edition 2021, rust-version 1.85, tokio 1.54 with sync, time, macros and rt). I read all of `src/lib.rs`: `wait_until_ready` and `mark_ready`. The packet context says the writer and waiter are both in this crate and `mark_ready` is called once by startup code the team owns.
- Coverage: the base control-flow pass is done on both declarations. There are no profiles. Nothing required is missing. The Tokio note was not loaded, because the control flow is a plain loop with no select, task group or shutdown logic.
- New applicability signals: none.

No candidates.

`wait_until_ready` is a short loop with one decision and one exit. It checks the flag and returns if it is set, otherwise it sleeps and checks again. The main path and the exit are visible without any nesting. A combinator form would hide the stopping condition, so the loop should stay as it is. `mark_ready` is a single store with no branching.

The poll-and-sleep design, and replacing it with a notification primitive such as `tokio::sync::watch` or `Notify`, is a data-flow and lifecycle-ownership question. It is not a control-flow readability burden in this source, so I raise it only as context for the orchestrator.
