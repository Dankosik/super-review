<!-- model: claude-sonnet-5-5; arm: baseline; input: RD37; tool: native Claude Code subagent, fresh context -->
## Task result: RD37

- Snapshot: local packet RD37, whole-project scope; `Cargo.toml` and `src/lib.rs` as supplied. No B/H/D, no commit identity.
- Instructions: `content identity unverified`.
- Assignment: lens `rationale` (rust.rationale.explain-constraints), no profiles; all supplied production declarations in a private, unreleased crate (edition 2021, rust-version 1.85); no team override.
- Status: completed
- Inspected evidence: `Cargo.toml`. In `src/lib.rs`: `retry_limit`, `Config` (`retry_limit`, `timeout_ms`), `backoff`. The packet shows no callers of any of them, and no other source.
- Coverage: the rationale base pass is complete over all supplied declarations. Callers and the origin of the 250 are not in the packet. That gap limits the remedy for C-RD37-2 only.
- New applicability signals: none.

## C-RD37-1: The `timeout_ms` doc comment says seconds while the name and type say milliseconds

- Change anchor: `src/lib.rs`, `Config::timeout_ms`, whole-project snapshot. The doc line is `/// Timeout in seconds.` on `pub timeout_ms: u64`. The packet context says the field has always held milliseconds and the doc predates a rename.
- Basis: rust.rationale.explain-constraints. This is an existing explanation that is no longer accurate, not a missing one.
- Observation: The doc contradicts the field name. A reader has to choose which to trust, and the unit is the one fact a caller needs when setting a timeout. The mismatch is the only unit statement on the field, so it is the main source of confusion.
- Remedy: Correct the doc to state milliseconds, for example `/// Timeout in milliseconds.` A tighter fix would make the unit visible in the type, for example `Duration`. That would change the field's representation, which is beyond this lens. If the doc only repeats the name, it can be dropped instead.
- Preserve: The field name, type and value semantics stay unchanged. The only change is the comment. No consumers were supplied.
- Affected files: `src/lib.rs`

## C-RD37-2: The `backoff` comment states the wrong multiplier, and the constant 250 has no recorded reason

- Change anchor: `src/lib.rs`, `fn backoff`. The comment `// Multiply the attempt by 100.` sits above `u64::from(attempt) * 250`.
- Basis: rust.rationale.explain-constraints.
- Observation: The comment says 100 and the code multiplies by 250, so it is stale or wrong. It also only narrates the operation. The context says no comment records a reason, protocol or caller obligation. The reason for 250, and the unit of the result, are not recoverable from the code. A reader cannot tell whether 250 is a deliberate constraint, such as a base delay in milliseconds, or an accident. The result's unit is plausibly milliseconds, given `timeout_ms`, but the packet does not establish it.
- Remedy: Delete the narrating comment. Then express the intent through a named constant such as a base delay in milliseconds, or a doc comment on `backoff` that states the unit. A comment recording why the value is 250 belongs there only if the real reason is known. The reason is not in the supplied evidence, so no rationale should be invented. The owner must supply it.
- Preserve: The computed value (`attempt * 250`) and the signature stay unchanged. Callers are not supplied, so whether any depends on the unit is unverified.
- Affected files: `src/lib.rs`. Callers still needed.

## C-RD37-3: The `retry_limit` function and its comment, and the field doc, only restate the code

- Change anchor: `src/lib.rs`, `fn retry_limit` and `Config::retry_limit`. The doc is `/// Returns the retry limit.`, the comment is `// Read the limit from the config.`, and the field doc is `/// The retry limit.`
- Basis: rust.rationale.explain-constraints (prefer a clearer name or structure over commentary).
- Observation: Each of the three texts repeats the name or body and records no reason or caller obligation. The function is a private pass-through of a public field. It adds no constraint, and the packet shows no caller. A reader gets nothing from the three texts, and they add noise around a one-line body. The doc on `Config::retry_limit` also omits what the count means, which would be useful: retries versus total attempts. The packet gives no basis for it, so that is an evidence gap, not a defect.
- Remedy: Remove the narrating inline comment and the tautological docs. Add a field doc only if the semantics can be stated from a known contract. Whether the wrapper function should exist at all belongs to another lens. This lens only notes that nothing documents a reason for it.
- Preserve: Public field visibility and the function signature stay unchanged. Callers were not supplied.
- Affected files: `src/lib.rs`
