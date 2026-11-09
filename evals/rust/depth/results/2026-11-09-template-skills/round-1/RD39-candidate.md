<!-- model: claude-sonnet-5-5; arm: candidate; input: RD39; tool: native Claude Code subagent, fresh context -->
## Task result: RD39

- Snapshot: supplied packet RD39 (files `Cargo.toml`, `src/lib.rs`); no B/H/D, whole-snapshot scope.
- Instructions: content identity unverified.
- Assignment: lens duplication (`rust.duplication.share-knowledge`), no profiles, scope: all supplied production declarations in a private, unreleased module.
- Status: completed
- Inspected evidence: `Cargo.toml` (edition 2021, rust-version 1.85, `time` 0.3 with `std`, `parsing`, `formatting`, default features off); `Timestamp` and `parse_timestamp` in `src/lib.rs` in full. The packet context says `OffsetDateTime` is used elsewhere for formatting. That code was not supplied.
- Coverage: the base lens is complete over the supplied source. No other partner locations were available to search, because the packet contains only `src/lib.rs`.
- New applicability signals: none

## C-RD39-1: `parse_timestamp` hand-parses RFC 3339, a grammar the declared `time` dependency already owns

- Change anchor: `src/lib.rs`, `parse_timestamp`, whole-snapshot scope. The span `text.trim_end_matches('Z').split_once('T')?` followed by `date.splitn(3, '-')`, `time.splitn(3, ':')` and `time.next()?.get(..2)?.parse().ok()?`.
- Basis: `rust.duplication.share-knowledge` (handwritten general mechanism, date parser). Owning-crate dependency evidence in `Cargo.toml`.
- Observation: The function re-implements part of the RFC 3339 grammar that the `time` crate already owns.
  - The `time` dependency is declared with the `parsing` feature, and the context says the crate already uses `OffsetDateTime` elsewhere. So the matching contract is available without a new crate.
  - The inputs are RFC 3339 timestamps from a partner API, including offsets other than `Z` and fractional seconds. The hand-written code handles those cases implicitly or not at all.
  - `trim_end_matches('Z')` is the only offset handling. With an offset such as `+02:00`, the `-` split gives `date.splitn(3, '-')` a clean date, but the time part `10:00:00+02:00` is handled only by the `get(..2)` cut on the seconds field. The offset is silently dropped and the result is read as a local time, with no UTC adjustment and no record that an offset existed.
  - Fractional seconds survive only because `get(..2)` slices off the first two characters. The seconds slice is a workaround for a grammar the code does not model.
  - `Timestamp` has no field for an offset, so the parser cannot represent what the input contains.
  - The parser also never checks ranges (month 13, day 40, hour 99), digit counts, or the trailing characters of the seconds field beyond two.
  - Its edge cases, parsing and failure handling are exactly what the maintained parser already owns. The owned surface (offsets, fractions, field widths, ranges, leap-second and calendar validity) is much larger than the 15 lines suggest.
- Remedy: Parse with the declared dependency and keep only the domain adaptation. Sketch: `OffsetDateTime::parse(text, &time::format_description::well_known::Rfc3339).ok()` returns `Option<OffsetDateTime>`. Where the six-field `Timestamp` shape is still wanted, build it from the accessors `year()`, `month() as u8`, `day()`, `hour()`, `minute()` and `second()`. If the instant is meant to be normalised, call `.to_offset(UtcOffset::UTC)` first. Which behaviour is wanted for non-`Z` offsets is a domain decision the code does not make. Better still, if no caller needs the extra struct, return `OffsetDateTime` directly and delete `Timestamp`; that needs a check of the callers, which were not supplied. The strongest keep alternative is that `Timestamp` may be a deliberate offset-agnostic wall-clock value. Even then, the grammar should be parsed by `time` and the struct filled from it.
- Preserve: The `Option` return and the `None` result on malformed input stay unchanged. Ordering and evaluation are not at issue. Acceptance of some inputs may change: the current code accepts out-of-range values and non-RFC 3339 shapes such as a missing seconds field cut by `get`. Strict parsing would reject those. Known versus unverified: the `parsing` feature is declared, and the `well_known` Rfc3339 description's availability under the declared feature set was not checked. Consumers of `Timestamp` and `parse_timestamp` were not supplied, so field semantics cannot be confirmed. The MSRV of 1.85 is not a constraint on this call.
- Affected files: `src/lib.rs` (inspected), `Cargo.toml` (inspected, no change needed). Callers of `parse_timestamp` and `Timestamp`, and the `OffsetDateTime` formatting code named in the context, are still needed.
