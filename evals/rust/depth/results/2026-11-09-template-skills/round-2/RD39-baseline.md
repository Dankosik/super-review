<!-- model: claude-sonnet-5-5; arm: baseline; input: RD39; round 2 after review fixes; tool: native Claude Code subagent, fresh context -->
## Task result: RD39

- Snapshot: local packet RD39 (whole-project snapshot, supplied files `Cargo.toml`, `src/lib.rs`).
- Instructions: super-review review-contract, rust language note, rust duplication lens; content identity unverified.
- Assignment: duplication lens, no profiles; scope is all supplied production declarations in a private, unreleased module. No team override.
- Status: completed
- Inspected evidence: `Cargo.toml` (edition 2021, rust-version 1.85, `time` 0.3 with `std`, `parsing`, `formatting`); `Timestamp` and `parse_timestamp` in `src/lib.rs`; the packet context fact.
- Coverage: the base duplication rule was applied to every supplied declaration. Only one function exists, so no partners were available elsewhere in the snapshot. No tests or generated files were supplied.
- New applicability signals: none

## C-RD39-1: Handwritten RFC 3339 parsing repeats a format the declared `time` dependency already owns

- Change anchor: `src/lib.rs`, `parse_timestamp` (whole-project snapshot), the span `text.trim_end_matches('Z').split_once('T')?` through `time.next()?.get(..2)?.parse().ok()?`. Supporting context: the `time` dependency in `Cargo.toml`, enabled with `parsing`.
- Basis: rust.duplication.share-knowledge (comparing handwritten mechanics with existing helpers). Not convention-only.
- Observation: The function re-encodes the RFC 3339 date-time grammar by hand. That grammar is the `T` separator, the `-` and `:` delimiters, the field order, and the Z suffix. The crate already declares `time` with `parsing` and uses `OffsetDateTime` elsewhere for formatting, so the project holds this knowledge in two places: the format owned by `time` and these string operations.
  - The hand-rolled parser carries format decisions that a reader must verify against the RFC. `trim_end_matches('Z')` strips any number of trailing Zs. `get(..2)` on the seconds field silently discards trailing characters, such as fractional seconds or an offset. The partner contract says only whole seconds with Z are sent, so these are implicit assumptions.
  - Every parsed field is a plain integer with no range check. The code never states what a valid month, day or hour is.
  - `Timestamp` mirrors the component fields that `OffsetDateTime` already provides. A second timestamp representation therefore exists beside the one the crate uses for formatting. Callers of this struct would need to convert between the two if they format what they parse.
- Remedy: Parse with the dependency's RFC 3339 support and keep the struct only if callers need that shape.
  ```rust
  use time::{format_description::well_known::Rfc3339, OffsetDateTime};
  pub fn parse_timestamp(text: &str) -> Option<OffsetDateTime> {
      OffsetDateTime::parse(text, &Rfc3339).ok()
  }
  ```
  The grammar and range validation then have one owner. If `Timestamp` has consumers that need the plain-field shape, build it from the parsed value's accessors (`year()`, `month() as u8`, `day()`, `hour()`, `minute()`, `second()`). The strongest keep-alternative is the current dependency-free split. It is short, and the contract fixes the format, so the duplication costs little. That alternative leaves no validation and no named owner for the format.
- Preserve:
  - Return type: the public return type is `Option<Timestamp>`. `pub` visibility in a private, unreleased module is not a known external contract. Callers were not supplied, so which return shape they need is unverified.
  - Accepted input: `Rfc3339` parsing also accepts offsets and fractional seconds, and it rejects out-of-range fields. Both are stricter or broader than the current code, but neither conflicts with the documented contract of UTC with Z and whole seconds. Whether any caller depends on the lenient acceptance is unverified.
  - Offset: if UTC-only input must be enforced, check `offset().is_utc()` after parsing.
  - MSRV and features: `time` 0.3 with `parsing` is already declared, and the `well_known` descriptions are available behind it. The resolved `time` version was not supplied, so it is unconfirmed that it supports MSRV 1.85. No new dependency or feature is needed.
- Affected files: `src/lib.rs` (inspected), `Cargo.toml` (inspected). Consumers of `Timestamp` and `parse_timestamp`, and the elsewhere-used `OffsetDateTime` formatting code, were not supplied and are still needed.
