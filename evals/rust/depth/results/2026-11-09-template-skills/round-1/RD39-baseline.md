<!-- model: claude-sonnet-5-5; arm: baseline; input: RD39; tool: native Claude Code subagent, fresh context -->
## Task result: RD39

- Snapshot: supplied packet RD39 (local files, no PR or B/H/D); `Cargo.toml`, `src/lib.rs`.
- Instructions: super-review duplication lens; content identity unverified.
- Assignment: lens duplication (`rust.duplication.share-knowledge`), no profiles, scope is all supplied production declarations. Private, unreleased module, no team override.
- Status: completed
- Inspected evidence: `Cargo.toml` (edition 2021, rust-version 1.85, `time` 0.3 with `std`, `parsing` and `formatting`, no `macros`); the whole of `src/lib.rs` (`Timestamp`, `parse_timestamp`); the packet context.
- Coverage: base lens completed over every declaration. No library note under references/rust/ was routed. No tests or generated files were included.
- New applicability signals: none

## C-RD39-1: `parse_timestamp` hand-implements RFC 3339 parsing that the already-declared `time` dependency owns

- Change anchor: `src/lib.rs`, `parse_timestamp`. The span is `text.trim_end_matches('Z').split_once('T')?` followed by `time.next()?.get(..2)?.parse().ok()?`. The anchor is the whole-project snapshot.
- Basis: `rust.duplication.share-knowledge`. The overlap is with an existing helper, not with another block in this file.
- Observation: The function re-implements, field by field, a format that `time::OffsetDateTime::parse(text, &time::format_description::well_known::Rfc3339)` already implements. The packet context says the crate already enables `parsing` and uses `OffsetDateTime` elsewhere for formatting, so there are two owners of one format.
  - The hand parser encodes the RFC 3339 grammar as several scattered decisions: the `T` separator, `-` and `:` splitting, the trailing `Z`, and two-digit seconds taken with `get(..2)`.
  - The context says inputs include offsets other than `Z` and fractional seconds. The hand version drops the offset entirely in two situations.
    - For `+02:00`, the `splitn(3, ':')` call leaves the seconds field as `05+02:00`, and `get(..2)` silently discards the offset.
    - For a negative offset such as `-05:00`, the date split happens first, so `-05:00` lands inside the time half, which is not parsed as an offset at all.
  - Each future format need (offset, fraction, validation of ranges or leap days) would be another hand-written rule next to the one `time` already carries.
  - Reading cost: a reader must work out which parts of RFC 3339 are handled, which are truncated, and why `Timestamp` has no offset. The `time` call states "RFC 3339" directly.
- Remedy: Parse once with `OffsetDateTime::parse(text, &Rfc3339)` and read the fields from it. Alternatively, drop the `Timestamp` struct and return `OffsetDateTime` if callers do not need the flat fields.
  ```rust
  use time::{OffsetDateTime, format_description::well_known::Rfc3339};
  pub fn parse_timestamp(text: &str) -> Option<Timestamp> {
      let t = OffsetDateTime::parse(text, &Rfc3339).ok()?;
      Some(Timestamp { year: t.year(), month: t.month() as u8, day: t.day(),
                       hour: t.hour(), minute: t.minute(), second: t.second() })
  }
  ```
  - The string-splitting and per-field parsing logic disappears.
  - Still needed: a decision on whether `Timestamp` should carry the offset or normalize to UTC, and whether `Timestamp` stays at all alongside the existing `OffsetDateTime` use.
  - Keep alternative: retain the hand parser only if the flat `Timestamp` must accept inputs RFC 3339 rejects. Nothing in the packet shows that.
- Preserve:
  - Return type `Option` and the failure-to-`None` contract.
  - `year` is `i32` and `time` returns `i32`.
  - `month` becomes a `Month` enum, so the conversion to `u8` is needed.
  - Offset handling is a behavior decision. Normalizing to UTC with `to_offset(UTC)` versus keeping the local fields changes the field values, and that choice is unverified.
  - Strictness will change. `time` rejects inputs the hand parser currently accepts, for example a missing `Z`, or a `Z` mixed with other trailing text. That change is the intended point and is unverified against callers.
  - Callers of `parse_timestamp` and `Timestamp` were not supplied.
- Affected files: `src/lib.rs` (inspected). `Cargo.toml` already provides the `parsing` feature (inspected). The elsewhere-use of `OffsetDateTime` and the consumers of `Timestamp` were not supplied and are still needed.
