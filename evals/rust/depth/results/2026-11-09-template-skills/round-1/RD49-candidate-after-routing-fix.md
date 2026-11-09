<!-- model: claude-sonnet-5-5; arm: candidate; input: RD49; tool: native Claude Code subagent, fresh context -->
## Task result: RD49

- Snapshot: supplied packet RD49, whole-source scope, no PR or B/H/D. Files are `Cargo.toml` and `src/lib.rs`, taken from the packet JSON.
- Instructions: `content identity unverified`.
- Assignment: lens `control-flow` (`rust.flow.show-main-path`), no profiles, with the Tokio control-flow note. Scope is `wait_until_ready` and `mark_ready` in the private, unreleased module. No team override.
- Status: completed
- Inspected evidence: `Cargo.toml` (edition 2021, rust-version 1.85, tokio 1.54 with features sync, time, macros, rt). In `src/lib.rs`, `wait_until_ready` and `mark_ready` in full. Context fact: writer and waiter are both in this crate, and `mark_ready` is called once by startup code the team owns.
- Coverage: base control-flow pass complete for all declarations. No test-only items were present. Missing evidence: the callers of `wait_until_ready` are not supplied, so how many waiters there are is unknown.
- New applicability signals: none.

## C-RD49-1: Readiness wait is a 50 ms sleep-and-recheck loop on a one-shot flag

- Change anchor: `src/lib.rs`, whole-project snapshot, `wait_until_ready` (`loop { if ready.load(Ordering::Acquire) { return; } tokio::time::sleep(Duration::from_millis(50)).await; }`) and `mark_ready` (`ready.store(true, Ordering::Release)`). The two functions and the `Arc<AtomicBool>` are the whole coordination.
- Basis: `rust.flow.show-main-path`, with the Tokio control-flow note (a sleep-and-recheck loop hides the awaited condition; polling suits state that offers no notification).
- Observation:
  - The waiter's actual condition is "startup has signalled readiness once". The loop expresses it only indirectly. A reader has to join three things to see it: the `AtomicBool`, the 50 ms cadence, and the `Acquire`/`Release` pairing. The 50 ms constant is an unexplained magic number.
  - Polling does not fit here. The signal is internal state, not external state without notification. The writer is in this crate and owned by the team, so a notification can be added at the single `mark_ready` call site. The ready flag also never resets, so no terminal condition is left implicit.
  - Cost to the reader: the flag, the cadence and the memory-ordering choices are three separate things to understand for what is one event. The waiter also wakes about 20 times a second and notices readiness up to 50 ms late.
- Remedy: replace the flag and poll with an existing notification that names the event. `tokio::sync::watch` is a good fit because it needs no new dependency and its state persists for late waiters. The `sync` feature is already enabled, so there is no feature change. A `tokio::sync::Notify` alone is less suitable. Its `notify_waiters` stores no permit, and a waiter arriving after the signal would hang.
  ```rust
  pub struct Readiness(watch::Sender<bool>);
  impl Readiness {
      pub fn mark_ready(&self) { self.0.send_replace(true); }
      pub fn subscribe(&self) -> watch::Receiver<bool> { self.0.subscribe() }
  }
  pub async fn wait_until_ready(mut rx: watch::Receiver<bool>) {
      let _ = rx.wait_for(|ready| *ready).await;
  }
  ```
  - What disappears: the loop, the cadence constant, the `Ordering` choices, and the up-to-50 ms lag.
  - What remains: an owner of the sender, and a decision about a dropped sender. `wait_for` returns an error if the sender drops, where the current code would wait forever. The sketch ignores that error, which resolves the wait on sender drop. That is a visible behavior change, so decide it deliberately. For example, treat it as not ready and return an error.
  - Keep alternative: a bounded poll is acceptable only if the flag must stay a plain `Arc<AtomicBool>` shared with code that cannot be changed. The packet says startup code is team-owned and changeable, so that constraint is not shown. If kept, name the 50 ms as a constant and document that it bounds notice latency.
- Preserve:
  - Established: the function returns once `ready` is true, and an already-true flag returns immediately. `watch` with `wait_for` preserves both, including for late subscribers.
  - Established: the waiter signature `Arc<AtomicBool>` and `&AtomicBool` is private and unreleased, so changing it breaks no external API. `rust-version = "1.85"` and tokio 1.54 support `watch::Receiver::wait_for`, which was added in tokio 1.28.
  - Unverified: other callers of these functions, and whether anything else reads the `AtomicBool` directly.
- Affected files: `src/lib.rs` (inspected). The startup code that calls `mark_ready` and any waiter call sites are not supplied and are still needed. `Cargo.toml` needs no change.
