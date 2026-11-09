<!-- model: claude-sonnet-5-5; arm: candidate; input: RD47; tool: native Claude Code subagent, fresh context -->
## Task result: RD47

- Snapshot: supplied packet RD47, `src/lib.rs` and `Cargo.toml` as given; no B/H/D (not a repository snapshot).
- Instructions: content identity unverified (installed package at the candidate `skills/super-review` root).
- Assignment: lens control-flow (`rust.flow.show-main-path`), profile error-expression. Scope is all supplied production declarations (`FetchError`, its `Display` impl, `fetch`, `load`) in a private, unreleased module. No team override. The crate declares edition 2021 and rust-version 1.85.
- Status: completed
- Inspected evidence: `Cargo.toml`, and all of `src/lib.rs`: `FetchError`, `impl Display`, `fetch` and `load`. `load` is the only caller of `fetch`, and no caller distinguishes `NotFound` from `Gone`. The `Display` text is operator-facing and may be reworded.
- Coverage: base rule and profile were both applied to the full supplied source. Nothing is missing.
- New applicability signals: none

## C-RD47-1: `load` decides recovery by searching `Display` text instead of matching variants

- Change anchor: `src/lib.rs`, `load`. The guards are `Err(error) if error.to_string().contains("missing") => Ok(None)` and `Err(error) if error.to_string().contains("timed out") => fetch(id).map(Some)`. The strings come from `impl Display for FetchError`: "resource missing" for `NotFound | Gone`, and "request timed out" for `Timeout`. This is whole-source scope, so the anchor is the current snapshot.
- Basis: rust.flow.show-main-path; profile error-expression (a caller matching on `Display` text couples recovery to wording).
- Observation:
  - `load` is the only place that acts on the error, and it recovers by allocating the `Display` string and searching it for a substring. The two decisions are "absent resource becomes `None`" and "timeout is retried once". Both are hidden inside string literals.
  - Those literals must stay in sync with a different `match` in `fmt`. The context says the text is operator-facing and may be reworded, so a rewording would silently change `load`'s behavior. Nothing in the types or the compiler links the two.
  - The `Other(String)` payload makes this worse. An arbitrary message that contains "missing" or "timed out" is treated as not-found or as a retryable timeout. For example, `Other("column missing in schema")` would return `Ok(None)`.
  - The reader has to trace strings back to variants to see which variants take which arm.
- Remedy: match the variants directly, so the main path and the three outcomes are visible:

  ```rust
  match fetch(id) {
      Ok(bytes) => Ok(Some(bytes)),
      Err(FetchError::NotFound | FetchError::Gone) => Ok(None),
      Err(FetchError::Timeout) => fetch(id).map(Some),
      Err(error) => Err(error),
  }
  ```

  The or-pattern states that `NotFound` and `Gone` are treated alike, which is what the context says callers do. The strongest case for keeping the current form is that the `Display` strings already group the variants, but the pattern expresses the same grouping with no string coupling.
- Preserve:
  - Evaluation order is unchanged: a single retry on timeout, with its result mapped through `Some`.
  - The return type and the error values returned are unchanged. `Other` and `Forbidden` still propagate unchanged.
  - Behavior changes only for `Other(text)` containing "missing" or "timed out", and for any future rewording. In both cases the change moves recovery from message wording to variant identity.
  - `Display` stays as it is, so operator output is unaffected.
- Affected files: `src/lib.rs` only. This is inspected, and `load` is the sole consumer of `fetch`.

## C-RD47-2: `NotFound` and `Gone` are variants nobody distinguishes

- Change anchor: `src/lib.rs`, `FetchError::{NotFound, Gone}`, the `NotFound | Gone` arm of `fmt`, and the matching condition in `load`.
- Basis: rust.flow.show-main-path; profile error-expression (a variant no caller distinguishes adds conversion and matching without a decision behind it).
- Observation:
  - The two variants render identically ("resource missing") and are recovered identically. The context states that no caller distinguishes them, and `load` is the only consumer. Today the pair carries no decision.
  - Each variant adds an arm alternative in `fmt` and a place to update. A reader looking at the enum may assume the distinction matters somewhere, and has to look at every use to learn that it does not.
  - The remedy for C-RD47-1 would add a third place that names both variants, `Err(FetchError::NotFound | FetchError::Gone)`.
- Remedy:
  - Merge them into one variant, for example `Missing`. The `fmt` arm and the `load` arm each lose an alternative.
  - Alternative: keep both if `fetch` is expected to report the two causes differently, for example in operator logs. In that case the `Display` text would need to differ too, and nothing in the supplied source shows that need. This is a decision for the module owner.
  - This is independent of C-RD47-1. Matching on variants is clearer even if both variants stay.
- Preserve:
  - The enum is `pub` in a private, unreleased module. A variant merge changes an exported type, and external consumers cannot be ruled out from the supplied files, so this is unverified. `fetch` is private and always returns `Timeout`, so no producer of the removed variants exists in the supplied source.
  - Display text and recovery behavior stay identical after the merge.
- Affected files: `src/lib.rs` (inspected). Any downstream code that names `NotFound` or `Gone` has not been inspected.
