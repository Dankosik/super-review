<!-- model: claude-sonnet-5-5; native Claude Code subagent, fresh context; 2026-11-09 -->
## Task result: CT13

- Snapshot: local fixture snapshot, single file `notify/src/channel.rs`; no base revision or diff; source location is the review packet's `files` map.
- Instructions: super-review specialist, duplication lens (`rust.duplication.share-knowledge`); content identity unverified.
- Assignment: duplication lens, no profiles, scope `notify/src/channel.rs`. The project is private and unreleased, with no team override. Root `Cargo.toml` has edition 2024 and rust-version 1.90.
- Status: completed
- Inspected evidence: the full `notify/src/channel.rs` (`Channel`, `Channel::as_str`, `UnknownChannel`, `FromStr for Channel`) and `Cargo.toml`. The packet's `files` map holds only these two files, so no other file was available to search.
- Coverage:
  - Decisions listed:
    1. The variant-to-wire-name mapping: `email`, `sms`, `push`.
    2. The wire-name set accepted when parsing.
    3. The unknown-name rejection.
  - Searches run over the whole snapshot, using the keys `"email"`, `"sms"`, `"push"`, `Channel::Email`, `Channel::Sms`, `Channel::Push`, `as_str`, `from_str` and `UnknownChannel`.
  - Matches read:
    - the forward `match` in `as_str` (3 arms);
    - the reverse `match` in `from_str` (3 arms plus `_`);
    - no other file in the snapshot references these keys.
  - Both directions of the table were read.
  - The packet context says parsing and rendering must stay inverse, and that variants are added a few times a year.
  - No external partner exists in the snapshot (no schema, migration, config or database definition of channel names). The database and client encodings are outside the provided evidence and could not be searched.
  - Missing required evidence: none for the assigned file.
- New applicability signals: none

## C-CT13-1: Channel wire names are stated twice, in `as_str` and in `from_str`, and only the forward table is compiler-checked

- Change anchor: whole-project snapshot, `notify/src/channel.rs`.
  - `Channel::as_str`: `Channel::Email => "email"`, `Channel::Sms => "sms"`, `Channel::Push => "push"`.
  - `<Channel as FromStr>::from_str`: `"email" => Ok(Channel::Email)`, `"sms" => Ok(Channel::Sms)`, `"push" => Ok(Channel::Push)`, `_ => Err(UnknownChannel)`.
  - There is no base revision, so the anchor is the snapshot itself.
- Basis: `rust.duplication.share-knowledge`, the reverse-table rule. The reverse `FromStr` match ends in a `_` arm, so it is not connected to the exhaustive forward `match`.
- Observation:
  - Both functions encode one domain decision, the mapping between each `Channel` variant and its persisted and client-facing name. The context says the two directions must stay inverse.
  - Adding a variant forces an edit in `as_str`, because that `match` is exhaustive and the compiler rejects the omission.
  - The same addition forces no edit in `from_str`. The `_ => Err(UnknownChannel)` arm silently absorbs the new variant's name.
  - The result is a variant that renders as, say, `"webhook"` but fails to parse it back. Nothing connects the two tables, so a reviewer has to remember to update both.
  - The context says variants are added a few times a year, so the coordinated edit recurs.
  - A typo in either table's string literal (for example `"sms"` against `"smss"`) would also break the inverse property with no signal.
  - The two tables are the same length and hold the same pairs, so no semantic difference justifies keeping them separate.
- Remedy: keep one owner for the pairing and derive both directions from it.
  - Option A, `std` only: declare a single constant table and implement both directions over it.
    ```rust
    impl Channel {
        const ALL: [(Channel, &'static str); 3] =
            [(Channel::Email, "email"), (Channel::Sms, "sms"), (Channel::Push, "push")];
        pub fn as_str(self) -> &'static str {
            Self::ALL.iter().find(|(c, _)| *c == self).map(|(_, s)| *s).unwrap_or_default() // needs an exhaustive form
        }
    }
    // from_str: Self::ALL.iter().find(|(_, s)| *s == text).map(|(c, _)| *c).ok_or(UnknownChannel)
    ```
    - Caveat: a search over a slice loses the compiler-enforced exhaustiveness of the forward `match`. As written, a missing table row would make `as_str` fall into a fallback instead of failing to compile.
    - A better `std`-only variant keeps the exhaustive `as_str` `match` as the single source. It then builds the parse direction by scanning a `const ALL: [Channel; 3]` and comparing `c.as_str() == text`, so only the variant list is a second place to edit.
    - That variant still needs a check that `ALL` lists every variant. An exhaustive `match` inside a small test, or a count check, could do it, and that is a remaining tradeoff.
  - Option B, a maintained crate such as `strum` (`EnumString` and `IntoStaticStr`, or `Display` with `serialize_all = "lowercase"`). This is only a named dependency decision, because the snapshot declares no dependencies. The derive makes both directions come from the variant list, so the `_` gap disappears. It adds a dependency and a derive-generated error type in place of the hand-written `UnknownChannel`.
  - Strongest keep alternative: two three-arm matches are short and readable. If the team prefers no macro or dependency, retaining the duplication is defensible provided a test or an exhaustive-match guard pins the inverse property. Adding such a test is outside this lens, so it is noted only as the preservation route.
- Preserve:
  - The exact wire strings `"email"`, `"sms"` and `"push"`, which the database and clients use. Matching stays case-sensitive, because the current `from_str` has no case folding.
  - `as_str(self) -> &'static str` and `Channel: Copy`.
  - The `FromStr` impl with `Err = UnknownChannel`. The unit struct has no `Debug`, `Display` or `Error` impl, so changing it would be a separate decision.
  - A derive-based error type would change the current `UnknownChannel`, which is the type callers see.
  - Known: the file's own contents. Unverified: any callers of `as_str`, `from_str` or `UnknownChannel` (none in the snapshot), and any database or client definitions of the channel names.
- Affected files: `notify/src/channel.rs` (inspected). Consumers and storage schema are not in the snapshot and are still needed to confirm the preserved wire contract.
