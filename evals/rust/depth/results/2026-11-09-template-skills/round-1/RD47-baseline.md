<!-- model: claude-sonnet-5-5; arm: baseline; input: RD47; tool: native Claude Code subagent, fresh context -->
## Task result: RD47

- Snapshot: supplied packet RD47, local snapshot with no B/H/D. Source is the packet's `Cargo.toml` and `src/lib.rs`.
- Instructions: content identity unverified. Resources came from the baseline super-review root: review-contract, languages/rust, lenses/rust/control-flow, profiles/rust/error-expression, finding-template.
- Assignment: lens control-flow, profile error-expression, rule `rust.flow.show-main-path`. Scope is all of `src/lib.rs` (`FetchError`, its `Display` impl, `fetch`, `load`). The module is private and unreleased, with no team override.
- Status: completed
- Inspected evidence: `Cargo.toml` (edition 2021, rust-version 1.85). In `src/lib.rs` I read `FetchError`, `Display for FetchError`, `fetch` and `load`. The context states that `load` is the only caller of `fetch`, that no caller distinguishes `NotFound` from `Gone`, and that the `Display` text is shown to operators and may be reworded.
- Coverage: the base control-flow pass and the error-expression profile are both complete over the supplied source. No evidence is missing. The Tokio, Serde, clap and Axum notes are not implicated.
- New applicability signals: none

## C-RD47-1: `load` selects recovery by searching `Display` text instead of matching the typed error

- Change anchor: `src/lib.rs`, `load`, whole-project snapshot. The spans are `Err(error) if error.to_string().contains("missing") => Ok(None)` and `Err(error) if error.to_string().contains("timed out") => fetch(id).map(Some)`. The text being searched comes from `Display for FetchError`, the arms `NotFound | Gone => "resource missing"` and `Timeout => "request timed out"`.
- Basis: `rust.flow.show-main-path`, profile error-expression. This is not convention-only advice.
- Observation:
  - `FetchError` is a closed enum, but the recovery decisions are made by formatting the error to a `String` and substring-matching it.
  - A reader cannot tell which variants the two guards cover without finding the `Display` impl and mapping its strings back to variants. The "missing" guard hides that it means `NotFound | Gone`, and the "timed out" guard hides that it means `Timeout`.
  - The coupling between the `Display` wording and the control flow is implicit. The context says the text is operator-facing and may be reworded. Rewording would silently change which arm runs, with no compiler signal. For example, an `Other("item missing upstream")` would also match the first guard.
  - Each guard also allocates a `String` just to be tested.
  - The three-way recovery is a meaningful local decision (absent becomes `None`, a timeout is retried once, anything else propagates). The text-based guards bury it.
- Remedy: match on the variants, which drops the dependence on `Display` text:

```rust
match fetch(id) {
    Ok(bytes) => Ok(Some(bytes)),
    Err(FetchError::NotFound | FetchError::Gone) => Ok(None),
    Err(FetchError::Timeout) => fetch(id).map(Some),
    Err(error) => Err(error),
}
```

  The `Display` impl can then be reworded freely. The remaining tradeoff is that adding a new "missing"-like variant now needs a conscious edit to `load`. That is the right place for the decision, and an exhaustive final arm still propagates the rest.
- Preserve:
  - The `Other(String)` payload keeps propagating unchanged through the last arm, with the same error type and value.
  - The single retry after `Timeout` is kept, and its result is still wrapped in `Some` or returned as an error.
  - Behavior changes only for `Other` strings that happen to contain "missing" or "timed out". Those currently get recovered by accident, and the remedy would propagate them. The context gives no sign that this is intended.
  - The `Display` text, the `load` signature and `FetchError` are unchanged. Nothing outside `src/lib.rs` is implicated. The only consumer is `load`, and it is private to the unreleased module.
- Affected files: `src/lib.rs` (inspected). No other consumers were supplied.

## C-RD47-2: `Display` merges `NotFound` and `Gone`, which makes the merged text the only way for `load` to group them

- Change anchor: `src/lib.rs`, `Display for FetchError`, span `FetchError::NotFound | FetchError::Gone => f.write_str("resource missing")`.
- Basis: `rust.flow.show-main-path`, profile error-expression. This is a contributing cause of C-RD47-1 and is not a separate fix.
- Observation: the `Display` impl is the only place that groups `NotFound` and `Gone`. `load` relies on that grouping through the shared string, so formatting is doing the work of classification.
- Remedy: resolved by C-RD47-1. Once `load` matches `NotFound | Gone` directly, the shared `Display` arm needs no change and can be edited independently. Count this once with C-RD47-1.
- Preserve: the operator-visible `Display` strings stay as they are.
- Affected files: `src/lib.rs` (inspected).
