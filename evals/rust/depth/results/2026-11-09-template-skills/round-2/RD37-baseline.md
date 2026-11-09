<!-- model: claude-sonnet-5-5; arm: baseline; input: RD37; round 2 after review fixes; tool: native Claude Code subagent, fresh context -->
## Task result: RD37

- Snapshot: local packet RD37, whole-project snapshot of the supplied files. Source is `src/lib.rs` in the packet JSON.
- Instructions: `content identity unverified`.
- Assignment: lens `rationale` (`rust.rationale.explain-constraints`), no profiles. Scope is all supplied production declarations in a private, unreleased module. No team override.
- Status: completed
- Inspected evidence: `Cargo.toml` (edition 2021, rust-version 1.85) and `src/lib.rs`, whole file. Symbols: `retry_limit`, `Config`, `Config::retry_limit`, `Config::timeout_ms`, `backoff`. Context fact: `timeout_ms` has always held milliseconds, and the field doc predates a rename.
- Coverage: base lens pass over every declaration in the file. No library notes were implicated. `retry_limit` and `backoff` have no callers in the supplied source, so I could not inspect consumers. No expansion or generated source is involved.
- New applicability signals: none

## C-RD37-1: `Config::timeout_ms` doc says seconds, but the field and context say milliseconds

- Change anchor: `src/lib.rs`, `Config::timeout_ms`, whole-project snapshot. The span is `/// Timeout in seconds.` above `pub timeout_ms: u64,`.
- Basis: `rust.rationale.explain-constraints`. The context fact supports a stale-documentation reading.
- Observation: The doc states the unit as seconds, and the name and the context both say milliseconds. The context says the doc predates a rename. A reader cannot tell whether the name or the doc is wrong. A caller who trusts the doc could pass a value 1000 times too large. The comment states a unit that contradicts the code, so it is a misleading explanation and not just a missing one.
- Remedy: Correct the doc to state milliseconds, for example `/// Timeout in milliseconds.`. Alternatively drop the unit from the doc, since the `_ms` suffix already carries it.
- Preserve: The field name, type and public shape stay unchanged. Only the doc text changes, so there is no behavior or compatibility effect.
- Affected files: `src/lib.rs`. No consumers were inspected because none are supplied.

## C-RD37-2: `backoff` comment states a factor of 100, but the code multiplies by 250

- Change anchor: `src/lib.rs`, `backoff`. The comment is `// Multiply the attempt by 100.` above `u64::from(attempt) * 250`.
- Basis: `rust.rationale.explain-constraints`.
- Observation: The comment contradicts the code. A reader cannot tell which value is intended, so they cannot distinguish a deliberate constant from a stale one. The comment restates the syntax of the multiplication and does not give a reason. The unit of the result, presumably milliseconds given the `timeout_ms` convention, and the origin of the base interval are not recoverable from the source. The source does not establish which of 100 or 250 is correct, so I cannot say whether the code or the comment should change.
- Remedy: The code and the comment have to agree on the factor, and the source cannot settle which is intended. Name the constant, for example `const BACKOFF_STEP_MS: u64 = 250;`. Replace the syntax-restating comment with a doc comment that gives the unit and the reason for the step size. Whoever owns the policy must confirm 250 or 100 before editing. The reason for the step size is unverified, so it should not be invented.
- Preserve: The return value for each `attempt` must stay the same unless the owner confirms 100 is intended. In that case the change is a behavior change and not a readability edit. The `u64::from(attempt)` widening avoids overflow in `u32` multiplication, which holds for `attempt` up to `u32::MAX` times 250. No callers were inspected.
- Affected files: `src/lib.rs`. Callers are not supplied and are still needed to confirm the intended unit.

## C-RD37-3: `retry_limit` doc and comment restate the code

- Change anchor: `src/lib.rs`, `retry_limit`. The spans are `/// Returns the retry limit.` and `// Read the limit from the config.`, and `Config::retry_limit` has the doc `/// The retry limit.`.
- Basis: `rust.rationale.explain-constraints`.
- Observation: The doc, the inline comment and the field doc repeat the name of the item they describe. They do not state a constraint, a unit or a caller obligation. A reader learns nothing the signature does not show. Each of these comments is one more place that has to be kept in step with the code, as C-RD37-1 and C-RD37-2 show. They also hide the one fact worth stating. The meaning of the limit is unclear: it could be the total attempts or the retries after the first attempt.
- Remedy: Delete the inline comment and the function doc, since the name and body already say it. On `Config::retry_limit`, either state what the count measures once the owner confirms it, or leave only the name. The meaning of the count is not established by the supplied source, so I am not proposing wording for it.
- Preserve: Visibility (private function, public field) and behavior stay unchanged. Public rustdoc on the field is product output only if a consumer renders it. This is a private, unreleased module, so no external contract is implicated.
- Affected files: `src/lib.rs`.
