<!-- model: claude-sonnet-5-5; arm: candidate; input: RD41; tool: native Claude Code subagent, fresh context -->
## Task result: RD41

- Snapshot: local packet RD41, whole-project scope; files `Cargo.toml`, `src/lib.rs` from the packet; no B/H/D.
- Instructions: super-review (metadata version not exposed); content identity unverified.
- Assignment: lens `change-locality` (rust.change.localize-existing-variation), no profiles; scope is all supplied production declarations in a private, unreleased module, with no external API commitment or team override.
- Status: completed
- Inspected evidence: `Cargo.toml` (edition 2021, rust-version 1.85); `src/lib.rs` in full (`errors::Failure`, `errors::is_transient`, `delivery::should_retry`, `delivery::parse_target`, `delivery::parse_target_legacy`); the packet context fact on `is_transient` and on `parse_target_legacy`.
- Coverage: base lens complete over all supplied declarations. No missing evidence. Exclusions: no tests, generated files, or vendor trees were supplied.
- New applicability signals: none.

## C-RD41-1: `delivery::should_retry` re-implements the retry classification that `errors::is_transient` already owns

- Change anchor: `src/lib.rs`, `delivery::should_retry` (new). Its body is `Failure::Timeout | Failure::Refused => true, Failure::Rejected(status) => *status == 503`. The existing owner is `errors::is_transient`, which has `matches!(failure, Failure::Timeout | Failure::Refused | Failure::Rejected(503))`. The change introduced `should_retry` as a second copy of the same rule.
- Basis: rust.change.localize-existing-variation (a changed rule copied locally from the code that owns it: error classification, retry policy).
- Observation: the two functions accept the same `Failure` values and return the same result for every variant. The context says `is_transient` is the retry classification used by every other outbound client. Changing the rule, for example treating `Rejected(502)` or `Rejected(504)` as retryable, now means editing two places. If only `is_transient` is updated, delivery silently diverges from the other clients. `should_retry` is also an exhaustive `match`, so it adds a second place that must be edited when a `Failure` variant is added.
- Remedy: remove `delivery::should_retry` and have delivery call `errors::is_transient`. If delivery needs a different policy, that difference belongs in `errors` or in a documented delivery-specific policy, not in a copy. Sketch: `use crate::errors::is_transient;` then `if is_transient(&failure) { retry }`.
- Preserve: both functions take `&Failure` and return `bool`, and currently agree on every variant, so behavior is unchanged. Not verified: callers of `should_retry` were not supplied. Both items are private to the crate, so a rename or removal is local. `Failure` is not `#[non_exhaustive]`, so the exhaustive match behaves as it does now.
- Affected files: `src/lib.rs` (inspected). Delivery call sites were not supplied, so they are still needed context.

## C-RD41-2: `parse_target_legacy` is a superseded path that nothing selects

- Change anchor: `src/lib.rs`, `delivery::parse_target_legacy`, next to its replacement `delivery::parse_target`. The old version uses `text.split(':')` and reads the first two parts. The new one uses `rsplit_once(':')`.
- Basis: rust.change.localize-existing-variation (replacement that keeps its superseded path).
- Observation: the context says nothing in the crate calls `parse_target_legacy` any more. It is neither `pub` outside the private `delivery` module nor feature-gated, and there is no activation condition or removal note. The two functions also disagree on input such as `a:b:80`, where `parse_target` yields host `a:b` and the legacy one fails on the port. A maintainer reading the module has to work out which parse rule is current, and any change to target syntax has two parsers to consider.
- Remedy: delete `parse_target_legacy`. The module is private and unreleased, so no external consumer holds it alive.
- Preserve: `parse_target` keeps its signature and its behavior. Not verified: that no `#[cfg]`-selected or macro-generated caller exists, since only `src/lib.rs` was supplied. The context states there is no remaining call.
- Affected files: `src/lib.rs` (inspected).
