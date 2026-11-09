<!-- model: claude-sonnet-5-5 (requested native alias `sonnet`); arm: baseline fffcf9d; input: RD63; tool: native Claude Code subagent, fresh context; the scratchpad prefix is shortened to `.../scratchpad` -->
## Task result: RD63

- Snapshot: local packet, whole supplied source (no diff or base). Files: Cargo.toml and src/lib.rs. No commit or hash identities were exposed. Source location: .../scratchpad/packets/RD63
- Instructions: `content identity unverified`. Installed resource root is .../scratchpad/baseline/skills/super-review.
- Assignment: api-clarity (Rust), no profiles, scope is all production declarations and uses in the private, unreleased module, no team policy. Baseline is edition 2021 and rust-version 1.85, from Cargo.toml.
- Status: completed
- Inspected evidence: Cargo.toml, src/lib.rs in full (`Kind`, `Event`, `StatsError`, `collect_uploads`, `largest`, `largest_upload`). Caller facts come from the packet context. There are no tests in the source.
- Coverage: the api-clarity base question (rust.api.express-the-call) was applied to every declaration. No profiles were selected. Nothing required is missing. The remedy for C-RD63-2 depends on a caller decision, noted in that candidate.
- New applicability signals: none. The `Result` use is a declared signature only, not translation or recovery structure, so error-expression is not signalled.

## C-RD63-1: `collect_uploads` uses an out-parameter that every caller supplies as a fresh empty Vec

- Change anchor: src/lib.rs, `pub fn collect_uploads(events: &[Event], out: &mut Vec<u64>)`, and its use in `largest_upload`: `let mut sizes = Vec::new(); collect_uploads(events, &mut sizes);`. Whole-source scope, anchored in the supplied snapshot.
- Basis: rust.api.express-the-call (ownership and sequencing of the call). Not convention-only.
- Observation: the signature says the function appends to a caller-owned Vec. That suggests a caller might pass a non-empty or reused buffer, and the reader must read the body to see it only pushes. The packet states every caller passes a freshly created empty Vec, so the append contract is never used. Each call site pays for a two-step "create, then fill" sequence plus a `&mut` borrow. The name "collect" also does not say whether existing contents are kept.
- Remedy: return an owned value, since the function produces a new collection:
  ```rust
  pub fn upload_sizes(events: &[Event]) -> Vec<u64> {
      events.iter().filter(|e| e.kind == Kind::Upload).map(|e| e.bytes).collect()
  }
  // largest_upload: largest(&upload_sizes(events))
  ```
  Tradeoff: the append form lets a caller reuse a buffer's allocation, but the source shows no such caller. The loop form is also already clear, so the gain is in the signature, not the body. Keeping the loop with a `Vec::new()` inside the function and returning it is equally valid.
- Preserve: output order and values are unchanged. `events` stays borrowed. The function is pub in a private, unreleased module, so no external API commitment is known. The two callers' source is not supplied beyond the packet facts, so the other call sites are unverified.
- Affected files: src/lib.rs (inspected). External callers of `collect_uploads` are not inspected.

## C-RD63-2: `largest` and `largest_upload` signal failure and absence in ways the code never uses

- Change anchor: src/lib.rs, `pub fn largest(sizes: &[u64]) -> Result<u64, StatsError>` with body `Ok(sizes.iter().copied().max().unwrap_or(0))`, `pub fn largest_upload(...) -> Result<u64, StatsError>`, and `pub enum StatsError { Unavailable }`.
- Basis: rust.api.express-the-call (failure and absence).
- Observation: two protocols are hidden or misleading.
  1. Failure: `largest` has only an `Ok(..)` return, and the packet says no code constructs `StatsError`. Yet both callers of `largest_upload` match on the Result and log the `Err` arm. Readers must infer from the body that `Err` is unreachable. The `Unavailable` variant has no stated meaning and a log branch that can never run.
  2. Absence: an empty slice yields `0` through `unwrap_or(0)`. The signature gives no sign that "no uploads" and "largest upload is 0 bytes" are the same result, so callers cannot tell them apart without reading the body.
- Remedy: depends on the intended contract.
  - If failure is never intended: return a plain `u64` (or `Option<u64>` if empty should be distinguishable) and drop `StatsError` and the callers' `Err` arms.
  - If failure is a deliberate reserved extension point: a doc comment saying when `Unavailable` would occur, and that empty input means `0`, would make the call contract explicit.
  - The first is supported by the source facts, since the error is never constructed and the module is unreleased.
  - Which of the first option's two return types to use (`u64` or `Option<u64>`) depends on whether callers need to distinguish "no uploads" from zero. That is unresolved from the supplied source.
- Preserve: the `0` result for empty input if callers rely on it. Callers' handling of `Err` is only known from the packet description. The two callers' source is not supplied, so their exact edits are not verified.
- Affected files: src/lib.rs (inspected). The callers of `largest_upload` are not supplied, so they are still needed for the remedy.
