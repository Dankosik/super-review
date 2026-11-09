<!-- model: claude-sonnet-5-5; arm: candidate; input: RD39; round 2 after review fixes; tool: native Claude Code subagent, fresh context -->
## Task result: RD39

- Snapshot: packet RD39 (supplied files only, no PR or B/H/D); `Cargo.toml`, `src/lib.rs`.
- Instructions: content identity unverified.
- Assignment: duplication lens, no profiles; all supplied production declarations; private, unreleased module; no team override.
- Status: completed
- Inspected evidence: `Cargo.toml` (edition 2021, rust-version 1.85, `time` 0.3 with `std`, `parsing`, `formatting`); `Timestamp` and `parse_timestamp` in `src/lib.rs`. The packet context states that `OffsetDateTime` is already used elsewhere for formatting. That code was not supplied, so it was not read.
- Coverage: `rust.duplication.share-knowledge` covered for all supplied declarations. Repetition inside the function was checked and is not a candidate. No other consumers were supplied, so nothing outside the packet was searched.
- New applicability signals: none

## C-RD39-1: `parse_timestamp` hand-parses RFC 3339, which the declared `time` dependency already parses

- Change anchor: `src/lib.rs`, `parse_timestamp`, whole-snapshot scope. The span is `text.trim_end_matches('Z').split_once('T')?` together with the `splitn(3, '-')` / `splitn(3, ':')` field extraction. `Timestamp` mirrors the same calendar and clock fields that `time::OffsetDateTime` already models.
- Basis: rust.duplication.share-knowledge (handwritten non-trivial general mechanism, with a declared dependency that supplies the contract).
- Observation: `parse_timestamp` implements an RFC 3339 date-time grammar by hand.
  - The partner contract is RFC 3339 UTC with a trailing `Z` and whole seconds (packet context). The crate already declares `time` with the `parsing` feature, and it uses `OffsetDateTime` elsewhere for formatting.
  - The hand-written parser therefore repeats knowledge that the declared dependency's `time::format_description::well_known::Rfc3339` parser already owns. It also adds a second timestamp representation next to `OffsetDateTime`.
  - The `Z` handling already misreads the format: `trim_end_matches('Z')` strips any number of trailing `Z` characters, so `...ZZ` is accepted.
  - There is no range or calendar validation. Month 13, day 40 and hour 99 all parse into `Timestamp`.
  - The second field is read as `get(..2)`, so any trailing text after the first two digits is ignored. That includes fractional seconds, `+00:00` offsets and junk.
  - Because the trailing `Z` is stripped, a numeric offset such as `+02:00` is not rejected by the `Z` trim. It is left in the time text, and `get(..2)` then discards it. The offset is silently dropped.
  - Each of these edge cases is something the maintained parser already decides in one place. Here they are decided implicitly by `splitn`, `get` and `trim_end_matches`.
  - A reader must work out the accepted grammar from the combinators. Any change to the contract, such as fractional seconds or offsets, means rewriting the splitting logic.
  - Strongest keep argument: the fixed-shape inputs from a single partner are narrow. That makes this closer to a tiny fixed grammar. The code is short and has no allocation. It does skip validation, though, and that goes beyond the line-count argument the lens warns about.
- Remedy: replace the manual splitting with `time::OffsetDateTime::parse(text, &time::format_description::well_known::Rfc3339)`.
  - Map the result to `Option` with `.ok()`.
  - If the `Timestamp` struct has no other consumers, replace it with `OffsetDateTime` outright, or build it from the accessors `year()`, `month() as u8`, `day()`, `hour()`, `minute()` and `second()`.
  - The `parsing` feature is already enabled.
  - Sketch: `pub fn parse_timestamp(text: &str) -> Option<OffsetDateTime> { OffsetDateTime::parse(text, &Rfc3339).ok() }`.
  - The only option to adopt is the existing dependency. No new crate or MSRV change is involved.
- Preserve:
  - `Option` return and the no-error-detail failure shape.
  - Acceptance of the documented `...Z` whole-second form.
  - Whether any caller depends on the current permissive behaviour (fractional seconds, missing `Z`, unvalidated ranges, a numeric offset silently dropped). The supplied packet shows no callers, so this is unverified.
  - The `Timestamp` field layout, if it is consumed elsewhere. It is `pub` but the module is private and unreleased.
  - `Rfc3339` parsing also accepts numeric offsets and fractional seconds, so the accepted set widens in those ways while it narrows for invalid dates and times. This is a behavioural change to check against actual callers.
- Affected files: `src/lib.rs` (inspected), `Cargo.toml` (inspected, no change needed). Any consumers of `Timestamp` and the elsewhere-used `OffsetDateTime` formatting code were not supplied, so they are still needed to confirm whether the struct can be dropped.
