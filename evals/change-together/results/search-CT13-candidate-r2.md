<!-- model: claude-sonnet-5-5; native Claude Code subagent, fresh context; 2026-11-09 -->
## Task result: CT13

- Snapshot: local snapshot, packet CT13 (single revision, no base diff); source `notify/src/channel.rs`; endpoint hashes not exposed.
- Instructions: content identity unverified (super-review contract, duplication lens, Rust language notes, finding template).
- Assignment: duplication lens, `rust.duplication.share-knowledge`, no profiles; scope `notify/src/channel.rs`; no team overrides.
- Status: completed
- Inspected evidence: `notify/src/channel.rs` in full (`Channel`, `Channel::as_str`, `impl FromStr for Channel`, `UnknownChannel`); `Cargo.toml` (edition 2024, rust-version 1.90). The packet snapshot holds no other files.
- Coverage: completed for the assigned file. Searched decisions and keys:
  - The channel name key set `"email"`, `"sms"`, `"push"`, and the variant set `Email`, `Sms`, `Push`.
  - Both directions of the mapping between them.
  - No sibling partner exists in the snapshot (no configuration, schema or migration file).
  - MSRV 1.90 does not constrain the remedy; it needs only `match` and a const array.
- New applicability signals: none.

## C-CT13-1: Channel name set is encoded twice, and the parse direction is unconnected to the render direction

- Change anchor: `notify/src/channel.rs`, `Channel::as_str` (`Channel::Email => "email"`, `Channel::Sms => "sms"`, `Channel::Push => "push"`) and `impl FromStr for Channel::from_str` (`"email" => Ok(Channel::Email)`, and so on). Whole-snapshot scope, so there is no separate diff to anchor to.
- Basis: `rust.duplication.share-knowledge`. The lens text says a reverse table ending in a `_` arm is not connected to its forward `match`, even when the forward `match` is exhaustive.
- Observation:
  - The three name strings and variant pairings are written once in `as_str` and again, reversed, in `from_str`.
  - `as_str` is exhaustive, so adding a variant forces an edit there.
  - `from_str` ends in `_ => Err(UnknownChannel)`, so a new variant added only to `as_str` still compiles. Its name then renders but fails to parse.
  - The context says parsing and rendering must stay inverse, that names are persisted and sent by clients, and that variants are added a few times a year.
  - A missed `from_str` edit would therefore surface as unparseable stored or client names rather than as a compile error.
  - The coordinated edit is real and recurring. Nothing in the file connects the two directions.
- Remedy: derive parsing from the single rendering table, so a variant is declared in one place and the parse side cannot drift.
  - A minimal sketch: `const ALL: [Channel; 3] = [Channel::Email, Channel::Sms, Channel::Push];` and `from_str` as `Self::ALL.into_iter().find(|c| c.as_str() == text).ok_or(UnknownChannel)`.
  - `as_str` remains the only name table, and its exhaustive `match` still forces a name for each new variant.
  - The `ALL` array is a smaller second edit. It is not compile-connected either, so it has to be kept in step.
  - To connect it, add a unit test asserting the round trip over `ALL`, or use a maintained derive such as `strum` (`EnumString` and `AsRefStr`). The latter would be a new-dependency decision. The workspace has no declared dependency to use here.
  - Strongest keep alternative: for three variants and a rare edit, the two small `match`es are very readable. The parse direction has the same two-edit cost as `ALL` and is checked by nothing. So the sketch trades one unconnected copy for a shorter one and moves the guard to a round-trip test. That is a modest gain, not a large one.
- Preserve:
  - Wire names stay `"email"`, `"sms"`, `"push"` and matching stays case-sensitive exact.
  - `from_str` still returns `Err(UnknownChannel)` for any other text.
  - The linear scan is eager and cannot short-circuit differently from the `match`.
  - `Channel` stays `Copy` and `as_str` stays `&'static str`.
  - Known: all of this is local to the file. Unverified: callers of `Channel` and `UnknownChannel` are not in the snapshot.
- Affected files: `notify/src/channel.rs` (inspected). Consumers of `Channel`, such as the database layer and client parsing, are not in the snapshot and are still needed to confirm no caller depends on the existing `from_str` shape.
