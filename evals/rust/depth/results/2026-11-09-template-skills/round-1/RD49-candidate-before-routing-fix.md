<!-- model: claude-sonnet-5-5; arm: candidate; input: RD49; tool: native Claude Code subagent, fresh context -->
## Task result: RD49

- Snapshot: supplied packet RD49 source, `Cargo.toml` and `src/lib.rs`. No B/H/D is exposed, so the packet source is the whole-project snapshot.
- Instructions: super-review package, `content identity unverified`.
- Assignment: lens control-flow (`rust.flow.show-main-path`), no profiles. Scope is `wait_until_ready` and `mark_ready`, in a private, unreleased module with no team override.
- Status: completed
- Inspected evidence: `Cargo.toml` (edition 2021, rust-version 1.85, tokio with sync/time/macros/rt). `src/lib.rs`: the whole of `wait_until_ready` and `mark_ready`. The packet context says the writer and waiter are both in this crate, and that `mark_ready` is called once by team-owned startup code.
- Coverage: the base control-flow pass is complete over both declarations. No profile was assigned. No evidence is missing.
- New applicability signals: `wait_until_ready` and `mark_ready` share a flag, and the waiter polls it every 50 ms. This raises a data-flow/lifecycle-ownership question: whether a notification primitive would give a clearer one-time readiness contract. It is a signal only, not a completed check and not a control-flow finding. The context says tokio's `sync` feature is already enabled.

No candidates.

`wait_until_ready` is a plain loop with a single early return and a sleep. The decision and the exit are both visible at a glance. A combinator or `let else` form would hide the retry intent without making it easier to follow. Within this lens, the current form is already the simplest expression of the decisions.
