<!-- model: claude-sonnet-5-5; arm: candidate; input: RD47; round 2 after review fixes; tool: native Claude Code subagent, fresh context -->
## Task result: RD47

- Snapshot: local supplied packet RD47, `src/lib.rs` and `Cargo.toml` as given. No B/H/D or hashes were supplied.
- Instructions: `content identity unverified`.
- Assignment: lens `control-flow` (`rust.flow.show-main-path`), profile `error-expression`. Scope is `load`, `fetch`, and `FetchError` with its `Display` impl, in a private, unreleased module. Edition is 2021 and MSRV is 1.85.
- Status: completed
- Inspected evidence: all of `src/lib.rs` (`FetchError`, its `Display` impl, `fetch`, `load`) and `Cargo.toml`. The packet context says `load` is the only caller of `fetch`, no caller distinguishes `NotFound` from `Gone`, and the `Display` text is operator-facing and may be reworded.
- Coverage: the base lens and the profile are both complete for the supplied source. Nothing required is missing.
- New applicability signals: none

## C-RD47-1: `load` chooses its recovery path by matching substrings of `Display` text

- Change anchor: `src/lib.rs`, `load`, whole-project snapshot. The arms are `Err(error) if error.to_string().contains("missing") => Ok(None)` and `Err(error) if error.to_string().contains("timed out") => fetch(id).map(Some)`. The strings come from the `Display` impl for `FetchError`: `"resource missing"` for `NotFound | Gone`, and `"request timed out"` for `Timeout`.
- Basis: `rust.flow.show-main-path` with the `error-expression` profile (a caller matching on `Display` text couples recovery to wording).
- Observation:
  - `FetchError` is a closed enum whose variants already name the decisions `load` makes: `NotFound` and `Gone` map to `None`, `Timeout` triggers one retry, and everything else propagates.
  - `load` ignores the variants. It renders each error to a `String` and searches it for substrings. The reader has to open the `Display` impl and work out which variants produce "missing" and "timed out" before the arms make sense.
  - The recovery logic is tied to message wording that the context says operators may reword. A change to that text would silently change which arm runs.
  - `FetchError::Other(String)` carries arbitrary text. An `Other("... missing ...")` or `Other("... timed out ...")` is therefore also caught by those arms. It would be treated as not-found or retried, which the variant structure does not suggest was intended. This shows the text match is a different, looser rule than the variants.
  - Each arm also allocates a string just to run the test.
- Remedy: match on the variants directly, so the main path and each exit are visible in `load`.
  ```rust
  pub fn load(id: u64) -> Result<Option<Vec<u8>>, FetchError> {
      match fetch(id) {
          Ok(bytes) => Ok(Some(bytes)),
          Err(FetchError::NotFound | FetchError::Gone) => Ok(None),
          Err(FetchError::Timeout) => fetch(id).map(Some),
          Err(error) => Err(error),
      }
  }
  ```
  - The alternative of keeping text matching is not supported by any source evidence. No consumer needs the wording to drive logic.
  - Separately, `NotFound` and `Gone` could be merged into one variant. The context says no caller distinguishes them, and `Display` renders them identically. But that is a wider API-shape decision, and the `Display` impl only shows they are treated alike, so it stays optional. The variant match above makes the two-variant form harmless.
- Preserve:
  - Inputs reaching each arm are unchanged for `NotFound`, `Gone` and `Timeout`.
  - The retry stays a single second `fetch` whose result, including a second `Timeout`, is returned as `Some` or `Err`.
  - `Other` and `Forbidden` still propagate unchanged.
  - The one intended behavior difference is that `Other(text)` containing "missing" or "timed out" no longer takes the `None` or retry arm. The current behavior looks accidental, but this is not confirmed against intent.
  - `Display` output is untouched, so operator-visible text is unchanged.
  - The error type and source contract are unchanged, since `FetchError` has no `source` and no conversion is added.
- Affected files: `src/lib.rs`, inspected. No other consumers exist per the packet context. `load` is `pub`, but the scope states no external commitment.
